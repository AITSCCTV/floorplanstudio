/* Local previews for static hosting. No plan files leave the browser here. */
(() => {
  const assetBase = new URL('.', document.currentScript.src);
  const serviceMessage = () => window.aitsLanguage === 'th'
    ? 'เว็บไซต์นี้ยังไม่ได้เชื่อมต่อบริการสร้างผัง เปิดไฟล์และแก้ไขแบบได้ แต่การสร้างผังต้องใช้บริการที่เชื่อมต่อแล้ว'
    : 'This website is not connected to the design service. You can open and edit plans, but generation needs a connected backend.';
  window.aitsReadJson = async response => {
    if (!response.headers.get('content-type')?.includes('application/json')) throw Error(serviceMessage());
    const result = await response.json();
    if (!response.ok) throw Error(typeof result.detail === 'string' ? result.detail : 'The request could not be completed.');
    return result;
  };
  const validateSize = (width, height) => {
    if (!(width > 0 && height > 0) || Math.max(width / height, height / width) > 6) {
      throw Error('Unsupported drawing proportions. Use a width/depth ratio between 1:6 and 6:1.');
    }
  };
  let pdfLibrary, dxfLibrary;
  async function dxfParser() {
    if (!dxfLibrary) dxfLibrary = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('vendor/dxf-parser.js', assetBase).href;
      script.onload = () => resolve(window.DxfParser);
      script.onerror = () => { dxfLibrary = null; reject(Error('Could not load the DXF reader. Refresh and try again.')); };
      document.head.append(script);
    });
    return dxfLibrary;
  }
  window.aitsBrowserPreview = async (file, pageIndex = 0) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const result = {name:file.name, width:1000, page:1, pageCount:1};
    const canvas = document.createElement('canvas');
    if (ext === 'pdf') {
      pdfLibrary ||= import(new URL('vendor/pdf.mjs', assetBase).href);
      const pdfjs = await pdfLibrary;
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('vendor/pdf.worker.mjs', assetBase).href;
      const task = pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()), isEvalSupported:false});
      try {
        const doc = await task.promise;
        if (doc.numPages > 20) throw Error('This PDF has more than 20 pages. Split it into smaller files first.');
        if (pageIndex < 0 || pageIndex >= doc.numPages) throw Error('The selected PDF page does not exist.');
        const page = await doc.getPage(pageIndex + 1);
        const original = page.getViewport({scale:1});
        validateSize(original.width, original.height);
        const viewport = page.getViewport({scale:Math.min(2,1600/Math.max(original.width,original.height))});
        canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
        return {...result,kind:'pdf',page:pageIndex+1,pageCount:doc.numPages,height:original.height/original.width*1000,image:canvas.toDataURL('image/png')};
      } finally { await task.destroy(); }
    }
    if (['png','jpg','jpeg'].includes(ext)) {
      const image = new Image(), url = URL.createObjectURL(file);
      try {
        await new Promise((resolve,reject) => { image.onload=resolve;image.onerror=()=>reject(Error('Could not read the plan image.'));image.src=url; });
        validateSize(image.naturalWidth,image.naturalHeight);
        if (image.naturalWidth*image.naturalHeight>80_000_000) throw Error('This image is too large. Resize it before uploading.');
        const scale = Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
        canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
        canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
        return {...result,kind:'image',height:image.naturalHeight/image.naturalWidth*1000,image:canvas.toDataURL('image/png')};
      } finally { URL.revokeObjectURL(url); }
    }
    if (ext === 'dxf') {
      const Parser = await dxfParser();
      const doc = new Parser().parseSync(await file.text());
      if ((doc.entities?.length || 0)>50_000) throw Error('This DXF has more than 50,000 entities. Export a simpler drawing or PDF.');
      const raw = [], bounds = [];
      const point = p => p && Number.isFinite(p.x) && Number.isFinite(p.y);
      for (const entity of doc.entities || []) {
        if (entity.inPaperSpace) continue;
        if (['LINE','LWPOLYLINE','POLYLINE'].includes(entity.type)) {
          const vertices=(entity.vertices||[]).filter(point);
          if(vertices.length<2) continue;
          raw.push({kind:entity.type==='LINE'?'line':'polyline',points:vertices,closed:!!entity.shape});bounds.push(...vertices);
        } else if (entity.type==='CIRCLE' && point(entity.center) && entity.radius>0) {
          raw.push({kind:'circle',center:entity.center,radius:entity.radius});
          bounds.push({x:entity.center.x-entity.radius,y:entity.center.y-entity.radius},{x:entity.center.x+entity.radius,y:entity.center.y+entity.radius});
        } else if (['TEXT','MTEXT'].includes(entity.type) && point(entity.startPoint||entity.position)) {
          const at=entity.startPoint||entity.position;bounds.push(at);raw.push({kind:'text',at,text:String(entity.text||'').slice(0,80)});
        }
      }
      if (!raw.length) throw Error('No supported DXF geometry found. Export the drawing as PDF.');
      let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
      for (const p of bounds) {minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y);}
      const width=maxX-minX,height=maxY-minY;validateSize(width,height);
      const scale=1000/(width*1.07),toPoint=p=>[(p.x-minX+width*.035)*scale,(maxY+height*.035-p.y)*scale];
      const entities=raw.map(e=>e.kind==='circle'?{...e,center:toPoint(e.center),radius:e.radius*scale}:e.kind==='text'?{...e,at:toPoint(e.at)}:{...e,points:e.points.map(toPoint)});
      return {...result,kind:'dxf',height:height/width*1000,entities,note:'DXF modelspace loaded. Advanced CAD objects may be omitted; use PDF for full drawing fidelity.'};
    }
    throw Error('Choose a PDF, PNG, JPEG or DXF file.');
  };
})();
