(function(){
 var L=document.createElement('div'); L.className='sala'; L.id='lector'; L.setAttribute('role','dialog'); L.setAttribute('aria-modal','true'); document.body.appendChild(L);
 function cerrar(){ L.classList.remove('abierta'); document.body.style.overflow=''; }
 function abrir(id){
  var a=(window.ARTICULOS||[]).filter(function(x){return x.id===id})[0]; if(!a) return;
  L.innerHTML='<button class="btn-menu cerrar" id="cerrar-lector" type="button">Cerrar</button><article class="lectura" style="padding-top:10px"><p><span class="etiqueta">'+a.tema+'</span> <span class="etiqueta">'+a.minutos+' min</span> '+(a.borrador?'<span class="etiqueta" style="color:#f3d4a8">Borrador sin revisar</span>':'')+'</p><h1>'+a.titulo+'</h1><p class="entradilla">'+a.resumen+'</p>'+a.cuerpo+'</article>';
  L.classList.add('abierta'); L.scrollTop=0; document.body.style.overflow='hidden'; document.getElementById('cerrar-lector').onclick=cerrar;
 }
 document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href^="/articulos/"]'); if(a){ e.preventDefault(); abrir(a.getAttribute('href').split('/')[2]); return; }
  var h=e.target.closest&&e.target.closest('#lector a[href^="/#"]'); if(h){ e.preventDefault(); cerrar(); var t=document.getElementById(h.getAttribute('href').slice(2)); if(t) t.scrollIntoView({behavior:'smooth'}); }
 },true);
 document.addEventListener('keydown',function(e){ if(e.key==='Escape') cerrar(); });
})();

(function(){
 /* capa Cuba: en la web real es la pagina /cuba/; aqui se abre encima porque la prueba es un solo archivo */
 var C=document.createElement('div'); C.className='sala pagina-cuba'; C.id='lector-cuba'; C.setAttribute('role','dialog'); C.setAttribute('aria-modal','true'); document.body.appendChild(C);
 function cerrar(){ C.classList.remove('abierta'); document.body.style.overflow=''; }
 function abrir(){ C.innerHTML='<button class="btn-menu cerrar" id="cerrar-cuba" type="button">Cerrar</button><div class="ancho" id="cuba-dentro" style="padding-top:10px"></div>'; window.CubaApp.render(document.getElementById('cuba-dentro')); C.classList.add('abierta'); C.scrollTop=0; document.body.style.overflow='hidden'; document.getElementById('cerrar-cuba').onclick=cerrar; }
 document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href="/cuba/"]'); if(a){ e.preventDefault(); abrir(); return; }
  var h=e.target.closest&&e.target.closest('#lector-cuba a[href^="#cuba-"]'); if(h){ e.preventDefault(); var t=document.getElementById(h.getAttribute('href').slice(1)); if(t) t.scrollIntoView({behavior:'smooth'}); }
 },true);
 document.addEventListener('keydown',function(e){ if(e.key==='Escape') cerrar(); });
})();
