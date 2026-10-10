/* capa Cuba: datos. Cada dato lleva las fuentes (numeros de FUENTES) donde se comprobo.
   Regla: lo que aparece en una sola fuente se marca asi; lo que las fuentes se contradicen se deja fuera o se avisa. */
(function(raiz){
'use strict';

var FUENTES = [
 null,
 {t:'La religión: la Regla de Ocha (texto de la Hispano Cubano)', u:'https://www.hispanocubano.org/cas/cul3c1.pdf'},
 {t:'Santería (Wikipedia en español)', u:'https://es.wikipedia.org/wiki/Santer%C3%ADa'},
 {t:'The gods of Santería (Museo de Historia Cultural de la Universidad de Oslo)', u:'https://www.historiskmuseum.no/english/exhibitions/exhibitions-archive/santeria/the-gods-of-santeria/'},
 {t:'Diloggun (EcuRed)', u:'https://www.ecured.cu/Diloggun'},
 {t:'Refranes adivinatorios de Osha-Ifá (Proyecto Orunmila)', u:'https://www.refranesadivinatoriosdeoshaifa.com/'},
 {t:'Ifá (Wikipedia en español)', u:'https://es.wikipedia.org/wiki/If%C3%A1'},
 {t:'Odù Ifá (Wikipedia en inglés)', u:'https://en.wikipedia.org/wiki/Od%C3%B9_If%C3%A1'},
 {t:'Palo (religión) (Wikipedia en español)', u:'https://es.wikipedia.org/wiki/Palo_(religi%C3%B3n)'},
 {t:'Cowrie-shell divination (Wikipedia en inglés)', u:'https://en.wikipedia.org/wiki/Cowrie-shell_divination'}
];

/* ---------- orishas ---------- */
/* n nombre, rep que representa, col colores, santo, fiesta, palo (mpungu equivalente), f fuentes, nota */
var ORISHAS = [
 {n:'Elegguá', rep:'Dueño de los caminos y las encrucijadas. Es el mensajero entre Olofin, los orishas y las personas, y abre y cierra los caminos. En cualquier ritual se le saluda primero.', col:'Negro y rojo', santo:'Santo Niño de Atocha y San Antonio de Padua', palo:'Nkuyu (Lucero)', f:[1,2,3,8], nota:'La fuente 1 cita también a San Roque y al Ánima Sola.'},
 {n:'Ogún', rep:'Dueño de los metales y del trabajo. La fuente 1 lo asocia también con la guerra.', col:'Negro y verde', santo:'San Pedro', palo:'Sarabanda', f:[1,2,3,8], nota:'La fuente 1 cita también a San Pablo, San Juan Bautista y San Miguel Arcángel.'},
 {n:'Ochosi', rep:'Orisha de la caza, la justicia, las cárceles y las leyes.', col:'', santo:'San Norberto', fiesta:'6 de junio', palo:'Surumba Mukalla', f:[1,2,3,8], nota:'Las fuentes no coinciden en su color, por eso no se indica. La fuente 8 asocia a su equivalente congo con San Juan Bautista, y las demás fuentes dan ese santo a otros orishas.'},
 {n:'Osun', rep:'Uno de los orishas guerreros (Oddé), junto a Elegguá, Ogún y Ochosi.', col:'', santo:'San Juan Bautista', f:[2], nota:'Una sola fuente. Otras fuentes asignan ese santo a Ogún u Ochosi.'},
 {n:'Obatalá', rep:'Ayudó a Olofin a crear la tierra y a las personas. Se le asocia con la paz y la pureza.', col:'Blanco', santo:'Virgen de las Mercedes', fiesta:'24 de septiembre', palo:'Ma Kengue', f:[1,2,3,8], nota:'La fuente 1 cita además a Jesús Nazareno y a otros santos para distintos caminos de Obatalá.'},
 {n:'Yemayá', rep:'Dueña del mar y madre de los orishas y de las personas.', col:'Azul (collar de cuentas azules y blancas)', santo:'Virgen de Regla', fiesta:'7 de septiembre', palo:'Má Lango (Madre de Agua)', f:[1,2,3,8]},
 {n:'Ochún', rep:'Dueña de los ríos y de las aguas dulces. Se le asocia con el amor, la belleza y la fertilidad.', col:'Amarillo', santo:'Virgen de la Caridad del Cobre', fiesta:'8 de septiembre', palo:'Chola Wengue', f:[1,2,3,8]},
 {n:'Changó', rep:'Dueño del fuego, el trueno, la música y el baile.', col:'Rojo y blanco', santo:'Santa Bárbara', fiesta:'4 de diciembre', palo:'Siete Rayos', f:[1,2,3,8]},
 {n:'Oyá', rep:'Dueña de las tempestades y de la centella. Cuida las puertas del cementerio.', col:'Tonos vino y los colores del arcoíris', santo:'Virgen de la Candelaria y Santa Teresa', fiesta:'2 de febrero', palo:'Mariwara (Centella Ndoki)', f:[1,2,3,8], nota:'La Candelaria aparece en las fuentes 1 y 2; Santa Teresa en las fuentes 1, 3 y 8.'},
 {n:'Orula (Orunmila)', rep:'Orisha de la adivinación y del consejo. Es el santo de los babalawos y del sistema de Ifá.', col:'Verde y amarillo', santo:'San Francisco de Asís', fiesta:'4 de octubre', palo:'Kimbabula', f:[1,2,3,6,8]},
 {n:'Babalú Ayé', rep:'Dueño de las enfermedades. Es uno de los orishas más venerados en Cuba.', col:'Blanco con rayas azul claro (collar)', santo:'San Lázaro', fiesta:'17 de diciembre', palo:'Kobayende', f:[1,2,3,8]},
 {n:'Ibeyi', rep:'Los mellizos. Divinidades infantiles, queridas y mimadas por los demás orishas y por las personas.', col:'', santo:'San Cosme y San Damián', f:[1,2], nota:'La fuente 2 cita solo a San Damián.'},
 {n:'Orisha Oko', rep:'Orisha de la agricultura. Sus atributos incluyen la figura de un labrador y una yunta de bueyes.', col:'', santo:'San Isidro Labrador', fiesta:'15 de mayo', f:[1,2]},
 {n:'Inle', rep:'Su símbolo es el pez. La fuente 1 lo describe como muy casto.', col:'', santo:'San Rafael', fiesta:'24 de octubre', f:[1,2], nota:'La fuente 2 menciona también a San Roque.'},
 {n:'Aggayú Solá', rep:'Las fuentes consultadas no detallan lo que representa.', col:'', santo:'San Cristóbal', f:[1,2]},
 {n:'Osain', rep:'Dueño de las hierbas y del monte. Se le asocia con las hierbas mágicas.', col:'', santo:'Varía: San Silvestre o San Norberto', palo:'Gurunfinda', f:[1,8], nota:'Las fuentes no coinciden en el santo, por eso se indican las dos opciones que aparecen.'},
 {n:'Olokun', rep:'Orisha mayor asociado con el mar. Su color es el azul oscuro.', col:'Azul oscuro', santo:'Las fuentes consultadas no le asignan un santo', f:[1,2]},
 {n:'Naná Burukú', rep:'Orisha mayor. Las fuentes consultadas no detallan lo que representa.', col:'', santo:'Santa Ana', f:[2], nota:'Una sola fuente.'},
 {n:'Yewá', rep:'La doncella que vive en el cementerio y recibe a los difuntos.', col:'', santo:'Santa Clara', f:[1], nota:'Una sola fuente.'},
 {n:'Oba', rep:'Se le asocia con el hogar y la entrega en el matrimonio. También se la describe como maestra y escritora.', col:'Rosado', santo:'Santa Catalina de Siena', f:[1], nota:'Una sola fuente.'}
];

/* ---------- diloggun ---------- */
/* num caracoles abiertos, n nombre, frase = texto literal de la fuente 5 (resumen de la letra),
   orishas = orishas que hablan en esa letra segun la fuente 4. La pregunta es de Anima, no de la tradicion. */
var LETRAS = [
 {num:1, n:'Okana', alt:'Okana Sorde', frase:['Por uno empezó el mundo.','Obitele Ofotele, Si no hay bueno no hay malo'], orishas:['Elegguá','Yewá'], q:'¿Qué estoy empezando? ¿Qué parte buena y qué parte difícil convive en lo que vivo hoy?'},
 {num:2, n:'Eyioko', frase:['Flecha entre hermanos'], orishas:['Ochosi','Orisha Oko','Ibeyi'], q:'¿Hay un conflicto cercano que pueda cuidar antes de que hiera?'},
 {num:3, n:'Ogunda', frase:['Discusión trágica por una cosa'], orishas:['Ogún'], q:'¿Por qué estoy discutiendo, y vale lo que me cuesta?'},
 {num:4, n:'Iroso', frase:['Nadie sabe lo que hay en el fondo del mar'], orishas:['Yemayá','Olokun','Yewá','Babalú Ayé','Orula'], q:'¿Qué hay en mí, o en alguien cercano, que aún no conozco del todo?'},
 {num:5, n:'Oshe', frase:['Sangre que corre por las venas'], orishas:['Ochún','Naná Burukú'], q:'¿Qué vínculos de familia o de origen me sostienen y cuáles me pesan?'},
 {num:6, n:'Obara', frase:['El rey no dice mentira'], orishas:['Changó','Orula'], q:'¿Soy coherente entre lo que digo y lo que hago?'},
 {num:7, n:'Odi', frase:['Donde por primera vez se hizo un entierro'], orishas:['Elegguá','Yemayá','Orisha Oko'], q:'¿Qué etapa necesito cerrar o despedir?'},
 {num:8, n:'Eyeunle', frase:['La cabeza es la que lleva al cuerpo.','Un solo rey gobierna un pueblo'], orishas:['Obatalá','Ochún','Obba','Orisha Oko','Olokun'], q:'¿Dejo que la razón guíe mis pasos? ¿Quién manda en mis decisiones?'},
 {num:9, n:'Osa', frase:['Su mejor amigo es su peor enemigo.'], orishas:['Obba','Yewá','Oyá'], q:'¿Qué costumbre o relación que parece buena me está perjudicando?'},
 {num:10, n:'Ofún', frase:['Donde nació la maldición'], orishas:['Ochún','Naná Burukú'], q:'¿Qué palabras o rencores guardo que convendría soltar?'},
 {num:11, n:'Ojuani', frase:['Sacar agua con canasta. Mal agradecimiento, desconfianza.'], orishas:['Elegguá','Babalú Ayé'], q:'¿Dónde me esfuerzo sin ver resultado? ¿Agradezco lo que recibo?'},
 {num:12, n:'Eyila', frase:['Cuando hay guerra, el soldado no duerme.'], orishas:['Changó','Obañeñe'], q:'¿Qué lucha me está quitando el descanso?'},
 {num:13, n:'Metanla', solo:true}, {num:14, n:'Merinla', solo:true}, {num:15, n:'Marunla', solo:true}, {num:16, n:'Merindilogun', solo:true}
];

/* ---------- Ifa: los 16 odu mayores (Meji) ---------- */
/* n nombre, cuba nombre usado en Cuba si difiere, ep epiteto (fuente 7), tema (fuente 6) */
var MEJI = [
 {n:'Ogbe Meji', alt:'Eyiogbe', ep:'El que sostiene', tema:'el comienzo de todo en el cielo y la tierra'},
 {n:'Oyeku Meji', alt:'Oyekun', ep:'La madre de la muerte (Iku)', tema:'el reino de los muertos'},
 {n:'Iwori Meji', ep:'El vidente profundo', tema:'la adivinación, la inteligencia y la profecía'},
 {n:'Odi Meji', ep:'El sello', tema:'la perversión y los vicios'},
 {n:'Irosun Meji', alt:'Iroso', ep:'El Oṣun que resuena', tema:'la religiosidad y el sufrimiento humano'},
 {n:'Owonrin Meji', alt:'Ojuani', ep:'La cabeza invertida', tema:'los fenómenos espirituales'},
 {n:'Obara Meji', ep:'El que descansa y se cierne', tema:'la sabiduría y la riqueza'},
 {n:'Okanran Meji', alt:'Okana', ep:'El que golpea palos y esteras', tema:'la confusión y las contrariedades'},
 {n:'Ogunda Meji', ep:'El creador', tema:'la lucha permanente y el poder'},
 {n:'Osa Meji', ep:'El espíritu de Sa (Oyá)', tema:'el mundo de los espíritus'},
 {n:'Ika Meji', ep:'El que controla', tema:'la hechicería y la maldad'},
 {n:'Oturupon Meji', alt:'Otrupon', ep:'El que carga', tema:'la enfermedad y el daño'},
 {n:'Otura Meji', ep:'El que consuela', tema:'la estabilidad y las acciones'},
 {n:'Irete Meji', ep:'El que aplasta', tema:'la reencarnación y las vidas pasadas'},
 {n:'Ose Meji', alt:'Oshe', ep:'El conquistador', tema:'los secretos religiosos'},
 {n:'Ofun Meji', alt:'Oragun', ep:'El que da', tema:'los misterios y la comprensión de las cosas'}
];

/* ---------- Palo Monte: mpungu <-> orisha <-> santo (fuente 8; contrastado con la 1 donde se indica) ---------- */
var MPUNGOS = [
 {n:'Nzambi (Nsambi)', ori:'Olofin', santo:'', nota:'Dios alto, creador del universo (fuente 8).'},
 {n:'Nkuyu (Lucero)', ori:'Elegguá', santo:'Santo Niño de Atocha'},
 {n:'Sarabanda', ori:'Ogún', santo:'San Pedro'},
 {n:'Siete Rayos', ori:'Changó', santo:'Santa Bárbara'},
 {n:'Má Lango (Madre de Agua)', ori:'Yemayá', santo:'Virgen de Regla'},
 {n:'Chola Wengue', ori:'Ochún', santo:'Virgen de la Caridad del Cobre'},
 {n:'Ma Kengue', ori:'Obatalá', santo:'Virgen de las Mercedes'},
 {n:'Kobayende', ori:'Babalú Ayé', santo:'San Lázaro'},
 {n:'Mariwara (Centella Ndoki)', ori:'Oyá', santo:'Santa Teresa'},
 {n:'Kimbabula', ori:'Orunmila', santo:'San Francisco de Asís'},
 {n:'Gurunfinda', ori:'Osain', santo:'', nota:'Dios del bosque y de las hierbas. Las fuentes no coinciden en su santo.'},
 {n:'Surumba Mukalla', ori:'Ochosi', santo:'', nota:'Dios de la caza y la guerra. Las fuentes no coinciden en su santo.'}
];

raiz.CUBA = {FUENTES: FUENTES, ORISHAS: ORISHAS, LETRAS: LETRAS, MEJI: MEJI, MPUNGOS: MPUNGOS};
})(typeof window !== 'undefined' ? window : globalThis);
