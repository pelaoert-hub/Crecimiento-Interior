require(require('path').join(__dirname,'../../iching.js')); require(require('path').join(__dirname,'../../lecturas.js')); let ok=true; const I=globalThis.IChing, L=globalThis.Lecturas;
function chk(n,c){ if(!c){ok=false;} console.log(c?'ok ':'FALLA',n); }
// 64 combinaciones de lineas -> 64 numeros distintos 1..64
const vistos=new Set(); for(let i=0;i<64;i++){ const l=[0,1,2,3,4,5].map(b=>(i>>b)&1); vistos.add(I.numeroDe(l)); }
chk('64 hexagramas distintos', vistos.size===64 && Math.min(...vistos)===1 && Math.max(...vistos)===64);
chk('1 = todo continuo', I.numeroDe([1,1,1,1,1,1])===1); chk('2 = todo partido', I.numeroDe([0,0,0,0,0,0])===2);
chk('11 Paz (tierra arriba, cielo abajo)', I.numeroDe([1,1,1,0,0,0])===11); chk('12 Estancamiento (cielo arriba, tierra abajo)', I.numeroDe([0,0,0,1,1,1])===12);
chk('63 Despues de la consumacion (fuego abajo, agua arriba)', I.numeroDe([1,0,1,0,1,0])===63); chk('64 Antes de la consumacion', I.numeroDe([0,1,0,1,0,1])===64);
chk('29 Lo abismal (agua/agua)', I.numeroDe([0,1,0,0,1,0])===29); chk('30 Lo adherente (fuego/fuego)', I.numeroDe([1,0,1,1,0,1])===30);
chk('51 Lo suscitativo (trueno/trueno)', I.numeroDe([1,0,0,1,0,0])===51); chk('52 Aquietamiento (monta/monta)', I.numeroDe([0,0,1,0,0,1])===52);
chk('57 Lo suave (viento/viento)', I.numeroDe([0,1,1,0,1,1])===57); chk('58 Lo sereno (lago/lago)', I.numeroDe([1,1,0,1,1,0])===58);
chk('hay nombre para los 64', I.H.slice(1).every(h=>h&&h[0]&&h[1]) && I.H.length===65);
// tirada con valores fijos: 9 movil yang -> yin
const t=I.tirar([9,7,7,7,7,7]); chk('tirada con linea movil: primero 1 (Creativo) y segundo cambia', t.primero.numero===1 && t.moviles[0]===1 && t.segundo.numero===44);
const t2=I.tirar([7,8,7,8,7,8]); chk('sin moviles no hay segundo', !t2.segundo);
// distribucion de monedas: 6:7:8:9 = 1:3:3:1
const cnt={6:0,7:0,8:0,9:0}; for(let i=0;i<80000;i++){ const v=I.tirar().valores; v.forEach(x=>cnt[x]++); } const tot=480000; console.log('distribucion',Object.entries(cnt).map(([k,v])=>k+':'+(v/tot).toFixed(3)).join(' '),'(esperado 0.125 0.375 0.375 0.125)');
chk('distribucion de monedas razonable', Math.abs(cnt[6]/tot-.125)<.01 && Math.abs(cnt[7]/tot-.375)<.01);
// arboles: cada dia del ano tiene exactamente un arbol y los limites coinciden con la fuente
let sinArbol=0; for(let m=1;m<=12;m++){ const dm=[31,29,31,30,31,30,31,31,30,31,30,31][m-1]; for(let d=1;d<=dm;d++){ if(!L._t.arbolDe(m,d)) sinArbol++; } }
chk('todos los dias tienen arbol', sinArbol===0);
const A=L._t.arbolDe; const pr=(m,d)=>A(m,d)[0];
chk('limites: 24-dic Abedul, 20-ene Abedul, 21-ene Serbal', pr(12,24)==='Abedul'&&pr(1,20)==='Abedul'&&pr(1,21)==='Serbal'); chk('23-dic Saúco, 24-nov Saúco, 23-nov Caña', pr(12,23)==='Saúco'&&pr(11,24)==='Saúco'&&pr(11,23)==='Caña');
chk('29-jul Acebo, 15-abr Sauce, 10-jun Roble', pr(7,29)==='Acebo'&&pr(4,15)==='Sauce'&&pr(6,10)==='Roble');
const r=L.leer({nombre:'Ana',anio:1990,mes:7,dia:29,hora:'',tz:'America/Havana',palma:{},ahora:Date.UTC(2026,9,10,15)});
chk('lectura incluye arbol celta en nacimiento y mes', r.nacimiento.some(c=>c.trad.startsWith('Árboles'))&&r.mes.some(c=>c.trad.startsWith('Árboles')));
console.log(r.nacimiento.find(c=>c.trad.startsWith('Árboles')).items[0].k,'|',r.mes.find(c=>c.trad.startsWith('Árboles')).items[0].k);
console.log(ok?'TODO OK':'HAY FALLOS'); process.exit(ok?0:1);
