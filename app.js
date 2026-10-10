(function(){
'use strict';
var $ = function(id){ return document.getElementById(id); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

/* escapa tambien comillas: se usa dentro de atributos */
function esc(s){
  return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
}
/* almacenamiento local con respaldo en memoria si el navegador lo bloquea */
var mem = {};
function leer(k, def){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch(e){ return k in mem ? mem[k] : def; } }
function guardar(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){ mem[k] = v; } }
function clave(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function hoy(){ return clave(new Date()); }

/* ---------- tema claro/oscuro ---------- */
$('tema').onclick = function(){
  var r = document.documentElement, oscuro = getComputedStyle(r).colorScheme === 'dark';
  var nuevo = oscuro ? 'claro' : 'oscuro'; r.dataset.tema = nuevo;
  try { localStorage.setItem('ci_tema', nuevo); } catch(e){}
};

/* ---------- reflexion del dia (textos propios, sin atribuir a nadie) ---------- */
var FRASES = [
  'Lo que hoy haces en silencio se nota mañana en cómo tratas a los demás.',
  'No tienes que arreglar toda tu vida hoy. Con un gesto pequeño y bien hecho, basta.',
  'Antes de responder, respira una vez. A veces esa sola respiración cambia la conversación.',
  'Agradecer no niega lo difícil; recuerda lo que también está bien.',
  'Cuidarte no es egoísmo: es la base para poder cuidar a otros.',
  'Una palabra amable cuesta poco y puede sostener a alguien todo el día.',
  'Equivocarte no te define. Lo que haces después de equivocarte, sí.',
  'El silencio no está vacío: ahí es donde te escuchas.',
  'Cada día es una oportunidad de empezar de nuevo, sin cargar todo el peso de ayer.',
  'Perdonar no es decir que estuvo bien: es dejar de cargar con lo que ya pasó.',
  'Lo que repites cada día te va formando, para bien o para mal. Elige con cuidado.',
  'No compares tu camino con el de nadie. Cada persona avanza a su ritmo.',
  'Hay días de avanzar y días de descansar. Los dos cuentan.',
  'Mirar con atención a quien tienes delante es una forma de cariño.'
];
var dia = Math.floor(Date.now()/86400000);
$('frase').textContent = FRASES[dia % FRASES.length];

/* ---------- articulos ---------- */
$('lista-articulos').innerHTML = (window.ARTICULOS || []).map(function(a){
  return '<a class="tarjeta aparece" href="/articulos/'+esc(a.id)+'/"><span class="etiqueta">'+esc(a.tema)+'</span> '+
    (a.borrador ? '<span class="etiqueta borrador">Borrador</span>' : '')+
    '<h3>'+esc(a.titulo)+'</h3><p>'+esc(a.resumen)+'</p><span class="mas">Leer · '+a.minutos+' min →</span></a>';
}).join('');

/* ---------- pestanas de ejercicios ---------- */
$$('.pestana[data-p]').forEach(function(b){
  b.onclick = function(){
    $$('.pestana[data-p]').forEach(function(x){ x.setAttribute('aria-selected', x === b); });
    ['resp','silencio','gratitud','examen'].forEach(function(p){ $('p-'+p).hidden = p !== b.dataset.p; });
  };
});

/* ---------- diario ---------- */
function pintarDiario(){
  var d = leer('ci_diario', []); if(!d.length) return;
  $('lista-diario').innerHTML = d.slice().reverse().slice(0,20).map(function(e){
    return '<div class="entrada"><small>'+esc(e.fecha)+' · '+esc(e.tipo)+'</small><br>'+esc(e.texto).replace(/\n/g,'<br>')+'</div>';
  }).join('');
}
function anotar(tipo, texto){
  var d = leer('ci_diario', []); d.push({fecha: hoy(), tipo: tipo, texto: texto});
  guardar('ci_diario', d.slice(-200)); pintarDiario();
}
$('gr-guardar').onclick = function(){
  var t = ['gr1','gr2','gr3'].map(function(i){ return $(i).value.trim(); }).filter(Boolean);
  if(!t.length){ $('gr-ok').textContent = 'Escribe al menos una.'; return; }
  anotar('Gratitud', t.map(function(x,i){ return (i+1)+'. '+x; }).join('\n'));
  ['gr1','gr2','gr3'].forEach(function(i){ $(i).value = ''; });
  $('gr-ok').textContent = 'Guardado en tu diario.';
};
$('ex-guardar').onclick = function(){
  var p = ['A quién ayudé:','A quién pude lastimar:','Mañana, distinto:'], t = [];
  ['ex1','ex2','ex3'].forEach(function(i,n){ var v = $(i).value.trim(); if(v) t.push(p[n]+' '+v); });
  if(!t.length){ $('ex-ok').textContent = 'Escribe algo primero.'; return; }
  anotar('Examen del día', t.join('\n'));
  ['ex1','ex2','ex3'].forEach(function(i){ $(i).value = ''; });
  $('ex-ok').textContent = 'Guardado en tu diario.';
};

/* ---------- habitos ---------- */
function racha(dias){
  var n = 0, d = new Date();
  if(dias.indexOf(hoy()) < 0) d.setDate(d.getDate()-1); /* si hoy no se marco, cuenta desde ayer */
  while(dias.indexOf(clave(d)) >= 0){ n++; d.setDate(d.getDate()-1); }
  return n;
}
function semana(dias){
  var h = '', d = new Date(); d.setDate(d.getDate()-6);
  for(var i = 0; i < 7; i++){ h += '<i class="'+(dias.indexOf(clave(d)) >= 0 ? 'si' : '')+'"></i>'; d.setDate(d.getDate()+1); }
  return '<div class="semana" aria-hidden="true">'+h+'</div>';
}
function pintarHabitos(){
  var h = leer('ci_habitos', []), hechos = 0;
  $('lista-habitos').innerHTML = h.length ? h.map(function(x,i){
    var ok = x.dias.indexOf(hoy()) >= 0; if(ok) hechos++;
    return '<div class="habito"><div><span class="n">'+esc(x.nombre)+'</span> <span class="racha">'+racha(x.dias)+' días seguidos</span>'+semana(x.dias)+'</div>'+
      '<div><button class="check '+(ok?'hecho':'')+'" data-m="'+i+'" aria-pressed="'+ok+'" aria-label="Marcar '+esc(x.nombre)+' como hecho hoy">✓</button> '+
      '<button class="quitar" data-q="'+i+'" aria-label="Quitar '+esc(x.nombre)+'">✕</button></div></div>';
  }).join('') : '<p class="nota" style="margin-top:14px">Añade tu primer hábito. Mejor uno pequeño.</p>';
  var pct = h.length ? Math.round(hechos/h.length*100) : 0;
  $('anillo-num').textContent = pct;
  $('anillo-valor').style.strokeDashoffset = 452.4 * (1 - pct/100);
}
$('lista-habitos').onclick = function(e){
  var b = e.target.closest('button'); if(!b) return;
  var h = leer('ci_habitos', []);
  if(b.dataset.m !== undefined){
    var x = h[+b.dataset.m], p = x.dias.indexOf(hoy());
    if(p >= 0) x.dias.splice(p,1); else x.dias.push(hoy());
  } else if(b.dataset.q !== undefined){
    if(!confirm('¿Quitar este hábito y su historial?')) return;
    h.splice(+b.dataset.q,1);
  }
  guardar('ci_habitos', h); pintarHabitos();
};
function añadirHabito(){
  var n = $('nuevo-habito').value.trim(); if(!n) return;
  var h = leer('ci_habitos', []); h.push({nombre: n, dias: []});
  guardar('ci_habitos', h); $('nuevo-habito').value = ''; pintarHabitos();
}
$('add-habito').onclick = añadirHabito;
$('nuevo-habito').onkeydown = function(e){ if(e.key === 'Enter') añadirHabito(); };

/* ---------- respiracion guiada ---------- */
var PATRONES = {
  calma: {fases: [['Inhala',4,1.25],['Sostén',4,1.25],['Exhala',6,0.8]], ciclos: 12},
  caja:  {fases: [['Inhala',4,1.25],['Sostén',4,1.25],['Exhala',4,0.8],['Sostén',4,0.8]], ciclos: 11}
};
var patron = 'calma', resp = null;
$$('.pestana[data-patron]').forEach(function(b){
  b.onclick = function(){ if(resp) parar(); patron = b.dataset.patron; $$('.pestana[data-patron]').forEach(function(x){ x.setAttribute('aria-selected', x === b); }); };
});
function parar(){
  clearTimeout(resp); resp = null; var o = $('orbe'); o.style.transform = ''; $('orbe-texto').textContent = 'Listo';
  $('resp-inicio').textContent = 'Comenzar'; $('resp-estado').textContent = 'Siéntate cómodo y sigue el círculo.';
}
$('resp-inicio').onclick = function(){
  if(resp){ parar(); return; }
  var P = PATRONES[patron], ciclo = 0; $('resp-inicio').textContent = 'Parar';
  (function paso(i){
    if(ciclo >= P.ciclos){ parar(); $('resp-estado').textContent = 'Terminaste. Respira con normalidad.'; anotar('Respiración', 'Respiración guiada completa ('+patron+')'); return; }
    var f = P.fases[i], o = $('orbe');
    o.style.transitionDuration = f[1]+'s'; o.style.transform = 'scale('+f[2]+')';
    $('orbe-texto').textContent = f[0]; $('resp-estado').textContent = 'Ciclo '+(ciclo+1)+' de '+P.ciclos;
    if(i === P.fases.length-1) ciclo++;
    resp = setTimeout(function(){ paso((i+1) % P.fases.length); }, f[1]*1000);
  })(0);
};

/* ---------- silencio ---------- */
var med = null;
function fmt(s){ return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
$('med-min').onchange = function(){ if(!med) $('med-reloj').textContent = fmt(+$('med-min').value*60); };
function campana(){
  try{
    var a = new (window.AudioContext||window.webkitAudioContext)(), o = a.createOscillator(), g = a.createGain();
    o.frequency.value = 528; g.gain.setValueAtTime(.2,a.currentTime); g.gain.exponentialRampToValueAtTime(.001,a.currentTime+3);
    o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+3);
  }catch(e){}
  if(navigator.vibrate) navigator.vibrate(200);
}
$('med-inicio').onclick = function(){
  var btn = $('med-inicio');
  if(med){ clearInterval(med); med = null; btn.textContent = 'Comenzar'; $('med-reloj').textContent = fmt(+$('med-min').value*60); return; }
  var fin = Date.now() + (+$('med-min').value)*60000; btn.textContent = 'Parar';
  med = setInterval(function(){
    var r = Math.max(0, Math.round((fin-Date.now())/1000)); $('med-reloj').textContent = fmt(r);
    if(r === 0){ clearInterval(med); med = null; btn.textContent = 'Comenzar'; campana(); anotar('Silencio', $('med-min').value+' minutos de silencio'); }
  }, 250);
};

/* ---------- comunidad: PostgREST directo con fetch, sin CDN (en Cuba los CDN fallan a menudo) ---------- */
var C = window.CONFIG_COMUNIDAD || {};
function cab(){ return {'apikey': C.clavePublica, 'Authorization': 'Bearer '+C.clavePublica, 'Content-Type': 'application/json'}; }
function cargarMensajes(){
  fetch(C.url+'/rest/v1/comunidad_mensajes?select=nombre,texto,created_at&order=created_at.desc&limit=30', {headers: cab()})
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(m){
      $('com-lista').innerHTML = m.length ? m.map(function(x){
        return '<div class="entrada"><b>'+esc(x.nombre)+'</b> <small>'+esc(String(x.created_at).slice(0,10))+' · ? Aporte de la comunidad</small><br>'+esc(x.texto)+'</div>';
      }).join('') : '<p class="nota">Aún no hay mensajes publicados.</p>';
    })
    .catch(function(){ $('com-lista').innerHTML = '<p class="nota">No se pudieron cargar los mensajes ahora mismo.</p>'; });
}
if(C.url && C.clavePublica && /^https:\/\//.test(C.url)){
  cargarMensajes();
  $('com-enviar').onclick = function(){
    var n = $('com-nombre').value.trim(), t = $('com-texto').value.trim();
    if(!n || t.length < 5){ $('com-ok').textContent = 'Escribe tu nombre y un mensaje.'; return; }
    $('com-enviar').disabled = true;
    fetch(C.url+'/rest/v1/comunidad_mensajes', {method:'POST', headers: Object.assign({'Prefer':'return=minimal'}, cab()), body: JSON.stringify({nombre:n, texto:t})})
      .then(function(r){ if(!r.ok) throw 0; $('com-texto').value = ''; $('com-ok').textContent = 'Recibido. Se publicará cuando se revise.'; })
      .catch(function(){ $('com-ok').textContent = 'No se pudo enviar. Inténtalo más tarde.'; })
      .then(function(){ $('com-enviar').disabled = false; });
  };
} else { $('com-activa').classList.add('oculto'); $('com-inactiva').classList.remove('oculto'); }

/* ---------- instalar como app ---------- */
var evInstalar = null;
window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); evInstalar = e; $('instalar-btn').hidden = false; });
$('instalar-btn').onclick = function(){
  if(!evInstalar) return; evInstalar.prompt();
  evInstalar.userChoice.then(function(){ evInstalar = null; $('instalar-btn').hidden = true; });
};
window.addEventListener('appinstalled', function(){ $('instalar').classList.add('oculto'); });
if(window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) $('instalar').classList.add('oculto');
if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(function(){});

/* ---------- aparecer al hacer scroll (si no hay soporte, todo visible) ---------- */
if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visto'); io.unobserve(e.target); } }); }, {threshold: .12});
  $$('.aparece').forEach(function(el){ io.observe(el); });
} else { $$('.aparece').forEach(function(el){ el.classList.add('visto'); }); }

pintarHabitos(); pintarDiario();
})();
