/* lecturas: interfaz (formulario + resultados). El motor esta en lecturas.js; aqui solo se pinta. */
(function(){
'use strict';
var $ = function(id){ return document.getElementById(id); };
if(!$('lec-form') || !window.Lecturas) return;
var L = window.Lecturas, T = L.TEXTOS_UI;

function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
var mem = {};
function leer(k){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch(e){ return mem[k] || null; } }
function guardar(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){ mem[k] = v; } }
function borrar(k){ try { localStorage.removeItem(k); } catch(e){ delete mem[k]; } }

var ZONAS = [['America/Havana','Cuba (La Habana)'],['America/New_York','Miami / Nueva York'],['America/Chicago','Chicago / Texas'],['America/Los_Angeles','Los Ángeles'],['America/Mexico_City','México (centro)'],['America/Bogota','Colombia / Perú / Ecuador'],['America/Caracas','Venezuela'],['America/Santiago','Chile'],['America/Argentina/Buenos_Aires','Argentina'],['Europe/Madrid','España (península)'],['Europe/London','Reino Unido'],['UTC','Hora universal (UTC)']];
$('lec-tz').innerHTML = ZONAS.map(function(z){ return '<option value="'+z[0]+'">'+esc(z[1])+'</option>'; }).join('');
var hoyISO = new Date().toISOString().slice(0,10); $('lec-fecha').max = hoyISO; $('lec-fecha').min = '1900-01-01';

/* ---- tradiciones elegidas y marcas (en memoria; al disco solo con "Recordar mis datos") ---- */
var TODAS = L.TRADICIONES.map(function(t){ return t.clave; });
var tg = leer('ci_lectura_trads'), mg = leer('ci_resonancias');
var TRADS = Array.isArray(tg) ? tg.filter(function(k){ return TODAS.indexOf(k) >= 0; }) : TODAS.slice();
var MARCAS = {};
if(mg && typeof mg === 'object') Object.keys(mg).forEach(function(k){ if(mg[k] === 'si' || mg[k] === 'no') MARCAS[k] = mg[k]; });
function recordar(){ return $('lec-recordar').checked; }
function guardarElecciones(){ if(recordar()){ guardar('ci_lectura_trads', TRADS); guardar('ci_resonancias', MARCAS); } }

function palmaRellena(){ return ['corazon','cabeza','vida'].some(function(l){ return $('lec-'+l).value; }); }
function pintarTradiciones(){
  $('lec-trads-nota').textContent = T.tradiciones_nota;
  $('lec-trads-iching').textContent = T.iching_aparte;
  $('lec-trads-lista').innerHTML = L.TRADICIONES.map(function(t){
    return '<div class="lec-trad" data-trad="'+t.clave+'"'+(t.soloConPalma && !palmaRellena() ? ' hidden' : '')+'>'+
      '<label><input type="checkbox" value="'+t.clave+'"'+(TRADS.indexOf(t.clave) >= 0 ? ' checked' : '')+'> '+esc(t.nombre)+'</label>'+
      '<details><summary>'+esc(T.de_donde)+'<span class="lec-sr">: '+esc(t.nombre)+'</span></summary><p>'+esc(L.ORIGENES[t.clave])+'</p></details></div>';
  }).join('');
}
function verQuiromancia(){ var q = document.querySelector('.lec-trad[data-trad="quiromancia"]'); if(q) q.hidden = !palmaRellena(); }

/* datos recordados (solo si la persona lo eligio) */
var rec = leer('ci_lectura');
if(rec){
  $('lec-nombre').value = rec.nombre || ''; $('lec-fecha').value = rec.fecha || ''; $('lec-hora').value = rec.hora || '';
  if(rec.tz) $('lec-tz').value = rec.tz; ['corazon','cabeza','vida'].forEach(function(l){ if(rec.palma && rec.palma[l]) $('lec-'+l).value = rec.palma[l]; });
  $('lec-recordar').checked = true;
}
if(tg || mg) $('lec-recordar').checked = true;
pintarTradiciones();
$('lec-repite-titulo').textContent = L.NOMBRE_SECCION;

var ULTIMA = null, PESTANA = 'nacimiento', ORDEN = ['nacimiento','hoy','mes','ano'];

function marcaHTML(c, i, nombre){
  var m = MARCAS[i.id] || '', op = [['si', T.marca_si], ['no', T.marca_no], ['', T.marca_nose]];
  return '<fieldset class="lec-marca"><legend>'+esc(T.marca_pregunta)+'<span class="lec-sr"> '+esc(c.trad)+': '+esc(i.k)+'</span></legend>'+
    op.map(function(o){ return '<label><input type="radio" name="'+nombre+'" value="'+o[0]+'" data-id="'+esc(i.id)+'"'+(m === o[0] ? ' checked' : '')+'> '+esc(o[1])+'</label>'; }).join('')+'</fieldset>';
}
function tarjetaHTML(c, ci){
  return '<article class="vidrio lec-card"><header><span class="lec-simb" aria-hidden="true">'+esc(c.simbolo)+'</span><div><h4>'+esc(c.trad)+'</h4><small>Mirada tradicional, no predicción</small></div></header>'+
    c.items.map(function(i, ii){
      var extra = '';
      if(i.id && i.incierto) extra = '<p class="lec-incierto">'+esc(i.cuerpo === 'sol' ? T.sol_incierto : T.luna_incierta)+'</p>';
      else if(i.id && i.tags && i.tags.length) extra = marcaHTML(c, i, 'lm-'+ci+'-'+ii);
      return '<div class="lec-item"><b>'+esc(i.k)+'</b><p>'+esc(i.d)+'</p>'+extra+'</div>';
    }).join('')+
    (c.pregunta ? '<p class="lec-q">Para pensar: '+esc(c.pregunta)+'</p>' : '')+
    (c.nota ? '<p class="lec-nota">'+esc(c.nota)+'</p>' : '')+'</article>';
}
function elegidas(){ return ULTIMA ? L.elegir(ULTIMA[PESTANA], TRADS) : []; }

/* solo reescribe un bloque si cambio: asi la region aria-live anuncia unicamente lo nuevo */
function poner(id, html){ var e = $(id); if(e.innerHTML !== html) e.innerHTML = html; }
function actualizarRepite(){
  var t = elegidas(), r = L.resumen(t, MARCAS), base = PESTANA === 'nacimiento';
  var a = '<h4>'+esc(T.repite_titulo)+'</h4>';
  if(r.max < 2) a += '<p class="nota">'+esc(T.una_familia)+'</p>';
  else if(!r.repetidos.length) a += '<p class="nota">'+esc(T.nada_repetido)+'</p>';
  else a += '<ul>'+r.repetidos.map(function(x){
    return '<li><b>'+esc(x.tema)+'</b> <span class="lec-desc">('+esc(L.DESCRIPCION_TEMAS[x.tema].replace(/\.$/, '').toLowerCase())+')</span> · '+esc(L.rellenar(T.aparece_en, {n: x.n, max: r.max}))+' <span class="lec-fams">('+x.etiquetas.map(esc).join(', ')+')</span></li>';
  }).join('')+'</ul>';
  if(r.familiasPresentes.indexOf('aritmetica') >= 0) a += '<p class="nota">'+esc(L.AVISOS_AZAR[2])+'</p>';
  var b = '<h4>'+esc(T.marcado_titulo)+'</h4>';
  b += r.marcados.length ? '<ul>'+r.marcados.map(function(x){ return '<li><b>'+esc(x.tema)+'</b> · '+esc(L.rellenar(T.marcado_veces, {n: x.veces, s: x.veces === 1 ? '' : 's'}))+'</li>'; }).join('')+'</ul>'
                         : '<p class="nota">'+esc(T.sin_marcas)+'</p>';
  poner('lec-parte-a', a); poner('lec-parte-b', b);
  poner('lec-parte-c', r.texto ? '<p class="lec-concl">'+esc(r.texto)+'</p>' : '');
  var azar;
  if(base){
    /* las cifras de la tabla solo valen si se ve lo mismo que ella midio (ver Lecturas.azarExacto) */
    azar = L.textoAzar(TRADS, ULTIMA.resumen.conNombre, ULTIMA.resumen.conPalma, r.tema);
  } else azar = 'Que varias tradiciones coincidan no es una prueba. Sus descripciones son amplias y casi cualquier persona se reconoce en ellas (a esto se le llama efecto Barnum). Úsalo como espejo para pensar, no como verdad.';
  poner('lec-parte-azar', '<p class="lec-nota">'+esc(azar)+'</p>');
}
function pintar(){
  if(!ULTIMA) return;
  $('lec-tabs').querySelectorAll('[role="tab"]').forEach(function(b){ var s = b.dataset.t === PESTANA; b.setAttribute('aria-selected', s); b.tabIndex = s ? 0 : -1; });
  $('lec-panel').setAttribute('aria-labelledby', 'lec-tab-' + PESTANA);
  var t = elegidas();
  $('lec-cuerpo').innerHTML = t.length ? t.map(tarjetaHTML).join('') : '<p class="nota lec-vacia">'+esc(T.pestana_vacia)+'</p>';
  $('lec-repite').hidden = !t.length;
  if(t.length) actualizarRepite();
}
function resumenHTML(R, nombre){
  var chips = ['Sol en '+R.solN, 'Luna en '+R.lunaN, R.animal, 'Camino de vida '+R.camino];
  return '<h3>'+(nombre ? 'Lectura para '+esc(nombre) : 'Tu lectura')+'</h3><div class="selector">'+chips.map(function(c){ return '<span class="chip" style="cursor:default">'+esc(c)+'</span>'; }).join('')+'</div>';
}

$('lec-form').addEventListener('submit', function(e){
  e.preventDefault();
  var f = $('lec-fecha').value, ok = /^\d{4}-\d{2}-\d{2}$/.test(f);
  if(!ok || f > hoyISO || f < '1900-01-01'){ $('lec-error').textContent = 'Escribe una fecha de nacimiento válida (desde 1900 hasta hoy).'; $('lec-fecha').focus(); return; }
  $('lec-error').textContent = '';
  var p = f.split('-').map(Number), h = $('lec-hora').value, hh = h ? h.split(':').map(Number) : [null, null];
  var palma = {corazon: $('lec-corazon').value, cabeza: $('lec-cabeza').value, vida: $('lec-vida').value};
  var datos = {nombre: $('lec-nombre').value.trim(), anio: p[0], mes: p[1], dia: p[2], hora: hh[0], min: hh[1], tz: $('lec-tz').value, palma: palma};
  try { ULTIMA = Lecturas.leer(datos); }
  catch(err){ $('lec-error').textContent = 'No se pudo calcular la lectura en este navegador.'; return; }
  if(recordar()){ guardar('ci_lectura', {nombre: datos.nombre, fecha: f, hora: h, tz: datos.tz, palma: palma}); guardarElecciones(); }
  else { borrar('ci_lectura'); borrar('ci_lectura_trads'); borrar('ci_resonancias'); }
  $('lec-resumen').innerHTML = resumenHTML(ULTIMA.resumen, datos.nombre);
  $('lec-resultado').hidden = false; PESTANA = 'nacimiento'; pintar();
  $('lec-resultado').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
});

/* pestanas: clic y teclado (flechas, Inicio, Fin) */
function irA(t, foco){ PESTANA = t; pintar(); if(foco) $('lec-tab-' + t).focus(); }
$('lec-tabs').addEventListener('click', function(e){ var b = e.target.closest('[data-t]'); if(!b) return; irA(b.dataset.t); });
$('lec-tabs').addEventListener('keydown', function(e){
  var i = ORDEN.indexOf(PESTANA), n = ORDEN.length, j = null;
  if(e.key === 'ArrowRight') j = (i + 1) % n; else if(e.key === 'ArrowLeft') j = (i - 1 + n) % n;
  else if(e.key === 'Home') j = 0; else if(e.key === 'End') j = n - 1;
  if(j === null) return; e.preventDefault(); irA(ORDEN[j], true);
});

/* marcas: solo se actualiza el bloque del resultado, para no perder el foco */
$('lec-cuerpo').addEventListener('change', function(e){
  var r = e.target; if(!r || r.type !== 'radio' || !r.dataset.id) return;
  var id = r.dataset.id;
  if(r.value === 'si' || r.value === 'no') MARCAS[id] = r.value; else delete MARCAS[id];
  $('lec-cuerpo').querySelectorAll('input[type="radio"]').forEach(function(o){ if(o.dataset.id === id && o.name !== r.name) o.checked = o.value === r.value; });
  guardarElecciones(); actualizarRepite();
});
/* tradiciones elegidas */
$('lec-trads-lista').addEventListener('change', function(e){
  var c = e.target; if(!c || c.type !== 'checkbox') return;
  TRADS = TODAS.filter(function(k){ var x = $('lec-trads-lista').querySelector('input[value="'+k+'"]'); return x && x.checked; });
  guardarElecciones(); pintar();
});
['corazon','cabeza','vida'].forEach(function(l){ $('lec-'+l).addEventListener('change', verQuiromancia); });
$('lec-recordar').addEventListener('change', function(){
  if(recordar()) guardarElecciones(); else { borrar('ci_lectura'); borrar('ci_lectura_trads'); borrar('ci_resonancias'); }
});
$('lec-borrar').addEventListener('click', function(){
  borrar('ci_lectura'); borrar('ci_lectura_trads'); borrar('ci_resonancias'); MARCAS = {}; TRADS = TODAS.slice();
  ULTIMA = null; $('lec-form').reset(); $('lec-resultado').hidden = true; $('lec-recordar').checked = false; pintarTradiciones();
  $('lec-error').textContent = 'Datos borrados de este dispositivo.';
});
})();
