// Site-photo batches become editable schematic plans in the existing workflow.
(() => {
  window.aitsExtraTranslations={
    'Starting material':'ข้อมูลเริ่มต้น','I have a floorplan file':'มีไฟล์ผังอยู่แล้ว','I have site photos':'มีภาพถ่ายหน้างาน',
    'Upload a floor plan or create a draft from site photos. Check the preview before continuing.':'อัปโหลดผังหรือสร้างแบบร่างจากภาพหน้างาน ตรวจสอบภาพตัวอย่างก่อนดำเนินการต่อ',
    'Create a floorplan from site photos':'สร้างผังจากภาพหน้างาน',
    'Upload several views of one floor. Include overlapping views, entrances and corners. Marked photos are welcome.':'อัปโหลดภาพหลายมุมของชั้นเดียวกัน รวมมุมที่ต่อเนื่องกัน ทางเข้า และมุมห้อง สามารถใช้ภาพที่วาดสัญลักษณ์ไว้แล้วได้',
    'Label where each photo was taken and add any measurements.':'ระบุจุดที่ถ่ายแต่ละภาพและระยะที่วัดได้',
    'Explain how rooms connect and what your drawn symbols mean.':'อธิบายว่าห้องเชื่อมต่อกันอย่างไร และสัญลักษณ์ที่วาดหมายถึงอะไร',
    'Create the draft, check recognised markings, then choose any additional devices.':'สร้างแบบร่าง ตรวจสอบสัญลักษณ์ที่ระบบอ่านได้ แล้วเลือกอุปกรณ์เพิ่มเติม',
    'Floor name':'ชื่อชั้น','Add site photos':'เพิ่มภาพหน้างาน',
    'PNG or JPEG · up to 12 photos · 15 MB each · 50 MB per selection. Photos are resized before generation.':'PNG หรือ JPEG · สูงสุด 12 ภาพ · ภาพละ 15 MB · รวมไม่เกิน 50 MB ต่อครั้ง ระบบย่อภาพก่อนสร้างผัง',
    'Room connections and site notes':'การเชื่อมต่อห้องและข้อมูลหน้างาน',
    'Example: Entrance leads into reception. The office is behind reception; the corridor is on the right.':'ตัวอย่าง: ทางเข้าเชื่อมกับโถงต้อนรับ สำนักงานอยู่ด้านหลังโถง ทางเดินอยู่ทางขวา',
    'Your hand-drawn symbol legend':'คำอธิบายสัญลักษณ์ที่วาด',
    'Example: Red box = CCTV. Blue circle = AP. Arrow = camera direction. 2G = 2 Gang box. The same numbered mark in two photos is one device.':'ตัวอย่าง: กล่องสีแดง = CCTV วงกลมสีน้ำเงิน = AP ลูกศร = ทิศทางกล้อง 2G = กล่อง 2 Gang หมายเลขเดียวกันในสองภาพคืออุปกรณ์ตัวเดียวกัน',
    'Use matching numbers for the same device in different photos. Unclear symbols will be listed for review.':'ใช้หมายเลขเดียวกันสำหรับอุปกรณ์เดียวกันในหลายภาพ ระบบจะแสดงสัญลักษณ์ที่ไม่ชัดเจนให้ตรวจสอบ',
    'Overall floor width (optional)':'ความกว้างชั้นทั้งหมด (ถ้าทราบ)','Overall floor depth (optional)':'ความลึกชั้นทั้งหมด (ถ้าทราบ)','Measurement unit':'หน่วยวัด',
    'Without measurements, dimensions and room connections are estimates. Review them before sharing the drawing.':'หากไม่มีระยะที่วัดจริง ขนาดและการเชื่อมต่อห้องเป็นการประมาณ กรุณาตรวจสอบก่อนส่งต่อแบบ',
    'Create draft floorplan':'สร้างผังร่าง','Photo survey · rooms and recognised markings':'ผังจากภาพหน้างาน · ห้องและสัญลักษณ์ที่อ่านได้',
    'This is a schematic reconstruction. Review photo correspondence, dimensions and marked device placements.':'นี่คือผังแสดงพื้นที่โดยประมาณ โปรดตรวจสอบภาพอ้างอิง ขนาด และตำแหน่งอุปกรณ์ที่วาดไว้',
    'Edit reconstructed rooms and photo markings':'แก้ไขห้องและสัญลักษณ์จากภาพหน้างาน',
    'Photo inputs changed. Create a new draft before continuing.':'ข้อมูลภาพมีการเปลี่ยนแปลง โปรดสร้างแบบร่างใหม่ก่อนดำเนินการต่อ',
    'Room / spot label':'ชื่อห้อง / จุดที่ถ่าย','Measurements, viewpoint and markings':'ระยะที่วัด มุมที่ถ่าย และสัญลักษณ์',
    'Example: Taken from the entrance, facing the back wall. Room 5 m × 4 m. Red box at the far-left corner.':'ตัวอย่าง: ถ่ายจากทางเข้า หันไปผนังด้านหลัง ห้อง 5 × 4 เมตร กล่องสีแดงอยู่มุมซ้ายสุด',
    'Remove photo':'ลบภาพ','Choose PNG or JPEG photos up to 15 MB each.':'เลือกภาพ PNG หรือ JPEG ขนาดไม่เกิน 15 MB ต่อภาพ',
    'Could not read this photo.':'ไม่สามารถอ่านภาพนี้ได้','This photo is too large to process.':'ภาพนี้มีขนาดใหญ่เกินกว่าจะประมวลผลได้',
    'Use up to 12 photos and 50 MB per selection.':'ใช้ภาพไม่เกิน 12 ภาพและรวมไม่เกิน 50 MB ต่อครั้ง',
    'Preparing photos…':'กำลังเตรียมภาพ…','Photos added. Label each view and describe your symbols.':'เพิ่มภาพแล้ว โปรดระบุจุดที่ถ่ายและอธิบายสัญลักษณ์',
    'PHOTO SURVEY · SCHEMATIC · VERIFY DIMENSIONS':'ผังจากภาพหน้างาน · แบบประมาณ · กรุณายืนยันขนาด',
    'Enter a floor name and a label for every photo.':'กรอกชื่อชั้นและชื่อจุดที่ถ่ายสำหรับทุกภาพ',
    'Overall dimensions must be between 1 and 500 metres.':'ขนาดชั้นทั้งหมดต้องอยู่ระหว่าง 1 ถึง 500 เมตร',
    'Use a floor width/depth ratio between 1:6 and 6:1.':'ใช้สัดส่วนความกว้างต่อความลึกระหว่าง 1:6 ถึง 6:1',
    'Creating the schematic and reading your markings… This can take a few minutes.':'กำลังสร้างผังและอ่านสัญลักษณ์… อาจใช้เวลาสักครู่',
    'Check the photo labels and measurements, then try again.':'ตรวจสอบชื่อจุดที่ถ่ายและระยะที่วัด แล้วลองอีกครั้ง',
    'Draft ready. Confirm rooms and recognised markings before generating additional devices.':'แบบร่างพร้อมแล้ว โปรดยืนยันห้องและสัญลักษณ์ที่อ่านได้ก่อนสร้างตำแหน่งอุปกรณ์เพิ่มเติม',
    'Draft floor width (m)':'ความกว้างชั้นในแบบร่าง (ม.)','Draft floor depth (m)':'ความลึกชั้นในแบบร่าง (ม.)','Apply dimensions':'ใช้ขนาดนี้',
    'Room positions use a 0–1000 grid; widths and depths use metres. Editing rooms does not move devices automatically.':'ตำแหน่งห้องใช้พิกัด 0–1000 ความกว้างและความลึกใช้เมตร การแก้ไขห้องจะไม่ย้ายอุปกรณ์โดยอัตโนมัติ',
    'Room':'ห้อง','Width (m)':'ความกว้าง (ม.)','Depth (m)':'ความลึก (ม.)','Apply room':'ใช้ข้อมูลห้อง','Room name':'ชื่อห้อง','Room X':'พิกัด X ของห้อง','Room Y':'พิกัด Y ของห้อง','Room width':'ความกว้างห้อง','Room depth':'ความลึกห้อง',
    'Photo correspondence':'ภาพอ้างอิงของแต่ละห้อง','Recognised device markings':'สัญลักษณ์อุปกรณ์ที่อ่านได้',
    'These devices are preserved during generation. Uncheck Preserve to move them on the layout, or remove an incorrect match below. Counts below include these devices.':'ระบบรักษาตำแหน่งอุปกรณ์เหล่านี้ไว้เมื่อสร้างแบบ หากต้องการย้ายให้ยกเลิกการรักษาตำแหน่ง หรือลบรายการที่อ่านผิดด้านล่าง จำนวนอุปกรณ์ด้านล่างรวมอุปกรณ์เหล่านี้แล้ว',
    'Included in layout':'รวมอยู่ในแบบแล้ว','Removed from layout':'นำออกจากแบบแล้ว','Source photo':'ภาพต้นฉบับ','Edit placement on layout':'แก้ไขตำแหน่งในแบบ','Remove incorrect match':'ลบรายการที่อ่านผิด',
    'No device markings recognised. Use the quantities below to generate devices.':'ไม่พบสัญลักษณ์อุปกรณ์ที่อ่านได้ ใช้จำนวนด้านล่างเพื่อสร้างตำแหน่งอุปกรณ์',
    'Unclear or unsupported markings':'สัญลักษณ์ที่ไม่ชัดเจนหรือไม่รองรับ','No unclear markings reported.':'ไม่มีสัญลักษณ์ที่ไม่ชัดเจนรายงานไว้',
    'Unclear markings are not included as devices. Clarify the symbol legend and create another draft, or add the device manually during review.':'สัญลักษณ์ที่ไม่ชัดเจนยังไม่ถูกเพิ่มเป็นอุปกรณ์ โปรดอธิบายสัญลักษณ์แล้วสร้างแบบใหม่ หรือเพิ่มอุปกรณ์เองในขั้นตอนตรวจสอบ',
    'I have reviewed the approximate rooms and recognised markings.':'ตรวจสอบห้องโดยประมาณและสัญลักษณ์ที่อ่านได้แล้ว',
    'Use this floorplan with marked devices only →':'ใช้ผังนี้พร้อมเฉพาะอุปกรณ์ที่วาดไว้ →',
    'Enter a room name.':'กรอกชื่อห้อง','The room must fit inside the floor boundary.':'ห้องต้องอยู่ภายในขอบเขตชั้น','Use unique room names and non-overlapping rooms.':'ใช้ชื่อห้องไม่ซ้ำกันและอย่าให้ห้องทับซ้อนกัน',
    'Review the rooms and markings, then tick the confirmation box.':'ตรวจสอบห้องและสัญลักษณ์ แล้วทำเครื่องหมายยืนยัน',
    'Photo-survey project is missing its source record.':'โครงการผังจากภาพไม่มีข้อมูลต้นฉบับ','Invalid photo-survey source record.':'ข้อมูลต้นฉบับภาพหน้างานไม่ถูกต้อง',
    'Photo-derived schematic: verify room connections, dimensions and all marked placements.':'ผังประมาณจากภาพถ่าย: ยืนยันการเชื่อมต่อห้อง ขนาด และตำแหน่งที่วาดทั้งหมด',
    'Photo reconstruction has not been reviewed.':'ยังไม่ได้ตรวจสอบผังจากภาพหน้างาน',
    'The design service is not enabled. Your current plan is unchanged.':'ยังไม่เปิดบริการสร้างผัง แบบปัจจุบันยังคงอยู่',
    'The photo batch is too large. Use fewer or smaller images.':'ชุดภาพมีขนาดใหญ่เกินไป ให้ลดจำนวนหรือขนาดภาพ',
    'Could not reconstruct a usable floorplan from these photos. Add clearer room labels, connections or measurements and try again. Your current plan is unchanged.':'ยังสร้างผังที่ใช้งานได้จากภาพชุดนี้ไม่ได้ โปรดเพิ่มชื่อห้อง การเชื่อมต่อ หรือระยะที่วัดให้ชัดเจนแล้วลองใหม่ แบบปัจจุบันยังคงอยู่',
    'Created schematic from site photos':'สร้างผังประมาณจากภาพหน้างาน','Reviewed photo reconstruction':'ตรวจสอบผังจากภาพหน้างาน','Edited photo floor dimensions':'แก้ไขขนาดชั้นจากภาพหน้างาน','Edited reconstructed room':'แก้ไขห้องที่สร้างจากภาพ','Removed recognised marking':'ลบสัญลักษณ์ที่อ่านได้'
  };
  const link=document.createElement('link');link.rel='stylesheet';link.href='/static/site-photos.css';document.head.append(link);
  const stage=document.getElementById('journeyStep1'),upload=document.querySelector('.setup-card');
  const choose=document.createElement('div');choose.className='survey-source';choose.setAttribute('aria-label','Starting material');
  choose.innerHTML='<button type="button" id="sourceDrawing" aria-pressed="true">I have a floorplan file</button><button type="button" id="sourcePhotos" aria-pressed="false">I have site photos</button>';
  stage.prepend(choose);
  const panel=document.createElement('section');panel.id='sitePhotoPanel';panel.className='journey-card survey-panel';panel.hidden=true;
  panel.innerHTML=`<h3>Create a floorplan from site photos</h3><p>Upload several views of one floor. Include overlapping views, entrances and corners. Marked photos are welcome.</p>
    <ol class="survey-instructions"><li>Label where each photo was taken and add any measurements.</li><li>Explain how rooms connect and what your drawn symbols mean.</li><li>Create the draft, check recognised markings, then choose any additional devices.</li></ol>
    <label>Floor name<input id="surveyTitle" maxlength="160" value="Site survey · Floor 1"></label>
    <label class="survey-file">Add site photos<input id="surveyFiles" type="file" accept="image/jpeg,image/png" multiple></label>
    <p>PNG or JPEG · up to 12 photos · 15 MB each · 50 MB per selection. Photos are resized before generation.</p>
    <div id="surveyPhotos" class="survey-photo-grid"></div>
    <label>Room connections and site notes<textarea id="surveyConnections" rows="3" maxlength="4000" placeholder="Example: Entrance leads into reception. The office is behind reception; the corridor is on the right."></textarea></label>
    <label>Your hand-drawn symbol legend<textarea id="surveyLegend" rows="3" maxlength="3000" placeholder="Example: Red box = CCTV. Blue circle = AP. Arrow = camera direction. 2G = 2 Gang box. The same numbered mark in two photos is one device."></textarea></label>
    <p>Use matching numbers for the same device in different photos. Unclear symbols will be listed for review.</p>
    <div class="survey-dimensions"><label>Overall floor width (optional)<input id="surveyWidth" type="number" step="any" min="0.01"></label><label>Overall floor depth (optional)<input id="surveyHeight" type="number" step="any" min="0.01"></label><label>Measurement unit<select id="surveyUnit"><option value="m">Metres (m)</option><option value="cm">Centimetres (cm)</option><option value="mm">Millimetres (mm)</option><option value="ft">Feet (ft)</option><option value="in">Inches (in)</option><option value="yd">Yards (yd)</option></select></label></div>
    <p>Without measurements, dimensions and room connections are estimates. Review them before sharing the drawing.</p>
    <button id="surveyBuild" type="button" class="btn btn-primary" disabled>Create draft floorplan</button><p id="surveyStatus" role="status" aria-live="polite"></p>`;
  choose.after(panel);
  const review=document.createElement('details');review.id='surveyReview';review.className='journey-details';review.hidden=true;review.open=true;
  review.innerHTML='<summary>Photo survey · rooms and recognised markings</summary><div><p>This is a schematic reconstruction. Review photo correspondence, dimensions and marked device placements.</p><div id="surveyReviewBody"></div></div>';
  document.getElementById('journeyStep2').prepend(review);
  const reviewLater=document.createElement('button');reviewLater.type='button';reviewLater.textContent='Edit reconstructed rooms and photo markings';reviewLater.onclick=()=>{window.aitsJourneyGo(2);review.open=true;review.scrollIntoView({behavior:'smooth'});};
  document.getElementById('journeyStep3').prepend(reviewLater);reviewLater.hidden=true;
  let photos=[],busy=false,photoMode=false,dirty=false;
  const by=id=>document.getElementById(id);
  const floorLoad=by('loadFloor').onclick;by('loadFloor').onclick=()=>{floorLoad();renderReview();if(workflow.survey){photos=JSON.parse(JSON.stringify(workflow.survey.photos));renderPhotos();}source(state.kind==='survey');};
  const undo=by('undoBtn').onclick,redo=by('redoBtn').onclick;by('undoBtn').onclick=()=>{undo();renderReview();};by('redoBtn').onclick=()=>{redo();renderReview();};
  const units={m:1,cm:.01,mm:.001,ft:.3048,in:.0254,yd:.9144};
  const t=s=>window.aitsTranslate?window.aitsTranslate(s):s;
  const numbers=v=>Number(Number(v).toFixed(3));
  function source(mode){if(busy)return;photoMode=mode;panel.hidden=!mode;upload.hidden=mode;by('sourceDrawing').setAttribute('aria-pressed',String(!mode));by('sourcePhotos').setAttribute('aria-pressed',String(mode));by('surveyReview').hidden=state.kind!=='survey';refreshNext();}
  by('sourceDrawing').onclick=()=>source(false);by('sourcePhotos').onclick=()=>source(true);
  function refreshNext(){
    const first=!by('journeyStep1').hidden;
    by('journeyNext').parentElement.hidden=first&&photoMode&&(dirty||state.kind!=='survey');
    by('journeySample').closest('.journey-card').hidden=photoMode||state.kind!=='demo';
    if(first&&photoMode)by('journeyNext').disabled=busy||dirty||state.kind!=='survey';
    else if(first)by('journeyNext').disabled=state.kind==='demo';
  }
  window.aitsJourneyStepChanged=()=>refreshNext();
  window.aitsJourneyCanGo=n=>{if(n>1&&photoMode&&(dirty||state.kind!=='survey')){toast(t('Create draft floorplan'));return false;}return true;};
  function invalidate(){dirty=true;by('surveyStatus').textContent=t('Photo inputs changed. Create a new draft before continuing.');refreshNext();}
  ['surveyTitle','surveyConnections','surveyLegend','surveyWidth','surveyHeight','surveyUnit'].forEach(id=>by(id).addEventListener('input',invalidate));
  function renderPhotos(){
    by('surveyPhotos').innerHTML=photos.map((p,i)=>`<article class="survey-photo"><div class="survey-photo-top"><b>${i+1}</b><span data-user-content>${esc(p.filename)}</span><button type="button" data-remove-photo="${i}" aria-label="Remove photo">×</button></div><img src="${p.imageDataUrl}" alt="${esc(p.label)}"><label>Room / spot label<input maxlength="120" data-photo-label="${i}" value="${esc(p.label)}"></label><label>Measurements, viewpoint and markings<textarea rows="3" maxlength="1200" data-photo-notes="${i}" placeholder="Example: Taken from the entrance, facing the back wall. Room 5 m × 4 m. Red box at the far-left corner.">${esc(p.notes)}</textarea></label></article>`).join('');
    by('surveyBuild').disabled=busy||!photos.length;
  }
  async function resize(file){
    if(!/\.(png|jpe?g)$/i.test(file.name)||file.size>15*1024*1024)throw Error(t('Choose PNG or JPEG photos up to 15 MB each.'));
    const url=URL.createObjectURL(file),image=new Image();
    try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error(t('Could not read this photo.')));image.src=url;});
      const ratio=Math.min(1,1400/Math.max(image.naturalWidth,image.naturalHeight));if(!ratio||image.naturalWidth*image.naturalHeight>80_000_000)throw Error(t('This photo is too large to process.'));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
      return {filename:file.name.slice(0,180),label:file.name.replace(/\.[^.]+$/,'').slice(0,120),notes:'',imageDataUrl:canvas.toDataURL('image/jpeg',.86)};
    }finally{URL.revokeObjectURL(url);}
  }
  function freeze(on){busy=on;panel.setAttribute('aria-busy',String(on));panel.querySelectorAll('input,textarea,select,button').forEach(n=>n.disabled=on);choose.querySelectorAll('button').forEach(n=>n.disabled=on);by('journeyNext').disabled=on;by('surveyBuild').disabled=on||!photos.length;}
  by('surveyFiles').onchange=async event=>{
    const files=[...event.target.files];event.target.value='';if(!files.length)return;
    if(photos.length+files.length>12||files.reduce((n,f)=>n+f.size,0)>50*1024*1024){by('surveyStatus').textContent=t('Use up to 12 photos and 50 MB per selection.');return;}
    freeze(true);by('surveyStatus').textContent=t('Preparing photos…');
    try{const added=[];for(const file of files)added.push(await resize(file));photos.push(...added);invalidate();renderPhotos();by('surveyStatus').textContent=t('Photos added. Label each view and describe your symbols.');}catch(e){by('surveyStatus').textContent=e.message;}finally{freeze(false);refreshNext();}
  };
  by('surveyPhotos').addEventListener('input',event=>{const label=event.target.dataset.photoLabel,notes=event.target.dataset.photoNotes;if(label!==undefined)photos[Number(label)].label=event.target.value;if(notes!==undefined)photos[Number(notes)].notes=event.target.value;invalidate();});
  by('surveyPhotos').addEventListener('click',event=>{const b=event.target.closest('[data-remove-photo]');if(b&&!busy){photos.splice(Number(b.dataset.removePhoto),1);renderPhotos();invalidate();}});
  function showNotes(){
    by('aiSummary').textContent=state.analysis.summary;by('aiSummary').classList.remove('hidden');
    const all=[...state.analysis.assumptions,...state.analysis.questions.map(q=>t('Confirm: ')+q)];by('assumptionList').innerHTML=all.map(s=>`<li>${esc(s)}</li>`).join('');by('assumptionBox').classList.toggle('hidden',!all.length);
  }
  window.siteSurveyBackground=()=>{
    const s=workflow.survey,depth=s?.floorHeightM||Number(by('floorWidth').value)*h()/1000;
    return `<rect width="1000" height="${h()}" fill="#fff"/><g class="survey-geometry" data-user-content>${state.rooms.map(r=>`<rect x="${r.x}" y="${r.y*h()/1000}" width="${r.width}" height="${r.height*h()/1000}" fill="#f8fafc" stroke="#203b50" stroke-width="4"/><text x="${r.x+r.width/2}" y="${(r.y+r.height/2)*h()/1000}" text-anchor="middle" fill="#203b50" font-size="14">${esc(r.name)}</text><text x="${r.x+r.width/2}" y="${(r.y+r.height/2)*h()/1000+20}" text-anchor="middle" fill="#64788b" font-size="12">${numbers(r.width/1000*Number(by('floorWidth').value))} m × ${numbers(r.height/1000*depth)} m</text>`).join('')}</g><text x="20" y="${h()-12}" font-size="12" fill="#7a5c2f">${esc(t('PHOTO SURVEY · SCHEMATIC · VERIFY DIMENSIONS'))}</text>`;
  };
  by('surveyBuild').onclick=async()=>{
    if(busy||!photos.length)return;
    try{
      if(!by('surveyTitle').value.trim()||photos.some(p=>!p.label.trim()))throw Error(t('Enter a floor name and a label for every photo.'));
      const factor=units[by('surveyUnit').value];const dim=id=>{if(!by(id).value)return null;const v=Number(by(id).value)*factor;if(!Number.isFinite(v)||v<1||v>500)throw Error(t('Overall dimensions must be between 1 and 500 metres.'));return v;};
      const payload={photos,title:by('surveyTitle').value.trim(),connections:by('surveyConnections').value,legend:by('surveyLegend').value,widthM:dim('surveyWidth'),heightM:dim('surveyHeight'),language:window.aitsLanguage==='th'?'th':'en'};
      if(payload.widthM&&payload.heightM&&Math.max(payload.widthM/payload.heightM,payload.heightM/payload.widthM)>6)throw Error(t('Use a floor width/depth ratio between 1:6 and 6:1.'));
      freeze(true);by('surveyStatus').textContent=t('Creating the schematic and reading your markings… This can take a few minutes.');
      const response=await fetch('/api/site-survey',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok)throw Error(typeof result.detail==='string'?t(result.detail):t('Check the photo labels and measurements, then try again.'));
      remember();
      workflow.survey={...result,photos:JSON.parse(JSON.stringify(photos)),title:payload.title,connections:payload.connections,legend:payload.legend,confirmed:false};
      state.kind='survey';state.fileName=payload.title;state.image=null;state.entities=[];state.planHeight=result.floorHeightM/result.floorWidthM*1000;state.sourceFile=null;state.page=0;state.pageCount=1;state.selectedDeviceId=null;
      state.rooms=result.rooms.map(r=>({...r,normalized:true}));
      state.devices=result.marks.map(m=>({...m,y:m.y*h()/1000,locked:true,...(m.mountHeightM===null?{mountHeightM:undefined}:{})}));
      state.requestedCameras=Math.max(4,state.devices.filter(d=>d.type==='cctv').length);state.requestedAps=Math.max(2,state.devices.filter(d=>d.type==='ap').length);
      for(const type of ['router','switch','nvr']){workflow.requested[type]=Math.max(1,state.devices.filter(d=>d.type===type).length);by('request-'+type).value=workflow.requested[type];}
      state.analysis={mode:'pending',summary:result.summary,assumptions:result.assumptions,questions:result.questions,model:result.model};
      workflow.scaleVerified=false;workflow.routes=[];workflow.zones=[];workflow.selected=null;workflow.project=payload.title;by('floorWidth').value=result.floorWidthM;by('pageSelect').classList.add('hidden');
      dirty=false;changed('Created schematic from site photos');draw();showNotes();renderReview();freeze(false);window.aitsJourneyGo(2);by('journeyMessage').textContent=t('Draft ready. Confirm rooms and recognised markings before generating additional devices.');
    }catch(e){by('surveyStatus').textContent=e.message;toast(e.message);}finally{freeze(false);refreshNext();}
  };
  function renderReview(){
    const s=workflow.survey,active=state.kind==='survey'&&!!s;review.hidden=!active;reviewLater.hidden=!active;if(!active)return;
    const body=by('surveyReviewBody');
    body.innerHTML=`<p data-user-content>${esc(s.summary)}</p><div class="survey-dimensions"><label>Draft floor width (m)<input id="surveyEditWidth" type="number" min="1" max="500" step="any" value="${Number(by('floorWidth').value)}"></label><label>Draft floor depth (m)<input id="surveyEditHeight" type="number" min="1" max="500" step="any" value="${s.floorHeightM}"></label><button id="surveyApplyDimensions" type="button">Apply dimensions</button></div>
      <p>Room positions use a 0–1000 grid; widths and depths use metres. Editing rooms does not move devices automatically.</p>
      <div class="survey-table-wrap"><table class="survey-room-table"><thead><tr><th>Room</th><th>X</th><th>Y</th><th>Width (m)</th><th>Depth (m)</th><th></th></tr></thead><tbody>${state.rooms.map((r,i)=>`<tr data-room="${i}"><td><input aria-label="Room name" data-field="name" maxlength="120" value="${esc(r.name)}"></td><td><input aria-label="Room X" data-field="x" type="number" min="0" max="1000" value="${r.x}"></td><td><input aria-label="Room Y" data-field="y" type="number" min="0" max="1000" value="${r.y}"></td><td><input aria-label="Room width" data-field="width" type="number" min="0.01" step="any" value="${numbers(r.width/1000*Number(by('floorWidth').value))}"></td><td><input aria-label="Room depth" data-field="height" type="number" min="0.01" step="any" value="${numbers(r.height/1000*s.floorHeightM)}"></td><td><button type="button" data-apply-room="${i}">Apply room</button></td></tr>`).join('')}</tbody></table></div>
      <h4>Photo correspondence</h4><ul>${s.photoLinks.map(p=>`<li data-user-content><b>#${p.photoIndex} · ${esc(s.photos[p.photoIndex-1]?.label||'')}</b> → ${p.roomNames.map(esc).join(', ')}<br>${esc(p.notes)}</li>`).join('')}</ul>
      <h4>Recognised device markings</h4><p>These devices are preserved during generation. Uncheck Preserve to move them on the layout, or remove an incorrect match below. Counts below include these devices.</p>
      <div class="survey-mark-list">${s.marks.map(m=>{const device=state.devices.find(d=>d.id===m.id);return `<article class="survey-match"><img src="${s.photos[m.photoIndex-1]?.imageDataUrl||''}" alt="Source photo"><div><b data-user-content>${esc(m.id)} · ${esc(m.type.toUpperCase())} · #${m.photoIndex}</b><p data-user-content>${esc(m.symbol)} — ${esc(m.evidence)}</p><small data-user-content>${esc(m.roomName)} · ${Math.round(m.confidence*100)}% · ${esc(m.rationale)}</small><p>${device?'<span>Included in layout</span>':'<span>Removed from layout</span>'}</p><button type="button" data-select-mark="${esc(m.id)}" ${device?'':'disabled'}>Edit placement on layout</button><button type="button" data-remove-mark="${esc(m.id)}" ${device?'':'disabled'}>Remove incorrect match</button></div></article>`;}).join('')||'<p>No device markings recognised. Use the quantities below to generate devices.</p>'}</div>
      <h4>Unclear or unsupported markings</h4><ul>${s.unclearMarks.map(m=>`<li data-user-content>#${m.photoIndex} · ${esc(m.symbol)}: ${esc(m.reason)}</li>`).join('')||'<li>No unclear markings reported.</li>'}</ul>
      <p>Unclear markings are not included as devices. Clarify the symbol legend and create another draft, or add the device manually during review.</p>
      <ul>${[...s.assumptions,...s.questions].map(n=>`<li data-user-content>${esc(n)}</li>`).join('')}</ul>
      <label class="survey-confirm"><input type="checkbox" id="surveyConfirmed" ${s.confirmed?'checked':''}>I have reviewed the approximate rooms and recognised markings.</label>
      <button type="button" id="surveyMarksOnly">Use this floorplan with marked devices only →</button>`;
    by('surveyConfirmed').onchange=()=>{s.confirmed=by('surveyConfirmed').checked;changed('Reviewed photo reconstruction');};
    by('surveyApplyDimensions').onclick=()=>{
      try{const w=num(by('surveyEditWidth').value,1,500,'floor width'),depth=num(by('surveyEditHeight').value,1,500,'floor depth');if(Math.max(w/depth,depth/w)>6)throw Error(t('Use a floor width/depth ratio between 1:6 and 6:1.'));remember();const old=h();by('floorWidth').value=w;s.floorWidthM=w;s.floorHeightM=depth;state.planHeight=depth/w*1000;state.devices.forEach(d=>d.y=d.y/old*h());workflow.routes=[];workflow.zones=[];workflow.scaleVerified=false;s.confirmed=false;changed('Edited photo floor dimensions');draw();renderReview();}catch(e){toast(e.message);}
    };
    body.querySelectorAll('[data-apply-room]').forEach(b=>b.onclick=()=>{
      try{const row=b.closest('tr'),v=Object.fromEntries([...row.querySelectorAll('[data-field]')].map(n=>[n.dataset.field,n.value]));if(!v.name.trim())throw Error(t('Enter a room name.'));const room={...state.rooms[Number(b.dataset.applyRoom)],name:v.name.trim(),x:num(v.x,0,1000,'room X'),y:num(v.y,0,1000,'room Y'),width:num(v.width,.01,500,'room width')/Number(by('floorWidth').value)*1000,height:num(v.height,.01,500,'room depth')/s.floorHeightM*1000};if(room.x+room.width>1000||room.y+room.height>1000)throw Error(t('The room must fit inside the floor boundary.'));if(state.rooms.some((r,i)=>i!==Number(b.dataset.applyRoom)&&(r.name===room.name||(Math.min(r.x+r.width,room.x+room.width)>Math.max(r.x,room.x)+1&&Math.min(r.y+r.height,room.y+room.height)>Math.max(r.y,room.y)+1))))throw Error(t('Use unique room names and non-overlapping rooms.'));remember();const oldName=state.rooms[Number(b.dataset.applyRoom)].name;s.marks.forEach(m=>{if(m.roomName===oldName)m.roomName=room.name;});s.photoLinks.forEach(l=>l.roomNames=l.roomNames.map(n=>n===oldName?room.name:n));state.rooms[Number(b.dataset.applyRoom)]=room;s.confirmed=false;workflow.scaleVerified=false;changed('Edited reconstructed room');draw();renderReview();}catch(e){toast(e.message);}
    });
    body.querySelectorAll('[data-remove-mark]').forEach(b=>b.onclick=()=>{remember();state.devices=state.devices.filter(d=>d.id!==b.dataset.removeMark);s.confirmed=false;changed('Removed recognised marking');draw();renderReview();});
    body.querySelectorAll('[data-select-mark]').forEach(b=>b.onclick=()=>{state.selectedDeviceId=b.dataset.selectMark;workflow.selected=b.dataset.selectMark;state.analysis.mode='ai';draw();window.aitsJourneyGo(3);});
    by('surveyMarksOnly').onclick=()=>{if(!s.confirmed)return toast(t('Review the rooms and markings, then tick the confirmation box.'));state.analysis.mode='ai';draw();showNotes();window.aitsJourneyGo(3);};
  }
  // Preserve photos, source evidence and review status in project files and undo history.
  const validate=validateProject;
  validateProject=function(raw){
    const p=validate(raw),s=raw.workflow?.survey;
    if(p.kind==='survey'&&!s)throw Error(t('Photo-survey project is missing its source record.'));
    if(s){
      if(JSON.stringify(s).length>18_000_000||!Array.isArray(s.photos)||s.photos.length<1||s.photos.length>12)throw Error(t('Invalid photo-survey source record.'));
      const text=(v,max)=>{if(typeof v!=='string'||v.length>max)throw Error(t('Invalid photo-survey source record.'));return v;};
      const ps=s.photos.map(photo=>{const image=text(photo.imageDataUrl,3_000_000);if(!/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/.test(image))throw Error(t('Invalid photo-survey source record.'));return {imageDataUrl:image,filename:text(photo.filename,180),label:text(photo.label,120),notes:text(photo.notes,1200)};});
      const index=v=>num(v,1,ps.length,'source photo');
      const clean={title:text(s.title,160),connections:text(s.connections,4000),legend:text(s.legend,3000),floorWidthM:num(s.floorWidthM,1,500,'floor width'),floorHeightM:num(s.floorHeightM,1,500,'floor depth'),summary:text(s.summary,1200),photos:ps,confirmed:s.confirmed===true};
      if(Math.max(clean.floorWidthM/clean.floorHeightM,clean.floorHeightM/clean.floorWidthM)>6)throw Error(t('Invalid photo-survey source record.'));
      for(const key of ['assumptions','questions']){if(!Array.isArray(s[key])||s[key].length>30)throw Error(t('Invalid photo-survey source record.'));clean[key]=s[key].map(v=>text(v,500));}
      if(!Array.isArray(s.marks)||s.marks.length>75||!Array.isArray(s.unclearMarks)||s.unclearMarks.length>30||!Array.isArray(s.photoLinks)||s.photoLinks.length>12)throw Error(t('Invalid photo-survey source record.'));
      clean.marks=s.marks.map(m=>({id:text(m.id,40),type:text(m.type,20),photoIndex:index(m.photoIndex),symbol:text(m.symbol,120),evidence:text(m.evidence,500),roomName:text(m.roomName,120),rationale:text(m.rationale,500),confidence:num(m.confidence,0,1,'mark confidence')}));
      clean.unclearMarks=s.unclearMarks.map(m=>({photoIndex:index(m.photoIndex),symbol:text(m.symbol,120),reason:text(m.reason,500)}));
      clean.photoLinks=s.photoLinks.map(l=>{if(!Array.isArray(l.roomNames)||l.roomNames.length>40)throw Error(t('Invalid photo-survey source record.'));return {photoIndex:index(l.photoIndex),roomNames:l.roomNames.map(n=>text(n,120)),notes:text(l.notes,500)};});
      p.workflow.survey=clean;
    }else if(p.workflow)p.workflow.survey=null;
    return p;
  };
  const load=loadProject;loadProject=async function(...args){const before=state.devices;await load(...args);if(state.devices===before)return;dirty=false;if(state.kind==='survey'&&workflow.survey){photos=JSON.parse(JSON.stringify(workflow.survey.photos));by('surveyTitle').value=workflow.survey.title;by('surveyConnections').value=workflow.survey.connections;by('surveyLegend').value=workflow.survey.legend;renderPhotos();source(true);renderReview();showNotes();}else{source(false);renderReview();}window.aitsJourneyGo(state.devices.length||state.analysis.mode==='ai'?3:2);};
  const uploadPlan=uploadFile;uploadFile=async function(...args){await uploadPlan(...args);if(state.kind!=='survey'){workflow.survey=null;source(false);renderReview();}};
  const gen=analyze;analyze=async function(...args){
    if(state.kind==='survey'&&!workflow.survey?.confirmed){state.lastAnalysisError=t('Review the rooms and markings, then tick the confirmation box.');toast(state.lastAnalysisError);return;}
    await gen(...args);renderReview();
  };
  // Journey owns the new-project button; clear source records only after its reset succeeds.
  by('newProjectBtn').addEventListener('click',()=>{if(state.kind==='demo'){photos=[];workflow.survey=null;dirty=false;renderPhotos();source(false);renderReview();}});
  const warn=warnings;warnings=function(){const list=warn();if(state.kind==='survey'){list.unshift(t('Photo-derived schematic: verify room connections, dimensions and all marked placements.'));if(!workflow.survey?.confirmed)list.unshift(t('Photo reconstruction has not been reviewed.'));}return list;};
  by('floorWidth').addEventListener('change',()=>{if(state.kind==='survey'&&workflow.survey){workflow.survey.floorWidthM=Number(by('floorWidth').value);workflow.survey.floorHeightM=Number(by('floorWidth').value)*h()/1000;workflow.survey.confirmed=false;renderReview();draw();}});
  document.addEventListener('click',event=>{if(busy&&event.target.closest('#journeyNext,#journeyBack,[data-step],#newProjectBtn,#fileInput,#openProjectBtn')){event.preventDefault();event.stopImmediatePropagation();}if(event.target.closest('[data-step],#journeyBack'))setTimeout(refreshNext,0);},true);
  renderReview();
})();
