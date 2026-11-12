/* lecturas: motor de calculo + textos. Sin dependencias; funciona en el navegador y en node.
   Todo es una mirada SIMBOLICA basada en tradiciones; no es prediccion. */
(function(raiz){
'use strict';

/* ---------- temas comunes para cruzar tradiciones ---------- */
/* vocabulario cerrado de 12 temas. Ninguno habla de enfermedad, dinero ni futuro.
   Antes eran 8: Estabilidad paso a llamarse Constancia, Servicio paso a Cuidado y Comunicacion paso a Palabra. */
var TEMAS = ['Iniciativa','Constancia','Cambio','Soltar','Sensibilidad','Vínculos','Cuidado','Palabra','Creatividad','Introspección','Límites','Libertad'];
var DESCRIPCION_TEMAS = {
 'Iniciativa': 'Empezar, dar el primer paso.',
 'Constancia': 'Sostener, construir despacio.',
 'Cambio': 'Etapas que se mueven.',
 'Soltar': 'Cerrar ciclos, dejar ir.',
 'Sensibilidad': 'Sentir y percibir.',
 'Vínculos': 'Familia, pareja, amistad.',
 'Cuidado': 'Atender a otros.',
 'Palabra': 'Decir, escribir, escuchar.',
 'Creatividad': 'Hacer y expresar.',
 'Introspección': 'Mirar hacia dentro, silencio.',
 'Límites': 'Decir no, proteger lo propio.',
 'Libertad': 'Espacio, movimiento, independencia.'
};

/* ---------- familias de fuentes ----------
   Una coincidencia cuenta por FAMILIAS, no por tarjetas: numerologia, cabala, tarot y dia de la semana salen
   de las mismas cifras de la fecha, asi que juntas son una sola mirada. La quiromancia (si se rellena) es otra. */
var FAMILIAS = {
 astros: 'Sol y Luna',
 ano_chino: 'Año chino',
 arboles: 'Árboles celtas',
 aritmetica: 'Aritmética de la fecha',
 quiromancia: 'Quiromancia'
};
var FAMILIA_DE_TRADICION = {
 'Astrología occidental': 'astros',
 'Astrología china': 'ano_chino',
 'Árboles celtas': 'arboles',
 'Numerología pitagórica': 'aritmetica',
 'Numerología personal': 'aritmetica',
 'Cábala': 'aritmetica',
 'Tarot': 'aritmetica',
 'Día de la semana': 'aritmetica',
 'Quiromancia': 'quiromancia'
};
function familiaDe(trad){ return FAMILIA_DE_TRADICION[String(trad).split(' (')[0]] || null; }

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
 ['Aries','♈','Fuego','Cardinal','el impulso de empezar, la franqueza y el coraje. Su reto clásico es la paciencia.','Emociones rápidas y directas; se calma moviéndose y actuando.',['Iniciativa'],'¿Qué quiero empezar sin esperar a que todo esté listo?','signo-aries'],
 ['Tauro','♉','Tierra','Fijo','la constancia, el gusto por lo sencillo y lo concreto, la lealtad. Su reto es la rigidez ante el cambio.','Se tranquiliza con rutina, comida, naturaleza y cercanía física.',['Constancia'],'¿Qué cosa sencilla me da paz y casi no le dedico tiempo?','signo-tauro'],
 ['Géminis','♊','Aire','Mutable','la curiosidad, la palabra ágil y la mente inquieta. Su reto es profundizar en lo que empieza.','Procesa lo que siente hablándolo o escribiéndolo.',['Palabra'],'¿Qué tengo guardado que me haría bien decir o escribir?','signo-geminis'],
 ['Cáncer','♋','Agua','Cardinal','el cuidado, la memoria afectiva y la protección del hogar. Su reto es no encerrarse en la sensibilidad.','Emociones profundas ligadas a la familia y al recuerdo; necesita sentirse a salvo.',['Cuidado','Vínculos','Sensibilidad'],'¿A quién cuido y quién me cuida a mí?','signo-cancer'],
 ['Leo','♌','Fuego','Fijo','la calidez, la generosidad y el deseo de brillar con corazón. Su reto es aceptar que no siempre es el centro.','Necesita sentirse valorado y expresar lo que siente con entusiasmo.',['Creatividad'],'¿Qué parte de mí quiere expresarse más abiertamente?','signo-leo'],
 ['Virgo','♍','Tierra','Mutable','la atención al detalle, el sentido del servicio y el análisis. Su reto es la autoexigencia.','Se calma ordenando, ayudando y teniendo algo útil que hacer.',['Cuidado'],'¿Dónde me exijo más de lo que le exigiría a otra persona?','signo-virgo'],
 ['Libra','♎','Aire','Cardinal','la búsqueda de equilibrio, belleza y buena relación con los demás. Su reto es decidirse sin temer al conflicto.','Necesita armonía y compañía para sentirse en paz.',['Vínculos'],'¿Qué decisión estoy aplazando por evitar un desacuerdo?','signo-libra'],
 ['Escorpio','♏','Agua','Fijo','la intensidad, la profundidad y la capacidad de transformarse. Su reto es confiar y soltar el control.','Emociones intensas y reservadas; necesita autenticidad y privacidad.',['Cambio','Soltar','Introspección'],'¿Qué estoy listo para dejar morir para renovarme?','signo-escorpio'],
 ['Sagitario','♐','Fuego','Mutable','el optimismo, el amor por la libertad y la búsqueda de sentido. Su reto es la constancia y el tacto.','Se recupera con aire libre, aventura y perspectiva; no soporta sentirse atrapado.',['Libertad'],'¿Qué me da sentido más allá de lo cotidiano?','signo-sagitario'],
 ['Capricornio','♑','Tierra','Cardinal','la responsabilidad, la disciplina y la visión a largo plazo. Su reto es permitirse descansar y sentir.','Contiene lo que siente y se muestra fuerte; necesita permitirse la ternura.',['Constancia'],'¿Cuándo fue la última vez que descansé sin culpa?','signo-capricornio'],
 ['Acuario','♒','Aire','Fijo','la independencia, la originalidad y el interés por el bien común. Su reto es el vínculo afectivo cercano.','Necesita espacio propio y comprender sus emociones desde la distancia.',['Libertad','Creatividad'],'¿Cómo puedo acercarme más a quienes quiero sin perder mi libertad?','signo-acuario'],
 ['Piscis','♓','Agua','Mutable','la imaginación, la empatía y la sensibilidad espiritual. Su reto es poner límites y anclarse.','Absorbe el ambiente emocional; necesita silencio, arte o agua para recargarse.',['Sensibilidad','Límites'],'¿Qué límite me cuesta poner y me estaría haciendo bien?','signo-piscis']
];
var ANIMALES = [
 ['Rata','ingenio, adaptabilidad y sentido práctico',['Cambio'],'animal-rata'],['Buey','constancia, paciencia y trabajo firme',['Constancia'],'animal-buey'],['Tigre','valentía, energía y espíritu independiente',['Iniciativa','Libertad'],'animal-tigre'],
 ['Conejo','diplomacia, sensibilidad estética y calma',['Sensibilidad','Vínculos'],'animal-conejo'],['Dragón','carisma, ambición y vitalidad',['Iniciativa'],'animal-dragon'],['Serpiente','intuición, reserva y mirada profunda',['Introspección'],'animal-serpiente'],
 ['Caballo','libertad, entusiasmo y movimiento',['Libertad'],'animal-caballo'],['Cabra','creatividad, ternura y gusto por la armonía',['Creatividad','Sensibilidad'],'animal-cabra'],['Mono','ingenio, curiosidad y versatilidad',['Creatividad'],'animal-mono'],
 ['Gallo','orden, franqueza y esmero',['Constancia','Palabra'],'animal-gallo'],['Perro','lealtad, justicia y protección',['Vínculos','Cuidado'],'animal-perro'],['Cerdo','generosidad, sencillez y disfrute',['Cuidado'],'animal-cerdo']
];
var ELEMENTOS_CH = {madera:['Madera','crecimiento y flexibilidad'],fuego:['Fuego','pasión y dinamismo'],tierra:['Tierra','estabilidad y cuidado'],metal:['Metal','rigor y determinación'],agua:['Agua','adaptación e intuición']};
function elementoChino(anio){ var u = anio % 10; return u<2?'metal':u<4?'agua':u<6?'madera':u<8?'fuego':'tierra'; }
var NUM = {
 1:['Iniciativa y autonomía','empezar cosas, valerse por sí mismo y marcar camino',['Iniciativa','Libertad'],'num-1'],
 2:['Cooperación y sensibilidad','colaborar, escuchar y buscar el equilibrio con los demás',['Sensibilidad','Vínculos'],'num-2'],
 3:['Expresión y creatividad','comunicar, crear y disfrutar de lo que se hace',['Creatividad','Palabra'],'num-3'],
 4:['Orden y bases firmes','construir con esfuerzo, método y constancia',['Constancia'],'num-4'],
 5:['Cambio y libertad','moverse, probar y adaptarse a lo nuevo',['Cambio','Libertad'],'num-5'],
 6:['Cuidado y responsabilidad','atender a la familia y a la comunidad, y buscar armonía en el hogar',['Cuidado','Vínculos'],'num-6'],
 7:['Búsqueda interior','analizar, estudiar y buscar silencio para entender',['Introspección'],'num-7'],
 8:['Logro y manejo de recursos','organizar, conseguir resultados y administrar con equilibrio',['Iniciativa','Constancia'],'num-8'],
 9:['Cierre y compasión','terminar ciclos, soltar y mirar con visión amplia',['Soltar','Cuidado'],'num-9'],
 11:['Intuición e inspiración (número maestro)','sensibilidad aguda e intuición; pide cuidarse de la tensión nerviosa',['Sensibilidad','Introspección'],'num-11'],
 22:['Construir en grande (número maestro)','llevar una visión a lo concreto; pide no cargar con demasiado',['Constancia','Creatividad'],'num-22'],
 33:['Servicio a gran escala (número maestro)','cuidado y entrega por los demás; pide no olvidarse de uno mismo',['Cuidado','Límites'],'num-33']
};
var CONTEXTO_NUM = {
 camino:'Camino de vida, el aprendizaje de fondo que esta tradición asigna a tu fecha',
 expresion:'Expresión, cómo tiendes a mostrar tus talentos',
 alma:'Impulso del alma, lo que tu interior suele desear',
 personalidad:'Personalidad, lo que otros suelen percibir de ti',
 dia:'Día de nacimiento, un talento natural'
};
var ARCANOS = [
 ['El Loco','comienzo, confianza y salto con inocencia',['Iniciativa','Cambio'],'¿Qué comienzo estoy aplazando por miedo?','arcano-0'],
 ['El Mago','voluntad, recursos a mano y acción consciente',['Iniciativa'],'¿Qué tengo ya a mano y no estoy usando?','arcano-1'],
 ['La Sacerdotisa','intuición, silencio y saber interior',['Introspección'],'¿Qué sé en el fondo y no me atrevo a admitir?','arcano-2'],
 ['La Emperatriz','fertilidad, creatividad y cuidado',['Creatividad','Cuidado'],'¿Qué quiero hacer crecer?','arcano-3'],
 ['El Emperador','estructura, autoridad y protección',['Límites','Constancia'],'¿Qué límite o estructura me falta?','arcano-4'],
 ['El Hierofante','tradición, enseñanza y valores compartidos',['Palabra','Vínculos'],'¿Qué valor quiero transmitir con el ejemplo?','arcano-5'],
 ['Los Enamorados','elección, vínculo y coherencia con los valores',['Vínculos'],'¿Qué elección me pide ser fiel a lo que valoro?','arcano-6'],
 ['El Carro','determinación, rumbo y dominio de fuerzas opuestas',['Iniciativa'],'¿Hacia dónde quiero ir de verdad?','arcano-7'],
 ['La Fuerza','fortaleza amable, paciencia y dominio de los impulsos',['Sensibilidad','Constancia'],'¿Dónde me serviría más la ternura que la fuerza?','arcano-8'],
 ['El Ermitaño','búsqueda interior, prudencia y guía',['Introspección'],'¿Qué necesito comprender a solas?','arcano-9'],
 ['La Rueda de la Fortuna','ciclos y cambios que no controlamos',['Cambio'],'¿Qué estoy aprendiendo de este ciclo?','arcano-10'],
 ['La Justicia','equilibrio, verdad y consecuencia de los actos',['Límites'],'¿Estoy siendo justo conmigo y con los demás?','arcano-11'],
 ['El Colgado','pausa, otra perspectiva y entrega',['Introspección','Soltar'],'¿Qué veo distinto si me detengo?','arcano-12'],
 ['La Muerte','final de una etapa y renovación; no habla de muerte física',['Soltar','Cambio'],'¿Qué etapa está terminando y qué me toca soltar?','arcano-13'],
 ['La Templanza','moderación, armonía y paciencia',['Constancia'],'¿Qué necesito mezclar con más calma?','arcano-14'],
 ['El Diablo','ataduras, deseos y lo que nos domina',['Soltar'],'¿Qué hábito o apego me cuesta soltar?','arcano-15'],
 ['La Torre','ruptura de lo falso y sacudida liberadora',['Cambio','Libertad'],'¿Qué construcción mía no se sostenía?','arcano-16'],
 ['La Estrella','esperanza, renovación y confianza serena',['Sensibilidad'],'¿Qué me devuelve la esperanza?','arcano-17'],
 ['La Luna','sueños, intuiciones y miedos difusos',['Introspección','Sensibilidad'],'¿Qué miedo se vuelve más pequeño si lo miro de frente?','arcano-18'],
 ['El Sol','claridad, alegría y vitalidad',['Creatividad'],'¿Qué me hace sentir vivo y sencillo?','arcano-19'],
 ['El Juicio','llamado, balance y renacer',['Cambio','Introspección'],'¿A qué me siento llamado ahora?','arcano-20'],
 ['El Mundo','plenitud, culminación e integración',['Soltar'],'¿Qué he completado y puedo celebrar?','arcano-21']
];
var SEFIROT = [null,
 ['Keter','la corona: el origen y la voluntad pura',['Iniciativa'],'sefira-1'],['Jojmá','la sabiduría: la chispa creativa y la intuición',['Creatividad'],'sefira-2'],['Biná','el entendimiento: dar forma y discernir',['Introspección'],'sefira-3'],
 ['Jésed','la bondad: la generosidad sin condiciones',['Cuidado'],'sefira-4'],['Guevurá','el rigor: los límites y la fuerza',['Límites'],'sefira-5'],['Tiféret','la belleza: la armonía y el equilibrio',['Sensibilidad'],'sefira-6'],
 ['Nétzaj','la perseverancia: seguir adelante',['Constancia'],'sefira-7'],['Hod','el esplendor: la humildad y la palabra',['Palabra'],'sefira-8'],['Yesod','el fundamento: la conexión entre lo de arriba y lo de abajo',['Constancia'],'sefira-9']
];
var DIAS = [['domingo','el Sol','vitalidad e identidad',['Creatividad'],'dia-domingo'],['lunes','la Luna','emociones y hogar',['Sensibilidad','Vínculos'],'dia-lunes'],['martes','Marte','energía y acción',['Iniciativa'],'dia-martes'],['miércoles','Mercurio','comunicación y estudio',['Palabra'],'dia-miercoles'],['jueves','Júpiter','crecimiento y generosidad',['Cuidado'],'dia-jueves'],['viernes','Venus','afecto y armonía',['Vínculos','Sensibilidad'],'dia-viernes'],['sábado','Saturno','orden y paciencia',['Constancia'],'dia-sabado']];
var PALMA = {
 corazon:{curva:['Línea del corazón curva','suele leerse como expresar lo que se siente con apertura',['Sensibilidad'],'palma-corazon-curva'],recta:['Línea del corazón recta','suele leerse como reserva al mostrar el afecto y un enfoque más racional en los vínculos',['Vínculos'],'palma-corazon-recta']},
 cabeza:{recta:['Línea de la cabeza recta','suele leerse como pensamiento práctico y ordenado',['Constancia'],'palma-cabeza-recta'],curva:['Línea de la cabeza curva','suele leerse como imaginación, intuición y creatividad',['Creatividad'],'palma-cabeza-curva']},
 vida:{amplia:['Línea de la vida amplia y curva','suele leerse como vitalidad y apertura a la experiencia',['Iniciativa'],'palma-vida-amplia'],cerrada:['Línea de la vida pegada al pulgar','suele leerse como tendencia a cuidar la energía y a la cautela',['Límites'],'palma-vida-cerrada']}
};


/* lunas del mes: temas e id de los dos textos fijos de la pestana "Este mes" */
var ID_FASES = {nueva: [['Iniciativa'], 'fase-luna-nueva'], llena: [['Soltar'], 'fase-luna-llena']};

/* ---------- arboles celtas (calendario MODERNO de Robert Graves, 1948; fechas segun Learn Religions) ---------- */
var ARBOLES = [
 ['Abedul','Beth',12,24,1,20,'renacimiento y regeneración, un impulso extra para empezar cosas nuevas; se asocia con la creatividad, la fertilidad, la curación y la protección',['Iniciativa','Cambio'],'arbol-abedul'],
 ['Serbal','Luis',1,21,2,17,'la diosa Brighid, protectora del hogar, y con el poder personal y el éxito; se usaba como protección',['Límites','Iniciativa'],'arbol-serbal'],
 ['Fresno','Nion',2,18,3,17,'rituales del océano, la potencia mágica, los sueños proféticos y los viajes espirituales',['Introspección'],'arbol-fresno'],
 ['Aliso','Fearn',3,18,4,14,'las decisiones espirituales, la profecía, la adivinación y el contacto con la propia intuición',['Introspección'],'arbol-aliso'],
 ['Sauce','Saille',4,15,5,12,'la curación y el crecimiento; el nutrir, el conocimiento que crece y los misterios femeninos',['Cuidado','Sensibilidad'],'arbol-sauce'],
 ['Espino blanco','Huath',5,13,6,9,'la fertilidad, la energía masculina y el fuego; las decisiones de negocios y los contactos profesionales',['Iniciativa'],'arbol-espino-blanco'],
 ['Roble','Duir',6,10,7,7,'la protección, la fuerza, la fertilidad, el éxito y la buena fortuna',['Constancia','Límites'],'arbol-roble'],
 ['Acebo','Tinne',7,8,8,4,'la firmeza; se usaba en armas y en magia protectora, y una ramita en casa se asocia con la suerte y la seguridad',['Límites','Constancia'],'arbol-acebo'],
 ['Avellano','Coll',8,5,9,1,'la sabiduría y la protección; los pozos sagrados y el salmón del conocimiento, la adivinación, los sueños y la inspiración creativa',['Creatividad','Introspección'],'arbol-avellano'],
 ['Vid','Muin',9,2,9,29,'la felicidad y también la ira, emociones apasionadas; la alegría, la exaltación y el equilibrio del equinoccio de otoño',['Sensibilidad'],'arbol-vid'],
 ['Hiedra','Gort',9,30,10,27,'la vida que continúa tras la muerte, el ciclo de vida, muerte y renacimiento; alejar lo negativo, mejorarse, proteger y cooperar',['Cambio','Soltar'],'arbol-hiedra'],
 ['Caña','Negetal',10,28,11,23,'los muertos y el inframundo; la adivinación, la meditación y honrar el ciclo de la vida y el renacimiento',['Introspección'],'arbol-cana'],
 ['Saúco','Ruish',11,24,12,23,'los finales y los comienzos, la recuperación rápida; la creatividad, la renovación y la protección',['Cambio','Soltar','Creatividad'],'arbol-sauco']
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
  var c = carta('Árboles celtas (calendario moderno)', '❦', [{k: etiqueta + ': ' + a[0] + ' (' + a[1] + ')', d: 'Del ' + a[3] + ' de ' + MESES[a[2]] + ' al ' + a[5] + ' de ' + MESES[a[4]] + '. Se asocia con ' + a[6] + '.', tags: a[7], id: ID(a)}]);
  c.nota = 'Este calendario lo inventó el poeta Robert Graves en su libro The White Goddess (1948). No es un sistema celta antiguo y no se parece a los calendarios celtas documentados. Las fechas varían algo según el autor.';
  return c;
}

/* ---------- utilidades de resultado ---------- */
function signoDeLon(l){ return SIGNOS[Math.floor(n360(l)/30)]; }
function carta(trad, simbolo, items, pregunta){
  var tags = []; items.forEach(function(i){ (i.tags||[]).forEach(function(t){ if(tags.indexOf(t) < 0) tags.push(t); }); });
  return {trad: trad, simbolo: simbolo, items: items, pregunta: pregunta || '', tags: tags, familia: familiaDe(trad)};
}
/* el id estable de cada texto es el ultimo elemento de su entrada */
function ID(e){ return e[e.length - 1]; }
function listaArcano(idxList, prefijo){
  return idxList.map(function(n, i){ var a = ARCANOS[idxArcano(n)]; return {k: (i === 0 ? prefijo : 'Arcano asociado') + ': ' + a[0], d: a[1].charAt(0).toUpperCase() + a[1].slice(1) + '.', tags: a[2], id: ID(a)}; });
}

/* ---------- lectura completa ---------- */
/* datos: {nombre, anio, mes, dia, hora (opcional), min, tz, palma:{corazon,cabeza,vida}, ahora (ts opcional)} */
function leer(datos){
  var y = datos.anio, m = datos.mes, d = datos.dia, tz = datos.tz || 'UTC', hayHora = datos.hora != null && datos.hora !== '';
  var ahora = datos.ahora || Date.now(), A = new Date(ahora), nacTs;
  nacTs = utcDeLocal(y, m, d, hayHora ? +datos.hora : 12, hayHora ? (+datos.min||0) : 0, tz);

  /* astrologia occidental */
  var solN = signoDeLon(lonSol(nacTs)), lunaN = signoDeLon(lonLuna(nacTs)), avisos = [], lunaIncierta = false, solIncierto = false;
  if(!hayHora){
    var ini = utcDeLocal(y, m, d, 0, 0, tz), fin = ini + 86400000;
    var s1 = signoDeLon(lonSol(ini)), s2 = signoDeLon(lonSol(fin)), l1 = signoDeLon(lonLuna(ini)), l2 = signoDeLon(lonLuna(fin));
    if(s1[0] !== s2[0]){ solIncierto = true; avisos.push('Naciste el día en que el Sol cambia de signo (' + s1[0] + ' a ' + s2[0] + '). Con la hora exacta se sabría cuál es el tuyo.'); }
    if(l1[0] !== l2[0]) lunaIncierta = true;
    if(l1[0] !== l2[0]) avisos.push('Ese día la Luna cambió de signo (' + l1[0] + ' a ' + l2[0] + '). Sin la hora de nacimiento no se puede saber cuál es la tuya.');
  }
  var astro = carta('Astrología occidental', solN[1], [
    {k: 'Sol en ' + solN[0] + ' (' + solN[2] + ', ' + solN[3] + ')', d: 'Tradicionalmente se asocia con ' + solN[4], tags: solN[6], id: ID(solN), incierto: solIncierto, cuerpo: 'sol'},
    {k: 'Luna en ' + lunaN[0], d: lunaN[5], tags: lunaN[6], id: ID(lunaN), incierto: lunaIncierta, cuerpo: 'luna'}
  ].concat(avisos.map(function(a){ return {k: 'Aviso', d: a, tags: []}; })), solN[7]);
  astro.nota = 'Se calcula el Sol y la Luna. El ascendente, las casas y los demás planetas necesitan hora y lugar exactos y tablas astronómicas completas, y aquí no se incluyen.';

  /* astrologia china */
  var cny = anoNuevoChino(y), anioCh = (m < cny.mes || (m === cny.mes && d < cny.dia)) ? y - 1 : y;
  var an = ANIMALES[((anioCh - 4) % 12 + 12) % 12], el = ELEMENTOS_CH[elementoChino(anioCh)];
  var chino = carta('Astrología china', '☯', [{k: an[0] + ' de ' + el[0], d: 'El animal se asocia con ' + an[1] + '; el elemento aporta ' + el[1] + '.', tags: an[2], id: ID(an)}], '¿Qué de este animal reconozco en mí y qué no?');
  chino.nota = 'El año chino empieza en el Año Nuevo Chino (entre finales de enero y mediados de febrero). Si naciste en esas fechas, comprueba el tuyo.';

  /* numerologia pitagorica */
  var cam = caminoDeVida(y, m, d), nom = datos.nombre || '', items = [], conNombre = limpiar(nom).length >= 2;
  function it(clave, n){ var t = NUM[n]; items.push({k: CONTEXTO_NUM[clave].split(',')[0] + ' ' + n + ': ' + t[0], d: CONTEXTO_NUM[clave].split(',').slice(1).join(',').trim().replace(/^./, function(c){ return c.toUpperCase(); }) + '. Se asocia con ' + t[1] + '.', tags: t[2], id: ID(t)}); }
  it('camino', cam);
  if(conNombre){
    it('expresion', red(sumaNombre(nom, function(){ return true; })));
    it('alma', red(sumaNombre(nom, esVocal)) || 9);
    it('personalidad', red(sumaNombre(nom, function(c){ return !esVocal(c); })) || 9);
  }
  it('dia', red(d));
  var numer = carta('Numerología pitagórica', '123', items, '¿Qué parte de este aprendizaje de fondo ya estoy viviendo?');
  numer.nota = 'Método pitagórico: A=1 … I=9, y así en ciclos. La Y se cuenta como consonante. Los números 11, 22 y 33 se conservan.';

  /* cabala */
  var cs = SEFIROT[red9(cam)];
  var cabala = carta('Cábala (lectura inspirada)', '✧', [{k: 'Sefirá ' + cs[0], d: 'Asociada a tu camino de vida, representa ' + cs[1] + '.', tags: cs[2], id: ID(cs)}], '¿Cómo se expresa esta cualidad en mi vida diaria?');
  cabala.nota = 'Asociar sefirot a los números de una fecha es una adaptación moderna popular. La Cábala tradicional trabaja con textos hebreos y estudio guiado, y aquí solo se muestra un reflejo muy simple.';

  /* tarot */
  var sumaNac = sumaDig(y) + sumaDig(m) + sumaDig(d), lista = arcanosDe(sumaNac);
  var tarot = carta('Tarot (carta de nacimiento)', '✦', listaArcano(lista, 'Tu arcano'), ARCANOS[idxArcano(lista[0])][3]);
  tarot.nota = 'Se usa el método de las cartas de nacimiento de los arcanos mayores (numeración Rider-Waite).';

  /* dia planetario */
  var wd = new Date(Date.UTC(y, m-1, d)).getUTCDay(), dp = DIAS[wd];
  var dia = carta('Día de la semana (planetario)', '☉', [{k: 'Naciste un ' + dp[0], d: 'La tradición lo asocia con ' + dp[1] + ': ' + dp[2] + '.', tags: dp[3], id: ID(dp)}]);

  var arbolNac = arbolDe(m, d);
  var tarjetasNac = [astro, chino, cartaArbol(arbolNac, 'Naciste en el mes del'), numer, cabala, tarot, dia];

  /* quiromancia */
  var palma = datos.palma || {}, pItems = [];
  ['corazon','cabeza','vida'].forEach(function(l){ var v = PALMA[l][palma[l]]; if(v) pItems.push({k: v[0], d: v[1].charAt(0).toUpperCase() + v[1].slice(1) + '.', tags: v[2], id: ID(v)}); });
  if(pItems.length){ var q = carta('Quiromancia', '✋', pItems); q.nota = 'La longitud de la línea de la vida no indica cuánto se vive; esa idea es un mito. Es una lectura de rasgos, no de destino.'; tarjetasNac.push(q); }

  /* ---- hoy / mes / ano ---- */
  var ay = A.getFullYear(), am = A.getMonth()+1, ad = A.getDate();
  var persAnio = red9(d + m + red9(ay)), persMes = red9(persAnio + am), persDia = red9(persMes + ad);
  var luna = signoDeLon(lonLuna(ahora)), sol = signoDeLon(lonSol(ahora)), fase = nombreFase(ahora), pct = Math.round(fasePorcentaje(ahora)*100);
  function numCarta(n, etiqueta, pregunta){ var t = NUM[n]; return carta('Numerología personal', '123', [{k: etiqueta + ' ' + n + ': ' + t[0], d: 'Se asocia con ' + t[1] + '.', tags: t[2], id: ID(t)}], pregunta); }
  function sefCarta(n, etiqueta){ var s = SEFIROT[n]; return carta('Cábala (lectura inspirada)', '✧', [{k: etiqueta + ': ' + s[0], d: 'Representa ' + s[1] + '.', tags: s[2], id: ID(s)}]); }
  var dpHoy = DIAS[A.getDay()];

  /* hoy */
  var arcHoy = arcanosDe(sumaDig(ad) + sumaDig(am) + sumaDig(ay) + sumaNac)[0];
  var hoy = [
    carta('Astrología occidental', '☾', [
      {k: 'Luna en ' + luna[0] + ', ' + fase + ' (' + pct + ' % iluminada)', d: 'Se asocia con este tono emocional: ' + luna[5].charAt(0).toLowerCase() + luna[5].slice(1), tags: luna[6], id: ID(luna)},
      {k: 'El Sol está en ' + sol[0], d: 'La temporada solar de ' + sol[0] + ' pone el acento en ' + sol[4].replace(/\. Su reto.*$/, '') + '.', tags: sol[6], id: ID(sol)}
    ], luna[7]),
    numCarta(persDia, 'Día personal', '¿Cómo puedo vivir esta cualidad en una acción pequeña?'),
    carta('Tarot (carta del día)', '✦', [{k: 'Arcano del día: ' + ARCANOS[idxArcano(arcHoy)][0], d: ARCANOS[idxArcano(arcHoy)][1].charAt(0).toUpperCase() + ARCANOS[idxArcano(arcHoy)][1].slice(1) + '.', tags: ARCANOS[idxArcano(arcHoy)][2], id: ID(ARCANOS[idxArcano(arcHoy)])}], ARCANOS[idxArcano(arcHoy)][3]),
    sefCarta(persDia, 'Sefirá del día'),
    carta('Día de la semana (planetario)', '☉', [{k: 'Hoy es ' + dpHoy[0], d: 'Se asocia con ' + dpHoy[1] + ': ' + dpHoy[2] + '.', tags: dpHoy[3], id: ID(dpHoy)}])
  ];

  /* mes */
  var nm = proximaFase(ahora, 0), fm = proximaFase(ahora, 180), fmt = function(t){ return t ? new Date(t).toLocaleDateString('es', {weekday:'long', day:'numeric', month:'long'}) : '—'; };
  var arcMes = arcanosDe(persMes)[0];
  var relSol = sol[0] === solN[0] ? 'Es tu propio signo solar: la tradición lo llama "temporada de tu signo" y lo asocia con energía renovada.' : (sol[2] === solN[2] ? 'Comparte elemento (' + sol[2] + ') con tu Sol: suele leerse como un mes en sintonía.' : 'Su elemento (' + sol[2] + ') es distinto al de tu Sol (' + solN[2] + '): suele leerse como un mes para aprender de otra forma de hacer las cosas.');
  var mes = [
    carta('Astrología occidental', '☾', [
      {k: 'El Sol transita ' + sol[0], d: relSol, tags: sol[6], id: ID(sol)},
      {k: 'Próxima luna nueva: ' + fmt(nm), d: 'Tradicionalmente es un momento para plantar intenciones.', tags: ID_FASES.nueva[0], id: ID(ID_FASES.nueva)},
      {k: 'Próxima luna llena: ' + fmt(fm), d: 'Tradicionalmente es un momento de balance y de soltar.', tags: ID_FASES.llena[0], id: ID(ID_FASES.llena)}
    ], '¿Qué intención quiero plantar este mes?'),
    numCarta(persMes, 'Mes personal', '¿Qué hábito pequeño le da forma a este mes?'),
    carta('Tarot', '✦', [{k: 'Arcano del mes: ' + ARCANOS[idxArcano(arcMes)][0], d: ARCANOS[idxArcano(arcMes)][1].charAt(0).toUpperCase() + ARCANOS[idxArcano(arcMes)][1].slice(1) + '.', tags: ARCANOS[idxArcano(arcMes)][2], id: ID(ARCANOS[idxArcano(arcMes)])}], ARCANOS[idxArcano(arcMes)][3]),
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
    carta('Astrología china', '☯', [{k: 'Año actual: ' + anH[0] + ' de ' + elH[0], d: 'Se asocia con ' + anH[1] + '. ' + relCh, tags: anH[2], id: ID(anH)}])
  ];

  return {nacimiento: tarjetasNac, hoy: hoy, mes: mes, ano: ano, resumen: {conNombre: conNombre, conPalma: pItems.length > 0, solN: solN[0], lunaN: lunaN[0], solIncierto: solIncierto, lunaIncierta: lunaIncierta, animal: an[0] + ' de ' + el[0], camino: cam, persAnio: persAnio, persMes: persMes, persDia: persDia}};
}

/* ---------- lo que se repite entre tradiciones ---------- */
function coincidencias(tarjetas){
  var mapa = {};
  tarjetas.forEach(function(c){ c.tags.forEach(function(t){ var base = c.trad.split(' (')[0]; (mapa[t] = mapa[t] || []); if(mapa[t].indexOf(base) < 0) mapa[t].push(base); }); });
  return TEMAS.filter(function(t){ return mapa[t] && mapa[t].length >= 2; }).map(function(t){ return {tema: t, tradiciones: mapa[t]}; }).sort(function(a,b){ return b.tradiciones.length - a.tradiciones.length; });
}

/* ---------- coincidencias por familias de fuentes ----------
   Acepta la lectura completa (usa .nacimiento) o una lista de tarjetas. Devuelve, para los 12 temas,
   cuantas familias DISTINTAS lo tienen y cuales. maxFamilias = familias presentes en esas tarjetas. */
function coincidenciasPorFamilia(entrada){
  var tarjetas = Array.isArray(entrada) ? entrada : (entrada && entrada.nacimiento) || [];
  var presentes = [], mapa = {};
  tarjetas.forEach(function(c){
    var f = c.familia || familiaDe(c.trad); if(!f) return;
    if(presentes.indexOf(f) < 0) presentes.push(f);
    (c.tags || []).forEach(function(t){ (mapa[t] = mapa[t] || []); if(mapa[t].indexOf(f) < 0) mapa[t].push(f); });
  });
  var orden = Object.keys(FAMILIAS);
  var temas = TEMAS.map(function(t){
    var fs = (mapa[t] || []).slice().sort(function(a, b){ return orden.indexOf(a) - orden.indexOf(b); });
    return {tema: t, n: fs.length, familias: fs, etiquetas: fs.map(function(f){ return FAMILIAS[f]; })};
  }).sort(function(a, b){ return b.n - a.n || TEMAS.indexOf(a.tema) - TEMAS.indexOf(b.tema); });
  return {maxFamilias: presentes.length, familiasPresentes: orden.filter(function(f){ return presentes.indexOf(f) >= 0; }), temas: temas};
}

/* ---------- catalogo de textos con tema (para pruebas y para la tabla de revision) ---------- */
function catalogo(){
  var l = [];
  function add(lista, trad, familia, nombre){ lista.forEach(function(e){ if(e) l.push({id: ID(e), trad: trad, familia: familia, nombre: nombre(e), temas: e[TEMAS_POS[trad]]}); }); }
  add(SIGNOS, 'Zodiaco occidental', 'astros', function(e){ return e[0]; });
  add(ANIMALES, 'Zodiaco chino', 'ano_chino', function(e){ return e[0]; });
  add(ARBOLES, 'Árboles celtas', 'arboles', function(e){ return e[0]; });
  add([1,2,3,4,5,6,7,8,9,11,22,33].map(function(n){ return NUM[n]; }), 'Numerología', 'aritmetica', function(e){ return e[0]; });
  add(SEFIROT, 'Cábala', 'aritmetica', function(e){ return e[0]; });
  add(ARCANOS, 'Tarot', 'aritmetica', function(e){ return e[0]; });
  add(DIAS, 'Día planetario', 'aritmetica', function(e){ return e[0]; });
  add(['corazon','cabeza','vida'].reduce(function(a, k){ return a.concat(Object.keys(PALMA[k]).map(function(v){ return PALMA[k][v]; })); }, []), 'Quiromancia', 'quiromancia', function(e){ return e[0]; });
  add([ID_FASES.nueva, ID_FASES.llena], 'Lunas del mes', 'astros', function(e){ return e[1] === 'fase-luna-nueva' ? 'Luna nueva' : 'Luna llena'; });
  return l;
}
var TEMAS_POS = {'Zodiaco occidental': 6, 'Zodiaco chino': 2, 'Árboles celtas': 7, 'Numerología': 2, 'Cábala': 2, 'Tarot': 2, 'Día planetario': 3, 'Quiromancia': 2, 'Lunas del mes': 0};

/* ---------- textos nuevos (fase 1: datos; la interfaz llega en la fase siguiente) ---------- */
var NOMBRE_SECCION = 'Lo que se repite y lo que te dice algo';

/* "De donde viene": cada dato historico esta comprobado; fuentes en tools/fuentes_lecturas.md
   (revision critica del 12/11/2026: fechas suavizadas donde las fuentes no coinciden) */
var ORIGENES = {
 zodiaco: 'Los doce signos iguales del zodiaco vienen de la astronomía de Babilonia, en el siglo V a. C. Las columnas de astrología en los periódicos son del siglo XX: en el Reino Unido, la primera fija fue la de R. H. Naylor en el Sunday Express, desde 1930.',
 zodiaco_chino: 'Las listas más antiguas que se conocen de doce animales, todavía algo distintas de la actual, están en tiras de bambú de la época Qin halladas en Shuihudi (China), del siglo III a. C.; allí servían para describir a un ladrón según el día del robo. Usar el animal para el año de nacimiento aparece documentado más tarde.',
 arboles: 'El alfabeto ogam aparece grabado en piedras, sobre todo en Irlanda, desde hacia el siglo IV d. C., y la idea de que sus letras nombran árboles es medieval. El calendario de árboles por meses lo propuso el poeta Robert Graves en The White Goddess (1948); los estudiosos no lo encuentran en fuentes celtas antiguas.',
 numerologia: 'El sistema que da un número a cada letra (A=1 … I=9) lleva el nombre de Pitágoras, pero tal como se usa hoy lo difundieron autores estadounidenses de principios del siglo XX, como L. Dow Balliett. La palabra «numerología» no está registrada en inglés antes de hacia 1907.',
 cabala: 'La palabra «sefirot» aparece por primera vez en el Séfer Yetsirá, un antiguo texto hebreo. Los nombres que se usan aquí (Keter, Jojmá…) vienen de la Cábala de la Edad Media; el Zóhar circuló en España a finales del siglo XIII. Unir una sefirá a las cifras de tu fecha no viene de esa tradición: es una adaptación que hace esta web.',
 tarot: 'Las cartas del tarot nacieron en el norte de Italia hacia 1440 para jugar. La primera prueba de su uso para adivinar es un manuscrito de Bolonia de hacia 1750, y esa costumbre se extendió desde París a partir de la década de 1780. Calcular una «carta de nacimiento» con las cifras de la fecha es un método moderno: la tarotista Mary K. Greer cuenta que lo aprendió de Angeles Arrien en 1977.',
 dia_planetario: 'Dar a cada día de la semana el nombre de uno de los siete astros que se ven a simple vista es una costumbre de la Antigüedad griega y romana, ligada a la astrología; en el siglo I d. C. ya era conocida en todo el Imperio romano. Por eso en español decimos lunes, martes, miércoles, jueves y viernes.',
 quiromancia: 'Leer las líneas de la mano se practicó en muchos lugares de Asia y Europa, como la India y la Grecia antigua. En la Europa de los siglos XIII al XVI circularon tratados en latín que se atribuían, sin serlo, a Aristóteles.',
 iching: 'El I Ching empezó como un manual de adivinación de la dinastía Zhou, con fechas propuestas entre los siglos X y IV a. C.; en el siglo II a. C. pasó a ser uno de los Cinco Clásicos chinos. Consultarlo con monedas se generalizó en la dinastía Tang.'
};

/* plantillas de conclusion. Huecos: {tema}, {n} (familias con el tema), {max} (familias miradas),
   {marcas} (temas que marco la persona), {cruces} (temas marcados que tambien se repiten).
   Todas terminan en una pregunta abierta que admite dejarlo estar.
   Solo hay conclusion cuando la persona marco algun texto como "Me dice algo": lo que la persona marca es lo que
   cuenta, asi que la herramienta nunca le propone un tema que no eligio (12/11/2026: se quito la conclusion que lo hacia). */
var CONCLUSIONES = {
 marcado_repetido: 'Marcaste «{tema}» y ese tema aparece en {n} de las {max} familias que miraste. No anuncia nada: es un tema que hoy te llamó la atención. ¿Hay algo pequeño que querrías mirar más de cerca esta semana, o prefieres dejarlo estar?',
 varios_cruces: '{cruces} de los {marcas} temas que marcaste también se repiten entre las tradiciones; el que más marcaste, «{tema}», aparece en {n} de las {max} familias. Que coincidan no lo vuelve un aviso ni una certeza. ¿Te apetece quedarte un rato con uno de ellos, o prefieres dejarlo estar?',
 marcado_en_una: 'Marcaste «{tema}» y solo aparece en {n} de las {max} familias. Que te llamara la atención a ti ya es un dato, y no hace falta que las tradiciones coincidan contigo. ¿Qué te hizo fijarte en él, o prefieres dejarlo estar?',
 marcado_en_ninguna: 'Marcaste «{tema}» y ninguna de las {max} familias que miraste lo nombra. Eso no le quita valor: lo trajiste tú. ¿Qué tiene este tema para ti ahora mismo, o prefieres dejarlo estar?',
 ningun_cruce: 'Ninguno de los {marcas} temas que marcaste coincide con lo que repiten las tradiciones. También es un resultado válido: lo que hoy te importa no tiene por qué salir de una fecha. ¿Quieres quedarte con alguno de tus temas para pensarlo con calma, o prefieres dejarlo estar?'
};

/* avisos del azar: describen como funciona la herramienta. Huecos: {desde}, {hasta}, {mediana}, {tema}, {pctTema}.
   La tabla recorre todas las fechas del rango (no las elige al azar) y cuenta fechas, no personas. */
var AVISOS_AZAR = [
 'En las fechas de {desde} a {hasta}, casi todas tienen varios temas repetidos: la fecha típica tiene {mediana}. Repetirse aquí es lo normal. Lo que tú marcas es lo que cuenta.',
 'A {pctTema} de cada 100 fechas les sale «{tema}» en dos o más familias solo por cómo están hechas las cuentas. Es un dato sobre la herramienta, no sobre ti.',
 'Numerología, cábala, tarot y día de la semana salen de las mismas cifras de la fecha. Por eso aquí cuentan como una sola familia.'
];
/* version sin cifras: se usa cuando la cuenta de la tabla ya no describe lo que la persona ve (ver azarExacto).
   No puede decir "casi todas": con dos o tres familias elegidas los temas repetidos son mucho menos frecuentes.
   Lo que si vale siempre: anadir tradiciones nunca quita repeticiones, y con todas las de la fecha casi todas repiten. */
var AVISO_AZAR_SIN_CIFRAS = 'Cuantas más tradiciones mires, más fácil es que algún tema se repita solo por cómo están hechas las cuentas; con todas las que salen de la fecha, les pasa a casi todas las fechas. Lo que tú marcas es lo que cuenta.';
function rellenar(plantilla, datos){ return String(plantilla).replace(/\{(\w+)\}/g, function(m, k){ return datos && datos[k] != null ? String(datos[k]) : m; }); }

/* ---------- tabla del azar ----------
   Generada por: node tools/azar_coincidencias.js   (recorre TODAS las fechas del rango, sin azar).
   Para regenerarla: ejecutar ese script y pegar aqui la constante que imprime. La prueba
   tools/pruebas/motor_lecturas.js comprueba que coincide con lo que calcula el motor. */
/* TABLA_AZAR_INICIO */
var TABLA_AZAR = {"rango":["1930-01-01","2010-12-31"],"fechas":29585,"tz":"America/Havana","hora":"12:00 local","paso":1,"maxFamilias":4,"maxFamiliasConPalma":5,"maxObservado":4,"pctConAlguno":99.5,"pctConTres":38.3,"pctConCuatro":1.9,"repetidos":{"p10":2,"mediana":3,"p90":4,"reparto":{"0":0.5,"1":7.4,"2":27.2,"3":36.4,"4":20.9,"5":6.5,"6":1,"7":0.1,"8":0}},"temas":{"Iniciativa":{"dos":30.5,"tres":4.4},"Constancia":{"dos":36.9,"tres":6.2},"Cambio":{"dos":19,"tres":2.4},"Soltar":{"dos":9.4,"tres":0.8},"Sensibilidad":{"dos":34.9,"tres":5.6},"Vínculos":{"dos":25.6,"tres":2.8},"Cuidado":{"dos":32.8,"tres":4.8},"Palabra":{"dos":12.5,"tres":0.7},"Creatividad":{"dos":30.4,"tres":6.6},"Introspección":{"dos":27.7,"tres":6.2},"Límites":{"dos":13.5,"tres":0.5},"Libertad":{"dos":20.3,"tres":2.1}}};
/* TABLA_AZAR_FIN */

/* ---------- fase 2: tradiciones elegibles, marcas y resumen ---------- */
/* tradiciones que la persona puede elegir. clave = clave de ORIGENES. Quiromancia solo si relleno la palma. */
var TRADICIONES = [
 {clave: 'zodiaco', nombre: 'Zodiaco occidental (Sol y Luna)', familia: 'astros'},
 {clave: 'zodiaco_chino', nombre: 'Zodiaco chino', familia: 'ano_chino'},
 {clave: 'arboles', nombre: 'Árboles celtas', familia: 'arboles'},
 {clave: 'numerologia', nombre: 'Numerología', familia: 'aritmetica'},
 {clave: 'cabala', nombre: 'Cábala', familia: 'aritmetica'},
 {clave: 'tarot', nombre: 'Tarot', familia: 'aritmetica'},
 {clave: 'dia_planetario', nombre: 'Día planetario', familia: 'aritmetica'},
 {clave: 'quiromancia', nombre: 'Quiromancia', familia: 'quiromancia', soloConPalma: true}
];
var TRADICION_DE = {
 'Astrología occidental': 'zodiaco', 'Astrología china': 'zodiaco_chino', 'Árboles celtas': 'arboles',
 'Numerología pitagórica': 'numerologia', 'Numerología personal': 'numerologia', 'Cábala': 'cabala',
 'Tarot': 'tarot', 'Día de la semana': 'dia_planetario', 'Quiromancia': 'quiromancia'
};
function tradicionDe(trad){ return TRADICION_DE[String(trad).split(' (')[0]] || null; }
/* filtra tarjetas por las claves de tradicion elegidas (lo no elegido no se muestra ni cuenta) */
function elegir(tarjetas, claves){ return (tarjetas || []).filter(function(c){ return claves.indexOf(tradicionDe(c.trad)) >= 0; }); }

/* textos nuevos de la interfaz (revision critica de Claude el 12/11/2026; sin revision de personas expertas) */
var TEXTOS_UI = {
 tradiciones_titulo: 'Qué tradiciones mirar',
 tradiciones_nota: 'Salen de tu fecha (la numerología, también de tu nombre si lo escribes); la quiromancia, de lo que elegiste sobre tu palma. Lo que desmarques no se muestra ni cuenta en lo que se repite.',
 iching_aparte: 'El I Ching, más abajo, es una tirada aparte: ahí manda el azar de las monedas y no se cruza con tu fecha.',
 de_donde: 'De dónde viene',
 marca_pregunta: '¿Te dice algo?',
 marca_si: 'Me dice algo', marca_no: 'No me dice nada', marca_nose: 'No sé',
 luna_incierta: 'Sin la hora de nacimiento no se sabe con certeza el signo de la Luna, así que este texto no se puede marcar ni cuenta en lo que se repite.',
 sol_incierto: 'Sin la hora de nacimiento no se sabe con certeza el signo del Sol, así que este texto no se puede marcar ni cuenta en lo que se repite.',
 repite_titulo: 'Lo que se repite entre tradiciones',
 marcado_titulo: 'Lo que tú marcaste',
 aparece_en: 'aparece en {n} de {max} familias',
 marcado_veces: 'lo marcaste en {n} texto{s}',
 sin_marcas: 'No has marcado ningún texto como «Me dice algo». Si alguno te lo dice, puedes marcarlo justo debajo; si no, también está bien.',
 solo_no: 'No has marcado ningún texto como «Me dice algo», y está bien. Lo que se repite entre tradiciones es solo un dato sobre las tradiciones, no sobre ti.',
 incierto_hora: 'incierto sin la hora',
 una_familia: 'Para ver qué se repite hacen falta al menos dos familias de tradiciones.',
 nada_repetido: 'Aquí cada tradición mira algo distinto y no hay temas que se repitan.',
 pestana_vacia: 'Con las tradiciones que elegiste no hay nada que mostrar en esta pestaña.'
};

/* ---------- la linea del azar con cifras solo es exacta si la persona ve lo mismo que midio la tabla ----------
   TABLA_AZAR se calculo con las 7 tradiciones que salen de la fecha, sin nombre (la numerologia por nombre
   anade cifras) y sin palma. Si falta alguna tradicion, hay nombre que entra en la cuenta o hay quiromancia
   en la cuenta, las cifras ya no describen lo que se ve y se muestra la version sin cifras.
   claves = tradiciones elegidas; hayNombre = nombre completo rellenado; hayPalma = alguna linea de la palma rellenada.
   La palma o el nombre solo cuentan si su tradicion esta elegida (quiromancia / numerologia). */
function azarExacto(claves, hayNombre, hayPalma){
  claves = claves || [];
  var deFecha = TRADICIONES.filter(function(t){ return !t.soloConPalma; });
  if(!deFecha.every(function(t){ return claves.indexOf(t.clave) >= 0; })) return false;
  if(hayNombre && claves.indexOf('numerologia') >= 0) return false;
  if(hayPalma && claves.indexOf('quiromancia') >= 0) return false;
  return true;
}
/* texto del azar para "Tu base": con cifras si es exacto; si no, la version general. tema = el de la conclusion (opcional) */
function textoAzar(claves, hayNombre, hayPalma, tema){
  if(!azarExacto(claves, hayNombre, hayPalma)) return AVISO_AZAR_SIN_CIFRAS;
  var t = rellenar(AVISOS_AZAR[0], {desde: TABLA_AZAR.rango[0].slice(0, 4), hasta: TABLA_AZAR.rango[1].slice(0, 4), mediana: TABLA_AZAR.repetidos.mediana});
  if(tema && TABLA_AZAR.temas[tema]) t += ' ' + rellenar(AVISOS_AZAR[1], {tema: tema, pctTema: Math.round(TABLA_AZAR.temas[tema].dos)});
  return t;
}

/* resumen: funcion PURA. Cruza lo que se repite entre familias (de las tarjetas elegidas) con lo que la
   persona marco. marcas = {idTexto: 'si'|'no'}; "No se" = sin entrada. Sin ningun 'si' no hay conclusion. Los textos con incierto (Luna sin hora)
   no cuentan ni se pueden marcar. Devuelve la estructura para pintar y la plantilla de CONCLUSIONES elegida. */
function resumen(tarjetas, marcas){
  tarjetas = tarjetas || []; marcas = marcas || {};
  var limpias = tarjetas.map(function(c){
    var tags = []; (c.items || []).forEach(function(i){ if(i.incierto) return; (i.tags || []).forEach(function(t){ if(tags.indexOf(t) < 0) tags.push(t); }); });
    return {trad: c.trad, familia: c.familia || familiaDe(c.trad), tags: tags};
  });
  var co = coincidenciasPorFamilia(limpias), porTema = {};
  co.temas.forEach(function(t){ porTema[t.tema] = t; });
  var repetidos = co.temas.filter(function(t){ return t.n >= 2; });
  var vistos = {}, nSi = 0, nNo = 0, veces = {}, excluidos = [];
  tarjetas.forEach(function(c){ (c.items || []).forEach(function(i){
    if(!i.id) return;
    if(i.incierto){ excluidos.push(i.id); return; }
    if(vistos[i.id]) return; vistos[i.id] = true;
    var m = marcas[i.id];
    if(m === 'si'){ nSi++; (i.tags || []).forEach(function(t){ veces[t] = (veces[t] || 0) + 1; }); }
    else if(m === 'no') nNo++;
  }); });
  var idx = function(t){ return TEMAS.indexOf(t); };
  var marcados = TEMAS.filter(function(t){ return veces[t]; }).map(function(t){ return {tema: t, veces: veces[t], n: porTema[t] ? porTema[t].n : 0}; })
    .sort(function(a, b){ return b.veces - a.veces || b.n - a.n || idx(a.tema) - idx(b.tema); });
  var cruces = marcados.filter(function(m){ return m.n >= 2; });
  var plantilla = null, v = {max: co.maxFamilias, marcas: marcados.length, cruces: cruces.length};
  /* con una sola familia no hay nada que cruzar (y saldria "1 de las 1 familias"): sin conclusion */
  if(co.maxFamilias < 2){ /* nada */ }
  else if(nSi > 0){
    if(cruces.length >= 2){ plantilla = 'varios_cruces'; v.tema = cruces[0].tema; v.n = cruces[0].n; }
    else if(cruces.length === 1){ plantilla = 'marcado_repetido'; v.tema = cruces[0].tema; v.n = cruces[0].n; }
    else if(marcados.length === 1){ v.tema = marcados[0].tema; v.n = marcados[0].n; plantilla = v.n === 0 ? 'marcado_en_ninguna' : 'marcado_en_una'; }
    else plantilla = 'ningun_cruce';
  }
  /* sin ningun "Me dice algo" no hay conclusion, tampoco si solo hay "No me dice nada" */
  return {
    max: co.maxFamilias, familiasPresentes: co.familiasPresentes,
    repetidos: repetidos.map(function(t){ return {tema: t.tema, n: t.n, familias: t.familias, etiquetas: t.etiquetas}; }),
    marcados: marcados, cruces: cruces, nSi: nSi, nNo: nNo, excluidos: excluidos,
    plantilla: plantilla, valores: v, tema: v.tema || null,
    texto: plantilla ? rellenar(CONCLUSIONES[plantilla], v) : ''
  };
}

raiz.Lecturas = {leer: leer, coincidencias: coincidencias, coincidenciasPorFamilia: coincidenciasPorFamilia, catalogo: catalogo,
  TRADICIONES: TRADICIONES, tradicionDe: tradicionDe, elegir: elegir, resumen: resumen, azarExacto: azarExacto, textoAzar: textoAzar, AVISO_AZAR_SIN_CIFRAS: AVISO_AZAR_SIN_CIFRAS, TEXTOS_UI: TEXTOS_UI,
  TEMAS: TEMAS, DESCRIPCION_TEMAS: DESCRIPCION_TEMAS, FAMILIAS: FAMILIAS, familiaDe: familiaDe, NOMBRE_SECCION: NOMBRE_SECCION,
  ORIGENES: ORIGENES, CONCLUSIONES: CONCLUSIONES, AVISOS_AZAR: AVISOS_AZAR, rellenar: rellenar, TABLA_AZAR: TABLA_AZAR, _t: {arbolDe: arbolDe, lonSol: lonSol, lonLuna: lonLuna, anoNuevoChino: anoNuevoChino, caminoDeVida: caminoDeVida, sumaNombre: sumaNombre, esVocal: esVocal, red: red, arcanosDe: arcanosDe, utcDeLocal: utcDeLocal, proximaFase: proximaFase, elong: elong, T_de: T_de}};
})(typeof window !== 'undefined' ? window : globalThis);
