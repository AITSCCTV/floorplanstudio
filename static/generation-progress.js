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
    document.querySelectorAll('.generation-progress').forEach(node=>node.remove());
    const controller=new AbortController(),start=Date.now(),limitMs=150000;
    const timeoutMessage=()=>window.aitsLanguage==='th'?'คำขอใช้เวลาเกิน 150 วินาที จึงหยุดรอ แบบเดิมยังคงอยู่ ลองสร้างใหม่หลังจากบริการพร้อม':'Generation exceeded 150 seconds and stopped waiting. Your layout is unchanged. Try again when the service is ready.';
    const box=document.createElement('section');box.className='generation-progress';box.setAttribute('data-user-content','');
    box.innerHTML='<b role="status" aria-live="polite"></b><progress aria-label="Generation in progress"></progress><p></p><button type="button"></button>';
    const title=box.querySelector('b'),bar=box.querySelector('progress'),note=box.querySelector('p'),cancel=box.querySelector('button');
    (document.querySelector('#journeyStep2')||document.querySelector('#designJourney')).append(box);
    const thai=()=>window.aitsLanguage==='th';
    active={phase:0,render(){
      const seconds=Math.floor((Date.now()-start)/1000),remaining=Math.max(0,150-seconds),elapsed=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
      title.textContent=thai()?`ขั้นตอนที่ ${this.phase+1}/4 · ${phases[this.phase][1]}`:`Step ${this.phase+1}/4 · ${phases[this.phase][0]}`;
      note.textContent=(thai()?`ใช้เวลา ${elapsed} · เหลือเวลารอสูงสุด ${remaining} วินาที · `:`Elapsed ${elapsed} · Maximum wait remaining: ${remaining}s · `)+(seconds<60
        ?(thai()?'อาจใช้เวลาสักครู่ โดยเฉพาะเมื่อบริการเพิ่งเริ่มทำงาน':'This can take a few minutes, especially while the service wakes up.')
        :(thai()?'ยังรอผลจากบริการอยู่ เมื่อครบ 150 วินาที ระบบจะหยุดรอและให้ลองใหม่':'Still waiting for the service. Waiting ends automatically at 150 seconds.'));
      cancel.textContent=thai()?'หยุดรอ':'Stop waiting';
      bar.setAttribute('aria-label',title.textContent);
    }};active.render();
    cancel.onclick=()=>controller.abort('cancelled');
    const checkDeadline=()=>{if(Date.now()-start>=limitMs)controller.abort('timeout');else active?.render();};
    const interval=setInterval(checkDeadline,1000),timeout=setTimeout(()=>controller.abort('timeout'),limitMs);
    document.addEventListener('visibilitychange',checkDeadline);
    const stopped=new Promise((_,reject)=>controller.signal.addEventListener('abort',()=>reject(Error(controller.signal.reason==='cancelled'
      ?(thai()?'หยุดรอแล้ว แบบเดิมยังคงอยู่ บริการอาจยังประมวลผลคำขอเดิม':'Stopped waiting. Your layout is unchanged; the service may still finish the original request.')
      :timeoutMessage())),{once:true}));
    try { await Promise.race([run(controller.signal),stopped]); }
    catch(error){state.lastAnalysisError=error.message;toast(error.message);}
    finally{
      clearInterval(interval);clearTimeout(timeout);document.removeEventListener('visibilitychange',checkDeadline);
      if(state.lastAnalysisError){
        title.textContent=thai()?'สร้างผังไม่สำเร็จ':'Layout not generated';bar.hidden=true;note.textContent=state.lastAnalysisError;
        box.setAttribute('role','alert');box.style.borderColor='#c88d75';cancel.textContent=thai()?'ปิดข้อความ':'Dismiss';cancel.onclick=()=>box.remove();
      }else box.remove();
      active=null;
    }
  };
})();
