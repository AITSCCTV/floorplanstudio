const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const DEVICE_META = {
  cctv: { label: 'CCTV camera', short: 'Camera', glyph: '◉', color: '#e99e45' },
  ap: { label: 'Wi-Fi access point', short: 'Access point', glyph: '⌁', color: '#29aab7' },
  router: { label: 'Router', short: 'Router', glyph: '⌘', color: '#8978df' },
  switch: { label: 'PoE switch', short: 'PoE switch', glyph: '▤', color: '#6686a1' },
  nvr: { label: 'NVR', short: 'NVR', glyph: '▣', color: '#6686a1' },
};
const DEMO_ROOMS = [
  { name: 'RECEPTION', x: 46, y: 52, width: 255, height: 218 },
  { name: 'MEETING ROOM', x: 322, y: 52, width: 250, height: 218 },
  { name: 'OPEN OFFICE', x: 593, y: 52, width: 353, height: 360 },
  { name: 'PANTRY', x: 46, y: 300, width: 255, height: 169 },
  { name: 'STORAGE', x: 322, y: 300, width: 250, height: 169 },
  { name: 'SERVER ROOM', x: 46, y: 501, width: 225, height: 148 },
  { name: 'LOBBY', x: 593, y: 438, width: 353, height: 211 },
];

const state = {
  fileName: 'Sample office plan', kind: 'demo', image: null, entities: [], planHeight: 700,
  page: 0, pageCount: 1, sourceFile: null, view: 'plan', zoom: 100,
  requestedCameras: 4, requestedAps: 2,
  rooms: DEMO_ROOMS.map((r) => ({ ...r })),
  devices: [
    { id: 'CCTV-01', type: 'cctv', x: 82, y: 78, rotation: 43, coverageAngle: 80, coverageRange: 185, confidence: .82, rationale: 'Covers the main entry approach.' },
    { id: 'CCTV-02', type: 'cctv', x: 915, y: 78, rotation: 135, coverageAngle: 80, coverageRange: 200, confidence: .78, rationale: 'Watches the open office and meeting-room approach.' },
    { id: 'CCTV-03', type: 'cctv', x: 82, y: 619, rotation: 315, coverageAngle: 80, coverageRange: 170, confidence: .77, rationale: 'Covers the lower entrance and circulation path.' },
    { id: 'CCTV-04', type: 'cctv', x: 916, y: 619, rotation: 225, coverageAngle: 80, coverageRange: 190, confidence: .75, rationale: 'Covers the lobby approach.' },
    { id: 'AP-01', type: 'ap', x: 432, y: 168, rotation: 0, coverageAngle: 360, coverageRange: 285, confidence: .8, rationale: 'Central position for reception and meeting rooms.' },
    { id: 'AP-02', type: 'ap', x: 755, y: 305, rotation: 0, coverageAngle: 360, coverageRange: 300, confidence: .8, rationale: 'Central position for the open office and lobby.' },
    { id: 'RTR-01', type: 'router', x: 139, y: 556, rotation: 0, coverageAngle: 0, coverageRange: 0, confidence: .72, rationale: 'Communications point, confirm ISP entry and rack.' },
    { id: 'NVR-01', type: 'nvr', x: 217, y: 556, rotation: 0, coverageAngle: 0, coverageRange: 0, confidence: .76, rationale: 'Recording point, confirm secure rack location.' },
    { id: 'SW-01', type: 'switch', x: 291, y: 556, rotation: 0, coverageAngle: 0, coverageRange: 0, confidence: .72, rationale: 'PoE port count and power budget need engineering review.' },
  ],
  analysis: { mode: 'sample', summary: '', assumptions: [], questions: [] },
  dragging: null, rotating: null, selectedDeviceId: null, cameraPovDeviceId: null, dragMoved: false,
};
const DEMO_DEVICES = state.devices.map((d) => ({ ...d }));

function esc(v) { return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function h() { return state.planHeight; }
function scaleY(v) { return Number(v) * h() / 1000; }
function deviceVisible(d) {
  if (d.type === 'cctv') return $('#layerCameras').checked;
  if (d.type === 'ap') return $('#layerWifi').checked;
  return $('#layerNetwork').checked;
}

function demoBackground() {
  return `<rect class="floor-bg" width="1000" height="700"/>
    <path class="wall" d="M46 52H946V649H46Z M46 286H946 M46 485H580 M310 52V485 M580 52V485 M588 52V649"/>
    <path class="wall-light" d="M46 274h78 M179 274h131 M46 493h89 M195 493h115 M310 274h102 M463 274h117 M310 493h94 M444 493h136 M588 421h117 M761 421h185"/>
    <path class="door-arc" d="M124 286a78 78 0 0 1 78 -78 M412 286a51 51 0 0 1 51 -51 M135 485a60 60 0 0 0 60 60 M404 485a40 40 0 0 1 40 -40 M705 421a56 56 0 0 1 56 56"/>
    ${DEMO_ROOMS.map((r) => `<text class="room-label" x="${r.x + r.width / 2}" y="${r.y + r.height / 2}" text-anchor="middle">${r.name}</text>`).join('')}
    <text x="497" y="26" text-anchor="middle" class="dxf-text">AITS OFFICE · EXAMPLE FLOOR 1</text>`;
}

function dxfBackground() {
  return state.entities.map((e) => {
    if (e.kind === 'line') return `<line class="dxf-line" x1="${e.points[0][0]}" y1="${e.points[0][1]}" x2="${e.points[1][0]}" y2="${e.points[1][1]}"/>`;
    if (e.kind === 'polyline') return `<polyline class="dxf-line" points="${e.points.map((p) => p.join(',')).join(' ')}" ${e.closed ? 'fill="none"' : ''}/>`;
    if (e.kind === 'circle') return `<circle class="dxf-line" cx="${e.center[0]}" cy="${e.center[1]}" r="${e.radius}"/>`;
    if (e.kind === 'text') return `<text class="dxf-text" x="${e.at[0]}" y="${e.at[1]}">${esc(e.text)}</text>`;
    return '';
  }).join('');
}

function basePlan() {
  if (state.kind === 'survey' && window.siteSurveyBackground) return window.siteSurveyBackground();
  if (state.image) return `<rect class="floor-bg" width="1000" height="${h()}"/><image href="${state.image}" x="0" y="0" width="1000" height="${h()}" preserveAspectRatio="none"/>`;
  if (state.kind === 'dxf') return `<rect class="floor-bg" width="1000" height="${h()}"/>${dxfBackground()}`;
  return demoBackground();
}

function sectorPath(d) {
  const radius = (Number(d.coverageRange) || 180) * h() / 700;
  const angle = Math.max(1, Math.min(359.9, Number(d.coverageAngle) || 80));
  const a1 = (Number(d.rotation) - angle / 2) * Math.PI / 180;
  const a2 = (Number(d.rotation) + angle / 2) * Math.PI / 180;
  const x1 = Number(d.x) + Math.cos(a1) * radius;
  const y1 = Number(d.y) + Math.sin(a1) * radius;
  const x2 = Number(d.x) + Math.cos(a2) * radius;
  const y2 = Number(d.y) + Math.sin(a2) * radius;
  return `M ${d.x} ${d.y} L ${x1} ${y1} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
}

function renderDevice(d) {
  const m = DEVICE_META[d.type] || DEVICE_META.cctv;
  const x = Number(d.x), y = Number(d.y);
  const rot = Number(d.rotation) || 0;
  let graphic = '';
  if (d.type === 'cctv') graphic = `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - 2} ${y - 2}l13 -7v14l-13 -7z" fill="${m.color}"/><path d="M${x + 9} ${y - 6}l7 -3v18l-7 -3" fill="${m.color}" opacity=".72"/></g>`;
  else if (d.type === 'ap') graphic = `<circle cx="${x}" cy="${y}" r="4" fill="white"/><path d="M${x - 7} ${y - 2}a9 9 0 0 1 14 0M${x - 11} ${y - 5}a15 15 0 0 1 22 0" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round"/>`;
  else graphic = `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="white">${m.glyph}</text>`;
  const symbolScale = Math.max(1, h() / 700);
  const r = 18;
  const selected = state.selectedDeviceId === d.id;
  const angle = rot * Math.PI / 180;
  const handleX = Math.max(12, Math.min(988, x + Math.cos(angle) * 40 * symbolScale));
  const handleY = Math.max(12, Math.min(h() - 12, y + Math.sin(angle) * 40 * symbolScale));
  const rotateHandle = d.type === 'cctv' && selected ? `<g class="rotation-control"><line class="rotation-link" x1="${x}" y1="${y}" x2="${handleX}" y2="${handleY}"/><circle class="rotation-grab" data-rotate-id="${esc(d.id)}" cx="${handleX}" cy="${handleY}" r="${9*symbolScale}" tabindex="0" role="slider" aria-label="Drag to rotate ${esc(d.id)}" aria-valuenow="${Math.round(((rot % 360) + 360) % 360)}" aria-valuemin="0" aria-valuemax="359"/><path class="rotation-glyph" d="M${handleX - 3} ${handleY + 2}a4 4 0 1 1 5 -5m0 0v-3m0 3h-3"/></g>` : '';
  return `<g class="device ${d.type}${selected ? ' selected' : ''}" data-id="${esc(d.id)}" tabindex="0" role="button" aria-label="${esc(d.id)} ${esc(m.label)}" transform="translate(0 0)">
    <g transform="translate(${x} ${y}) scale(${symbolScale}) translate(${-x} ${-y})"><circle class="device-core" cx="${x}" cy="${y}" r="${r}" fill="${m.color}"/>
    ${graphic}<text class="device-label" x="${x}" y="${y + 29}" text-anchor="middle">${esc(d.id)}</text></g>${rotateHandle}
  </g>`;
}

