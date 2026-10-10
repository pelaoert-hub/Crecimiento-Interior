const { chromium } = require(process.env.PLAYWRIGHT||'playwright');
(async()=>{ const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}); let fallos=0; const U=process.env.BASE||'http://localhost:8790';
 for(const [w,h,n] of [[390,840,'m'],[1280,900,'d']]){
  const c=await b.newContext({viewport:{width:w,height:h},serviceWorkers:'block'}); const p=await c.newPage(); const errs=[]; let dialogo=false;
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text())); p.on('dialog',d=>{dialogo=true;d.dismiss()});
  await p.goto(U+'/'); await p.waitForTimeout(400);
  await p.fill('#lec-nombre','<img src=x onerror=alert(1)> Ana María'); await p.fill('#lec-fecha','1990-07-29'); await p.selectOption('#lec-tz','America/Havana');
  await p.click('#lec-form summary'); await p.selectOption('#lec-corazon','curva');
  await p.click('#lec-form button[type=submit]'); await p.waitForTimeout(500);
  const vis=await p.isVisible('#lec-resultado'); const resumen=await p.textContent('#lec-resumen');
  const cards0=await p.locator('.lec-card').count(); const tiene=await p.textContent('#lec-cuerpo');
  const tabs={}; for(const t of ['hoy','mes','ano']){ await p.click(`[data-t="${t}"]`); tabs[t]=await p.locator('.lec-card').count(); }
  await p.click('[data-t="nacimiento"]');
  const imgInyectada=await p.evaluate(()=>!!document.querySelector('#lec-resumen img, #lec-cuerpo img'));
  const aviso=/no es una predicci[oó]n/i.test(await p.textContent('.lec-aviso')); const barnum=/efecto Barnum/.test(tiene);
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await p.screenshot({path:`${require('os').tmpdir()}/${n}-lec-form.png`}); 
  await p.evaluate(()=>document.querySelectorAll('.aparece').forEach(e=>e.classList.add('visto'))); await p.locator('#lec-resultado').screenshot({path:`${require('os').tmpdir()}/${n}-lec-res.png`});
  // sin fecha
  await p.reload(); await p.click('#lec-form button[type=submit]'); const err=await p.textContent('#lec-error');
  // recordar y borrar
  await p.fill('#lec-fecha','1985-03-14'); await p.check('#lec-recordar'); await p.click('#lec-form button[type=submit]'); await p.reload(); const recordado=await p.inputValue('#lec-fecha');
  await p.click('#lec-borrar'); const tras=await p.inputValue('#lec-fecha'); const guardado=await p.evaluate(()=>localStorage.getItem('ci_lectura'));
  console.log(n,{vis,resumen:resumen.trim().slice(0,90),cards0,tabs,imgInyectada,dialogo,aviso,barnum,desborde:ov,errFecha:err,recordado,tras,guardado,errores:errs});
  fallos+=errs.length+(ov?1:0)+(!vis?1:0)+(imgInyectada||dialogo?1:0)+(!aviso||!barnum?1:0)+(recordado!=='1985-03-14'?1:0)+(tras!==''||guardado?1:0)+(cards0<6?1:0)+(tabs.hoy<4?1:0);
  await c.close(); }
 await b.close(); process.exit(fallos?1:0); })();
