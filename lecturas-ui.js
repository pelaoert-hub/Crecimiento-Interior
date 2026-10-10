/* lecturas: interfaz (formulario + resultados). El motor esta en lecturas.js */
(function(){
'use strict';
var $ = function(id){ return document.getElementById(id); };
if(!$('lec-form') || !window.Lecturas) return;

function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
var mem = {};
function leer(k){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch(e){ return mem[k] || null; } }
function guardar(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){ mem[k] = v; } }
function borrar(k){ try { localStorage.removeItem(k); } catch(e){ delete mem[k]; } }

var ZONAS = [['America/Havana','Cuba (La Habana)'],['America/New_York','Miami / Nueva York'],['America/Chicago','Chicago / Texas'],['America/Los_Angeles','Los Ángeles'],['America/Mexico_City','México (centro)'],['America/Bogota','Colombia / Perú / Ecuador'],['America/Caracas','Venezuela'],['America/Santiago','Chile'],['America/Argentina/Buenos_Aires','Argentina'],['Europe/Madrid','España (península)'],['Europe/London','Reino Unido'],['UTC','Hora universal (UTC)']];
$('lec-tz').innerHTML = ZONAS.map(function(z){ return '<option value="'+z[0]+'">'+esc(z[1])+'</option>'; }).join('');
var hoyISO = new Date().toISOString().slice(0,10); $('lec-fecha').max = hoyISO; $('lec-fecha').min = '1900-01-01';

/* datos recordados (solo si la persona lo eligio) */
var rec = leer('ci_lectura');
if(rec){
  $('lec-nombre').value = rec.nombre || ''; $('lec-fecha').value = rec.fecha || ''; $('lec-hora').value = rec.hora || '';
  if(rec.tz) $('lec-tz').value = rec.tz; ['corazon','cabeza','vida'].forEach(function(l){ if(rec.palma && rec.palma[l]) $('lec-'+l).value = rec.palma[l]; });
  $('lec-recordar').checked = true;
}

var ULTIMA = null, PESTANA = 'nacimiento';
var TITULOS = {nacimiento:'Tu base', hoy:'Hoy', mes:'Este mes', ano:'Este año'};

function tarjetaHTML(c){
  return '<article class="vidrio lec-card"><header><span class="lec-simb" aria-hidden="true">'+esc(c.simbolo)+'</span><div><h4>'+esc(c.trad)+'</h4><small>Mirada tradicional, no predicción</small></div></header>'+
    c.items.map(function(i){ return '<div class="lec-item"><b>'+esc(i.k)+'</b><p>'+esc(i.d)+'</p></div>'; }).join('')+
    (c.pregunta ? '<p class="lec-q">Para pensar: '+esc(c.pregunta)+'</p>' : '')+
    (c.nota ? '<p class="lec-nota">'+esc(c.nota)+'</p>' : '')+'</article>';
}
function coinHTML(tarjetas){
  var co = Lecturas.coincidencias(tarjetas);
  return '<div class="vidrio lec-coin"><h3>Lo que se repite</h3>'+
    (co.length ? '<p class="nota">Estos temas aparecen en más de una tradición:</p><ul>'+co.map(function(c){ return '<li><b>'+esc(c.tema)+'</b> · '+c.tradiciones.map(esc).join(', ')+'</li>'; }).join('')+'</ul>'
               : '<p class="nota">Aquí cada tradición mira algo distinto y no hay temas que se repitan.</p>')+
    '<p class="lec-nota">Que varias tradiciones coincidan no es una prueba. Sus descripciones son amplias y casi cualquier persona se reconoce en ellas (a esto se le llama efecto Barnum). Úsalo como espejo para pensar, no como verdad.</p></div>';
}
function pintar(){
  if(!ULTIMA) return;
  var r = ULTIMA, t = r[PESTANA], R = r.resumen;
  $('lec-tabs').querySelectorAll('[role="tab"]').forEach(function(b){ b.setAttribute('aria-selected', b.dataset.t === PESTANA); });
  $('lec-cuerpo').innerHTML = t.map(tarjetaHTML).join('') + coinHTML(t);
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
  if($('lec-recordar').checked) guardar('ci_lectura', {nombre: datos.nombre, fecha: f, hora: h, tz: datos.tz, palma: palma}); else borrar('ci_lectura');
  $('lec-resumen').innerHTML = resumenHTML(ULTIMA.resumen, datos.nombre);
  $('lec-resultado').hidden = false; PESTANA = 'nacimiento'; pintar();
  $('lec-resultado').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
});
$('lec-tabs').addEventListener('click', function(e){ var b = e.target.closest('[data-t]'); if(!b) return; PESTANA = b.dataset.t; pintar(); });
$('lec-borrar').addEventListener('click', function(){
  borrar('ci_lectura'); ULTIMA = null; $('lec-form').reset(); $('lec-resultado').hidden = true; $('lec-recordar').checked = false; $('lec-error').textContent = 'Datos borrados de este dispositivo.';
});
})();