function renderWifi() {
  const aps = state.devices.filter((d) => d.type === 'ap' && deviceVisible(d));
  if (!aps.length) return '';
  const grads = aps.map((d, i) => `<radialGradient id="wifi-${i}" gradientUnits="userSpaceOnUse" cx="${d.x}" cy="${d.y}" r="${(d.coverageRange || 290) * h() / 700}"><stop offset="0" stop-color="#15ad9a" stop-opacity=".40"/><stop offset=".42" stop-color="#80d5a3" stop-opacity=".30"/><stop offset=".76" stop-color="#f1d876" stop-opacity=".22"/><stop offset="1" stop-color="#ed9268" stop-opacity="0"/></radialGradient>`).join('');
  const fields = aps.map((d, i) => `<circle cx="${d.x}" cy="${d.y}" r="${(d.coverageRange || 290) * h() / 700}" fill="url(#wifi-${i})"/>`).join('');
  return `<defs>${grads}</defs><g opacity=".86" style="mix-blend-mode:multiply">${fields}</g><g><rect x="22" y="${h() - 68}" width="205" height="43" rx="7" fill="white" fill-opacity=".93" stroke="#e5ebef"/><text class="heat-legend" x="34" y="${h() - 50}">PREDICTED SIGNAL · RELATIVE</text><defs><linearGradient id="heatLegend"><stop stop-color="#ed9268"/><stop offset=".45" stop-color="#f1d876"/><stop offset="1" stop-color="#15ad9a"/></linearGradient></defs><rect x="34" y="${h() - 42}" width="115" height="5" rx="2.5" fill="url(#heatLegend)"/><text class="heat-legend" x="157" y="${h() - 37}">strong → weak</text></g>`;
}

function renderRooms() {
  if (state.kind === 'survey') return '';
  if (!state.rooms.length) return '';
  return state.rooms.map((r) => {
    const y = r.normalized ? scaleY(r.y) : Number(r.y);
    const height = r.normalized ? scaleY(r.height) : Number(r.height);
    const x = Number(r.x), width = Number(r.width);
    return `<g><rect class="room-ai-box" x="${x}" y="${y}" width="${width}" height="${height}" rx="3"/><text x="${x + 7}" y="${y + 15}" class="dxf-text">${esc(r.name)}</text></g>`;
  }).join('');
}

