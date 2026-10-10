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
console.log(ok?'TODO OK':'HAY FALLOS'); process.exit(ok?0:1);
