/* capa Cuba: interfaz. Los datos y sus fuentes estan en cuba-datos.js. */
(function(raiz){
'use strict';
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function azar(){ var a = new Uint8Array(1); if(raiz.crypto && raiz.crypto.getRandomValues){ raiz.crypto.getRandomValues(a); return a[0] & 1; } return Math.random() < .5 ? 1 : 0; }
function refs(f){ return f.map(function(n){ return '<sup><a href="#cuba-fuentes" title="'+esc(CUBA.FUENTES[n].t)+'">'+n+'</a></sup>'; }).join(' '); }

var CUBA = raiz.CUBA;
function norm(s){ return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

function html(){
  var h = '';
  h += '<div class="cuba-nav" role="navigation" aria-label="Secciones de Cuba"><a href="#cuba-reglas">Reglas</a><a href="#cuba-orishas">Orishas</a><a href="#cuba-sinc">Sincretismo</a><a href="#cuba-diloggun">Diloggún</a><a href="#cuba-ifa">Ifá</a><a href="#cuba-palo">Palo Monte</a><a href="#cuba-fuentes">Fuentes</a></div>';

  h += '<section id="cuba-intro" class="cuba-sec"><div class="enc"><span class="etq">Capa Cuba</span><h2>Tradiciones afrocubanas</h2><p>Un resumen educativo de las religiones de raíz africana más presentes en Cuba, con sus orishas, sus santos católicos y sus formas de adivinación.</p></div>'+
    '<div class="aviso"><b>Antes de leer.</b> Esto es información cultural, no una consulta ni una ceremonia, y no sustituye a un santero, un babalawo o un palero iniciado. Son tradiciones orales, vivas y con variaciones entre casas y regiones. Cada dato indica la fuente donde se comprobó: lo que aparece en una sola fuente se marca así, y lo que las fuentes contradicen se avisa o se omite. Está pendiente de revisión por practicantes de estas religiones y se agradecen sus correcciones.</div></section>';

  h += '<section id="cuba-reglas" class="cuba-sec"><div class="enc"><h2>Las reglas</h2><p>Varias religiones conviven en Cuba, y muchas personas practican más de una.</p></div><div class="cuba-grid">'+
   '<div class="vidrio tile"><h3>Regla de Ocha (Santería)</h3><p>Religión de origen yoruba, también llamada lucumí. Su culto gira en torno a los orishas, que en Cuba se identificaron con santos católicos. Se adivina con el diloggún, los caracoles. '+refs([1,2,4])+'</p></div>'+
   '<div class="vidrio tile"><h3>Regla de Ifá</h3><p>Sistema yoruba de adivinación y religión, centrado en Orunmila. Lo practican los babalawos, que significa «padres de los secretos». Tiene 256 odu. '+refs([1,6])+'</p></div>'+
   '<div class="vidrio tile"><h3>Palo Monte</h3><p>Religión de origen bantú, de la cuenca del Congo, traída por personas esclavizadas de África Central. Tiene varias ramas, como Mayombe, Briyumba y Kimbisa. '+refs([8])+'</p></div>'+
   '</div><p class="nota" style="text-align:center;margin-top:14px">Las fuentes mencionan también la sociedad secreta Abakuá y la influencia del espiritismo en Cuba. Aquí no se detallan. '+refs([1,8])+'</p></section>';

  h += '<section id="cuba-orishas" class="cuba-sec"><div class="enc"><h2>Orishas y santos</h2><p>A cada orisha le corresponde un santo católico, y en Palo Monte, un nombre equivalente. Pulsa un número para ver la fuente.</p></div>'+
    '<div class="cuba-buscar"><label for="cuba-q" class="oculto">Buscar un orisha o un santo</label><input id="cuba-q" type="search" placeholder="Buscar orisha o santo (Ej.: Yemayá, Regla)" autocomplete="off"></div><div class="cuba-grid" id="cuba-lista"></div></section>';

  h += '<section id="cuba-sinc" class="cuba-sec"><div class="enc"><h2>El sincretismo</h2><p>Cómo se relacionan los orishas, los santos católicos y las deidades de Palo Monte.</p></div>'+
    '<div class="vidrio tile" style="max-width:760px;margin:0 auto 16px"><p>El sincretismo se explica como un proceso cultural entre la religión traída por las personas esclavizadas y el catolicismo impuesto: un equilibrio entre la resistencia y la acomodación. Cada país produjo sus propias equivalencias, entre otras cosas por la función del santo como intercesor o patrono y por las imágenes populares de cada lugar. Algunos lo consideran una manera de proteger a los dioses bajo ropaje cristiano, aunque el proceso fue más complejo. '+refs([1])+'</p><p class="nota">Que se identifiquen no quiere decir que para todos los practicantes sean lo mismo.</p></div>'+
    '<div class="tabla-scroll"><table class="cuba-tabla"><thead><tr><th>Orisha</th><th>Santo católico</th><th>Palo Monte</th></tr></thead><tbody id="cuba-tabla"></tbody></table></div>'+
    '<p class="nota" style="text-align:center;margin-top:10px">En la tabla solo aparecen los orishas con equivalencia en Palo Monte indicada en la fuente 8.</p></section>';

  h += '<section id="cuba-diloggun" class="cuba-sec"><div class="enc"><h2>El diloggún: los caracoles</h2><p>La adivinación de la Regla de Ocha.</p></div>'+
    '<div class="vidrio tile" style="max-width:760px;margin:0 auto 16px"><p>El diloggún se lee con caracoles. Se interpretan según hayan caído boca arriba o boca abajo. Hay <b>16 posiciones</b> principales, y cada una tiene a su vez 16 más, hasta completar <b>256 odun</b>. En cada odun hablan uno o varios orishas. Las 12 primeras las leen los santeros, y las 4 últimas son de dominio exclusivo de los babalawos. La tirada se repite dos veces para formar un odu compuesto. Los resultados se leen como <i>ire</i> (buena fortuna) u <i>osogbo</i> (obstáculos que se pueden superar con ayuda de los orishas). '+refs([4,9])+'</p>'+
    '<p class="nota">Existen además otros oráculos: el de Biague (coco) y el de Ifá (ékuele), este último manejado solo por babalawos. '+refs([4])+'</p></div>'+
    '<div class="selector" id="cuba-letras" role="group" aria-label="Letras del diloggún"></div><div id="cuba-letra" class="cuba-letra"></div>'+
    '<div class="vidrio tile cuba-tirada"><h3>Tirada simbólica</h3><p>Una simulación para conocer las letras. No es una consulta, no responde preguntas y no predice nada. Cada uno de los 16 caracoles cae abierto o cerrado con la misma probabilidad, y la letra es el número de caracoles abiertos.</p><button class="boton lleno" type="button" id="cuba-tirar">Tirar los caracoles</button><div id="cuba-conchas" class="cuba-conchas" aria-live="polite"></div><div id="cuba-res"></div></div></section>';

  h += '<section id="cuba-ifa" class="cuba-sec"><div class="enc"><h2>Ifá y el tablero de Orula</h2><p>La adivinación de los babalawos.</p></div>'+
    '<div class="vidrio tile" style="max-width:760px;margin:0 auto 16px"><p>Ifá es un sistema religioso y de adivinación yoruba. Su corpus son los <i>Odu Ifá</i>, 256 en total, que salen de combinar los 16 odu mayores (<i>Meji</i>). Orunmila (Orula) es considerado el gran sacerdote. Los babalawos consultan con una cadena de adivinación (<i>opele</i>, que en Cuba se conoce como ékuele) o con semillas de la palma sagrada (<i>ikin</i>) sobre una bandeja de madera, el <i>opon Ifá</i>, que es el tablero de Orula. '+refs([4,6,1])+'</p><p class="nota">Esta web no simula la consulta de Ifá: solo pueden hacerla los babalawos.</p></div>'+
    '<div class="cuba-grid" id="cuba-meji"></div><p class="nota" style="text-align:center;margin-top:10px">Cada odu tiene lados favorables y desfavorables. Los temas se citan tal como los recogen las fuentes y no son predicciones. Entre paréntesis, el nombre con que se conoce en Cuba. '+refs([6,7,5])+'</p></section>';

  h += '<section id="cuba-palo" class="cuba-sec"><div class="enc"><h2>Palo Monte</h2><p>Cómo trabajan los paleros.</p></div>'+
    '<div class="vidrio tile" style="max-width:760px;margin:0 auto 16px"><p>Es una religión afroamericana, politeísta, sincrética y animista, derivada de la religión kongo y mezclada en Cuba con el espiritismo. Su dios alto es Nzambi, y trabaja con deidades llamadas <i>mpungu</i> y con los espíritus de los muertos. '+refs([8])+'</p>'+
    '<h3 style="margin-top:14px">Cómo ven las cosas</h3><p>La fuente 8 menciona dos métodos: el <i>vititi mensu</i>, que consiste en mirar en un cuerno de un animal sacralizado tapado con un espejo, y los <i>chamalongos</i>, conchas de coco que se lanzan y cuya caída expresaría la respuesta del muerto. La fuente 1 añade que los mayomberos usan el coco para saber si su nganga (el caldero sagrado) está satisfecha. '+refs([8,1])+'</p><p class="nota">Las fuentes consultadas no detallan cómo se interpretan, y esta web no lo inventa.</p></div>'+
    '<div class="cuba-grid" id="cuba-mpungos"></div></section>';

  h += '<section id="cuba-fuentes" class="cuba-sec"><div class="enc"><h2>Fuentes</h2><p>De dónde sale cada dato. Se consultaron el 10 de octubre de 2026.</p></div><ol class="cuba-fuentes" id="cuba-flist"></ol>'+
    '<div class="aviso"><b>Qué se hizo y qué no.</b> Los datos se comprobaron en estas páginas, que son de acceso público: un texto de la Hispano Cubano, Wikipedia, EcuRed, un museo universitario y una página de investigación sobre Osha-Ifá. Son fuentes divulgativas. No se consultó a practicantes ni libros de las propias casas. Los fragmentos entre comillas del diloggún son literales de la fuente 5. Las preguntas para pensar son de Ánima y no pertenecen a la tradición. Donde las fuentes se contradicen (el santo de Ochosi, Osun u Osain, algunos colores y fechas), se avisa o se deja fuera.</div></section>';
  return h;
}

function orishaHTML(o){
  var etq = o.f.length >= 2 ? '<span class="etiqueta">Contrastado en '+o.f.length+' fuentes</span>' : '<span class="etiqueta borr">Una sola fuente</span>';
  return '<article class="vidrio tile cuba-card"><header><h3>'+esc(o.n)+'</h3>'+etq+'</header>'+
    '<p>'+esc(o.rep)+'</p><dl>'+
    '<dt>Santo católico</dt><dd>'+esc(o.santo)+(o.fiesta ? ' <span class="nota">(fiesta: '+esc(o.fiesta)+', fuente 1)</span>' : '')+'</dd>'+
    (o.col ? '<dt>Colores</dt><dd>'+esc(o.col)+'</dd>' : '')+
    (o.palo ? '<dt>En Palo Monte</dt><dd>'+esc(o.palo)+'</dd>' : '')+'</dl>'+
    (o.nota ? '<p class="nota">'+esc(o.nota)+'</p>' : '')+'<p class="nota">Fuentes: '+refs(o.f)+'</p></article>';
}
function pintarOrishas(q){
  var n = norm(q || ''), lista = CUBA.ORISHAS.filter(function(o){ return !n || norm(o.n+' '+o.santo+' '+(o.palo||'')).indexOf(n) >= 0; });
  document.getElementById('cuba-lista').innerHTML = lista.length ? lista.map(orishaHTML).join('') : '<p class="nota" style="grid-column:1/-1;text-align:center">No hay resultados.</p>';
}

function letraHTML(l){
  if(l.solo) return '<div class="vidrio tile"><h3>'+l.num+'. '+esc(l.n)+'</h3><p>Según la fuente 4, esta letra es de dominio exclusivo de los babalawos. Aquí no se muestra lectura. '+refs([4])+'</p></div>';
  return '<div class="vidrio tile"><span class="etq">Letra '+l.num+(l.alt ? ' · '+esc(l.alt) : '')+'</span><h3>'+esc(l.n)+'</h3>'+
    '<p class="cuba-frase">'+l.frase.map(function(f){ return '«'+esc(f)+'»'; }).join('<br>')+'</p><p class="nota">Texto de la fuente 5 '+refs([5])+'</p>'+
    '<p><b>Orishas que hablan en esta letra:</b> '+l.orishas.map(esc).join(', ')+' <span class="nota">(fuente 4 '+refs([4])+')</span></p>'+
    '<p class="lec-q">Para pensar: '+esc(l.q)+'</p><p class="lec-nota">La pregunta es de Ánima, no de la tradición. La lectura real la hace un santero, que la interpreta en conjunto con todo el odun, con su ire u osogbo y con la persona que consulta.</p></div>';
}

function render(root){
  root.innerHTML = html();
  pintarOrishas('');
  var q = root.querySelector('#cuba-q'); q.addEventListener('input', function(){ pintarOrishas(q.value); });
  root.querySelector('#cuba-tabla').innerHTML = CUBA.ORISHAS.filter(function(o){ return o.palo; }).map(function(o){ return '<tr><td>'+esc(o.n)+'</td><td>'+esc(o.santo)+'</td><td>'+esc(o.palo)+'</td></tr>'; }).join('');
  root.querySelector('#cuba-meji').innerHTML = CUBA.MEJI.map(function(m, i){
    return '<div class="vidrio tile cuba-card"><h3>'+(i+1)+'. '+esc(m.n)+(m.alt ? ' <span class="nota">('+esc(m.alt)+')</span>' : '')+'</h3><p class="nota">'+esc(m.ep)+'</p><p>Se asocia con '+esc(m.tema)+'.</p></div>';
  }).join('');
  root.querySelector('#cuba-mpungos').innerHTML = CUBA.MPUNGOS.map(function(m){
    return '<div class="vidrio tile cuba-card"><h3>'+esc(m.n)+'</h3><dl><dt>Equivale al orisha</dt><dd>'+esc(m.ori)+'</dd>'+(m.santo ? '<dt>Santo católico</dt><dd>'+esc(m.santo)+'</dd>' : '')+'</dl>'+(m.nota ? '<p class="nota">'+esc(m.nota)+'</p>' : '')+'</div>';
  }).join('');
  root.querySelector('#cuba-flist').innerHTML = CUBA.FUENTES.slice(1).map(function(f){ return '<li><a href="'+esc(f.u)+'" target="_blank" rel="noopener noreferrer">'+esc(f.t)+'</a></li>'; }).join('');
  var box = root.querySelector('#cuba-letras'), det = root.querySelector('#cuba-letra');
  box.innerHTML = CUBA.LETRAS.map(function(l){ return '<button class="chip" type="button" data-n="'+l.num+'" aria-pressed="false">'+l.num+' · '+esc(l.n)+'</button>'; }).join('');
  function ver(n){ var l = CUBA.LETRAS.filter(function(x){ return x.num === n; })[0]; det.innerHTML = l ? letraHTML(l) : ''; Array.prototype.forEach.call(box.children, function(b){ b.setAttribute('aria-pressed', +b.dataset.n === n); }); }
  box.addEventListener('click', function(e){ var b = e.target.closest('[data-n]'); if(b) ver(+b.dataset.n); });
  ver(1);
  root.querySelector('#cuba-tirar').addEventListener('click', function(){
    var abiertos = 0, c = '';
    for(var i = 0; i < 16; i++){ var a = azar(); abiertos += a; c += '<i class="'+(a ? 'abierto' : 'cerrado')+'" aria-hidden="true"></i>'; }
    root.querySelector('#cuba-conchas').innerHTML = c + '<p class="nota">'+abiertos+' caracoles abiertos de 16.</p>';
    var res = root.querySelector('#cuba-res');
    if(abiertos === 0){ res.innerHTML = '<p class="nota">Ningún caracol cayó abierto. En esta simulación no hay letra para ese resultado: vuelve a tirar.</p>'; return; }
    var l = CUBA.LETRAS.filter(function(x){ return x.num === abiertos; })[0]; res.innerHTML = letraHTML(l);
  });
}
raiz.CubaApp = {render: render};
})(typeof window !== 'undefined' ? window : globalThis);
