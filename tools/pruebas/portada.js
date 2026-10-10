const { chromium } = require(process.env.PLAYWRIGHT||'playwright');
(async()=>{
 const b = await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}); let fallos=0; const U=process.env.BASE||'http://localhost:8790';
 for (const [w,h,n] of [[390,840,'m'],[1280,900,'d']]) {
  const c = await b.newContext({viewport:{width:w,height:h},serviceWorkers:'block'}); const p = await c.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto(U+'/'); await p.waitForTimeout(500);
  await p.screenshot({path:`${require('os').tmpdir()}/${n}-hero.png`});
  const luna = await p.textContent('#luna-nombre'); const carta = await p.textContent('#carta h4');
  const c1 = await p.textContent('#carta h4'); await p.click('#otra-carta'); const c2 = await p.textContent('#carta h4');
  await p.fill('#intencion','ser paciente');
  await p.click('#abrir-menu'); await p.waitForTimeout(600); const menuVis = await p.isVisible('#menu a[href="#hoy"]'); await p.keyboard.press('Escape');
  await p.fill('#nuevo-habito','Silencio'); await p.press('#nuevo-habito','Enter'); await p.click('[data-m="0"]');
  const racha = await p.textContent('#lista-habitos');
  await p.click('.prac[data-abrir="gratitud"]'); await p.fill('#gr1','la familia'); await p.click('#gr-guardar'); await p.click('#cerrar-sala');
  await p.click('.prac[data-abrir="soltar"]'); await p.fill('#suelta-txt','un rencor'); await p.click('#suelta-btn'); await p.waitForTimeout(400);
  const vuela = await p.isVisible('.vuela'); const vacio = await p.inputValue('#suelta-txt');
  await p.screenshot({path:`${require('os').tmpdir()}/${n}-soltar.png`}); await p.waitForTimeout(5200);
  const fin = await p.textContent('#suelta-ok'); await p.click('#cerrar-sala');
  await p.click('.prac[data-abrir="resp"]'); await p.click('#resp-inicio'); await p.waitForTimeout(700); const lt=await p.textContent('#loto-texto'); await p.screenshot({path:`${require('os').tmpdir()}/${n}-resp.png`}); await p.click('#resp-inicio'); await p.click('#cerrar-sala');
  await p.click('.prac[data-abrir="silencio"]'); await p.selectOption('#med-min','3'); const reloj = await p.textContent('#med-reloj'); await p.click('#cerrar-sala');
  await p.evaluate(()=>document.querySelectorAll('.aparece').forEach(e=>e.classList.add('visto')));
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const diario = await p.textContent('#lista-diario'); const dom = await p.evaluate(()=>document.querySelectorAll('#lista-articulos a').length);
  await p.screenshot({path:`${require('os').tmpdir()}/${n}-full.png`,fullPage:true});
  await p.goto(U+'/articulos/el-silencio/'); await p.waitForTimeout(300); const ov2=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth); const h1=await p.textContent('h1');
  await p.screenshot({path:`${require('os').tmpdir()}/${n}-art.png`});
  console.log(n,{luna,cartaCambia:c1!==c2,menuVis,racha:racha.includes('1 días'),vuela,vacio,fin:fin.trim().slice(0,20),lt,reloj,desborde:ov,desbordeArt:ov2,art:dom,diario:diario.includes('Gratitud'),h1,errores:errs});
  fallos += errs.length+(ov?1:0)+(ov2?1:0)+(c1===c2?1:0)+(!vuela||vacio!==''?1:0)+(!menuVis?1:0)+(dom!==9?1:0); await c.close();
 }
 const c = await b.newContext({viewport:{width:390,height:840}}); const p = await c.newPage();
 await p.goto(U+'/'); await p.evaluate(()=>navigator.serviceWorker.ready); await p.waitForTimeout(1500);
 await p.goto(U+'/articulos/el-perdon/'); await p.waitForTimeout(500); await c.setOffline(true);
 await p.goto(U+'/'); const offH = await p.textContent('h1'); await p.goto(U+'/articulos/el-perdon/'); const offA = await p.textContent('h1');
 const fuente = await p.evaluate(()=>document.fonts.check("16px Marcellus"));
 console.log('offline',{offH,offA,fuente}); if(!/Ánima/.test(offH)||!/Perdonar/.test(offA)) fallos++;
 await b.close(); process.exit(fallos?1:0);
})();
