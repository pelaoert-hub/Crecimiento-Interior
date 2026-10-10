(function(){
'use strict';
var $ = function(id){ return document.getElementById(id); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
var SIN_MOVIMIENTO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* escapa tambien comillas: se usa dentro de atributos */
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
/* almacenamiento local con respaldo en memoria si el navegador lo bloquea */
var mem = {};
function leer(k, def){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch(e){ return k in mem ? mem[k] : def; } }
function guardar(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){ mem[k] = v; } }
function clave(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function hoy(){ return clave(new Date()); }

/* ---------- cielo de estrellas ---------- */
(function(){
  var c = $('estrellas'), x = c.getContext && c.getContext('2d'); if(!x) return;
  var est = [], W, H, D = Math.min(window.devicePixelRatio || 1, 2);
  function medir(){
    W = c.width = innerWidth * D; H = c.height = innerHeight * D;
    var n = Math.round(innerWidth * innerHeight / 9000); est = [];
    for(var i = 0; i < n; i++) est.push({x: Math.random()*W, y: Math.random()*H, r: (Math.random()*1.2+.3)*D, f: Math.random()*6.28, v: Math.random()*.02+.004});
  }
  function pintar(t){
    x.clearRect(0,0,W,H);
    est.forEach(function(s){
      var a = SIN_MOVIMIENTO ? .6 : .35 + .55*Math.abs(Math.sin(s.f + t*s.v*.06));
      x.globalAlpha = a; x.fillStyle = s.r > 1.1*D ? '#cdbfff' : '#ffffff';
      x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.2832); x.fill();
    });
    if(!SIN_MOVIMIENTO && !document.hidden) requestAnimationFrame(pintar);
  }
  medir(); requestAnimationFrame(pintar);
  var rz; window.addEventListener('resize', function(){ clearTimeout(rz); rz = setTimeout(function(){ medir(); if(SIN_MOVIMIENTO) pintar(0); }, 200); });
  document.addEventListener('visibilitychange', function(){ if(!document.hidden && !SIN_MOVIMIENTO) requestAnimationFrame(pintar); });
})();

/* ---------- mandala y loto (SVG generado) ---------- */
function petalo(l, a){ return 'M0 0C'+a+' '+(-l*.3)+' '+a+' '+(-l*.72)+' 0 '+(-l)+'C'+(-a)+' '+(-l*.72)+' '+(-a)+' '+(-l*.3)+' 0 0Z'; }
function giros(n, ruta, extra, paso){ var s = ''; for(var i = 0; i < n; i++) s += '<path d="'+ruta+'" transform="rotate('+(i*360/n + (extra||0))+')"/>'; return s; }
$('mandala').innerHTML =
  '<g fill="none" stroke-width=".6">'+
  '<g class="g1" stroke="#b9a7ff" fill="rgba(185,167,255,.10)">'+giros(12, petalo(72,15))+'</g>'+
  '<g class="g2" stroke="#f2a9c4" fill="rgba(242,169,196,.08)">'+giros(12, petalo(46,10), 15)+'</g>'+
  '<circle r="96" stroke="#b9a7ff" opacity=".7"/><circle r="90" stroke="#b9a7ff" stroke-dasharray="1 5" opacity=".7"/>'+
  '<circle r="76" stroke="#f2a9c4" opacity=".5"/><circle r="22" stroke="#cdbfff" opacity=".8"/>'+
  '<circle r="4" fill="#f2a9c4" stroke="none"/></g>';
$('loto').innerHTML =
  '<defs><linearGradient id="lp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f2a9c4"/><stop offset="1" stop-color="#cdbfff"/></linearGradient>'+
  '<linearGradient id="lq" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b48bd6"/><stop offset="1" stop-color="#8f86ff"/></linearGradient></defs>'+
  '<g id="loto-g" style="transform-origin:0 18px;transform-box:view-box"><g transform="translate(0 40)">'+
  '<path d="'+petalo(100,26)+'" fill="url(#lq)" transform="rotate(-76) scale(.86)" opacity=".92"/><path d="'+petalo(100,26)+'" fill="url(#lq)" transform="rotate(76) scale(.86)" opacity=".92"/>'+
  '<path d="'+petalo(110,30)+'" fill="url(#lp)" transform="rotate(-40)" opacity=".95"/><path d="'+petalo(110,30)+'" fill="url(#lp)" transform="rotate(40)" opacity=".95"/>'+
  '<path d="'+petalo(120,30)+'" fill="#fff4fa"/></g></g>';

/* ---------- menu a pantalla completa ---------- */
var menu = $('menu');
function menuAbrir(a){
  menu.classList.toggle('abierto', a); menu.setAttribute('aria-hidden', !a); $('abrir-menu').setAttribute('aria-expanded', a);
  document.body.style.overflow = a ? 'hidden' : '';
  if(a) $('cerrar-menu').focus(); else $('abrir-menu').focus();
}
$('abrir-menu').onclick = function(){ menuAbrir(true); };
$('cerrar-menu').onclick = function(){ menuAbrir(false); };
$$('a', menu).forEach(function(a){ a.addEventListener('click', function(){ menu.classList.remove('abierto'); menu.setAttribute('aria-hidden', true); document.body.style.overflow = ''; }); });

/* ---------- salas de practica ---------- */
var sala = $('sala'), ultimoFoco = null;
function salaAbrir(id){
  $$('.panel', sala).forEach(function(p){ p.hidden = p.id !== 's-'+id; });
  ultimoFoco = document.activeElement;
  sala.classList.add('abierta'); sala.setAttribute('aria-hidden', false); sala.scrollTop = 0;
  document.body.style.overflow = 'hidden'; $('cerrar-sala').focus();
}
function salaCerrar(){
  pararResp(); pararMed();
  sala.classList.remove('abierta'); sala.setAttribute('aria-hidden', true); document.body.style.overflow = '';
  if(ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
}
$('cerrar-sala').onclick = salaCerrar;
$$('[data-abrir]').forEach(function(b){ b.addEventListener('click', function(){ salaAbrir(b.dataset.abrir); }); });
document.addEventListener('keydown', function(e){
  if(e.key !== 'Escape') return;
  if(sala.classList.contains('abierta')) salaCerrar(); else if(menu.classList.contains('abierto')) menuAbrir(false);
});

/* ---------- la luna (fase calculada) ---------- */
(function(){
  var SIN = 29.530588853, REF = Date.UTC(2000,0,6,18,14);
  var p = (((Date.now() - REF) / 86400000) / SIN) % 1; if(p < 0) p += 1;
  var f = (1 - Math.cos(p * 6.2832)) / 2, nombre;
  if(p < .03 || p > .97) nombre = 'Luna nueva';
  else if(p < .22) nombre = 'Luna creciente';
  else if(p < .28) nombre = 'Cuarto creciente';
  else if(p < .47) nombre = 'Gibosa creciente';
  else if(p < .53) nombre = 'Luna llena';
  else if(p < .72) nombre = 'Gibosa menguante';
  else if(p < .78) nombre = 'Cuarto menguante';
  else nombre = 'Luna menguante';
  var q = p < .5 ? p : 1 - p, r = 20, rx = r * Math.abs(Math.cos(q * 6.2832)), barrido = q < .25 ? 0 : 1;
  var luz = 'M0 '+(-r)+' A '+r+' '+r+' 0 0 1 0 '+r+' A '+rx.toFixed(2)+' '+r+' 0 0 '+barrido+' 0 '+(-r)+'Z';
  $('luna-svg').innerHTML = '<circle r="'+r+'" fill="#1b1450" stroke="#b9a7ff" stroke-width=".6"/><path d="'+luz+'" fill="#efeaff"'+(p > .5 ? ' transform="scale(-1 1)"' : '')+'/>';
  $('luna-nombre').textContent = nombre; $('luna-info').textContent = 'Iluminada al ' + Math.round(f*100) + ' %';
  $('fecha-hoy').textContent = new Date().toLocaleDateString('es', {weekday:'long', day:'numeric', month:'long'});
})();

/* ---------- carta de reflexion (textos propios) ---------- */
var CARTAS = [
  ['Paciencia','Lo que madura despacio dura más.','¿Dónde estoy forzando algo que necesita tiempo?'],
  ['Humildad','Aprender empieza cuando admito que no lo sé todo.','¿Qué podría aprender hoy de alguien que piensa distinto?'],
  ['Compasión','Casi todos cargan algo que no se ve.','¿A quién puedo mirar hoy con más ternura?'],
  ['Presencia','El único momento en el que puedo actuar es este.','¿Qué estoy haciendo ahora mismo, de verdad?'],
  ['Gratitud','Lo que damos por hecho también es un regalo.','¿Qué tengo hoy que antes deseaba?'],
  ['Perdón','Soltar el rencor es aligerar mi propio equipaje.','¿Qué peso estoy listo para dejar?'],
  ['Silencio','En el silencio se oye lo que el ruido tapa.','¿Qué me dice mi interior cuando callo cinco minutos?'],
  ['Confianza','No necesito ver todo el camino para dar el siguiente paso.','¿Cuál es el paso pequeño de hoy?'],
  ['Generosidad','Dar sin esperar nada cambia a quien da.','¿Qué puedo ofrecer hoy, aunque sea poco?'],
  ['Sencillez','Casi siempre basta con menos de lo que creo.','¿De qué puedo prescindir sin perder nada importante?'],
  ['Valor','Tener miedo y avanzar también es valentía.','¿Qué conversación o decisión estoy aplazando?'],
  ['Escucha','Escuchar de verdad es una forma de amar.','¿Cuándo fue la última vez que escuché sin preparar mi respuesta?'],
  ['Aceptación','Lo que acepto deja de pelear conmigo.','¿Qué estoy resistiendo que no puedo cambiar?'],
  ['Servicio','Ayudar a otro me recuerda quién quiero ser.','¿A quién puedo echar una mano hoy?']
];
function verCarta(i, anima){
  var c = CARTAS[i], el = $('carta');
  el.innerHTML = '<h4>'+esc(c[0])+'</h4><div class="f">'+esc(c[1])+'</div><div class="q">'+esc(c[2])+'</div>';
  el.classList.remove('voltea'); if(anima && !SIN_MOVIMIENTO){ void el.offsetWidth; el.classList.add('voltea'); }
  return i;
}
var cartaActual = verCarta(Math.floor(Date.now()/86400000) % CARTAS.length, false);
$('otra-carta').onclick = function(){ var n; do { n = Math.floor(Math.random()*CARTAS.length); } while(n === cartaActual); cartaActual = verCarta(n, true); };

/* ---------- intencion del dia ---------- */
(function(){
  var g = leer('ci_intencion', {}); if(g.dia === hoy() && g.texto){ $('intencion').value = g.texto; $('intencion-nota').textContent = 'Tu intención de hoy. Se guarda solo en este dispositivo.'; }
  $('intencion').addEventListener('input', function(){ guardar('ci_intencion', {dia: hoy(), texto: this.value.trim()}); });
})();

/* ---------- biblioteca ---------- */
$('lista-articulos').innerHTML = (window.ARTICULOS || []).map(function(a){
  return '<a href="/articulos/'+esc(a.id)+'/"><h3>'+esc(a.titulo)+'</h3><span class="m">'+esc(a.tema)+' · '+a.minutos+' min</span><p>'+esc(a.resumen)+(a.borrador ? ' <span class="borr">· borrador</span>' : '')+'</p></a>';
}).join('');

/* ---------- diario ---------- */
function pintarDiario(){
  var d = leer('ci_diario', []); if(!d.length) return;
  $('lista-diario').innerHTML = d.slice().reverse().slice(0,20).map(function(e){
    return '<div class="entrada"><small>'+esc(e.fecha)+' · '+esc(e.tipo)+'</small><br>'+esc(e.texto).replace(/\n/g,'<br>')+'</div>';
  }).join('');
}
function anotar(tipo, texto){ var d = leer('ci_diario', []); d.push({fecha: hoy(), tipo: tipo, texto: texto}); guardar('ci_diario', d.slice(-200)); pintarDiario(); }
$('gr-guardar').onclick = function(){
  var t = ['gr1','gr2','gr3'].map(function(i){ return $(i).value.trim(); }).filter(Boolean);
  if(!t.length){ $('gr-ok').textContent = ' Escribe al menos una.'; return; }
  anotar('Gratitud', t.map(function(x,i){ return (i+1)+'. '+x; }).join('\n'));
  ['gr1','gr2','gr3'].forEach(function(i){ $(i).value = ''; }); $('gr-ok').textContent = ' Guardado en tu diario.';
};
$('ex-guardar').onclick = function(){
  var p = ['A quién ayudé:','A quién pude lastimar:','Mañana, distinto:'], t = [];
  ['ex1','ex2','ex3'].forEach(function(i,n){ var v = $(i).value.trim(); if(v) t.push(p[n]+' '+v); });
  if(!t.length){ $('ex-ok').textContent = ' Escribe algo primero.'; return; }
  anotar('Examen del día', t.join('\n')); ['ex1','ex2','ex3'].forEach(function(i){ $(i).value = ''; }); $('ex-ok').textContent = ' Guardado en tu diario.';
};

/* ---------- soltar: el texto se disuelve y no se guarda ---------- */
$('suelta-btn').onclick = function(){
  var t = $('suelta-txt').value.trim(); if(!t){ $('suelta-ok').textContent = ' Escribe primero lo que quieres soltar.'; return; }
  var cont = $('suelta-txt').parentNode, v = document.createElement('div'); v.className = 'vuela'; v.textContent = t;
  cont.appendChild(v); cont.classList.add('soltando'); $('suelta-txt').value = ''; $('suelta-btn').disabled = true; $('suelta-ok').textContent = ' Respira mientras se va…';
  setTimeout(function(){ v.remove(); cont.classList.remove('soltando'); $('suelta-btn').disabled = false; $('suelta-ok').textContent = ' Lo soltaste. No quedó guardado en ningún sitio.'; }, SIN_MOVIMIENTO ? 800 : 5200);
};

/* ---------- habitos con lunas ---------- */
function racha(dias){ var n = 0, d = new Date(); if(dias.indexOf(hoy()) < 0) d.setDate(d.getDate()-1); while(dias.indexOf(clave(d)) >= 0){ n++; d.setDate(d.getDate()-1); } return n; }
function lunas(dias){ var h = '', d = new Date(); d.setDate(d.getDate()-13); for(var i = 0; i < 14; i++){ h += '<i class="'+(dias.indexOf(clave(d)) >= 0 ? 'si' : '')+'"></i>'; d.setDate(d.getDate()+1); } return '<div class="lunas" aria-hidden="true">'+h+'</div>'; }
function pintarHabitos(){
  var h = leer('ci_habitos', []);
  $('lista-habitos').innerHTML = h.length ? h.map(function(x,i){
    var ok = x.dias.indexOf(hoy()) >= 0;
    return '<div class="habito"><div><span class="n">'+esc(x.nombre)+'</span> <span class="racha">'+racha(x.dias)+' días seguidos</span>'+lunas(x.dias)+'</div>'+
      '<div><button class="check '+(ok?'hecho':'')+'" data-m="'+i+'" aria-pressed="'+ok+'" aria-label="Marcar '+esc(x.nombre)+' como hecho hoy">✓</button><button class="quitar" data-q="'+i+'" aria-label="Quitar '+esc(x.nombre)+'">✕</button></div></div>';
  }).join('') : '<p class="nota" style="margin-top:12px">Añade tu primer hábito. Mejor uno pequeño.</p>';
}
$('lista-habitos').onclick = function(e){
  var b = e.target.closest('button'); if(!b) return; var h = leer('ci_habitos', []);
  if(b.dataset.m !== undefined){ var x = h[+b.dataset.m], p = x.dias.indexOf(hoy()); if(p >= 0) x.dias.splice(p,1); else x.dias.push(hoy()); }
  else if(b.dataset.q !== undefined){ if(!confirm('¿Quitar este hábito y su historial?')) return; h.splice(+b.dataset.q,1); }
  guardar('ci_habitos', h); pintarHabitos();
};
function nuevoHabito(){ var n = $('nuevo-habito').value.trim(); if(!n) return; var h = leer('ci_habitos', []); h.push({nombre: n, dias: []}); guardar('ci_habitos', h); $('nuevo-habito').value = ''; pintarHabitos(); }
$('add-habito').onclick = nuevoHabito;
$('nuevo-habito').onkeydown = function(e){ if(e.key === 'Enter') nuevoHabito(); };

/* ---------- respiracion con el loto ---------- */
var PATRONES = {
  calma: {fases: [['Inhala',4,1.18],['Sostén',4,1.18],['Exhala',6,.8]], ciclos: 12},
  caja:  {fases: [['Inhala',4,1.18],['Sostén',4,1.18],['Exhala',4,.8],['Sostén',4,.8]], ciclos: 11}
};
var patron = 'calma', resp = null;
$$('[data-patron]').forEach(function(b){ b.onclick = function(){ pararResp(); patron = b.dataset.patron; $$('[data-patron]').forEach(function(x){ x.setAttribute('aria-pressed', x === b); }); }; });
function pararResp(){
  clearTimeout(resp); resp = null; var g = $('loto'); g.style.transform = ''; $('loto-texto').textContent = 'Listo';
  $('resp-inicio').textContent = 'Comenzar'; $('resp-estado').textContent = 'Siéntate cómodo y sigue la flor.';
}
$('resp-inicio').onclick = function(){
  if(resp){ pararResp(); return; }
  var P = PATRONES[patron], ciclo = 0; $('resp-inicio').textContent = 'Parar';
  (function paso(i){
    if(ciclo >= P.ciclos){ pararResp(); $('resp-estado').textContent = 'Terminaste. Respira con normalidad.'; anotar('Respiración', 'Respiración guiada completa ('+patron+')'); return; }
    var f = P.fases[i], g = $('loto');
    g.style.transitionDuration = f[1]+'s'; g.style.transform = 'scale('+f[2]+')';
    $('loto-texto').textContent = f[0]; $('resp-estado').textContent = 'Ciclo '+(ciclo+1)+' de '+P.ciclos;
    if(i === P.fases.length-1) ciclo++;
    resp = setTimeout(function(){ paso((i+1) % P.fases.length); }, f[1]*1000);
  })(0);
};

/* ---------- silencio con cuenco ---------- */
var med = null, audio = null;
function fmt(s){ return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
function cuenco(){
  try{
    audio = audio || new (window.AudioContext || window.webkitAudioContext)(); var t = audio.currentTime;
    [[1,.28],[2.76,.12],[5.4,.05]].forEach(function(p){
      var o = audio.createOscillator(), g = audio.createGain(); o.type = 'sine'; o.frequency.value = 196 * p[0];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p[1], t + .02); g.gain.exponentialRampToValueAtTime(.0008, t + 6);
      o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + 6.2);
    });
  }catch(e){}
  if(navigator.vibrate) navigator.vibrate(150);
}
$('med-min').onchange = function(){ if(!med) $('med-reloj').textContent = fmt(+$('med-min').value*60); };
function pararMed(){ clearInterval(med); med = null; $('med-inicio').textContent = 'Comenzar'; $('med-reloj').textContent = fmt(+$('med-min').value*60); }
$('med-inicio').onclick = function(){
  if(med){ pararMed(); return; }
  var fin = Date.now() + (+$('med-min').value)*60000; $('med-inicio').textContent = 'Parar'; cuenco();
  med = setInterval(function(){
    var r = Math.max(0, Math.round((fin-Date.now())/1000)); $('med-reloj').textContent = fmt(r);
    if(r === 0){ var m = $('med-min').value; pararMed(); $('med-reloj').textContent = '00:00'; cuenco(); anotar('Silencio', m+' minutos de silencio'); }
  }, 250);
};

/* ---------- velas (comunidad): fetch directo, sin CDN ---------- */
var C = window.CONFIG_COMUNIDAD || {};
function cab(){ return {'apikey': C.clavePublica, 'Authorization': 'Bearer '+C.clavePublica, 'Content-Type': 'application/json'}; }
function cargarVelas(){
  fetch(C.url+'/rest/v1/comunidad_mensajes?select=nombre,texto,created_at&order=created_at.desc&limit=30', {headers: cab()})
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(m){
      $('com-lista').innerHTML = m.length ? m.map(function(x){
        return '<div class="vidrio vela"><div class="llama"></div><div class="cera"></div><p>'+esc(x.texto)+'</p><small>'+esc(x.nombre)+' · '+esc(String(x.created_at).slice(0,10))+' · ? Aporte de la comunidad</small></div>';
      }).join('') : '<p class="nota" style="grid-column:1/-1;text-align:center">Aún no hay velas encendidas. Sé la primera persona.</p>';
    })
    .catch(function(){ $('com-lista').innerHTML = '<p class="nota" style="grid-column:1/-1;text-align:center">No se pudieron cargar las velas ahora mismo.</p>'; });
}
if(C.url && C.clavePublica && /^https:\/\//.test(C.url)){
  cargarVelas();
  $('com-enviar').onclick = function(){
    var n = $('com-nombre').value.trim(), t = $('com-texto').value.trim();
    if(!n || t.length < 5){ $('com-ok').textContent = ' Escribe tu nombre y tu intención.'; return; }
    $('com-enviar').disabled = true;
    fetch(C.url+'/rest/v1/comunidad_mensajes', {method:'POST', headers: Object.assign({'Prefer':'return=minimal'}, cab()), body: JSON.stringify({nombre:n, texto:t})})
      .then(function(r){ if(!r.ok) throw 0; $('com-texto').value = ''; $('com-ok').textContent = ' Recibido. Tu vela se encenderá cuando se revise.'; })
      .catch(function(){ $('com-ok').textContent = ' No se pudo enviar. Inténtalo más tarde.'; })
      .then(function(){ $('com-enviar').disabled = false; });
  };
} else { $('com-activa').classList.add('oculto'); $('com-inactiva').classList.remove('oculto'); }

/* ---------- instalar como app ---------- */
var evInstalar = null;
window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); evInstalar = e; $('instalar-btn').hidden = false; });
$('instalar-btn').onclick = function(){ if(!evInstalar) return; evInstalar.prompt(); evInstalar.userChoice.then(function(){ evInstalar = null; $('instalar-btn').hidden = true; }); };
window.addEventListener('appinstalled', function(){ $('instalar').classList.add('oculto'); });
if(window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) $('instalar').classList.add('oculto');
if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(function(){});

/* ---------- aparecer al hacer scroll ---------- */
if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visto'); io.unobserve(e.target); } }); }, {threshold: .1});
  $$('.aparece').forEach(function(el){ io.observe(el); });
} else { $$('.aparece').forEach(function(el){ el.classList.add('visto'); }); }

pintarHabitos(); pintarDiario();
})();