function renderCameraPov(camera) {
  const rooms = (state.rooms.length ? state.rooms : [{ name: 'FLOOR', x: 46, y: 52, width: 900, height: h() - 100 }]).map((r, i) => ({
    name: r.name || `Area ${i + 1}`,
    x: Number(r.x), y: r.normalized ? scaleY(r.y) : Number(r.y),
    width: Number(r.width), height: r.normalized ? scaleY(r.height) : Number(r.height),
  }));
  const walls = new Map();
  rooms.forEach((r, roomIndex) => {
    const edges = [
      [r.x, r.y, r.x + r.width, r.y], [r.x + r.width, r.y, r.x + r.width, r.y + r.height],
      [r.x + r.width, r.y + r.height, r.x, r.y + r.height], [r.x, r.y + r.height, r.x, r.y],
    ];
    edges.forEach((edge) => {
      const a = `${edge[0].toFixed(2)},${edge[1].toFixed(2)}`;
      const b = `${edge[2].toFixed(2)},${edge[3].toFixed(2)}`;
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (!walls.has(key)) walls.set(key, { x1: edge[0], y1: edge[1], x2: edge[2], y2: edge[3], roomIndex });
    });
  });
  const wallSegments = [...walls.values()];
  const originX = Number(camera.x), originY = Number(camera.y);
  const fov = Math.max(35, Math.min(140, Number(camera.coverageAngle) || 78));
  const heading = Number(camera.rotation) || 0;
  const halfFov = fov * Math.PI / 360;
  const headingRad = heading * Math.PI / 180;
  const planWidth = Math.max(...rooms.map((r) => r.x + r.width)) - Math.min(...rooms.map((r) => r.x));
  const metresPerUnit = Number($('#floorWidth').value || 20) / Math.max(1, planWidth);
  const roomHeightM = Math.max(2, Number($('#ceilingHeight').value || 3));
  const cameraHeightM = Math.min(roomHeightM - .1, Math.max(1.8, roomHeightM - .25));
  const frame = { x: 54, y: 82, width: 892, height: Math.max(360, h() - 150) };
  const horizon = frame.y + frame.height * .43;
  const bottom = frame.y + frame.height - 22;
  const focal = frame.width / (2 * Math.tan(halfFov));
  const farDistance = Math.max(10, Math.hypot(...rooms.map((r) => r.width), ...rooms.map((r) => r.height)) * metresPerUnit * 1.4);
  const samples = 64;
  const palette = ['#c9d5d8', '#d6dedd', '#bdcbd0', '#d0dadd', '#c2cfd3', '#dbe3e3'];

  function rayDistance(angle) {
    const rx = Math.cos(angle), ry = Math.sin(angle);
    let nearest = farDistance, wallIndex = -1;
    wallSegments.forEach((wall, index) => {
      const sx = wall.x2 - wall.x1, sy = wall.y2 - wall.y1;
      const qx = wall.x1 - originX, qy = wall.y1 - originY;
      const denom = rx * sy - ry * sx;
      if (Math.abs(denom) < 1e-7) return;
      const t = (qx * sy - qy * sx) / denom;
      const u = (qx * ry - qy * rx) / denom;
      if (t > 3 && u >= 0 && u <= 1 && t < nearest) { nearest = t; wallIndex = index; }
    });
    return { distanceM: Math.max(.25, nearest * metresPerUnit), wallIndex };
  }

  const hits = [];
  for (let i = 0; i <= samples; i++) {
    const relative = -halfFov + 2 * halfFov * i / samples;
    const hit = rayDistance(headingRad + relative);
    const screenX = frame.x + frame.width * (.5 + Math.tan(relative) / (2 * Math.tan(halfFov)));
    const wallTop = Math.max(frame.y + 12, horizon - focal * (roomHeightM - cameraHeightM) / hit.distanceM);
    const wallBottom = Math.min(bottom, horizon + focal * cameraHeightM / hit.distanceM);
    hits.push({ screenX, wallTop, wallBottom, ...hit });
  }

  let wallView = '';
  for (let i = 0; i < samples; i++) {
    const a = hits[i], b = hits[i + 1];
    const paletteIndex = a.wallIndex < 0 ? 0 : (wallSegments[a.wallIndex].roomIndex % palette.length);
    const shade = palette[paletteIndex];
    wallView += `<polygon points="${a.screenX.toFixed(1)},${a.wallTop.toFixed(1)} ${b.screenX.toFixed(1)},${b.wallTop.toFixed(1)} ${b.screenX.toFixed(1)},${b.wallBottom.toFixed(1)} ${a.screenX.toFixed(1)},${a.wallBottom.toFixed(1)}" fill="${shade}" stroke="#9babb0" stroke-width=".45"/>`;
  }

  const ceilingLines = Array.from({ length: 11 }, (_, i) => {
    const x = frame.x + frame.width * i / 10;
    return `<line x1="${frame.x + frame.width / 2}" y1="${horizon}" x2="${x}" y2="${frame.y}" stroke="#cbd5d9" stroke-width=".7"/>`;
  }).join('');
  const floorRays = Array.from({ length: 13 }, (_, i) => {
    const x = frame.x + frame.width * i / 12;
    return `<line x1="${frame.x + frame.width / 2}" y1="${horizon}" x2="${x}" y2="${bottom}" stroke="#a6a99f" stroke-width=".8" opacity=".56"/>`;
  }).join('');
  const floorBands = [.18, .34, .53, .75].map((fraction) => {
    const y = horizon + (bottom - horizon) * fraction;
    const spread = frame.width * fraction / 2;
    return `<line x1="${frame.x + frame.width / 2 - spread}" y1="${y}" x2="${frame.x + frame.width / 2 + spread}" y2="${y}" stroke="#a6a99f" stroke-width=".8" opacity=".52"/>`;
  }).join('');
  const angleText = Math.round(((heading % 360) + 360) % 360);
  const idLabel = esc(camera.id);
  const noteY = frame.y + frame.height - 12;
  return `<defs><linearGradient id="povSky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e9f0f2"/><stop offset="1" stop-color="#dfe8eb"/></linearGradient><linearGradient id="povFloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dddcd2"/><stop offset="1" stop-color="#c9cabe"/></linearGradient></defs>
    <rect width="1000" height="${h()}" fill="#f7fafb"/><rect x="${frame.x}" y="${frame.y}" width="${frame.width}" height="${frame.height}" rx="12" fill="#e9eff1" stroke="#d2dde1"/>
    <rect x="${frame.x + 1}" y="${frame.y + 1}" width="${frame.width - 2}" height="${horizon - frame.y}" fill="url(#povSky)"/>
    <rect x="${frame.x + 1}" y="${horizon}" width="${frame.width - 2}" height="${bottom - horizon}" fill="url(#povFloor)"/>
    ${ceilingLines}${floorRays}${floorBands}${wallView}
    <rect x="${frame.x + 15}" y="${frame.y + 14}" width="225" height="44" rx="8" fill="#fff" fill-opacity=".93" stroke="#dce5e8"/>
    <text x="${frame.x + 28}" y="${frame.y + 32}" fill="#334c60" font-size="11" font-weight="700" font-family="DM Sans">${idLabel} · CAMERA POV</text>
    <text x="${frame.x + 28}" y="${frame.y + 47}" fill="#728597" font-size="8" font-family="DM Sans">${fov}° view · ${angleText}° clockwise from right</text>
    <g data-pov-exit="true" tabindex="0" role="button" aria-label="Return to 3D model" style="cursor:pointer"><rect x="${frame.x + frame.width - 146}" y="${frame.y + 14}" width="128" height="34" rx="7" fill="#fff" stroke="#d5e0e6"/><text x="${frame.x + frame.width - 82}" y="${frame.y + 35}" text-anchor="middle" fill="#52697c" font-size="8" font-family="DM Sans" font-weight="700">← BACK TO 3D MODEL</text></g>
    <text x="500" y="${noteY}" text-anchor="middle" fill="#667b8e" font-size="8" font-family="DM Sans">SCHEMATIC PERSPECTIVE FROM DETECTED ROOM BOUNDARIES · NOT A LIVE CAMERA FEED</text>`;
}

