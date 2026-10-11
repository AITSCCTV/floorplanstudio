// Store physical lengths in metres; display the user's preferred unit.
const LENGTH_UNITS={m:{name:'Metres (m)',factor:1},cm:{name:'Centimetres (cm)',factor:.01},mm:{name:'Millimetres (mm)',factor:.001},in:{name:'Inches (in)',factor:.0254},ft:{name:'Feet (ft)',factor:.3048},yd:{name:'Yards (yd)',factor:.9144}};
function dimensionUnitLabel(id){return LENGTH_UNITS[workflow.dimensionUnits?.[id]||'m'].name;}
function dimensionToMetres(value,id){return Number(value)*LENGTH_UNITS[workflow.dimensionUnits?.[id]||'m'].factor;}
(() => {
  const fields={ceilingHeight:'Ceiling height',floorWidth:'Plan width',deviceHeight:'Mounting height'};
  function sync(){
    workflow.dimensionUnits ||= {};
    for(const [id,title] of Object.entries(fields)){
      const canonical=document.getElementById(id);if(!canonical)continue;
      const unit=Object.hasOwn(LENGTH_UNITS,workflow.dimensionUnits[id])?workflow.dimensionUnits[id]:'m';
      let value=document.getElementById(id+'Display'),select=document.getElementById(id+'Unit');
      if(!value){
        const container=canonical.closest('.unit-input')||document.createElement('div');
        if(!container.classList.contains('unit-input')){container.className='unit-input';canonical.after(container);container.append(canonical);const label=canonical.closest('label');if(label?.firstChild?.nodeType===3)label.firstChild.textContent=title+' ';}
        container.querySelector(':scope > span')?.remove();
        canonical.type='hidden';
        value=document.createElement('input');value.id=id+'Display';value.type='number';value.step='any';value.className='dimension-value';value.setAttribute('aria-label',title);
        select=document.createElement('select');select.id=id+'Unit';select.className='dimension-unit';select.setAttribute('aria-label',title+' unit');select.innerHTML=Object.entries(LENGTH_UNITS).map(([k,u])=>`<option value="${k}">${u.name}</option>`).join('');
        container.append(value,select);
        document.querySelector(`label[for="${id}"]`)?.setAttribute('for',value.id);
        value.addEventListener('change',()=>{
          const metres=Number(value.value)*LENGTH_UNITS[select.value].factor;
          const min=Number(canonical.min||0),max=Number(canonical.max||500);
          if(value.value===''||!Number.isFinite(metres)||metres<min-1e-9||metres>max+1e-9){const message=`Enter a value from ${min/LENGTH_UNITS[select.value].factor} to ${max/LENGTH_UNITS[select.value].factor} ${select.value}.`;value.setCustomValidity(window.aitsTranslate?window.aitsTranslate(message):message);value.reportValidity();return;}
          value.setCustomValidity('');canonical.value=String(Math.min(max,Math.max(min,Number(metres.toFixed(12)))));canonical.dispatchEvent(new Event('change',{bubbles:true}));
        });
        value.addEventListener('input',()=>value.setCustomValidity(''));
        select.addEventListener('change',()=>{workflow.dimensionUnits[id]=select.value;value.setCustomValidity('');sync();});
      }
      select.value=unit;
      const factor=LENGTH_UNITS[unit].factor;
      value.min=String(Number(canonical.min||0)/factor);value.max=String(Number(canonical.max||500)/factor);
      if(document.activeElement!==value)value.value=String(Number((Number(canonical.value)/factor).toFixed(6)));
    }
  }
  const render=renderWorkflow;renderWorkflow=function(){render();sync();};
  const validate=validateProject;validateProject=function(raw){const p=validate(raw);if(p.workflow){p.workflow.dimensionUnits={};for(const id of Object.keys(fields)){const unit=raw.workflow?.dimensionUnits?.[id];p.workflow.dimensionUnits[id]=Object.hasOwn(LENGTH_UNITS,unit)?unit:'m';}}return p;};
  document.addEventListener('click',event=>{if(!event.target.closest('#journeyNext,#applyDevice,#verifyWidthBtn,#saveProjectBtn,#journeySave'))return;for(const id of Object.keys(fields)){const value=document.getElementById(id+'Display');if(value&&value.offsetParent!==null&&!value.checkValidity()){event.preventDefault();event.stopImmediatePropagation();value.reportValidity();return;}}},true);
  sync();
})();
