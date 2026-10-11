// Present existing editing controls as a guided journey; keep their handlers and IDs.
(() => {
  const originalControls = new Map([...document.querySelectorAll('[id]')].map(n=>[n.id,n]));
  const el = id => document.getElementById(id) || originalControls.get(id);
  const shell = document.createElement('section');
  shell.id = 'designJourney'; shell.className = 'journey wf-panel';
  shell.innerHTML = `<nav class="journey-steps" aria-label="Design steps">${['Upload plan','Set requirements','Review layout','Save & export'].map((name,i)=>`<button type="button" data-step="${i+1}"><span>${i+1}</span><b>${name}</b></button>`).join('')}</nav>
    <div class="journey-heading"><div><p id="journeyEyebrow"></p><h2 id="journeyTitle" tabindex="-1"></h2><p id="journeyDescription"></p></div><span id="journeyMode" class="journey-badge"></span></div>
    <div id="journeyMessage" class="journey-message" role="status" aria-live="polite"></div>
    <div class="journey-layout"><div class="journey-content">${[1,2,3,4].map(i=>`<section id="journeyStep${i}" class="journey-stage" aria-label="Step ${i}"></section>`).join('')}</div><div id="journeyPreview"></div></div>
    <div class="journey-bottom"><button id="journeyBack" type="button">← Back</button><p id="journeyNextHint"></p><button id="journeyNext" class="btn btn-primary" type="button"></button></div>`;
  document.querySelector('.setup-card').before(shell);
  const move = (target,...nodes) => nodes.filter(Boolean).forEach(n=>target.append(n));
  const panel = (target,title,copy) => {const p=document.createElement('div');p.className='journey-card';p.innerHTML=`<h3>${title}</h3>${copy?`<p>${copy}</p>`:''}`;target.append(p);return p;};
  const details = (target,title,copy) => {const d=document.createElement('details');d.className='journey-details';d.innerHTML=`<summary>${title}</summary><div>${copy?`<p>${copy}</p>`:''}</div>`;target.append(d);return d.lastElementChild;};
  const field = id=>el(id).closest('label');
  const stages=[null,...[1,2,3,4].map(i=>el('journeyStep'+i))];
  const columns=[...document.querySelector('.wf-grid').children];
  const groups=[];
  for(const column of columns){let group;for(const node of [...column.children]){if(node.tagName==='H3'){group=document.createElement('div');group.dataset.title=node.textContent;groups.push(group);}if(group)group.append(node);}}
  const group = title => groups.find(g=>g.dataset.title===title);
  const stripHeading = g=>{g.querySelector(':scope > h3')?.remove();return g;};

  // 1: a real file or an explicit example choice.
  move(stages[1],document.querySelector('.setup-card'));
  document.querySelector('.step-head').remove();
  const sample=panel(stages[1],'Just exploring?','Try the sample office to learn the controls before uploading a customer plan.');
  sample.insertAdjacentHTML('beforeend','<button id="journeySample" type="button">Try sample office →</button>');
  stages[1].insertAdjacentHTML('beforeend','<p class="journey-helper">Already have a project file? Use <b>Open saved project</b> in the sidebar to restore your layout and settings.</p>');

  // 2: name, brief and quantities, followed by optional technical inputs.
  const brief=panel(stages[2],'What should this plan include?','Choose quantities and describe the areas you want to cover.');
  move(brief,field('projectTitle'));
  const inspector=document.querySelector('.inspector');
  const deviceHead=inspector.querySelector('.device-list-head');
  const list=el('deviceList');
  inspector.querySelector('.inspector-title').remove();inspector.querySelector('.inspector-intro').remove();
  const briefNodes=[...inspector.children];
  let listReached=false;
  for(const n of briefNodes){if(n===deviceHead)listReached=true;if(!listReached&& !['analyzeBtnSide','aiNotice','aiSummary'].includes(n.id)&&!n.classList.contains('inspector-divider'))move(brief,n);}
  move(brief,stripHeading(group('Requested network equipment')));
  brief.querySelector('.device-spec-head').innerHTML='<span>REQUIRED DEVICE QUANTITIES</span><small>The layout uses these counts</small>';
  const scale=details(stages[2],'Scale and multiple floors','If you know the plan dimensions, confirm the width or calibrate two measured points. You can also leave scale unverified for a first draft.');
  move(scale,stripHeading(group('Scale and floors')));
  const catalog=details(stages[2],'Product models (optional)','Have approved models? Add their specifications here. Otherwise, the draft uses generic devices and marks the models as unspecified.');
  const catalogGroup=stripHeading(group('Product catalog'));move(stages[3],el('deviceProperties'));move(catalog,catalogGroup);
  const consent=panel(stages[2],'What happens when you generate?','AitsCCTV Floorplan Studio turns your drawing and requirements into a proposed device layout, with notes for you to review and refine.');
  el('aiNotice').classList.add('journey-hidden');move(consent,el('aiNotice'));el('analyzeBtnSide').classList.add('journey-hidden');move(consent,el('analyzeBtnSide'));
  consent.insertAdjacentHTML('beforeend','<button id="journeyEditSample" type="button">Explore the sample layout without generating →</button>');

  // 3: keep device editing beside the canvas; advanced controls stay available.
  const reviewIntro=panel(stages[3],'Adjust the suggested layout','Drag a device to move it. Select a device to change its model, camera angle, mounting height or Gang choice.');
  move(reviewIntro,el('undoBtn'),el('redoBtn'));
  move(stages[3],el('aiSummary'),el('assumptionBox'));
  stages[3].append(el('deviceProperties'));
  const devices=details(stages[3],'All devices · add or remove','Select a row to edit that device. Adding a device creates a placeholder you can position on the plan.');move(devices,deviceHead,list);
  const cables=details(stages[3],'Cables and prohibited areas','Connect two devices to estimate a cable run. Add prohibited areas to show where equipment must not be placed.');move(cables,stripHeading(group('Design zones and cables')));
  const layers=details(stages[3],'Visible layers','Choose which devices and coverage overlays appear on the drawing.');document.querySelectorAll('.layer-row').forEach(n=>move(layers,n));
  const records=details(stages[3],'Feedback and review record','Add comments and record a review stage. Changes to the drawing return it to Draft.');move(records,field('reviewerName'),field('projectStatus'),el('recordStatus'),stripHeading(group('Comments and history')),el('revisionLabel'));

  // 4: explicit outputs and unresolved checks.
  const exports=panel(stages[4],'Choose your output','Save the project to continue editing later. The drawing pack opens in a new tab, where you can print or save a PDF.');
  move(exports,el('reportBtn'));el('reportBtn').textContent='Open drawing pack / PDF';
  exports.insertAdjacentHTML('beforeend','<button id="journeySave" type="button">Save editable project</button><button id="journeySvg" type="button">Download drawing SVG</button>');
  const branding=details(stages[4],'Logo and paper settings','Upload a company logo to include it in the drawing pack and SVG.');move(branding,field('logoInput'),el('logoPreview'),el('paperSize').closest('.wf-fields'));
  const checks=panel(stages[4],'Items to confirm before sharing','You can export a draft while these items remain unresolved. Check dimensions and product specifications before installation.');move(checks,el('validationList'));
  const bom=details(stages[4],'Device quantities and quote','Download a BOM, or enter confirmed prices and charges to prepare a draft quote.');move(bom,stripHeading(group('Quantities and validation')));
  const originalWorkflow=el('workflowPanel');originalWorkflow.classList.add('journey-hidden');
  // renderWorkflow uses this sentinel; controls now live in the journey.
  move(el('journeyPreview'),document.querySelector('.canvas-card'));
  document.querySelector('.work-grid').remove();
  document.querySelector('.intro-stats').remove();
  document.querySelector('.intro-row h1').textContent='Create your floorplan';
  document.querySelector('.intro-copy').textContent='Four steps from your floor plan to a layout you can review and share.';
  document.querySelector('.sidebar-note')?.remove();
  document.querySelector('.side-foot')?.remove();
  document.querySelector('.sidebar .side-upload').remove();
  document.querySelector('.side-divider').remove();
  document.querySelectorAll('.side-caption')[1]?.remove();
  el('analyzeBtn').classList.add('journey-hidden');
  document.querySelector('.page-footer').innerHTML='<span>AITS Floorplan Studio</span><span>Save your project file to keep your work.</span>';
  el('exportBtn').onclick=()=>go(4);el('exportBtn').textContent='Save & export →';

  const copy={
    1:['Start with your drawing','Upload a floor plan or create a draft from site photos. Check the preview before continuing.','Continue to requirements →','Next: describe the site and choose your device quantities.'],
    2:['Tell us what you need','Set the site details and device quantities. You can refine the layout after it is generated.','Generate layout →','Next: generate device placements and an explanation to review.'],
    3:['Review and adjust your layout','Check each placement and read the design notes. Select a device on the plan to edit its properties.','Continue to export →','Next: save your editable project or create a drawing pack.'],
    4:['Save and share your work','Choose an output below. Saving a project keeps the drawing and settings together for future edits.','Save editable project','Your project file is downloaded to this computer.']
  };
  let current=1,sampleChosen=false,busy=false;
  window.aitsJourneyGo=(n)=>go(n);
  function go(n,focus=true){
    if(busy)return;
    if(window.aitsJourneyCanGo&&!window.aitsJourneyCanGo(n))return;
    if(n>1&&state.kind==='demo'&&!sampleChosen){el('journeyMessage').textContent='Upload a plan or choose “Try sample office” to continue.';return;}
    if(n>2&&!state.devices.length&&state.analysis.mode!=='ai'){el('journeyMessage').textContent='Generate a layout in step 2 before reviewing or exporting it.';return;}
    current=n;const c=copy[n];
    for(let i=1;i<=4;i++){stages[i].hidden=i!==n;const b=shell.querySelector(`[data-step="${i}"]`);b.classList.toggle('is-current',i===n);b.setAttribute('aria-current',i===n?'step':'false');}
    el('journeyEyebrow').textContent=`STEP ${n} OF 4`;
    el('journeyTitle').textContent=c[0];el('journeyDescription').textContent=c[1];el('journeyNext').textContent=c[2];el('journeyNextHint').textContent=c[3];el('journeyBack').hidden=n===1;el('journeyMessage').textContent='';
    el('journeyNext').disabled=n===1&&state.kind==='demo'&&!sampleChosen;
    if(n===1&&state.kind==='demo'){el('journeyNextHint').textContent='Upload a plan or try the sample to get started.';el('planNote').textContent='Choose a file above, or explore the sample below.';}
    el('journeyPreview').hidden=n===4||(n===1&&state.kind==='demo');
    shell.classList.toggle('has-preview',!el('journeyPreview').hidden);
    shell.classList.toggle('review-step',n===3);
    sample.hidden=state.kind!=='demo';
    el('fileChip').hidden=n===1&&state.kind==='demo';
    el('journeyEditSample').hidden=state.kind!=='demo';
    el('journeyMode').textContent=state.kind==='demo'?(n===1?'No plan uploaded':'Sample office'):state.fileName;
    window.aitsJourneyStepChanged?.(n);
    if(focus){el('journeyTitle').focus({preventScroll:true});shell.scrollIntoView({behavior:'smooth',block:'start'});}
  }
  el('journeySample').onclick=()=>{sampleChosen=true;go(2);};
  el('journeyEditSample').onclick=()=>go(3);
  el('journeyBack').onclick=()=>go(current-1);
  shell.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>go(Number(b.dataset.step)));
  el('journeySave').onclick=saveProject;el('journeySvg').onclick=exportSvg;
  el('journeyNext').onclick=async()=>{
    if(current===1){go(2);return;}
    if(current===3){go(4);return;}
    if(current===4){saveProject();el('journeyMessage').textContent='Project download started. Keep this file to reopen and edit your design.';return;}
    const before=state.analysis;
    busy=true;el('journeyNext').disabled=true;el('journeyNext').textContent='Generating layout…';el('journeyMessage').textContent='Reading your plan and placing the requested devices. This can take a few minutes. Your layout will appear in step 3.';shell.setAttribute('aria-busy','true');
    try{await analyze();}finally{busy=false;el('journeyNext').disabled=false;shell.removeAttribute('aria-busy');el('journeyNext').textContent=copy[2][2];}
    if(state.analysis!==before&&state.analysis.mode==='ai')go(3);
    else el('journeyMessage').textContent=state.lastAnalysisError||'The layout could not be generated. Your requirements are still here. Try again shortly.';
  };
  const upload=uploadFile;
  uploadFile=async(...args)=>{const before=state.image;await upload(...args);if(state.image!==before||state.analysis.mode==='pending'){sampleChosen=false;go(1);el('journeyMessage').textContent='Plan loaded. Check the preview, then continue to requirements.';}};
  const load=loadProject;
  loadProject=async(...args)=>{const before=state.devices;await load(...args);if(state.devices!==before){sampleChosen=state.kind==='demo';go(state.devices.length?3:2);el('journeyMessage').textContent='Saved project restored. You can continue editing or go to Save & export.';}};
  const initialNew=el('newProjectBtn');
  initialNew.replaceWith(initialNew.cloneNode(true));
  el('newProjectBtn').onclick=()=>{if(!confirm('Start a new design? Save your current project first if you want to keep it.'))return;state.fileName='Sample office plan';state.kind='demo';state.image=null;state.entities=[];state.planHeight=700;state.rooms=DEMO_ROOMS.map(r=>({...r}));state.devices=DEMO_DEVICES.map(d=>({...d}));state.analysis={mode:'sample',summary:'',assumptions:[],questions:[]};state.requestedCameras=4;state.requestedAps=2;state.sourceFile=null;Object.assign(workflow,{dimensionUnits:{},project:'New project',revision:1,status:'Draft',scaleVerified:false,routes:[],zones:[],history:[],comments:[],floors:{},prices:{},quote:{labor:0,tax:0},selected:null});$('#aiSummary').classList.add('hidden');$('#assumptionBox').classList.add('hidden');$('#pageSelect').classList.add('hidden');sampleChosen=false;editBaseline=designSignature();draw();go(1);};
  go(1,false);
  document.querySelectorAll('.count-step button').forEach(b=>b.setAttribute('aria-label',`${Number(b.dataset.delta)>0?'Add':'Remove'} one ${b.dataset.count==='cameras'?'CCTV camera':'Wi-Fi access point'}`));
})();
