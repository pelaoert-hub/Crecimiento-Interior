/* lecturas: motor de calculo + textos. Sin dependencias; funciona en el navegador y en node.
   Todo es una mirada SIMBOLICA basada en tradiciones; no es prediccion. */
(function(raiz){
'use strict';

/* ---------- temas comunes para cruzar tradiciones ---------- */
var TEMAS = ['Iniciativa','Sensibilidad','Estabilidad','Cambio','Comunicación','Servicio','Introspección','Creatividad'];

/* ---------- astronomia basica (Meeus) ---------- */
function rad(x){ return x * Math.PI / 180; }
function n360(x){ x = x % 360; return x < 0 ? x + 360 : x; }
function T_de(ts){ return ((ts / 86400000 + 2440587.5) - 2451545) / 36525; }
function lonSol(ts){
  var T = T_de(ts), L0 = 280.46646 + 36000.76983*T + 0.0003032*T*T, M = 357.52911 + 35999.05029*T - 0.0001537*T*T;
  var C = (1.914602 - 0.004817*T - 0.000014*T*T)*Math.sin(rad(M)) + (0.019993 - 0.000101*T)*Math.sin(rad(2*M)) + 0.000289*Math.sin(rad(3*M));
  return n360(L0 + C - 0.00569 - 0.00478*Math.sin(rad(125.04 - 1934.136*T)));
}
/* terminos principales de la longitud lunar: [D, M, M', F, coeficiente en 1e-6 grados] */
var TL = [[0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],[0,1,0,0,-185116],[0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],[2,0,1,0,53322],[2,-1,0,0,45758],[0,1,-1,0,-40923],[1,0,0,0,-34720],[0,1,1,0,-30383],[2,0,0,-2,15327],[0,0,1,2,-12528],[0,0,1,-2,10980],[4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],[2,1,-1,0,-7888],[2,1,0,0,-6766],[1,0,-1,0,-5163],[1,1,0,0,4987],[2,-1,1,0,4036],[2,0,2,0,3994],[4,0,0,0,3861],[2,0,-3,0,3665],[0,1,-2,0,-2689],[2,0,-1,2,-2602],[2,-1,-2,0,2390],[1,0,1,0,-2348],[2,-2,0,0,2236],[0,1,2,0,-2120],[0,2,0,0,-2069],[2,-2,-1,0,2048],[2,0,1,-2,-1773],[2,0,0,2,-1595],[4,-1,-1,0,1215],[0,0,2,2,-1110],[3,0,-1,0,-892],[2,1,1,0,-810],[4,-1,-2,0,759],[0,2,-1,0,-713],[2,2,-1,0,-700],[2,1,-2,0,691],[2,-1,0,-2,596],[4,0,1,0,549],[0,0,4,0,537],[4,-1,0,0,520],[1,0,-2,0,-487],[2,1,0,-2,-399],[0,0,2,-2,-381],[1,1,1,0,351],[3,0,-2,0,-340],[4,0,-3,0,330],[2,-1,2,0,327],[0,2,1,0,-323],[1,1,-1,0,299],[2,0,3,0,294]];
function lonLuna(ts){
  var T = T_de(ts), T2 = T*T, T3 = T2*T, T4 = T3*T;
  var Lp = n360(218.3164477 + 481267.88123421*T - 0.0015786*T2 + T3/538841 - T4/65194000);
  var D = n360(297.8501921 + 445267.1114034*T - 0.0018819*T2 + T3/545868 - T4/113065000);
  var M = n360(357.5291092 + 35999.0502909*T - 0.0001536*T2 + T3/24490000);
  var Mp = n360(134.9633964 + 477198.8675055*T + 0.0087414*T2 + T3/69699 - T4/14712000);
  var F = n360(93.2720950 + 483202.0175233*T - 0.0036539*T2 - T3/3526000 + T4/863310000);
  var A1 = n360(119.75 + 131.849*T), A2 = n360(53.09 + 479264.290*T), E = 1 - 0.002516*T - 0.0000074*T2, s = 0;
  TL.forEach(function(t){ var e = Math.abs(t[1]) === 1 ? E : (Math.abs(t[1]) === 2 ? E*E : 1); s += t[4]*e*Math.sin(rad(t[0]*D + t[1]*M + t[2]*Mp + t[3]*F)); });
  s += 3958*Math.sin(rad(A1)) + 1962*Math.sin(rad(Lp - F)) + 318*Math.sin(rad(A2));
  return n360(Lp + s/1e6);
}
function elong(ts){ return n360(lonLuna(ts) - lonSol(ts)); }           /* 0 = luna nueva, 180 = llena */
function ang180(x){ x = n360(x); return x > 180 ? x - 360 : x; }
/* siguiente luna nueva (obj 0) o llena (obj 180) a partir de ts */
function proximaFase(ts, obj){
  var h = 6*3600000, a = ts, fa = ang180(elong(a) - obj);
  for(var i = 0; i < 140; i++){
    var b = a + h, fb = ang180(elong(b) - obj);
    if(fa < 0 && fb >= 0 && Math.abs(fb) < 90){
      var lo = a, hi = b; for(var k = 0; k < 30; k++){ var m = (lo+hi)/2; if(ang180(elong(m) - obj) < 0) lo = m; else hi = m; }
      return (lo+hi)/2;
    }
    a = b; fa = fb;
  }
  return null;
}
function fasePorcentaje(ts){ return (1 - Math.cos(rad(elong(ts)))) / 2; }
function nombreFase(ts){
  var p = elong(ts) / 360;
  if(p < .03 || p > .97) return 'luna nueva'; if(p < .22) return 'luna creciente'; if(p < .28) return 'cuarto creciente'; if(p < .47) return 'gibosa creciente';
  if(p < .53) return 'luna llena'; if(p < .72) return 'gibosa menguante'; if(p < .78) return 'cuarto menguante'; return 'luna menguante';
}
/* hora local -> instante UTC (usa las reglas historicas de la zona horaria del navegador) */
function offsetMin(ts, tz){
  var f = new Intl.DateTimeFormat('en-US', {timeZone: tz, hourCycle: 'h23', year:'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric', second:'numeric'}), p = {};
  f.formatToParts(new Date(ts)).forEach(function(x){ p[x.type] = +x.value; });
  return (Date.UTC(p.year, p.month-1, p.day, p.hour, p.minute, p.second) - Math.floor(ts/1000)*1000) / 60000;
}
function utcDeLocal(y, mo, d, h, mi, tz){
  var base = Date.UTC(y, mo-1, d, h, mi), g = base;
  for(var i = 0; i < 3; i++) g = base - offsetMin(g, tz)*60000;
  return g;
}
/* ano nuevo chino: el mes 11 es el que contiene el solsticio de invierno; el ano nuevo es dos lunas nuevas despues.
   Las fechas se toman en China (UTC+8). No contempla los meses intercalares raros. */
function solsticioInvierno(anio){
  var lo = Date.UTC(anio, 11, 19), hi = Date.UTC(anio, 11, 24);
  for(var k = 0; k < 40; k++){ var m = (lo + hi) / 2; if(ang180(lonSol(m) - 270) < 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
function diaChina(ts){ return Math.floor((ts + 8*3600000) / 86400000); }
function anoNuevoChino(anio){
  var sol = solsticioInvierno(anio - 1), n = proximaFase(sol - 35*86400000, 0), sig;
  while((sig = proximaFase(n + 20*86400000, 0)) && diaChina(sig) <= diaChina(sol)) n = sig;
  var n12 = proximaFase(n + 20*86400000, 0), n1 = proximaFase(n12 + 20*86400000, 0), d = new Date(n1 + 8*3600000);
  return {mes: d.getUTCMonth()+1, dia: d.getUTCDate()};
}

/* ---------- numerologia pitagorica ---------- */
var MAESTROS = [11,22,33];
function sumaDig(n){ return String(n).split('').reduce(function(a,c){ return a + (+c); }, 0); }
function red(n){ while(n > 9 && MAESTROS.indexOf(n) < 0) n = sumaDig(n); return n; }
function red9(n){ while(n > 9) n = sumaDig(n); return n; }
var VAL = {}; 'AJS'.split('').forEach(function(c){VAL[c]=1}); 'BKT'.split('').forEach(function(c){VAL[c]=2}); 'CLU'.split('').forEach(function(c){VAL[c]=3}); 'DMV'.split('').forEach(function(c){VAL[c]=4});
'ENW'.split('').forEach(function(c){VAL[c]=5}); 'FOX'.split('').forEach(function(c){VAL[c]=6}); 'GPY'.split('').forEach(function(c){VAL[c]=7}); 'HQZ'.split('').forEach(function(c){VAL[c]=8}); 'IR'.split('').forEach(function(c){VAL[c]=9});
function limpiar(s){ return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-Z]/g,''); }
function sumaNombre(s, filtro){ return limpiar(s).split('').filter(filtro).reduce(function(a,c){ return a + VAL[c]; }, 0); }
function esVocal(c){ return 'AEIOU'.indexOf(c) >= 0; }
function caminoDeVida(y, m, d){ return red(red(m) + red(d) + red(y)); }

/* ---------- tarot (arcanos mayores, numeracion Rider-Waite) ---------- */
function arcanosDe(suma){ var s = suma; while(s > 22) s = sumaDig(s); var l = [s]; while(s > 9){ s = sumaDig(s); l.push(s); } return l; }
function idxArcano(n){ return n === 22 ? 0 : n; }

/* ---------- textos ---------- */
var SIGNOS = [
 ['Aries','♈','Fuego','Cardinal','el impulso de empezar, la franqueza y el coraje. Su reto clásico es la paciencia.','Emociones rápidas y directas; se calma moviéndose y actuando.',['Iniciativa'],'¿Qué quiero empezar sin esperar a que todo esté listo?'],
 ['Tauro','♉','Tierra','Fijo','la constancia, el gusto por lo sencillo y lo concreto, la lealtad. Su reto es la rigidez ante el cambio.','Se tranquiliza con rutina, comida, naturaleza y cercanía física.',['Estabilidad'],'¿Qué cosa sencilla me da paz y casi no le dedico tiempo?'],
 ['Géminis','♊','Aire','Mutable','la curiosidad, la palabra ágil y la mente inquieta. Su reto es profundizar en lo que empieza.','Procesa lo que siente hablándolo o escribiéndolo.',['Comunicación'],'¿Qué tengo guardado que me haría bien decir o escribir?'],
 ['Cáncer','♋','Agua','Cardinal','el cuidado, la memoria afectiva y la protección del hogar. Su reto es no encerrarse en la sensibilidad.','Emociones profundas ligadas a la familia y al recuerdo; necesita sentirse a salvo.',['Sensibilidad'],'¿A quién cuido y quién me cuida a mí?'],
 ['Leo','♌','Fuego','Fijo','la calidez, la generosidad y el deseo de brillar con corazón. Su reto es aceptar que no siempre es el centro.','Necesita sentirse valorado y expresar lo que siente con entusiasmo.',['Creatividad','Iniciativa'],'¿Qué parte de mí quiere expresarse más abiertamente?'],
 ['Virgo','♍','Tierra','Mutable','la atención al detalle, el sentido del servicio y el análisis. Su reto es la autoexigencia.','Se calma ordenando, ayudando y teniendo algo útil que hacer.',['Servicio'],'¿Dónde me exijo más de lo que le exigiría a otra persona?'],
 ['Libra','♎','Aire','Cardinal','la búsqueda de equilibrio, belleza y buena relación con los demás. Su reto es decidirse sin temer al conflicto.','Necesita armonía y compañía para sentirse en paz.',['Comunicación'],'¿Qué decisión estoy aplazando por evitar un desacuerdo?'],
 ['Escorpio','♏','Agua','Fijo','la intensidad, la profundidad y la capacidad de transformarse. Su reto es confiar y soltar el control.','Emociones intensas y reservadas; necesita autenticidad y privacidad.',['Cambio','Introspección'],'¿Qué estoy listo para dejar morir para renovarme?'],
 ['Sagitario','♐','Fuego','Mutable','el optimismo, el amor por la libertad y la búsqueda de sentido. Su reto es la constancia y el tacto.','Se recupera con aire libre, aventura y perspectiva; no soporta sentirse atrapado.',['Cambio'],'¿Qué me da sentido más allá de lo cotidiano?'],
 ['Capricornio','♑','Tierra','Cardinal','la responsabilidad, la disciplina y la visión a largo plazo. Su reto es permitirse descansar y sentir.','Contiene lo que siente y se muestra fuerte; necesita permitirse la ternura.',['Estabilidad'],'¿Cuándo fue la última vez que descansé sin culpa?'],
 ['Acuario','♒','Aire','Fijo','la independencia, la originalidad y el interés por el bien común. Su reto es el vínculo afectivo cercano.','Necesita espacio propio y comprender sus emociones desde la distancia.',['Creatividad','Servicio'],'¿Cómo puedo acercarme más a quienes quiero sin perder mi libertad?'],
 ['Piscis','♓','Agua','Mutable','la imaginación, la empatía y la sensibilidad espiritual. Su reto es poner límites y anclarse.','Absorbe el ambiente emocional; necesita silencio, arte o agua para recargarse.',['Sensibilidad','Creatividad'],'¿Qué límite me cuesta poner y me estaría haciendo bien?']
];
var ANIMALES = [
 ['Rata','ingenio, adaptabilidad y sentido práctico',['Comunicación']],['Buey','constancia, paciencia y trabajo firme',['Estabilidad']],['Tigre','valentía, energía y espíritu independiente',['Iniciativa']],
 ['Conejo','diplomacia, sensibilidad estética y calma',['Sensibilidad']],['Dragón','carisma, ambición y vitalidad',['Iniciativa','Creatividad']],['Serpiente','intuición, reserva y mirada profunda',['Introspección']],
 ['Caballo','libertad, entusiasmo y movimiento',['Cambio']],['Cabra','creatividad, ternura y gusto por la armonía',['Creatividad','Sensibilidad']],['Mono','ingenio, curiosidad y versatilidad',['Creatividad','Comunicación']],
 ['Gallo','orden, franqueza y esmero',['Servicio','Estabilidad']],['Perro','lealtad, justicia y protección',['Servicio']],['Cerdo','generosidad, sencillez y disfrute',['Sensibilidad','Servicio']]
];
var ELEMENTOS_CH = {madera:['Madera','crecimiento y flexibilidad'],fuego:['Fuego','pasión y dinamismo'],tierra:['Tierra','estabilidad y cuidado'],metal:['Metal','rigor y determinación'],agua:['Agua','adaptación e intuición']};
function elementoChino(anio){ var u = anio % 10; return u<2?'metal':u<4?'agua':u<6?'madera':u<8?'fuego':'tierra'; }
var NUM = {
 1:['Iniciativa y autonomía','empezar cosas, valerse por sí mismo y marcar camino',['Iniciativa']],
 2:['Cooperación y sensibilidad','colaborar, escuchar y buscar el equilibrio con los demás',['Sensibilidad']],
 3:['Expresión y creatividad','comunicar, crear y disfrutar de lo que se hace',['Creatividad','Comunicación']],
 4:['Orden y bases firmes','construir con esfuerzo, método y constancia',['Estabilidad']],
 5:['Cambio y libertad','moverse, probar y adaptarse a lo nuevo',['Cambio']],
 6:['Cuidado y responsabilidad','atender a la familia y a la comunidad, y buscar armonía en el hogar',['Servicio']],
 7:['Búsqueda interior','analizar, estudiar y buscar silencio para entender',['Introspección']],
 8:['Logro y manejo de recursos','organizar, conseguir resultados y administrar con equilibrio',['Iniciativa','Estabilidad']],
 9:['Cierre y compasión','terminar ciclos, soltar y mirar con visión amplia',['Servicio']],
 11:['Intuición e inspiración (número maestro)','sensibilidad aguda e intuición; pide cuidarse de la tensión nerviosa',['Sensibilidad','Introspección']],
 22:['Construir en grande (número maestro)','llevar una visión a lo concreto; pide no cargar con demasiado',['Estabilidad','Creatividad']],
 33:['Servicio a gran escala (número maestro)','cuidado y entrega por los demás; pide no olvidarse de uno mismo',['Servicio']]
};
var CONTEXTO_NUM = {
 camino:'Camino de vida, el aprendizaje de fondo que esta tradición asigna a tu fecha',
 expresion:'Expresión, cómo tiendes a mostrar tus talentos',
 alma:'Impulso del alma, lo que tu interior suele desear',
 personalidad:'Personalidad, lo que otros suelen percibir de ti',
 dia:'Día de nacimiento, un talento natural'
};
var ARCANOS = [
 ['El Loco','comienzo, confianza y salto con inocencia',['Cambio','Iniciativa'],'¿Qué comienzo estoy aplazando por miedo?'],
 ['El Mago','voluntad, recursos a mano y acción consciente',['Iniciativa'],'¿Qué tengo ya a mano y no estoy usando?'],
 ['La Sacerdotisa','intuición, silencio y saber interior',['Introspección'],'¿Qué sé en el fondo y no me atrevo a admitir?'],
 ['La Emperatriz','fertilidad, creatividad y cuidado',['Creatividad','Sensibilidad'],'¿Qué quiero hacer crecer?'],
 ['El Emperador','estructura, autoridad y protección',['Estabilidad'],'¿Qué límite o estructura me falta?'],
 ['El Hierofante','tradición, enseñanza y valores compartidos',['Servicio','Estabilidad'],'¿Qué valor quiero transmitir con el ejemplo?'],
 ['Los Enamorados','elección, vínculo y coherencia con los valores',['Sensibilidad'],'¿Qué elección me pide ser fiel a lo que valoro?'],
 ['El Carro','determinación, rumbo y dominio de fuerzas opuestas',['Iniciativa'],'¿Hacia dónde quiero ir de verdad?'],
 ['La Fuerza','fortaleza amable, paciencia y dominio de los impulsos',['Sensibilidad'],'¿Dónde me serviría más la ternura que la fuerza?'],
 ['El Ermitaño','búsqueda interior, prudencia y guía',['Introspección'],'¿Qué necesito comprender a solas?'],
 ['La Rueda de la Fortuna','ciclos y cambios que no controlamos',['Cambio'],'¿Qué estoy aprendiendo de este ciclo?'],
 ['La Justicia','equilibrio, verdad y consecuencia de los actos',['Estabilidad','Servicio'],'¿Estoy siendo justo conmigo y con los demás?'],
 ['El Colgado','pausa, otra perspectiva y entrega',['Introspección'],'¿Qué veo distinto si me detengo?'],
 ['La Muerte','final de una etapa y renovación; no habla de muerte física',['Cambio'],'¿Qué etapa está terminando y qué me toca soltar?'],
 ['La Templanza','moderación, armonía y paciencia',['Estabilidad'],'¿Qué necesito mezclar con más calma?'],
 ['El Diablo','ataduras, deseos y lo que nos domina',['Introspección'],'¿Qué hábito o apego me cuesta soltar?'],
 ['La Torre','ruptura de lo falso y sacudida liberadora',['Cambio'],'¿Qué construcción mía no se sostenía?'],
 ['La Estrella','esperanza, renovación y confianza serena',['Sensibilidad'],'¿Qué me devuelve la esperanza?'],
 ['La Luna','sueños, intuiciones y miedos difusos',['Introspección'],'¿Qué miedo se vuelve más pequeño si lo miro de frente?'],
 ['El Sol','claridad, alegría y vitalidad',['Creatividad'],'¿Qué me hace sentir vivo y sencillo?'],
 ['El Juicio','llamado, balance y renacer',['Cambio'],'¿A qué me siento llamado ahora?'],
 ['El Mundo','plenitud, culminación e integración',['Estabilidad'],'¿Qué he completado y puedo celebrar?']
];
var SEFIROT = [null,
 ['Keter','la corona: el origen y la voluntad pura',['Iniciativa']],['Jojmá','la sabiduría: la chispa creativa y la intuición',['Creatividad']],['Biná','el entendimiento: dar forma y discernir',['Introspección']],
 ['Jésed','la bondad: la generosidad sin condiciones',['Servicio']],['Guevurá','el rigor: los límites y la fuerza',['Estabilidad']],['Tiféret','la belleza: la armonía y el equilibrio',['Sensibilidad']],
 ['Nétzaj','la perseverancia: seguir adelante',['Iniciativa']],['Hod','el esplendor: la humildad y la palabra',['Comunicación']],['Yesod','el fundamento: la conexión entre lo de arriba y lo de abajo',['Sensibilidad','Comunicación']]
];
var DIAS = [['domingo','el Sol','vitalidad e identidad',['Creatividad']],['lunes','la Luna','emociones y hogar',['Sensibilidad']],['martes','Marte','energía y acción',['Iniciativa']],['miércoles','Mercurio','comunicación y estudio',['Comunicación']],['jueves','Júpiter','crecimiento y generosidad',['Servicio']],['viernes','Venus','afecto y armonía',['Sensibilidad']],['sábado','Saturno','orden y paciencia',['Estabilidad']]];
var PALMA = {
 corazon:{curva:['Línea del corazón curva','suele leerse como expresar lo que se siente con apertura',['Sensibilidad']],recta:['Línea del corazón recta','suele leerse como reserva al mostrar el afecto y un enfoque más racional en los vínculos',['Estabilidad']]},
 cabeza:{recta:['Línea de la cabeza recta','suele leerse como pensamiento práctico y ordenado',['Estabilidad']],curva:['Línea de la cabeza curva','suele leerse como imaginación, intuición y creatividad',['Creatividad']]},
 vida:{amplia:['Línea de la vida amplia y curva','suele leerse como vitalidad y apertura a la experiencia',['Iniciativa']],cerrada:['Línea de la vida pegada al pulgar','suele leerse como tendencia a cuidar la energía y a la cautela',['Introspección']]}
};


/* ---------- arboles celtas (calendario MODERNO de Robert Graves, 1948; fechas segun Learn Religions) ---------- */
var ARBOLES = [
 ['Abedul','Beth',12,24,1,20,'renacimiento y regeneración, un impulso extra para empezar cosas nuevas; se asocia con la creatividad, la fertilidad, la curación y la protección',['Cambio','Iniciativa']],
 ['Serbal','Luis',1,21,2,17,'la diosa Brighid, protectora del hogar, y con el poder personal y el éxito; se usaba como protección',['Iniciativa','Estabilidad']],
 ['Fresno','Nion',2,18,3,17,'rituales del océano, la potencia mágica, los sueños proféticos y los viajes espirituales',['Introspección']],
 ['Aliso','Fearn',3,18,4,14,'las decisiones espirituales, la profecía, la adivinación y el contacto con la propia intuición',['Introspección']],
 ['Sauce','Saille',4,15,5,12,'la curación y el crecimiento; el nutrir, el conocimiento que crece y los misterios femeninos',['Sensibilidad']],
 ['Espino blanco','Huath',5,13,6,9,'la fertilidad, la energía masculina y el fuego; las decisiones de negocios y los contactos profesionales',['Iniciativa']],
 ['Roble','Duir',6,10,7,7,'la protección, la fuerza, la fertilidad, el éxito y la buena fortuna',['Estabilidad']],
 ['Acebo','Tinne',7,8,8,4,'la firmeza; se usaba en armas y en magia protectora, y una ramita en casa se asocia con la suerte y la seguridad',['Estabilidad']],
 ['Avellano','Coll',8,5,9,1,'la sabiduría y la protección; los pozos sagrados y el salmón del conocimiento, la adivinación, los sueños y la inspiración creativa',['Creatividad','Introspección']],
 ['Vid','Muin',9,2,9,29,'la felicidad y también la ira, emociones apasionadas; la alegría, la exaltación y el equilibrio del equinoccio de otoño',['Sensibilidad']],
 ['Hiedra','Gort',9,30,10,27,'la vida que continúa tras la muerte, el ciclo de vida, muerte y renacimiento; alejar lo negativo, mejorarse, proteger y cooperar',['Cambio']],
 ['Caña','Negetal',10,28,11,23,'los muertos y el inframundo; la adivinación, la meditación y honrar el ciclo de la vida y el renacimiento',['Introspección']],
 ['Saúco','Ruish',11,24,12,23,'los finales y los comienzos, la recuperación rápida; la creatividad, la renovación y la protección',['Cambio','Creatividad']]
];
function arbolDe(m, d){
  var v = m * 100 + d;
  for(var i = 0; i < ARBOLES.length; i++){
    var a = ARBOLES[i], ini = a[2]*100 + a[3], fin = a[4]*100 + a[5];
    if(ini <= fin ? (v >= ini && v <= fin) : (v >= ini || v <= fin)) return a;
  }
  return null;
}
function cartaArbol(a, etiqueta){
  var MESES = ['','enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var c = carta('Árboles celtas (calendario moderno)', '❦', [{k: etiqueta + ': ' + a[0] + ' (' + a[1] + ')', d: 'Del ' + a[3] + ' de ' + MESES[a[2]] + ' al ' + a[5] + ' de ' + MESES[a[4]] + '. Se asocia con ' + a[6] + '.', tags: a[7]}]);
  c.nota = 'Este calendario lo inventó el poeta Robert Graves en su libro The White Goddess (1948). No es un sistema celta antiguo y no se parece a los calendarios celtas documentados. Las fechas varían algo según el autor.';
  return c;
}

/* ---------- utilidades de resultado ---------- */
function signoDeLon(l){ return SIGNOS[Math.floor(n360(l)/30)]; }
function carta(trad, simbolo, items, pregunta){
  var tags = []; items.forEach(function(i){ (i.tags||[]).forEach(function(t){ if(tags.indexOf(t) < 0) tags.push(t); }); });
  return {trad: trad, simbolo: simbolo, items: items, pregunta: pregunta || '', tags: tags};
}
function listaArcano(idxList, prefijo){
  return idxList.map(function(n, i){ var a = ARCANOS[idxArcano(n)]; return {k: (i === 0 ? prefijo : 'Arcano asociado') + ': ' + a[0], d: a[1].charAt(0).toUpperCase() + a[1].slice(1) + '.', tags: a[2]}; });
}

/* ---------- lectura completa ---------- */
/* datos: {nombre, anio, mes, dia, hora (opcional), min, tz, palma:{corazon,cabeza,vida}, ahora (ts opcional)} */
function leer(datos){
  var y = datos.anio, m = datos.mes, d = datos.dia, tz = datos.tz || 'UTC', hayHora = datos.hora != null && datos.hora !== '';
  var ahora = datos.ahora || Date.now(), A = new Date(ahora), nacTs;
  nacTs = utcDeLocal(y, m, d, hayHora ? +datos.hora : 12, hayHora ? (+datos.min||0) : 0, tz);

  /* astrologia occidental */
  var solN = signoDeLon(lonSol(nacTs)), lunaN = signoDeLon(lonLuna(nacTs)), avisos = [];
  if(!hayHora){
    var ini = utcDeLocal(y, m, d, 0, 0, tz), fin = ini + 86400000;
    var s1 = signoDeLon(lonSol(ini)), s2 = signoDeLon(lonSol(fin)), l1 = signoDeLon(lonLuna(ini)), l2 = signoDeLon(lonLuna(fin));
    if(s1[0] !== s2[0]) avisos.push('Naciste el día en que el Sol cambia de signo (' + s1[0] + ' a ' + s2[0] + '). Con la hora exacta se sabría cuál es el tuyo.');
    if(l1[0] !== l2[0]) avisos.push('Ese día la Luna cambió de signo (' + l1[0] + ' a ' + l2[0] + '). Sin la hora de nacimiento no se puede saber cuál es la tuya.');
  }
  var astro = carta('Astrología occidental', solN[1], [
    {k: 'Sol en ' + solN[0] + ' (' + solN[2] + ', ' + solN[3] + ')', d: 'Tradicionalmente se asocia con ' + solN[4], tags: solN[6]},
    {k: 'Luna en ' + lunaN[0], d: lunaN[5], tags: lunaN[6]}
  ].concat(avisos.map(function(a){ return {k: 'Aviso', d: a, tags: []}; })), solN[7]);
  astro.nota = 'Se calcula el Sol y la Luna. El ascendente, las casas y los demás planetas necesitan hora y lugar exactos y tablas astronómicas completas, y aquí no se incluyen.';

  /* astrologia china */
  var cny = anoNuevoChino(y), anioCh = (m < cny.mes || (m === cny.mes && d < cny.dia)) ? y - 1 : y;
  var an = ANIMALES[((anioCh - 4) % 12 + 12) % 12], el = ELEMENTOS_CH[elementoChino(anioCh)];
  var chino = carta('Astrología china', '☯', [{k: an[0] + ' de ' + el[0], d: 'El animal se asocia con ' + an[1] + '; el elemento aporta ' + el[1] + '.', tags: an[2]}], '¿Qué de este animal reconozco en mí y qué no?');
  chino.nota = 'El año chino empieza en el Año Nuevo Chino (entre finales de enero y mediados de febrero). Si naciste en esas fechas, comprueba el tuyo.';

  /* numerologia pitagorica */
  var cam = caminoDeVida(y, m, d), nom = datos.nombre || '', items = [];
  function it(clave, n){ var t = NUM[n]; items.push({k: CONTEXTO_NUM[clave].split(',')[0] + ' ' + n + ': ' + t[0], d: CONTEXTO_NUM[clave].split(',').slice(1).join(',').trim().replace(/^./, function(c){ return c.toUpperCase(); }) + '. Se asocia con ' + t[1] + '.', tags: t[2]}); }
  it('camino', cam);
  if(limpiar(nom).length >= 2){
    it('expresion', red(sumaNombre(nom, function(){ return true; })));
    it('alma', red(sumaNombre(nom, esVocal)) || 9);
    it('personalidad', red(sumaNombre(nom, function(c){ return !esVocal(c); })) || 9);
  }
  it('dia', red(d));
  var numer = carta('Numerología pitagórica', '123', items, '¿Qué parte de este aprendizaje de fondo ya estoy viviendo?');
  numer.nota = 'Método pitagórico: A=1 … I=9, y así en ciclos. La Y se cuenta como consonante. Los números 11, 22 y 33 se conservan.';

  /* cabala */
  var cs = SEFIROT[red9(cam)];
  var cabala = carta('Cábala (lectura inspirada)', '✧', [{k: 'Sefirá ' + cs[0], d: 'Asociada a tu camino de vida, representa ' + cs[1] + '.', tags: cs[2]}], '¿Cómo se expresa esta cualidad en mi vida diaria?');
  cabala.nota = 'Asociar sefirot a los números de una fecha es una adaptación moderna popular. La Cábala tradicional trabaja con textos hebreos y estudio guiado, y aquí solo se muestra un reflejo muy simple.';

  /* tarot */
  var sumaNac = sumaDig(y) + sumaDig(m) + sumaDig(d), lista = arcanosDe(sumaNac);
  var tarot = carta('Tarot (carta de nacimiento)', '✦', listaArcano(lista, 'Tu arcano'), ARCANOS[idxArcano(lista[0])][3]);
  tarot.nota = 'Se usa el método de las cartas de nacimiento de los arcanos mayores (numeración Rider-Waite).';

  /* dia planetario */
  var wd = new Date(Date.UTC(y, m-1, d)).getUTCDay(), dp = DIAS[wd];
  var dia = carta('Día de la semana (planetario)', '☉', [{k: 'Naciste un ' + dp[0], d: 'La tradición lo asocia con ' + dp[1] + ': ' + dp[2] + '.', tags: dp[3]}]);

  var arbolNac = arbolDe(m, d);
  var tarjetasNac = [astro, chino, cartaArbol(arbolNac, 'Naciste en el mes del'), numer, cabala, tarot, dia];

  /* quiromancia */
  var palma = datos.palma || {}, pItems = [];
  ['corazon','cabeza','vida'].forEach(function(l){ var v = PALMA[l][palma[l]]; if(v) pItems.push({k: v[0], d: v[1].charAt(0).toUpperCase() + v[1].slice(1) + '.', tags: v[2]}); });
  if(pItems.length){ var q = carta('Quiromancia', '✋', pItems); q.nota = 'La longitud de la línea de la vida no indica cuánto se vive; esa idea es un mito. Es una lectura de rasgos, no de destino.'; tarjetasNac.push(q); }

  /* ---- hoy / mes / ano ---- */
  var ay = A.getFullYear(), am = A.getMonth()+1, ad = A.getDate();
  var persAnio = red9(d + m + red9(ay)), persMes = red9(persAnio + am), persDia = red9(persMes + ad);
  var luna = signoDeLon(lonLuna(ahora)), sol = signoDeLon(lonSol(ahora)), fase = nombreFase(ahora), pct = Math.round(fasePorcentaje(ahora)*100);
  function numCarta(n, etiqueta, pregunta){ var t = NUM[n]; return carta('Numerología personal', '123', [{k: etiqueta + ' ' + n + ': ' + t[0], d: 'Se asocia con ' + t[1] + '.', tags: t[2]}], pregunta); }
  function sefCarta(n, etiqueta){ var s = SEFIROT[n]; return carta('Cábala (lectura inspirada)', '✧', [{k: etiqueta + ': ' + s[0], d: 'Representa ' + s[1] + '.', tags: s[2]}]); }
  var dpHoy = DIAS[A.getDay()];

  /* hoy */
  var arcHoy = arcanosDe(sumaDig(ad) + sumaDig(am) + sumaDig(ay) + sumaNac)[0];
  var hoy = [
    carta('Astrología occidental', '☾', [
      {k: 'Luna en ' + luna[0] + ', ' + fase + ' (' + pct + ' % iluminada)', d: 'Se asocia con este tono emocional: ' + luna[5].charAt(0).toLowerCase() + luna[5].slice(1), tags: luna[6]},
      {k: 'El Sol está en ' + sol[0], d: 'La temporada solar de ' + sol[0] + ' pone el acento en ' + sol[4].replace(/\. Su reto.*$/, '') + '.', tags: sol[6]}
    ], luna[7]),
    numCarta(persDia, 'Día personal', '¿Cómo puedo vivir esta cualidad en una acción pequeña?'),
    carta('Tarot (carta del día)', '✦', [{k: 'Arcano del día: ' + ARCANOS[idxArcano(arcHoy)][0], d: ARCANOS[idxArcano(arcHoy)][1].charAt(0).toUpperCase() + ARCANOS[idxArcano(arcHoy)][1].slice(1) + '.', tags: ARCANOS[idxArcano(arcHoy)][2]}], ARCANOS[idxArcano(arcHoy)][3]),
    sefCarta(persDia, 'Sefirá del día'),
    carta('Día de la semana (planetario)', '☉', [{k: 'Hoy es ' + dpHoy[0], d: 'Se asocia con ' + dpHoy[1] + ': ' + dpHoy[2] + '.', tags: dpHoy[3]}])
  ];

  /* mes */
  var nm = proximaFase(ahora, 0), fm = proximaFase(ahora, 180), fmt = function(t){ return t ? new Date(t).toLocaleDateString('es', {weekday:'long', day:'numeric', month:'long'}) : '—'; };
  var arcMes = arcanosDe(persMes)[0];
  var relSol = sol[0] === solN[0] ? 'Es tu propio signo solar: la tradición lo llama "temporada de tu signo" y lo asocia con energía renovada.' : (sol[2] === solN[2] ? 'Comparte elemento (' + sol[2] + ') con tu Sol: suele leerse como un mes en sintonía.' : 'Su elemento (' + sol[2] + ') es distinto al de tu Sol (' + solN[2] + '): suele leerse como un mes para aprender de otra forma de hacer las cosas.');
  var mes = [
    carta('Astrología occidental', '☾', [
      {k: 'El Sol transita ' + sol[0], d: relSol, tags: sol[6]},
      {k: 'Próxima luna nueva: ' + fmt(nm), d: 'Tradicionalmente es un momento para plantar intenciones.', tags: ['Iniciativa']},
      {k: 'Próxima luna llena: ' + fmt(fm), d: 'Tradicionalmente es un momento de balance y de soltar.', tags: ['Cambio']}
    ], '¿Qué intención quiero plantar este mes?'),
    numCarta(persMes, 'Mes personal', '¿Qué hábito pequeño le da forma a este mes?'),
    carta('Tarot', '✦', [{k: 'Arcano del mes: ' + ARCANOS[idxArcano(arcMes)][0], d: ARCANOS[idxArcano(arcMes)][1].charAt(0).toUpperCase() + ARCANOS[idxArcano(arcMes)][1].slice(1) + '.', tags: ARCANOS[idxArcano(arcMes)][2]}], ARCANOS[idxArcano(arcMes)][3]),
    sefCarta(persMes, 'Sefirá del mes'),
    cartaArbol(arbolDe(am, ad), 'Mes actual')
  ];

  /* ano */
  var arcAnio = arcanosDe(sumaDig(d) + sumaDig(m) + sumaDig(ay)), cnyH = anoNuevoChino(ay), anioChHoy = (am < cnyH.mes || (am === cnyH.mes && ad < cnyH.dia)) ? ay - 1 : ay;
  var anH = ANIMALES[((anioChHoy - 4) % 12 + 12) % 12], elH = ELEMENTOS_CH[elementoChino(anioChHoy)];
  var relCh = anH[0] === an[0] ? 'Es el año de tu propio animal. Una tradición china lo considera un año de mucha exposición, que invita a cuidarse y a ir con calma.' : 'Es un año distinto al de tu animal (' + an[0] + '); simplemente aporta su propio tono.';
  var ano = [
    numCarta(persAnio, 'Año personal', '¿Qué quiero que este año deje en mí?'),
    carta('Tarot (carta del año)', '✦', listaArcano(arcAnio, 'Arcano del año'), ARCANOS[idxArcano(arcAnio[0])][3]),
    sefCarta(persAnio, 'Sefirá del año'),
    carta('Astrología china', '☯', [{k: 'Año actual: ' + anH[0] + ' de ' + elH[0], d: 'Se asocia con ' + anH[1] + '. ' + relCh, tags: anH[2]}])
  ];

  return {nacimiento: tarjetasNac, hoy: hoy, mes: mes, ano: ano, resumen: {solN: solN[0], lunaN: lunaN[0], animal: an[0] + ' de ' + el[0], camino: cam, persAnio: persAnio, persMes: persMes, persDia: persDia}};
}

/* ---------- lo que se repite entre tradiciones ---------- */
function coincidencias(tarjetas){
  var mapa = {};
  tarjetas.forEach(function(c){ c.tags.forEach(function(t){ var base = c.trad.split(' (')[0]; (mapa[t] = mapa[t] || []); if(mapa[t].indexOf(base) < 0) mapa[t].push(base); }); });
  return TEMAS.filter(function(t){ return mapa[t] && mapa[t].length >= 2; }).map(function(t){ return {tema: t, tradiciones: mapa[t]}; }).sort(function(a,b){ return b.tradiciones.length - a.tradiciones.length; });
}

raiz.Lecturas = {leer: leer, coincidencias: coincidencias, _t: {arbolDe: arbolDe, lonSol: lonSol, lonLuna: lonLuna, anoNuevoChino: anoNuevoChino, caminoDeVida: caminoDeVida, sumaNombre: sumaNombre, esVocal: esVocal, red: red, arcanosDe: arcanosDe, utcDeLocal: utcDeLocal, proximaFase: proximaFase, elong: elong, T_de: T_de}};
})(typeof window !== 'undefined' ? window : globalThis);
