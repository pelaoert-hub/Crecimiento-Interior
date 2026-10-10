/* I Ching: tirada con tres monedas (metodo clasico). La tabla hexagrama <-> trigramas se comprobo en Wikipedia
   (Hexagram (I Ching)); los nombres siguen la traduccion clasica de Wilhelm. Las glosas son resumenes generales de Anima,
   no el texto clasico. Funciona en navegador y en node. */
(function(raiz){
'use strict';

/* filas = trigrama inferior, columnas = trigrama superior; orden: cielo, lago, fuego, trueno, viento, agua, montana, tierra */
var TABLA = [
 [1,43,14,34,9,5,26,11],[10,58,38,54,61,60,41,19],[13,49,30,55,37,63,22,36],[25,17,21,51,42,3,27,24],
 [44,28,50,32,57,48,18,46],[6,47,64,40,59,29,4,7],[33,31,56,62,53,39,52,15],[12,45,35,16,20,8,23,2]
];
var TRIGRAMAS = [[1,1,1],[1,1,0],[1,0,1],[1,0,0],[0,1,1],[0,1,0],[0,0,1],[0,0,0]]; /* lineas de abajo a arriba; 1 = continua */
var NOMBRE_TRIGRAMA = ['Cielo','Lago','Fuego','Trueno','Viento','Agua','Montaña','Tierra'];

var H = [null,
 ['Lo Creativo','fuerza, iniciativa y energía que da origen a las cosas'],
 ['Lo Receptivo','acoger, ceder y sostener; dar espacio a lo que crece'],
 ['La Dificultad Inicial','los comienzos son torpes y piden paciencia y orden'],
 ['La Necedad Juvenil','la inexperiencia; aprender con humildad y preguntando'],
 ['La Espera','aguardar con confianza el momento adecuado'],
 ['El Conflicto','desacuerdo; buscar un acuerdo antes que imponerse'],
 ['El Ejército','disciplina y organización ante un esfuerzo común'],
 ['La Solidaridad','unirse y elegir bien con quién caminar'],
 ['El Poder Domesticador de lo Pequeño','avanzar con pequeñas acciones constantes'],
 ['La Marcha','caminar con cuidado y buena conducta ante lo difícil'],
 ['La Paz','armonía entre arriba y abajo; tiempo de florecer'],
 ['El Estancamiento','falta de comunicación; resistir sin forzar'],
 ['Comunidad con los Hombres','afinidad y trabajo con otros por un fin común'],
 ['La Posesión de lo Grande','abundancia que pide generosidad y claridad'],
 ['La Modestia','humildad que equilibra y atrae respeto'],
 ['El Entusiasmo','ilusión que moviliza; cuidar que no se vuelva exceso'],
 ['El Seguimiento','adaptarse y seguir lo que merece ser seguido'],
 ['El Trabajo en lo Echado a Perder','reparar lo deteriorado y hacerse cargo de lo heredado'],
 ['El Acercamiento','acercarse con atención; crecimiento que llega'],
 ['La Contemplación','observar con atención antes de actuar; dar ejemplo'],
 ['El Morder a Través','atravesar un obstáculo con decisión y justicia'],
 ['La Gracia','belleza y forma; no confundir apariencia con fondo'],
 ['La Desintegración','algo que se desmorona; no es momento de avanzar'],
 ['El Retorno','regreso de la luz; un nuevo comienzo tras un ciclo'],
 ['La Inocencia','actuar con naturalidad y sin cálculo'],
 ['El Poder Domesticador de lo Grande','acumular fuerza y saber; contención'],
 ['Las Comisuras de la Boca','nutrición; cuidar lo que se consume y lo que se dice'],
 ['La Preponderancia de lo Grande','carga excesiva sobre una base frágil; actuar con cautela'],
 ['Lo Abismal','peligro repetido; mantener la firmeza interior'],
 ['Lo Adherente','claridad; la luz depende de aquello a lo que se sostiene'],
 ['La Influencia','atracción y sensibilidad mutua; abrirse al otro'],
 ['La Duración','constancia; un compromiso sostenido en el tiempo'],
 ['La Retirada','retirarse a tiempo, sin huir, para conservar fuerzas'],
 ['El Poder de lo Grande','fuerza que pide rectitud para no volverse brusquedad'],
 ['El Progreso','avance y reconocimiento; la luz sale'],
 ['El Oscurecimiento de la Luz','tiempos adversos; proteger la luz interior'],
 ['El Clan','la familia y el hogar; cada quien en su lugar'],
 ['La Oposición','diferencias; buscar lo común en lo distinto'],
 ['El Obstáculo','una dificultad que invita a detenerse, mirar adentro y pedir ayuda'],
 ['La Liberación','alivio tras la tensión; resolver y dejar atrás'],
 ['La Merma','simplificar y dar con sencillez; reducir lo superfluo'],
 ['El Aumento','crecimiento y ayuda mutua; aprovechar el impulso favorable'],
 ['El Desbordamiento','resolución firme dicha con claridad, sin violencia'],
 ['El Venir al Encuentro','un encuentro inesperado; cuidado con influencias que se imponen'],
 ['La Reunión','congregarse en torno a un propósito'],
 ['El Empuje hacia Arriba','ascender paso a paso con esfuerzo constante'],
 ['La Opresión','agotamiento y límites; sostener la integridad'],
 ['El Pozo','lo esencial y compartido; cuidar la fuente'],
 ['La Revolución','cambio profundo en el momento justo y con convicción'],
 ['El Caldero','transformación y nutrición; algo valioso que se cocina'],
 ['Lo Suscitativo','sacudida que despierta; mantener la calma'],
 ['El Aquietamiento','detenerse y calmar la mente; saber cuándo parar'],
 ['El Desarrollo','avance gradual y estable'],
 ['La Muchacha que Se Casa','vínculos con dependencia; prudencia en las relaciones'],
 ['La Plenitud','apogeo; disfrutarlo sabiendo que todo ciclo cambia'],
 ['El Andariego','el viaje y sentirse extranjero; prudencia y discreción'],
 ['Lo Suave','influencia gradual y persistente, como el viento'],
 ['Lo Sereno','alegría compartida, conversación y apertura'],
 ['La Disolución','disolver la rigidez y los rencores; reunir lo disperso'],
 ['La Limitación','poner límites sanos y medida'],
 ['La Verdad Interior','sinceridad y confianza que se transmiten'],
 ['La Preponderancia de lo Pequeño','atender lo pequeño; humildad, sin pretender demasiado'],
 ['Después de la Consumación','un logro alcanzado; cuidado para no relajarse'],
 ['Antes de la Consumación','un proceso casi concluido; precisión en el último tramo']
];

function indiceTrigrama(l){
  for(var i = 0; i < 8; i++){ var t = TRIGRAMAS[i]; if(t[0] === l[0] && t[1] === l[1] && t[2] === l[2]) return i; }
  return -1;
}
/* lineas: 6 valores 0/1 de abajo a arriba */
function numeroDe(lineas){ return TABLA[indiceTrigrama(lineas.slice(0,3))][indiceTrigrama(lineas.slice(3,6))]; }
function hex(lineas){
  var n = numeroDe(lineas);
  return {numero: n, nombre: H[n][0], glosa: H[n][1], lineas: lineas, inferior: NOMBRE_TRIGRAMA[indiceTrigrama(lineas.slice(0,3))], superior: NOMBRE_TRIGRAMA[indiceTrigrama(lineas.slice(3,6))]};
}
function azar(){ var a = new Uint8Array(1); if(raiz.crypto && raiz.crypto.getRandomValues){ raiz.crypto.getRandomValues(a); return a[0] & 1; } return Math.random() < .5 ? 1 : 0; }
/* una linea = tres monedas (cara=3, cruz=2): 6 yin movil, 7 yang, 8 yin, 9 yang movil */
function lanzarLinea(){ return (azar() ? 3 : 2) + (azar() ? 3 : 2) + (azar() ? 3 : 2); }
function tirar(valores){
  var v = valores || [0,1,2,3,4,5].map(lanzarLinea);
  var prim = v.map(function(x){ return (x === 7 || x === 9) ? 1 : 0; });
  var moviles = v.map(function(x, i){ return (x === 6 || x === 9) ? i + 1 : 0; }).filter(Boolean);
  var res = {valores: v, primero: hex(prim), moviles: moviles, segundo: null};
  if(moviles.length) res.segundo = hex(v.map(function(x){ return x === 6 ? 1 : (x === 9 ? 0 : (x === 7 ? 1 : 0)); }));
  return res;
}
raiz.IChing = {tirar: tirar, hex: hex, H: H, TABLA: TABLA, numeroDe: numeroDe};

/* ---------- interfaz (solo si existe en la pagina) ---------- */
if(typeof document === 'undefined' || !document.getElementById('ic-lanzar')) return;
var $ = function(id){ return document.getElementById(id); };
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function dibujo(h, valores){
  var s = '<div class="hx" role="img" aria-label="Hexagrama '+h.numero+': '+esc(h.nombre)+'">';
  for(var i = 5; i >= 0; i--){
    var yang = h.lineas[i] === 1, mov = valores && (valores[i] === 6 || valores[i] === 9);
    s += '<div class="hx-l '+(yang ? 'yang' : 'yin')+(mov ? ' mov' : '')+'"><i></i>'+(yang ? '' : '<i></i>')+(mov ? '<b aria-hidden="true">'+(yang ? '○' : '✕')+'</b>' : '')+'</div>';
  }
  return s + '</div>';
}
function ficha(h, titulo, valores){
  return '<div class="vidrio tile ic-ficha"><span class="etq">'+esc(titulo)+'</span>'+dibujo(h, valores)+
    '<h3>'+h.numero+'. '+esc(h.nombre)+'</h3><p class="nota">'+esc(h.superior)+' sobre '+esc(h.inferior)+'</p><p>Se asocia con '+esc(h.glosa)+'.</p></div>';
}
$('ic-lanzar').addEventListener('click', function(){
  var t = tirar(), q = $('ic-pregunta').value.trim();
  var html = (q ? '<p class="ic-q">Tu pregunta: «'+esc(q)+'»</p>' : '') + '<div class="ic-par">' + ficha(t.primero, 'Hexagrama de la situación', t.valores) + (t.segundo ? ficha(t.segundo, 'Hacia donde tiende', null) : '') + '</div>';
  html += t.moviles.length ? '<p class="nota">Líneas móviles (cuentan de abajo a arriba): '+t.moviles.join(', ')+'. Las líneas con ○ o ✕ cambian y dan lugar al segundo hexagrama.</p>' : '<p class="nota">No salió ninguna línea móvil, así que se lee un solo hexagrama.</p>';
  html += '<p class="lec-nota">Es un resumen general del tema de cada hexagrama. Para leer los textos clásicos, la imagen y los comentarios de cada línea, hace falta una traducción completa del I Ching. El resultado sale de lanzar monedas y no depende de tu fecha de nacimiento ni anuncia nada.</p>';
  $('ic-resultado').innerHTML = html; $('ic-resultado').hidden = false;
});
})(typeof window !== 'undefined' ? window : globalThis);
