(() => {
  const hostedPage = location.hostname.endsWith('.github.io');
  let backend = hostedPage ? sessionStorage.getItem('aitsBackendUrl') || '' : '';
  let password = '';
  const th = () => window.aitsLanguage === 'th' || document.documentElement.lang === 'th';
  const missing = () => th() ? 'กรุณาเชื่อมต่อบริการสร้างผังก่อน โดยใช้ปุ่มเข้าสู่ระบบเพื่อใช้งานด้านบน' : 'Connect the design service using the Login to use button above.';
  window.aitsFetch = (path, options = {}) => {
    if (hostedPage && !backend) return Promise.reject(Error(missing()));
    const headers = new Headers(options.headers);
    if (password) headers.set('Authorization', 'Bearer ' + password);
    return fetch(backend + path, {...options, headers});
  };
  document.addEventListener('DOMContentLoaded', () => {
    if (!hostedPage) return;
    const button = document.createElement('button');
    button.className = 'btn btn-outline'; button.type = 'button';
    const label = () => button.textContent = th() ? 'เข้าสู่ระบบเพื่อใช้งาน' : 'Login to use';
    label();
    document.querySelector('.top-actions').prepend(button);
    new MutationObserver(label).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    button.onclick = () => {
      const thai = th();
      const dialog = document.createElement('dialog');
      dialog.style.cssText='width:min(480px,calc(100vw - 32px));box-sizing:border-box;border:1px solid #d7e2ed;border-radius:12px;padding:24px;color:#203b50';
      dialog.innerHTML = `<form method="dialog"><h2>${thai?'เข้าสู่ระบบเพื่อใช้งาน':'Login to use'}</h2><p>${thai?'ใช้ URL บริการที่ติดตั้งแล้วและรหัสผ่านทีม ไม่ใช่ OpenAI API key':'Enter your deployed service URL and team password. Do not enter an OpenAI API key here.'}</p><label>${thai?'URL ของบริการ':'Service URL'}<input name="url" type="url" required placeholder="https://your-service.onrender.com" style="box-sizing:border-box;width:100%;padding:12px;margin:8px 0 18px"></label><label>${thai?'รหัสผ่านทีม':'Team password'}<input name="password" type="password" required autocomplete="off" style="box-sizing:border-box;width:100%;padding:12px;margin:8px 0 18px"></label><p role="status"></p><button type="button" name="cancel" class="btn btn-outline">${thai?'ยกเลิก':'Cancel'}</button> <button type="submit" class="btn btn-primary">${thai?'เชื่อมต่อ':'Connect'}</button></form>`;
      document.body.append(dialog);
      const form=dialog.querySelector('form');form.elements.url.value=backend;
      form.elements.cancel.onclick=()=>dialog.close();
      form.onsubmit=async event=>{
        event.preventDefault();const submit=form.querySelector('[type=submit]'),status=form.querySelector('[role=status]');
        try {
          const url=new URL(form.elements.url.value.trim());
          if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/') throw Error(thai?'ใช้ HTTPS URL หลักของบริการ':'Use the HTTPS root URL of your service.');
          const secret=form.elements.password.value;
          if(secret.startsWith('sk-')) throw Error(thai?'ช่องนี้ใช้รหัสผ่านทีม ไม่ใช่ OpenAI API key':'Use the team password here, not an OpenAI API key.');
          submit.disabled=true;status.textContent=thai?'กำลังเชื่อมต่อ…':'Connecting…';
          const response=await fetch(url.origin+'/api/connection',{headers:{Authorization:'Bearer '+secret}});
          const info=await window.aitsReadJson(response);
          if(!info.aiReady) throw Error(thai?'บริการยังไม่ได้ตั้งค่า API key หรือการอนุมัติ':'The service still needs its API key or data approval setting.');
          backend=url.origin;password=secret;sessionStorage.setItem('aitsBackendUrl',backend);label();dialog.close();refreshStatus();
        } catch(error){status.textContent=error.message;} finally{submit.disabled=false;}
      };
      dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
    };
  });
})();
