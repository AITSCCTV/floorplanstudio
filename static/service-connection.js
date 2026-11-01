(() => {
  const hostedPage = location.hostname.endsWith('.github.io') || location.hostname.endsWith('.onrender.com');
  let backend = hostedPage ? sessionStorage.getItem('aitsBackendUrl') || 'https://aits-floorplan-api.onrender.com' : '';
  let password = '';
  let connectionState = 'disconnected';
  let updateLoginLabel = () => {};
  const setConnectionState = state => { connectionState = state; updateLoginLabel(); };
  const th = () => window.aitsLanguage === 'th' || document.documentElement.lang === 'th';
  const missing = () => th() ? 'กรุณาเชื่อมต่อบริการสร้างผังก่อน โดยใช้ปุ่มเข้าสู่ระบบเพื่อใช้งานด้านบน' : 'Connect the design service using the Login to use button above.';
  window.aitsFetch = (path, options = {}) => {
    if (hostedPage && connectionState !== 'connected') return Promise.reject(Error(missing()));
    const headers = new Headers(options.headers);
    if (password) headers.set('Authorization', 'Bearer ' + password);
    return fetch(backend + path, {...options, headers}).then(response => {
      if (response.status === 401) { password = ''; setConnectionState('disconnected'); }
      return response;
    });
  };
  document.addEventListener('DOMContentLoaded', () => {
    if (!hostedPage) return;
    const button = document.createElement('button');
    const workspace = document.querySelector('.shell');
    let loginDialog;
    button.className = 'btn btn-outline'; button.type = 'button';
    const label = () => {
      const labels = {disconnected: ['Login to use', 'เข้าสู่ระบบเพื่อใช้งาน'], connecting: ['Logging in…', 'กำลังเข้าสู่ระบบ…'], connected: ['Logged in', 'เข้าสู่ระบบแล้ว']};
      button.textContent = labels[connectionState][th() ? 1 : 0];
      button.disabled = connectionState === 'connecting';
      button.dataset.connectionState = connectionState;
      button.title = connectionState === 'connected' ? (th() ? 'จัดการการเชื่อมต่อ' : 'Manage connection') : '';
      document.documentElement.classList.toggle('login-required', connectionState !== 'connected');
      workspace.inert = connectionState !== 'connected';
      if (connectionState === 'disconnected' && !loginDialog?.open) button.onclick?.();
    };
    button.setAttribute('aria-live', 'polite');
    updateLoginLabel = label;
    document.querySelector('.top-actions').prepend(button);
    new MutationObserver(label).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    button.onclick = () => {
      if (loginDialog?.open) return;
      const thai = th();
      const dialog = document.createElement('dialog');
      loginDialog = dialog;
      dialog.className = 'login-gate';
      dialog.style.cssText='width:min(480px,calc(100vw - 32px));box-sizing:border-box;border:1px solid #d7e2ed;border-radius:12px;padding:24px;color:#203b50';
      dialog.innerHTML = `<form method="dialog"><h2>${thai?'เข้าสู่ระบบเพื่อใช้งาน':'Login to use'}</h2><p>${thai?'ใช้ URL บริการที่ติดตั้งแล้วและรหัสผ่านทีม ไม่ใช่ OpenAI API key':'Enter your deployed service URL and team password. Do not enter an OpenAI API key here.'}</p><label>${thai?'URL ของบริการ':'Service URL'}<input name="url" type="url" required placeholder="https://your-service.onrender.com" style="box-sizing:border-box;width:100%;padding:12px;margin:8px 0 18px"></label><label>${thai?'รหัสผ่านทีม':'Team password'}<input name="password" type="password" required autocomplete="off" style="box-sizing:border-box;width:100%;padding:12px;margin:8px 0 18px"></label><p role="status"></p><button type="button" name="cancel" class="btn btn-outline">${thai?'ยกเลิก':'Cancel'}</button> <button type="submit" class="btn btn-primary">${thai?'เชื่อมต่อ':'Connect'}</button></form>`;
      document.body.append(dialog);
      const form=dialog.querySelector('form');form.elements.url.value=backend;
      form.elements.cancel.remove();
      form.querySelector('h2').textContent=thai?'เข้าสู่ระบบ Floorplan Studio':'Log in to Floorplan Studio';
      dialog.addEventListener('cancel',event=>event.preventDefault());
      form.onsubmit=async event=>{
        event.preventDefault();if(connectionState==='connecting') return;const submit=form.querySelector('[type=submit]'),status=form.querySelector('[role=status]');
        try {
          const url=new URL(form.elements.url.value.trim());
          if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/') throw Error(thai?'ใช้ HTTPS URL หลักของบริการ':'Use the HTTPS root URL of your service.');
          const secret=form.elements.password.value;
          if(secret.startsWith('sk-')) throw Error(thai?'ช่องนี้ใช้รหัสผ่านทีม ไม่ใช่ OpenAI API key':'Use the team password here, not an OpenAI API key.');
          submit.disabled=true;setConnectionState('connecting');submit.textContent=thai?'กำลังเข้าสู่ระบบ…':'Logging in…';status.textContent=submit.textContent;
          const response=await fetch(url.origin+'/api/connection',{headers:{Authorization:'Bearer '+secret},signal:AbortSignal.timeout(90000)});
          const info=await window.aitsReadJson(response);
          if(!info.aiReady) throw Error(thai?'บริการยังไม่ได้ตั้งค่า API key หรือการอนุมัติ':'The service still needs its API key or data approval setting.');
          backend=url.origin;password=secret;sessionStorage.setItem('aitsBackendUrl',backend);setConnectionState('connected');dialog.close();refreshStatus();
        } catch(error){setConnectionState('disconnected');status.textContent=error.name==='TimeoutError' ? (thai?'เข้าสู่ระบบนานเกินไป กรุณาลองอีกครั้ง':'Login timed out. Please try again.') : error.message;} finally{submit.disabled=false;submit.textContent=thai?'เชื่อมต่อ':'Connect';}
      };
      dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
    };
    label();
  });
})();
