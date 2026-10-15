(() => {
  const phases = [
    ['Connecting to the design service','กำลังเชื่อมต่อบริการสร้างผัง'],
    ['Preparing your drawing','กำลังเตรียมภาพผัง'],
    ['Generating device placements','กำลังสร้างตำแหน่งอุปกรณ์'],
    ['Applying the finished layout','กำลังแสดงผลผังที่สร้างเสร็จ']
  ];
  let active;
  window.aitsGenerationPhase = phase => { if (active) { active.phase=phase;active.render(); } };
  window.aitsRunGeneration = async run => {
    if (active) return;
    const controller=new AbortController(),start=Date.now();
    const box=document.createElement('section');box.className='generation-progress';box.setAttribute('data-user-content','');
    box.innerHTML='<b role="status" aria-live="polite"></b><progress aria-label="Generation in progress"></progress><p></p><button type="button"></button>';
    const title=box.querySelector('b'),bar=box.querySelector('progress'),note=box.querySelector('p'),cancel=box.querySelector('button');
    (document.querySelector('#journeyStep2')||document.querySelector('#designJourney')).append(box);
    const thai=()=>window.aitsLanguage==='th';
    active={phase:0,render(){
      const seconds=Math.floor((Date.now()-start)/1000),elapsed=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
      title.textContent=thai()?`ขั้นตอนที่ ${this.phase+1}/4 · ${phases[this.phase][1]}`:`Step ${this.phase+1}/4 · ${phases[this.phase][0]}`;
      note.textContent=(thai()?`ใช้เวลา ${elapsed} · `:`Elapsed ${elapsed} · `)+(seconds<60
        ?(thai()?'อาจใช้เวลาสักครู่ โดยเฉพาะเมื่อบริการเพิ่งเริ่มทำงาน':'This can take a few minutes, especially while the service wakes up.')
        :(thai()?'ยังรอผลจากบริการอยู่ หากเกิน 4 นาที ระบบจะหยุดรอและให้ลองใหม่':'Still waiting for the service. After 4 minutes, the wait will end with a retry message.'));
      cancel.textContent=thai()?'หยุดรอ':'Stop waiting';
      bar.setAttribute('aria-label',title.textContent);
    }};active.render();
    cancel.onclick=()=>controller.abort('cancelled');
    const interval=setInterval(()=>active?.render(),1000),timeout=setTimeout(()=>controller.abort('timeout'),240000);
    const stopped=new Promise((_,reject)=>controller.signal.addEventListener('abort',()=>reject(Error(controller.signal.reason==='cancelled'
      ?(thai()?'หยุดรอแล้ว แบบเดิมยังคงอยู่ บริการอาจยังประมวลผลคำขอเดิม':'Stopped waiting. Your layout is unchanged; the service may still finish the original request.')
      :(thai()?'รอนานเกิน 4 นาที แบบเดิมยังคงอยู่ ตรวจสอบบริการแล้วลองใหม่':'The service did not finish within 4 minutes. Your layout is unchanged. Check the service and try again.'))),{once:true}));
    try { await Promise.race([run(controller.signal),stopped]); }
    catch(error){state.lastAnalysisError=error.message;toast(error.message);}
    finally{clearInterval(interval);clearTimeout(timeout);box.remove();active=null;}
  };
})();