function render3d() {
  if (state.cameraPovDeviceId) {
    const camera = state.devices.find((d) => d.id === state.cameraPovDeviceId && d.type === 'cctv');
    if (camera) return renderCameraPov(camera);
    state.cameraPovDeviceId = null;
  }
  const fallbackRooms = state.rooms.length ? state.rooms : [{ name: 'FLOOR', x: 46, y: 52, width: 900, height: h() - 100 }];
  const ceil = Math.min(95, Math.max(55, Number($('#ceilingHeight').value || 3) * 24));
  const rooms = fallbackRooms.map((r) => ({
    name: r.name,
    x: Number(r.x),
    y: r.normalized ? scaleY(r.y) : Number(r.y),
    width: Number(r.width),
    height: r.normalized ? scaleY(r.height) : Number(r.height),
  }));
  const minX = Math.min(...rooms.map((r) => r.x));
  const minY = Math.min(...rooms.map((r) => r.y));
  const maxX = Math.max(...rooms.map((r) => r.x + r.width));
  const maxY = Math.max(...rooms.map((r) => r.y + r.height));
  const floorWidth = Math.max(1, maxX - minX), floorHeight = Math.max(1, maxY - minY);
  const diagonal = floorWidth + floorHeight;
  const isoScale = Math.min(.62, 880 / diagonal, Math.max(100, h() - 160 - ceil) / (diagonal * .5));
  const depthScale = isoScale * .5;
  const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;
  const floorCenterY = h() / 2 + ceil / 2;
  const project = (x, y, z = 0) => [
    500 + ((x - centerX) - (y - centerY)) * isoScale,
    floorCenterY + ((x - centerX) + (y - centerY)) * depthScale - z,
  ];
  const points = (list) => list.map((p) => p.map((v) => Number(v.toFixed(1))).join(',')).join(' ');
  const floorCorners = [project(minX, minY), project(maxX, minY), project(maxX, maxY), project(minX, maxY)];
  const front = project(maxX, maxY);
  const shadowRx = Math.max(70, Math.min(220, diagonal * isoScale * .23));
  const shadowRy = Math.max(10, Math.min(22, shadowRx * .09));
  let floorShapes = `<ellipse cx="${front[0]}" cy="${front[1] + 17}" rx="${shadowRx}" ry="${shadowRy}" fill="#9eafb9" opacity=".20"/>`;
  floorShapes += `<polygon points="${points(floorCorners)}" fill="#e5ecef" stroke="#aebfc8" stroke-width="2"/>`;
  rooms.forEach((r, i) => {
    const a = project(r.x, r.y), b = project(r.x + r.width, r.y), c = project(r.x + r.width, r.y + r.height), d = project(r.x, r.y + r.height);
    floorShapes += `<polygon points="${points([a,b,c,d])}" fill="${i % 2 ? '#f2f6f7' : '#edf3f5'}" stroke="#c3d0d6" stroke-width="1.2"/>`;
  });
  let walls = '';
  rooms.forEach((r) => {
    const a = project(r.x, r.y), b = project(r.x + r.width, r.y);
    const d = project(r.x, r.y + r.height);
    const az = project(r.x, r.y, ceil), bz = project(r.x + r.width, r.y, ceil), dz = project(r.x, r.y + r.height, ceil);
    walls += `<polygon points="${points([a,b,bz,az])}" fill="#d7e3e8" stroke="#aebfc8" stroke-width="1.2"/>`;
    walls += `<polygon points="${points([a,d,dz,az])}" fill="#e2eaee" stroke="#aebfc8" stroke-width="1.2"/>`;
  });
  let labels = '';
  rooms.forEach((r) => {
    const mid = project(r.x + r.width * .5, r.y + r.height * .5, 1);
    labels += `<text x="${mid[0]}" y="${mid[1]}" text-anchor="middle" fill="#81939e" font-size="8" font-family="DM Sans">${esc(r.name)}</text>`;
  });
  const items = state.devices.filter(deviceVisible).map((d) => {
    const deviceHeight = d.type === 'cctv' || d.type === 'ap' ? ceil : 5;
    const p = project(Number(d.x), Number(d.y), deviceHeight);
    const color = DEVICE_META[d.type]?.color || '#6686a1';
    const heading = d.type === 'cctv' ? (() => { const a = (Number(d.rotation) || 0) * Math.PI / 180; const tip = project(Number(d.x) + Math.cos(a) * 44, Number(d.y) + Math.sin(a) * 44, deviceHeight); return `<line x1="${p[0]}" y1="${p[1]}" x2="${tip[0]}" y2="${tip[1]}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`; })() : '';
    const povAttrs = d.type === 'cctv' ? `class="camera-pov-target" data-camera-pov="${esc(d.id)}" tabindex="0" role="button" aria-label="Open first-person view for ${esc(d.id)}"` : '';
    return `<g ${povAttrs}>${heading}<line x1="${p[0]}" y1="${p[1] + 10}" x2="${p[0]}" y2="${p[1] + 24}" stroke="${color}" stroke-width="2" stroke-dasharray="2 2"/><circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${color}" stroke="white" stroke-width="2"/><text x="${p[0] + 12}" y="${p[1] + 3}" font-size="8" font-family="DM Sans" fill="#50687c">${esc(d.id)}</text></g>`;
  }).join('');
  return `<rect width="1000" height="${h()}" fill="#f7fafb"/>${floorShapes}${walls}${labels}${items}<text x="500" y="${h()-24}" text-anchor="middle" class="heat-legend">ISOMETRIC CONCEPT · WALL HEIGHTS ARE APPROXIMATE</text>`;
}

function draw() {
  const svg = $('#planSvg');
  svg.setAttribute('viewBox', `0 0 1000 ${h()}`);
  let html = '';
  if (state.view === '3d') html = render3d();
  else {
    html = basePlan();
    if (state.view === 'wifi') html += renderWifi();
    if (state.view === 'camera' || $('#layerFov').checked) {
      html += state.devices.filter((d) => d.type === 'cctv' && deviceVisible(d)).map((d) => `<path class="fov-area" d="${sectorPath(d)}"/>`).join('');
    }
    html += renderRooms();
    html += state.devices.filter(deviceVisible).map(renderDevice).join('');
  }
  svg.innerHTML = html;
  $('#canvasPaper').style.transform = `scale(${state.zoom / 100})`;
  $('#zoomLabel').textContent = `${state.zoom}%`;
  $('#viewToast').classList.toggle('hidden', state.view === 'plan');
  $('#viewToast').textContent = state.view === 'wifi' ? 'Estimated coverage only · Confirm materials and survey on site' : state.view === 'camera' ? 'Illustrative camera fields of view · Verify lens, height and target detail' : state.view === '3d' ? (state.cameraPovDeviceId ? 'Camera first-person concept · Click Back to 3D model to return' : 'Isometric concept · Click a camera to preview its perspective') : '';
  $('#canvasName').textContent = state.fileName;
  $('#projectCrumb').textContent = state.fileName === 'Sample office plan' ? 'New floor plan' : state.fileName;
  $('#canvasSub').textContent = state.kind === 'pdf' ? `Page ${state.page + 1} · Preliminary device layout` : state.kind === 'dxf' ? 'DXF modelspace · Preliminary device layout' : 'Floor 1 · Preliminary device layout';
  $('#fileName').textContent = state.fileName;
  $('#fileBadge').textContent = state.kind === 'demo' ? 'DEMO' : state.kind.toUpperCase();
  $('#planNote').textContent = state.kind === 'demo' ? 'Example layout · Replace with a customer plan to begin' : `${state.kind.toUpperCase()} plan loaded · Current page held in browser memory`;
  $('#deviceCountFoot').textContent = `${state.devices.length} devices · ${state.devices.filter((d)=>d.type==='cctv').length} cameras · ${state.devices.filter((d)=>d.type==='ap').length} APs`;
  $('#canvasStatus').textContent = state.analysis.mode === 'ai' ? '' : 'Ready for design';
  renderDeviceList();
}

function renderDeviceList() {
  const list = $('#deviceList');
  list.innerHTML = state.devices.map((d, i) => {
    const m = DEVICE_META[d.type] || DEVICE_META.cctv;
    const pct = Math.round((Number(d.confidence) || .25) * 100);
    const selected = state.selectedDeviceId === d.id ? ' selected' : '';
    const angle = Math.round(((Number(d.rotation) || 0) % 360 + 360) % 360);
    const rotationControls = d.type === 'cctv' ? `<div class="camera-angle"><span>Aim</span><button type="button" data-rotate-step="-15" data-index="${i}" aria-label="Rotate ${esc(d.id)} counter-clockwise 15 degrees" title="Rotate counter-clockwise 15 degrees">−15°</button><output aria-label="${esc(d.id)} direction">${angle}°</output><button type="button" data-rotate-step="15" data-index="${i}" aria-label="Rotate ${esc(d.id)} clockwise 15 degrees" title="Rotate clockwise 15 degrees">+15°</button><small>or drag handle</small></div>` : '';
    return `<div class="device-row${selected}" data-index="${i}"><span class="device-icon ${d.type}">${m.glyph}</span><div class="device-copy"><b>${esc(d.id)} · ${m.short}</b><small>${esc(d.rationale || 'Drag on plan to adjust location')}</small>${rotationControls}</div><span class="confidence">${pct}%</span><button type="button" data-remove="${i}" title="Remove ${esc(d.id)}">×</button></div>`;
  }).join('') || '<div class="device-row"><span class="device-copy"><small>No devices yet. Analyze the plan to start.</small></span></div>';
  const waitingForPlan = state.analysis.mode === 'pending';
  $('#cameraCount').textContent = waitingForPlan ? state.requestedCameras : state.devices.filter((d)=>d.type==='cctv').length;
  $('#apCount').textContent = waitingForPlan ? state.requestedAps : state.devices.filter((d)=>d.type==='ap').length;
}

function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.remove('hidden');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.add('hidden'), 3300);
}

