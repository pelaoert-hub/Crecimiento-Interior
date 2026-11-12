require(require('path').join(__dirname,'../../lecturas.js')); const L=globalThis.Lecturas, t=L._t; let ok=true;
function chk(n,a,b,tol){ const p=Math.abs(a-b)<=tol; if(!p)ok=false; console.log(p?'ok ':'FALLA',n,a,'esperado',b); }
// Meeus ej. 47.a: 1992-04-12 0h TD, luna lambda=133.162655 ; ej 25.a: 1992-10-13 0h TD sol ~199.909
const ts1=Date.UTC(1992,3,12,0,0,0), ts2=Date.UTC(1992,9,13,0,0,0);
chk('luna 1992-04-12', t.lonLuna(ts1), 133.1627, 0.05); chk('sol 1992-10-13', t.lonSol(ts2), 199.909, 0.02);
chk('sol J2000', t.lonSol(Date.UTC(2000,0,1,12)), 280.37, 0.1);
// Ano nuevo chino conocidos
const cny={1950:[2,17],1960:[1,28],1970:[2,6],1975:[2,11],1980:[2,16],1985:[2,20],1990:[1,27],1993:[1,23],1996:[2,19],1997:[2,7],1999:[2,16],2000:[2,5],2001:[1,24],2002:[2,12],2003:[2,1],2004:[1,22],2006:[1,29],2008:[2,7],2010:[2,14],2012:[1,23],2013:[2,10],2014:[1,31],2015:[2,19],2016:[2,8],2018:[2,16],2019:[2,5],2020:[1,25],2021:[2,12],2022:[2,1],2023:[1,22],2024:[2,10],2025:[1,29],2026:[2,17]};
let bad=[]; for(const y in cny){ const r=t.anoNuevoChino(+y); if(r.mes!==cny[y][0]||r.dia!==cny[y][1]) bad.push(y+': '+r.mes+'/'+r.dia+' vs '+cny[y]); }
console.log('CNY', Object.keys(cny).length-bad.length,'/',Object.keys(cny).length,'ok', bad.length?bad:''); if(bad.length) ok=false;
// camino de vida: 1990-07-29 -> 1 ; 1985-03-14 -> 3 -> (3+5+... ) calcular
console.log('camino 1990-07-29 =',t.caminoDeVida(1990,7,29),'(esperado 1)');
console.log('nombre Ana Maria expresion:', t.red(t.sumaNombre('Ana María',()=>true)));
console.log('arcano 31 ->',t.arcanosDe(31),' 19 ->',t.arcanosDe(19),' 22 ->',t.arcanosDe(22));
// luna nueva conocida 2024-02-09 22:59 UTC ; llena 2024-02-24 12:30 UTC
const nm=t.proximaFase(Date.UTC(2024,1,1),0), fm=t.proximaFase(Date.UTC(2024,1,15),180);
console.log('luna nueva',new Date(nm).toISOString(),'(esperado ~2024-02-09T22:59)'); console.log('luna llena',new Date(fm).toISOString(),'(esperado ~2024-02-24T12:30)');
// lectura completa
const r=L.leer({nombre:'Ana María Pérez',anio:1990,mes:7,dia:29,hora:'',tz:'America/Havana',palma:{corazon:'curva'},ahora:Date.UTC(2026,9,10,15)});
console.log(JSON.stringify(r.resumen)); console.log(r.nacimiento.map(c=>c.trad).join(' | '));
console.log('coinciden',JSON.stringify(L.coincidencias(r.nacimiento)));
// ---- vocabulario, ids y temas de cada texto ----
function si(n,c){ if(!c) ok=false; console.log(c?'ok ':'FALLA',n); }
si('12 temas, cada uno con descripcion', L.TEMAS.length===12 && L.TEMAS.every(t=>L.DESCRIPCION_TEMAS[t]));
const cat=L.catalogo(), ids=cat.map(x=>x.id);
si('catalogo: '+cat.length+' textos con tema', cat.length===95);
si('ids unicos', new Set(ids).size===ids.length);
si('ids legibles (minusculas, sin acentos)', ids.every(i=>/^[a-z]+(-[a-z0-9]+)+$/.test(i)));
const malos=cat.filter(x=>!Array.isArray(x.temas)||x.temas.length<1||x.temas.length>3||new Set(x.temas).size!==x.temas.length||x.temas.some(t=>!L.TEMAS.includes(t)));
si('cada texto tiene 1 a 3 temas validos del vocabulario'+(malos.length?' '+malos.map(x=>x.id):''), malos.length===0);
si('todas las tarjetas de la lectura tienen familia', ['nacimiento','hoy','mes','ano'].every(k=>r[k].every(c=>L.FAMILIAS[c.familia])));
// ---- coincidencias por familia ----
const cf=L.coincidenciasPorFamilia(r);
si('con quiromancia hay 5 familias', cf.maxFamilias===5);
si('devuelve los 12 temas con n = familias distintas', cf.temas.length===12 && cf.temas.every(t=>t.n===t.familias.length && new Set(t.familias).size===t.n && t.n<=cf.maxFamilias));
const sinPalma=L.leer({anio:1990,mes:7,dia:29,hora:'',tz:'America/Havana',palma:{},ahora:Date.UTC(2026,9,10,15)});
const cf2=L.coincidenciasPorFamilia(sinPalma.nacimiento);
si('sin quiromancia hay 4 familias; numerologia, cabala, tarot y dia cuentan como una', cf2.maxFamilias===4 && cf2.temas.every(t=>t.familias.every(f=>['astros','ano_chino','arboles','aritmetica'].includes(f))));
console.log('por familia 1990-07-29:',cf2.temas.filter(t=>t.n>=2).map(t=>t.tema+' '+t.n+' ('+t.etiquetas.join(', ')+')').join(' | '));
// ---- textos nuevos ----
si('origen para las 8 tradiciones del cruce y el I Ching', ['zodiaco','zodiaco_chino','arboles','numerologia','cabala','tarot','dia_planetario','quiromancia','iching'].every(k=>L.ORIGENES[k]&&L.ORIGENES[k].length>40));
const concl=Object.values(L.CONCLUSIONES);
si('6 conclusiones que terminan en pregunta abierta con "dejarlo estar"', concl.length===6 && concl.every(c=>/dejarlo estar\?$/.test(c)));
const todos=[L.NOMBRE_SECCION].concat(concl,L.AVISOS_AZAR,Object.values(L.ORIGENES),Object.values(L.DESCRIPCION_TEMAS)).join(' ');
si('sin "consenso" ni lenguaje de prediccion', !/consenso|predic|destino|te pasará|ocurrirá|seguro que/i.test(todos));
si('rellenar plantillas', L.rellenar(L.CONCLUSIONES.marcado_repetido,{tema:'Cambio',n:3,max:4})==='Marcaste «Cambio» y ese tema aparece en 3 de las 4 familias que miraste. No anuncia nada: es un tema que hoy te llamó la atención. ¿Hay algo pequeño que querrías mirar más de cerca esta semana, o prefieres dejarlo estar?');
// ---- fase 2: elegir tradiciones y resumen (marcas + coincidencia) con tarjetas fijas ----
const C=(trad,familia,items)=>({trad,familia,items,tags:[...new Set(items.flatMap(i=>i.tags))]});
const fij=[
  C('Astrología occidental','astros',[{id:'a1',tags:['Cambio']},{id:'a2',tags:['Sensibilidad'],incierto:true}]),
  C('Astrología china','ano_chino',[{id:'b1',tags:['Cambio','Libertad']}]),
  C('Tarot','aritmetica',[{id:'c1',tags:['Cambio']}]),
  C('Cábala (lectura inspirada)','aritmetica',[{id:'d1',tags:['Libertad','Sensibilidad']}]),
  C('Árboles celtas (calendario moderno)','arboles',[{id:'f1',tags:['Sensibilidad']}]),
  C('Quiromancia','quiromancia',[{id:'g1',tags:['Límites']}]),
  C('Otra cosa',null,[{id:'e1',tags:['Palabra']}])
];
const R=m=>L.resumen(fij,m), nDe=(r,t)=>(r.repetidos.find(x=>x.tema===t)||{n:0}).n;
const r0=R({});
si('resumen: 5 familias, la tarjeta sin familia no cuenta', r0.max===5);
si('resumen: tarot y cabala son la misma familia (Cambio 3, Libertad 2; no 4 y 3)', nDe(r0,'Cambio')===3 && nDe(r0,'Libertad')===2);
si('resumen: la Luna incierta no cuenta (Sensibilidad 2, no 3)', nDe(r0,'Sensibilidad')===2);
si('resumen sin marcas: sin conclusion de cruce', r0.plantilla===null && r0.texto==='' && r0.nSi===0 && r0.marcados.length===0);
const r1=R({c1:'si'});
si('una marca que cruza -> marcado_repetido "3 de las 5"', r1.plantilla==='marcado_repetido' && r1.tema==='Cambio' && /aparece en 3 de las 5 familias/.test(r1.texto));
const r2=R({g1:'si'});
si('marca en tema de una sola familia -> marcado_en_una', r2.plantilla==='marcado_en_una' && r2.tema==='Límites' && r2.valores.n===1 && r2.cruces.length===0);
const r3=R({e1:'si'});
si('marca en tema que ninguna familia nombra -> marcado_en_ninguna', r3.plantilla==='marcado_en_ninguna' && r3.tema==='Palabra' && r3.valores.n===0);
const r4=R({g1:'si',e1:'si'});
si('varias marcas que no cruzan -> ningun_cruce', r4.plantilla==='ningun_cruce' && /Ninguno de los 2 temas/.test(r4.texto));
const r5=R({c1:'si',b1:'si',d1:'si'});
si('varias que cruzan -> varios_cruces, primero lo mas marcado', r5.plantilla==='varios_cruces' && r5.cruces.map(x=>x.tema).join()==='Cambio,Libertad,Sensibilidad' && r5.tema==='Cambio' && /^3 de los 3 temas/.test(r5.texto));
const r6=R({a1:'no',b1:'no',c1:'no',d1:'no',f1:'no',g1:'no',e1:'no'});
si('todo "no" sobre los temas repetidos -> sin conclusion', r6.plantilla===null && r6.nNo===7 && r6.marcados.length===0);
const r7=R({g1:'no'});
si('solo "no" en otro tema -> repetido_no_marcado con el mas repetido', r7.plantilla==='repetido_no_marcado' && r7.tema==='Cambio');
const r8=R({a2:'si'});
si('la Luna incierta no se puede marcar', r8.nSi===0 && r8.plantilla===null && r8.excluidos.includes('a2'));
si('el mismo id en dos tarjetas cuenta una vez', L.resumen(fij.concat([C('Tarot','aritmetica',[{id:'c1',tags:['Cambio']}])]),{c1:'si'}).marcados[0].veces===1);
si('ninguna plantilla elegida usa la palabra consenso', [r1,r2,r3,r4,r5,r7].every(x=>x.texto && !/consenso|\{/.test(x.texto)));
// elegir tradiciones sobre una lectura real
si('8 tradiciones elegibles, todas con origen', L.TRADICIONES.length===8 && L.TRADICIONES.every(t=>L.ORIGENES[t.clave] && L.FAMILIAS[t.familia]));
si('cada tarjeta de la lectura tiene tradicion elegible', ['nacimiento','hoy','mes','ano'].every(k=>r[k].every(c=>L.tradicionDe(c.trad))));
const soloZ=L.elegir(r.nacimiento,['zodiaco']);
si('elegir: lo no elegido no aparece', soloZ.length===1 && soloZ[0].trad==='Astrología occidental');
si('elegir: sin tarot ni cabala no cambia la familia aritmetica si queda numerologia', L.resumen(L.elegir(r.nacimiento,['zodiaco','numerologia']),{}).max===2);
// luna incierta en una lectura real: buscar un dia sin hora en que la Luna cambie de signo
let incierta=null; for(let d=1;d<=31&&!incierta;d++){ const x=L.leer({anio:1990,mes:7,dia:d,hora:'',tz:'America/Havana',palma:{},ahora:Date.UTC(2026,9,10,15)}); const it=x.nacimiento[0].items[1]; if(it.incierto) incierta={d,x,it}; }
si('hay dias de julio 1990 con Luna incierta y el aviso lo dice', !!incierta && incierta.x.nacimiento[0].items.some(i=>i.k==='Aviso'&&/Luna/.test(i.d)));
const conHora=L.leer({anio:1990,mes:7,dia:incierta.d,hora:10,min:0,tz:'America/Havana',palma:{},ahora:Date.UTC(2026,9,10,15)});
si('con hora la Luna deja de ser incierta', !conHora.nacimiento[0].items[1].incierto);
si('la Luna incierta no se marca en la lectura real', L.resumen(incierta.x.nacimiento,{[incierta.it.id]:'si'}).nSi===0);
console.log('ejemplo 1990-07-29, marcando el Sol:', L.resumen(r.nacimiento,{[r.nacimiento[0].items[0].id]:'si'}).texto);
// ---- tabla del azar: se recalcula entera (unos 40 s) y debe coincidir con la guardada ----
const T=L.TABLA_AZAR, calc=require(require('path').join(__dirname,'../azar_coincidencias.js')).calcular();
si('TABLA_AZAR guardada', !!T && T.fechas===29585);
si('TABLA_AZAR coincide con lo que calcula el motor', JSON.stringify(T)===JSON.stringify(calc));
console.log(ok?'TODO OK':'HAY FALLOS'); process.exit(ok?0:1);
