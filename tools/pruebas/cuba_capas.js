const { chromium } = require(process.env.PLAYWRIGHT||'playwright');
(async()=>{ const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}); let fallos=0; const U=process.env.BASE||'http://localhost:8790';
 for(const [w,h,n] of [[390,840,'m'],[1280,900,'d']]){
  const c=await b.newContext({viewport:{width:w,height:h},serviceWorkers:'block',timezoneId:'America/Havana'}); const p=await c.newPage(); const errs=[];
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  // 1) portada: banner solo con hora de La Habana, interruptor y teaser
  await p.goto(U+'/'); await p.waitForTimeout(500);
  const banner=await p.isVisible('#capa-banner'); const teaserAntes=await p.isVisible('#cuba');
  await p.click('#capa-si'); await p.waitForTimeout(500); const teaserDespues=await p.isVisible('#cuba'); const bannerOculto=!(await p.isVisible('#capa-banner'));
  await p.reload(); const persiste=await p.isVisible('#cuba'); const sinBanner=!(await p.isVisible('#capa-banner'));
  await p.click('#abrir-menu'); await p.waitForTimeout(600); const menuCuba=await p.isVisible('#menu-cuba'); const estado=await p.textContent('#capa-toggle');
  await p.click('#capa-toggle'); const estado2=await p.textContent('#capa-toggle'); await p.keyboard.press('Escape');
  await p.evaluate(()=>{ document.querySelectorAll('.aparece').forEach(e=>e.classList.add('visto')); });
  // 2) I Ching en portada
  await p.fill('#ic-pregunta','¿Qué necesito ver?'); await p.click('#ic-lanzar'); await p.waitForTimeout(200);
  const ic=await p.textContent('#ic-resultado'); const lineas=await p.locator('.hx-l').count();
  // 3) lecturas siguen funcionando
  await p.fill('#lec-fecha','1990-07-29'); await p.click('#lec-form button[type=submit]'); await p.waitForTimeout(400); const tarjetas=await p.locator('.lec-card').count(); const arbol=/Árboles celtas/.test(await p.textContent('#lec-cuerpo'));
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  // 4) pagina Cuba
  await p.goto(U+'/cuba/'); await p.waitForTimeout(500);
  const orishas=await p.locator('#cuba-lista .cuba-card').count(); await p.fill('#cuba-q','regla'); const filtrados=await p.locator('#cuba-lista .cuba-card').count(); const quien=await p.textContent('#cuba-lista .cuba-card h3'); await p.fill('#cuba-q','');
  const tabla=await p.locator('#cuba-tabla tr').count(); const meji=await p.locator('#cuba-meji .cuba-card').count(); const mp=await p.locator('#cuba-mpungos .cuba-card').count(); const fuentes=await p.locator('#cuba-flist li a').count();
  const httpsOk=await p.evaluate(()=>Array.from(document.querySelectorAll('#cuba-flist a')).every(a=>a.href.startsWith('https://')&&a.rel.includes('noopener')));
  await p.click('#cuba-letras [data-n="9"]'); const l9=await p.textContent('#cuba-letra'); await p.click('#cuba-letras [data-n="14"]'); const l14=await p.textContent('#cuba-letra');
  await p.click('#cuba-tirar'); await p.waitForTimeout(100); const conchas=await p.locator('#cuba-conchas i').count(); const resTxt=(await p.textContent('#cuba-res')).trim().slice(0,60);
  const ov2=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth); const ovTabla=await p.evaluate(()=>{const t=document.querySelector('.tabla-scroll'); return t.scrollWidth>t.clientWidth? 'scroll-interno':'cabe'});
  const sup=await p.locator('#cuba-lista sup a').count();
  await p.screenshot({path:`${require('os').tmpdir()}/${n}-cuba.png`}); await p.evaluate(()=>document.getElementById('cuba-diloggun').scrollIntoView()); await p.screenshot({path:`${require('os').tmpdir()}/${n}-cuba-dil.png`});
  console.log(n,{banner,teaserAntes,teaserDespues,bannerOculto,persiste,sinBanner,menuCuba,estado,estado2,icOk:/Hexagrama|hexagrama|situación/.test(ic),lineas,tarjetas,arbol,desbordePortada:ov,orishas,filtrados,quien,tabla,meji,mp,fuentes,httpsOk,l9ok:/Su mejor amigo/.test(l9),l14solo:/exclusivo/.test(l14),conchas,resTxt,desbordeCuba:ov2,ovTabla,refs:sup>0,errores:errs});
  fallos+=errs.length+(!banner?1:0)+(teaserAntes?1:0)+(!teaserDespues||!persiste||!sinBanner?1:0)+(!menuCuba?1:0)+(ov||ov2?1:0)+(orishas!==20?1:0)+(filtrados!==1?1:0)+(meji!==16||mp!==12||fuentes!==20?1:0)+(!httpsOk?1:0)+(!/Su mejor amigo/.test(l9)||!/exclusivo/.test(l14)?1:0)+(conchas!==16?1:0)+(tarjetas<7||!arbol?1:0)+(lineas<6?1:0);
  await c.close(); }
 // sin Habana: no hay banner
 const c2=await b.newContext({viewport:{width:390,height:840},serviceWorkers:'block',timezoneId:'Europe/Madrid'}); const p2=await c2.newPage(); await p2.goto(U+'/'); await p2.waitForTimeout(400); const bn=await p2.isVisible('#capa-banner'); const tz=await p2.isVisible('#cuba'); console.log('Madrid: banner',bn,'teaser',tz); if(bn||tz) fallos++;
 // offline con SW
 const c=await b.newContext({viewport:{width:390,height:840},timezoneId:'America/Havana'}); const p=await c.newPage(); await p.goto(U+'/'); await p.evaluate(()=>navigator.serviceWorker.ready); await p.waitForTimeout(2000);
 await p.goto(U+'/cuba/'); await p.waitForTimeout(600); await c.setOffline(true); await p.goto(U+'/cuba/'); await p.waitForTimeout(400); const off=await p.locator('#cuba-lista .cuba-card').count(); await p.goto(U+'/'); const offH=await p.textContent('h1');
 console.log('offline',{cuba:off,home:offH}); if(off!==20||!/Ánima/.test(offH)) fallos++;
 await b.close(); process.exit(fallos?1:0); })();