async function refreshStatus() {
  try {
    const r = await fetch('/api/status'); const s = await window.aitsReadJson(r);
    if (!s.aiReady && !s.aiConfigured) $('#aiNotice').innerHTML = '<span class="notice-icon">i</span><span>The sample layout is illustrative. AI is off because no provider key is configured. Your current plan and device layout stay unchanged.</span>';
    else if (!s.aiReady) $('#aiNotice').innerHTML = '<span class="notice-icon">i</span><span>AI is paused until AITS explicitly approves sending plan images, file names, design briefs and settings to the configured provider. Your current plan and device layout stay unchanged.</span>';
    else $('#aiNotice').innerHTML = '<span class="notice-icon">i</span><span>When you analyze, the rendered plan page, file name, design brief and entered settings are sent to the configured AI provider. Review the suggested placements and dimensions before sharing your drawing.</span>';
  } catch { $('#aiNotice').textContent = 'The design service is unavailable. Try again shortly.'; }
}

async function uploadFile(file, pageIndex = 0) {
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf','dxf','png','jpg','jpeg'].includes(ext)) { toast(ext === 'dwg' ? 'Save the drawing as DXF or PDF before upload.' : 'Choose a PDF, PNG, JPEG or DXF file.'); return; }
  if (file.size > 50 * 1024 * 1024) { toast('This first version accepts files up to 50 MB.'); return; }
  $('#uploadTitle').textContent = 'Reading floor plan…'; $('#uploadHint').textContent = 'Rendering the selected page and preparing the drawing';
  $('#canvasStatus').textContent = 'Loading plan…';
  try {
    let result;
    if (location.hostname.endsWith('.github.io')) {
      result = await window.aitsBrowserPreview(file, pageIndex);
    } else {
      const body = new FormData(); body.append('file', file);
      const response = await fetch(`/api/preview?page=${pageIndex}`, { method: 'POST', body });
      result = await window.aitsReadJson(response);
    }
    state.kind = result.kind; state.fileName = result.name; state.image = result.image || null; state.entities = result.entities || [];
    state.planHeight = result.height || 700; state.page = result.page ? result.page - 1 : 0; state.pageCount = result.pageCount || 1; state.sourceFile = file;
    state.rooms = []; state.analysis = { mode: 'pending', summary: '', assumptions: [], questions: [] };
    state.devices = [];
    $('#pageSelect').classList.toggle('hidden', state.kind !== 'pdf' || state.pageCount < 2);
    if (state.kind === 'pdf' && state.pageCount > 1) {
      $('#pageSelect').innerHTML = Array.from({length: state.pageCount}, (_, i) => `<option value="${i}" ${i === state.page ? 'selected' : ''}>Page ${i + 1}</option>`).join('');
    }
    $('#uploadTitle').textContent = file.name; $('#uploadHint').textContent = result.note || `${ext.toUpperCase()} loaded`;
    $('#canvasStatus').textContent = 'Plan loaded · add context and analyze';
    $('#canvasSub').textContent = state.kind === 'pdf' ? `Page ${state.page + 1} of ${state.pageCount} · Preliminary device layout` : 'DXF modelspace · Preliminary device layout';
    draw(); toast('Floor plan loaded. Add project context, then analyze.');
  } catch (e) {
    $('#uploadTitle').textContent = 'Drop your floor plan here'; $('#uploadHint').textContent = 'PDF or DXF · up to 50 MB · DWG: export to PDF or DXF';
    $('#canvasStatus').textContent = 'Could not load plan'; toast(e.message);
  }
}

function canvasImageData() {
  return new Promise((resolve, reject) => {
    const sourceSvg = $('#planSvg').cloneNode(true);
    sourceSvg.querySelectorAll('.workflow-overlay,.device,.fov-area,.wifi-area,.heat-legend,.room-ai-box,.device-label').forEach((el) => el.remove());
    sourceSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    sourceSvg.setAttribute('width', '1400'); sourceSvg.setAttribute('height', String(Math.round(1400 * h() / 1000)));
    const blob = new Blob([new XMLSerializer().serializeToString(sourceSvg)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob); const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = 1400; canvas.height = Math.round(1400 * h() / 1000);
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0,canvas.width,canvas.height);
      URL.revokeObjectURL(url); resolve(canvas.toDataURL('image/jpeg', .88));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not prepare a clean plan preview for analysis.')); };
    img.src = url;
  });
}

async function analyze() {
  state.lastAnalysisError = null;
  try {
    const statusResponse = await fetch('/api/status');
    const status = await window.aitsReadJson(statusResponse);
    if (!status.aiReady) {
      $('#aiSummary').textContent = !status.aiConfigured
        ? 'Visual AI is not configured. Your floor plan and device layout were left unchanged.'
        : 'Visual AI is paused until AITS explicitly approves sending plan images and design context to the configured provider. Your floor plan and device layout were left unchanged.';
      state.lastAnalysisError = $('#aiSummary').textContent;
      $('#aiSummary').classList.remove('hidden');
      toast('No AI key configured. The current layout was left unchanged.');
      return;
    }
  } catch {
    state.lastAnalysisError = 'The design service is unavailable. Your requirements are saved in this session; try again shortly.';
    toast('Could not check the AI connection. Your layout was left unchanged.');
    return;
  }
  $('#analyzeBtn').disabled = true; $('#analyzeBtnSide').disabled = true;
  $('#analyzeBtn').innerHTML = '<span class="spinner"></span> Reading plan…'; $('#analyzeBtnSide').innerHTML = '<span class="spinner"></span> Reading plan…';
  $('#canvasStatus').textContent = 'Analyzing floor plan…';
  try {
    const imageDataUrl = await canvasImageData();
    const payload = {
      routerCount: typeof workflow === 'undefined' ? 1 : workflow.requested.router, switchCount: typeof workflow === 'undefined' ? 1 : workflow.requested.switch, nvrCount: typeof workflow === 'undefined' ? 1 : workflow.requested.nvr,
      designContext: typeof workflow === 'undefined' ? '' : JSON.stringify({catalog:workflow.catalog.filter(c=>c.approved).slice(0,30),locked:(workflow.analysisLocks||[]).map(d=>({...d,y:d.y/h()*1000})),prohibitedZones:workflow.zones.map(z=>({...z,y:z.y/h()*1000,height:z.height/h()*1000})),scaleVerified:workflow.scaleVerified}),
      language: window.aitsLanguage === 'th' ? 'th' : 'en',
      imageDataUrl, filename: state.fileName, brief: `${$('#siteType').value}. ${$('#customerNeeds').value}`,
      roomHeightM: Number($('#ceilingHeight').value || 3), wallType: $('#wallType').value,
      floorWidthM: Number($('#floorWidth').value || 20),
      cameraCount: state.analysis.mode === 'pending' ? state.requestedCameras : state.devices.filter((d)=>d.type==='cctv').length,
      apCount: state.analysis.mode === 'pending' ? state.requestedAps : state.devices.filter((d)=>d.type==='ap').length,
    };
    const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await window.aitsReadJson(response); if (!response.ok) throw new Error(result.detail || 'Analysis failed.');
    const createdAtPlanHeight = result.devices.map((d) => ({ ...d, x: Math.max(12, Math.min(988, Number(d.x))), y: Math.max(12, Math.min(988, Number(d.y))) * h() / 1000 }));
    state.devices = createdAtPlanHeight;
    if (state.kind !== 'survey') state.rooms = (result.rooms || []).map((r) => ({ ...r, normalized: true }));
    if (state.kind === 'survey' && workflow.survey) {
      result.assumptions = [...new Set([...workflow.survey.assumptions, ...(result.assumptions || [])])].slice(0,30);
      result.questions = [...new Set([...workflow.survey.questions, ...(result.questions || [])])].slice(0,30);
    }
    state.requestedCameras = Math.max(0, state.devices.filter((d)=>d.type==='cctv').length);
    state.requestedAps = Math.max(0, state.devices.filter((d)=>d.type==='ap').length);
    state.analysis = result; $('#aiSummary').textContent = result.summary || 'Layout suggestions are ready for review.'; $('#aiSummary').classList.remove('hidden');
    const assumptions = [...(result.assumptions || []), ...(result.questions || []).map((q)=>`Confirm: ${q}`)];
    $('#assumptionList').innerHTML = assumptions.map((a)=>`<li>${esc(a)}</li>`).join(''); $('#assumptionBox').classList.toggle('hidden', !assumptions.length);
    $('#canvasStatus').textContent = '';
    $('#uploadHint').textContent = 'Layout generated · review the placements and design notes';
    draw(); toast('Plan analyzed. Review and adjust every suggestion.');
  } catch (e) { state.lastAnalysisError=e.message; $('#canvasStatus').textContent = 'Analysis could not complete'; toast(e.message); }
  finally {
    $('#analyzeBtn').disabled = false; $('#analyzeBtnSide').disabled = false;
    $('#analyzeBtn').innerHTML = '<span class="sparkle">✦</span> Analyze plan'; $('#analyzeBtnSide').innerHTML = '<span class="sparkle">✦</span> Analyze &amp; suggest';
  }
}

function nextId(type) {
  const prefix = { cctv: 'CCTV', ap: 'AP', router: 'RTR', switch: 'SW', nvr: 'NVR' }[type] || 'DEV';
  let i = 1; while (state.devices.some((d)=>d.id === `${prefix}-${String(i).padStart(2,'0')}`)) i++;
  return `${prefix}-${String(i).padStart(2,'0')}`;
}

function addDevice() {
  const answer = window.prompt('Add which device? Enter: camera, ap, router, switch, or nvr', 'camera');
  if (!answer) return;
  const map = { 'กล้อง':'cctv', 'กล้องวงจรปิด':'cctv', 'เราเตอร์':'router', 'สวิตช์':'switch', 'จุดกระจายสัญญาณ':'ap', camera:'cctv', cctv:'cctv', ap:'ap', router:'router', switch:'switch', nvr:'nvr', 'access point':'ap' };
  const type = map[answer.trim().toLowerCase()];
  if (!type) { toast('Choose camera, AP, router, switch or NVR.'); return; }
  state.devices.push({ id: nextId(type), type, x: 500, y: h()/2, rotation: 45, coverageAngle: type==='cctv'?78:360, coverageRange: type==='ap'?290:200, confidence: .5, rationale: 'Manually added. Drag to the intended location and confirm specifications.' });
  draw(); toast('Device added. Drag it to position.');
}

function exportSvg() {
  const svg = $('#planSvg').cloneNode(true); svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
  svg.setAttribute('width','1600'); svg.setAttribute('height',String(Math.round(1600*h()/1000)));
  const blob = new Blob([new XMLSerializer().serializeToString(svg)], {type:'image/svg+xml;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${state.fileName.replace(/[^a-z0-9-_]+/gi,'_')}_AITS_layout.svg`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('Annotated SVG downloaded.');
}

function saveProject() {
  const payload = { app:'AITS Floorplan Studio', version:1, fileName:state.fileName, kind:state.kind, image:state.image, entities:state.entities, planHeight:h(), rooms:state.rooms, devices:state.devices, analysis:state.analysis, inputs:{siteType:$('#siteType').value,ceilingHeight:$('#ceilingHeight').value,floorWidth:$('#floorWidth').value,wallType:$('#wallType').value,customerNeeds:$('#customerNeeds').value} };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${state.fileName.replace(/[^a-z0-9-_]+/gi,'_')}_AITS_project.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('Project saved as a local JSON file.');
}

function projectNumber(value, label, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(`Invalid project ${label}.`);
  return value;
}

function validateProject(p) {
  if (!p || p.app !== 'AITS Floorplan Studio' || p.version !== 1) throw new Error('Unsupported AITS project file or version.');
  if (!['demo', 'pdf', 'dxf', 'image', 'survey'].includes(p.kind)) throw new Error('Invalid project plan type.');
  const fileName = typeof p.fileName === 'string' ? p.fileName.replace(/[\x00-\x1f\x7f]/g, '').slice(0, 180) : '';
  if (!fileName) throw new Error('Project name is missing.');
  const planHeight = projectNumber(p.planHeight, 'plan dimensions', 1, 6000);
  let image = null;
  if (p.image !== null && p.image !== undefined) {
    if (typeof p.image !== 'string' || p.image.length > 22_000_000) throw new Error('Project plan image is too large.');
    const match = p.image.match(/^data:image\/(png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/);
    if (!match) throw new Error('Project plan image must be an embedded PNG or JPEG.');
    let bytes;
    try { bytes = atob(match[2]); } catch { throw new Error('Project plan image is invalid.'); }
    const png = bytes.length >= 8 && bytes.charCodeAt(0) === 137 && bytes.slice(1, 4) === 'PNG' && bytes.charCodeAt(4) === 13 && bytes.charCodeAt(5) === 10 && bytes.charCodeAt(6) === 26 && bytes.charCodeAt(7) === 10;
    const jpeg = bytes.length >= 3 && bytes.charCodeAt(0) === 255 && bytes.charCodeAt(1) === 216 && bytes.charCodeAt(2) === 255;
    if ((match[1] === 'png' && !png) || (match[1] === 'jpeg' && !jpeg)) throw new Error('Project plan image content does not match its format.');
    image = p.image;
  }
  if (['pdf','image'].includes(p.kind) && !image) throw new Error('PDF project is missing its rendered plan page.');
  if (p.kind === 'dxf' && !Array.isArray(p.entities)) throw new Error('DXF project geometry is missing.');

  const point = (value) => {
    if (!Array.isArray(value) || value.length !== 2) throw new Error('Invalid project drawing coordinate.');
    return [projectNumber(value[0], 'drawing coordinate', 0, 1000), projectNumber(value[1], 'drawing coordinate', 0, planHeight)];
  };
  if (!Array.isArray(p.entities) || p.entities.length > 20_000) throw new Error('Project contains too many drawing elements.');
  const entities = p.entities.map((e) => {
    if (!e || typeof e !== 'object') throw new Error('Invalid project drawing element.');
    if (e.kind === 'line') {
      if (!Array.isArray(e.points) || e.points.length !== 2) throw new Error('Invalid project line.');
      return { kind: 'line', points: e.points.map(point) };
    }
    if (e.kind === 'polyline') {
      if (!Array.isArray(e.points) || e.points.length < 2 || e.points.length > 20_000 || typeof e.closed !== 'boolean') throw new Error('Invalid project polyline.');
      return { kind: 'polyline', points: e.points.map(point), closed: e.closed };
    }
    if (e.kind === 'circle') {
      if (!Array.isArray(e.center)) throw new Error('Invalid project circle.');
      return { kind: 'circle', center: point(e.center), radius: projectNumber(e.radius, 'circle radius', 0, 2000) };
    }
    if (e.kind === 'text') {
      if (typeof e.text !== 'string' || e.text.length > 120) throw new Error('Invalid project drawing label.');
      return { kind: 'text', at: point(e.at), text: e.text };
    }
    throw new Error('Project contains an unsupported drawing element.');
  });

  if (!Array.isArray(p.rooms) || p.rooms.length > 250) throw new Error('Invalid project room list.');
  const rooms = p.rooms.map((r) => {
    if (!r || typeof r.name !== 'string' || r.name.length > 120 || (r.normalized !== undefined && typeof r.normalized !== 'boolean')) throw new Error('Invalid project room.');
    const normalized = r.normalized === true;
    const limitY = normalized ? 1000 : planHeight;
    const room = {
      name: r.name, normalized,
      x: projectNumber(r.x, 'room position', 0, 1000),
      y: projectNumber(r.y, 'room position', 0, limitY),
      width: projectNumber(r.width, 'room size', 0, 1000),
      height: projectNumber(r.height, 'room size', 0, limitY),
      ...(r.confidence === undefined ? {} : { confidence: projectNumber(r.confidence, 'room confidence', 0, 1) }),
    };
    if (!room.width || !room.height || room.x + room.width > 1000 || room.y + room.height > limitY) throw new Error('A project room extends outside the plan.');
    return room;
  });

  const validTypes = new Set(['cctv', 'ap', 'router', 'switch', 'nvr']);
  if (!Array.isArray(p.devices) || p.devices.length > 75) throw new Error('Invalid project device list.');
  const deviceIds = new Set();
  const devices = p.devices.map((d) => {
    if (!d || !validTypes.has(d.type) || typeof d.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(d.id) || deviceIds.has(d.id)) throw new Error('Invalid or duplicate project device.');
    deviceIds.add(d.id);
    if (typeof d.rationale !== 'string' || d.rationale.length > 500) throw new Error(`Invalid rationale for ${d.id}.`);
    return {
      id: d.id, type: d.type,
      x: projectNumber(d.x, 'device position', 0, 1000),
      y: projectNumber(d.y, 'device position', 0, planHeight),
      rotation: projectNumber(d.rotation, 'device direction', -360, 360),
      coverageAngle: projectNumber(d.coverageAngle, 'coverage angle', 0, 360),
      coverageRange: projectNumber(d.coverageRange, 'coverage range', 0, 1500),
      confidence: projectNumber(d.confidence, 'device confidence', 0, 1),
      rationale: d.rationale,
    };
  });

  const analysis = p.analysis || { mode: 'restored', summary: '', assumptions: [], questions: [] };
  if (!analysis || !['sample', 'pending', 'ai', 'restored'].includes(analysis.mode)) throw new Error('Invalid project analysis status.');
  const cleanList = (value, label) => {
    if (!Array.isArray(value) || value.length > 30 || value.some((item) => typeof item !== 'string' || item.length > 500)) throw new Error(`Invalid project ${label}.`);
    return [...value];
  };
  if (typeof analysis.summary !== 'string' || analysis.summary.length > 1200) throw new Error('Invalid project analysis summary.');
  const safeAnalysis = {
    mode: analysis.mode, summary: analysis.summary,
    assumptions: cleanList(analysis.assumptions || [], 'assumptions'),
    questions: cleanList(analysis.questions || [], 'questions'),
  };
  if (analysis.model !== undefined) {
    if (typeof analysis.model !== 'string' || analysis.model.length > 120) throw new Error('Invalid project model label.');
    safeAnalysis.model = analysis.model;
  }
  const inputs = p.inputs || {};
  const siteTypes = new Set(['Office', 'Home', 'Warehouse', 'Retail', 'Construction site', 'Other commercial site']);
  const wallTypes = new Set(['unknown', 'lightweight partition', 'brick or block', 'reinforced concrete', 'mixed']);
  const height = Number(inputs.ceilingHeight ?? 3);
  const width = Number(inputs.floorWidth ?? 20);
  if (!Number.isFinite(height) || height < 2 || height > 12 || !Number.isFinite(width) || width < 1 || width > 500) throw new Error('Invalid project dimensions in the design brief.');
  if (inputs.siteType !== undefined && !siteTypes.has(inputs.siteType)) throw new Error('Invalid project site type.');
  if (inputs.wallType !== undefined && !wallTypes.has(inputs.wallType)) throw new Error('Invalid project wall material.');
  const customerNeeds = inputs.customerNeeds ?? '';
  if (typeof customerNeeds !== 'string' || customerNeeds.length > 4000) throw new Error('Invalid project customer brief.');
  const safeInputs = { siteType: inputs.siteType || 'Office', ceilingHeight: String(height), floorWidth: String(width), wallType: inputs.wallType || 'unknown', customerNeeds };
  return { fileName, kind: p.kind, image, entities, planHeight, rooms, devices, analysis: safeAnalysis, inputs: safeInputs };
}

function loadProject(file) {
  if (!file || file.size > 32 * 1024 * 1024) { toast('Project file is missing or larger than the 32 MB limit.'); return; }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const p = validateProject(JSON.parse(reader.result));
      state.fileName = p.fileName; state.kind = p.kind; state.image = p.image; state.entities = p.entities; state.planHeight = p.planHeight;
      state.rooms = p.rooms; state.devices = p.devices; state.requestedCameras = Math.max(0, state.devices.filter((d) => d.type === 'cctv').length);
      state.requestedAps = Math.max(0, state.devices.filter((d) => d.type === 'ap').length); state.analysis = p.analysis;
      state.sourceFile = null; state.page = 0; state.pageCount = 1; $('#pageSelect').classList.add('hidden'); $('#pageSelect').innerHTML = '';
      $('#siteType').value = p.inputs.siteType; $('#ceilingHeight').value = p.inputs.ceilingHeight; $('#floorWidth').value = p.inputs.floorWidth;
      $('#wallType').value = p.inputs.wallType; $('#customerNeeds').value = p.inputs.customerNeeds;
      $('#aiSummary').textContent = p.analysis.summary || ''; $('#aiSummary').classList.toggle('hidden', !p.analysis.summary);
      const assumptions = [...p.analysis.assumptions, ...p.analysis.questions.map((q) => `Confirm: ${q}`)];
      $('#assumptionList').innerHTML = assumptions.map((a) => `<li>${esc(a)}</li>`).join(''); $('#assumptionBox').classList.toggle('hidden', !assumptions.length);
      draw(); toast('Project restored.');
    } catch (e) { toast(e.message || 'Could not open this project.'); }
  };
  reader.readAsText(file);
}

function svgPoint(clientX,clientY){const svg=$('#planSvg');const point=svg.createSVGPoint();point.x=clientX;point.y=clientY;const local=point.matrixTransform(svg.getScreenCTM().inverse());return {x:Math.max(0,Math.min(1000,local.x)),y:Math.max(0,Math.min(h(),local.y))};}
function wireDrag(){
  $('#planSvg').addEventListener('pointerdown',(e)=>{
    const povExit=e.target.closest('[data-pov-exit]');
    if(povExit){state.cameraPovDeviceId=null;draw();e.preventDefault();return;}
    const povCamera=e.target.closest('[data-camera-pov]');
    if(povCamera){state.cameraPovDeviceId=povCamera.dataset.cameraPov;draw();e.preventDefault();return;}
    const rotateHandle=e.target.closest('[data-rotate-id]');
    if(rotateHandle){state.selectedDeviceId=rotateHandle.dataset.rotateId;state.rotating=state.selectedDeviceId;$('#planSvg').setPointerCapture?.(e.pointerId);e.preventDefault();return;}
    const g=e.target.closest('.device');
    if(!g){if(state.selectedDeviceId){state.selectedDeviceId=null;draw();}return;}
    const item=state.devices.find((d)=>d.id===g.dataset.id);if(!item)return;
    state.selectedDeviceId=item.id;state.dragging=item.id;state.dragMoved=false;$('#planSvg').setPointerCapture?.(e.pointerId);e.preventDefault();draw();
  });
  $('#planSvg').addEventListener('pointermove',(e)=>{
    if(state.rotating){const p=svgPoint(e.clientX,e.clientY);const d=state.devices.find((item)=>item.id===state.rotating);if(d){d.rotation=(Math.atan2(p.y-Number(d.y),p.x-Number(d.x))*180/Math.PI+360)%360;draw();}return;}
    if(!state.dragging)return;const p=svgPoint(e.clientX,e.clientY);const d=state.devices.find((item)=>item.id===state.dragging);if(d){if(Math.hypot(p.x-Number(d.x),p.y-Number(d.y))>2)state.dragMoved=true;d.x=p.x;d.y=p.y;draw();}
  });
  const finishPointer=()=>{if(state.rotating){const d=state.devices.find((item)=>item.id===state.rotating);state.rotating=null;draw();if(d)$('#canvasStatus').textContent=`${d.id} aimed to ${Math.round(((d.rotation%360)+360)%360)}° · Review required`;}if(state.dragging){const moved=state.dragMoved;state.dragging=null;state.dragMoved=false;if(moved)$('#canvasStatus').textContent='Layout edited · Review required';}};
  $('#planSvg').addEventListener('pointerup',finishPointer);$('#planSvg').addEventListener('pointercancel',finishPointer);
  $('#planSvg').addEventListener('keydown',(e)=>{
    const exit=e.target.closest('[data-pov-exit]');
    if(exit&&(e.key==='Enter'||e.key===' ')){state.cameraPovDeviceId=null;draw();e.preventDefault();return;}
    const povCamera=e.target.closest('[data-camera-pov]');
    if(povCamera&&(e.key==='Enter'||e.key===' ')){state.cameraPovDeviceId=povCamera.dataset.cameraPov;draw();e.preventDefault();return;}
    const handle=e.target.closest('[data-rotate-id]');
    if(handle&&['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home'].includes(e.key)){
      const d=state.devices.find((item)=>item.id===handle.dataset.rotateId);
      if(d){d.rotation=e.key==='Home'?0:((Number(d.rotation)||0)+(e.key==='ArrowLeft'||e.key==='ArrowDown'?-15:15)+360)%360;state.selectedDeviceId=d.id;draw();e.preventDefault();}
      return;
    }
    if(e.key==='Delete'||e.key==='Backspace'){const g=e.target.closest('.device');if(g){state.devices=state.devices.filter((d)=>d.id!==g.dataset.id);if(g.dataset.id===state.selectedDeviceId)state.selectedDeviceId=null;draw();}}
  });
}

$('#fileInput').addEventListener('change',(e)=>uploadFile(e.target.files[0]));
const dropzone=$('#dropzone');dropzone.addEventListener('dragover',(e)=>{e.preventDefault();dropzone.classList.add('dragover');});dropzone.addEventListener('dragleave',()=>dropzone.classList.remove('dragover'));dropzone.addEventListener('drop',(e)=>{e.preventDefault();dropzone.classList.remove('dragover');uploadFile(e.dataTransfer.files[0]);});
$('#analyzeBtn').addEventListener('click',analyze);$('#analyzeBtnSide').addEventListener('click',analyze);$('#addDeviceBtn').addEventListener('click',addDevice);$('#saveProjectBtn').addEventListener('click',saveProject);$('#openProjectBtn').addEventListener('click',()=>$('#projectInput').click());$('#exportBtn').addEventListener('click',()=>{ $('#exportMenu').classList.add('hidden'); window.print(); });
$('#exportMoreBtn').addEventListener('click',(e)=>{e.stopPropagation();$('#exportMenu').classList.toggle('hidden');});document.addEventListener('click',(e)=>{if(!e.target.closest('.export-wrap'))$('#exportMenu').classList.add('hidden');});$('#exportSvgBtn').addEventListener('click',()=>{exportSvg();$('#exportMenu').classList.add('hidden');});$('#exportJsonBtn').addEventListener('click',()=>{saveProject();$('#exportMenu').classList.add('hidden');});
$('#newProjectBtn').addEventListener('click',()=>{if(!confirm('Start a new sample layout? Unsaved layout changes will be cleared.'))return;state.fileName='Sample office plan';state.kind='demo';state.image=null;state.entities=[];state.planHeight=700;state.rooms=DEMO_ROOMS.map((r)=>({...r}));state.analysis={mode:'sample',summary:'',assumptions:[],questions:[]};state.devices=DEMO_DEVICES.map((d)=>({...d}));state.requestedCameras=4;state.requestedAps=2;$('#aiSummary').classList.add('hidden');$('#assumptionBox').classList.add('hidden');$('#pageSelect').classList.add('hidden');draw();});
$('#projectInput').addEventListener('change',(e)=>loadProject(e.target.files[0]));
$$('.view-tab').forEach((tab)=>tab.addEventListener('click',()=>{$$('.view-tab').forEach((t)=>t.classList.remove('active'));tab.classList.add('active');state.view=tab.dataset.view;if(state.view!=='3d')state.cameraPovDeviceId=null;draw();}));
['layerCameras','layerWifi','layerNetwork','layerFov'].forEach((id)=>$('#'+id).addEventListener('change',draw));
$$('.count-step button').forEach((btn)=>btn.addEventListener('click',()=>{const type=btn.dataset.count==='cameras'?'cctv':'ap';const d=Number(btn.dataset.delta);const isPending=state.analysis.mode==='pending';if(type==='cctv')state.requestedCameras=Math.max(0,Math.min(48,state.requestedCameras+d));else state.requestedAps=Math.max(0,Math.min(24,state.requestedAps+d));if(!isPending){const current=state.devices.filter((x)=>x.type===type).length;if(d>0)state.devices.push({id:nextId(type),type,x:200+Math.random()*600,y:h()*.5,rotation:45,coverageAngle:type==='cctv'?78:360,coverageRange:250,confidence:.25,rationale:'Added from the design brief. Position is a placeholder until analyzed or reviewed.'});else if(current>0){const idx=[...state.devices].reverse().find((x)=>x.type===type);if(idx)state.devices=state.devices.filter((x)=>x.id!==idx.id);}}draw();}));
$('#deviceList').addEventListener('click',(e)=>{const remove=e.target.closest('[data-remove]');if(remove){const removed=state.devices.splice(Number(remove.dataset.remove),1)[0];if(removed?.id===state.selectedDeviceId)state.selectedDeviceId=null;draw();return;}const rotate=e.target.closest('[data-rotate-step]');if(rotate){const d=state.devices[Number(rotate.dataset.index)];if(d?.type==='cctv'){d.rotation=((Number(d.rotation)||0)+Number(rotate.dataset.rotateStep)+360)%360;state.selectedDeviceId=d.id;draw();$('#canvasStatus').textContent=`${d.id} aimed to ${Math.round(d.rotation)}° · Review required`;toast(`${d.id} direction: ${Math.round(d.rotation)}°`);}return;}const row=e.target.closest('.device-row');if(row){const d=state.devices[Number(row.dataset.index)];state.selectedDeviceId=d?.id||null;draw();}});
$('#zoomIn').addEventListener('click',()=>{state.zoom=Math.min(145,state.zoom+10);draw();});$('#zoomOut').addEventListener('click',()=>{state.zoom=Math.max(65,state.zoom-10);draw();});$('#fitBtn').addEventListener('click',()=>{state.zoom=100;draw();});
$('#pageSelect').addEventListener('change',()=>{if(state.sourceFile)uploadFile(state.sourceFile,Number($('#pageSelect').value));});
wireDrag();draw();refreshStatus();
