/* Tabla del azar de "Lecturas": cuantos temas se repiten entre familias de fuentes por pura aritmetica.
   Sin dependencias y sin generador aleatorio: recorre TODAS las fechas de nacimiento del rango, una a una,
   y calcula cada lectura con el motor real (lecturas.js). Solo lee lecturas.js; no escribe nada ni usa la red.

   Uso:   node tools/azar_coincidencias.js        -> imprime la constante TABLA_AZAR para pegarla en lecturas.js
   Desde otro script: require('./azar_coincidencias.js').calcular()

   Supuestos (los mismos que usa la web cuando la persona no da mas datos):
   - sin hora de nacimiento: el motor usa las 12:00 hora local. Zona: America/Havana (la primera de la lista
     del formulario). Para el Sol casi no importa; la Luna avanza unos 13 grados al dia, asi que en los dias en
     que cambia de signo el resultado depende de esa hora supuesta.
   - sin nombre (la numerologia solo usa la fecha) y sin quiromancia: las familias posibles son 4
     (Sol y Luna, ano chino, arboles celtas, aritmetica de la fecha). Con quiromancia serian 5.
   - solo la pestana "Tu base" (lectura.nacimiento).
   - percentiles por rango mas cercano sobre la lista ordenada. */
'use strict';
var path = require('path');
require(path.join(__dirname, '..', 'lecturas.js'));
var L = globalThis.Lecturas;

var DESDE = [1930, 1, 1], HASTA = [2010, 12, 31], TZ = 'America/Havana';
var AHORA = Date.UTC(2026, 0, 1, 12); /* fijo: no afecta a "Tu base", solo evita depender del reloj */

function percentil(ordenados, p){ var i = Math.ceil(p / 100 * ordenados.length) - 1; return ordenados[Math.max(0, Math.min(ordenados.length - 1, i))]; }
function iso(f){ return f[0] + '-' + ('0' + f[1]).slice(-2) + '-' + ('0' + f[2]).slice(-2); }
function r1(x){ return Math.round(x * 10) / 10; }

function calcular(opciones){
  opciones = opciones || {};
  var desde = opciones.desde || DESDE, hasta = opciones.hasta || HASTA, paso = opciones.paso || 1;
  var t = Date.UTC(desde[0], desde[1] - 1, desde[2]), fin = Date.UTC(hasta[0], hasta[1] - 1, hasta[2]);
  var temas = {}, repetidos = [], total = 0, conAlguno = 0, conTres = 0, conCuatro = 0, maxObs = 0, maxFam = 0;
  L.TEMAS.forEach(function(x){ temas[x] = {dos: 0, tres: 0}; });
  for(; t <= fin; t += 86400000 * paso){
    var f = new Date(t);
    var lec = L.leer({anio: f.getUTCFullYear(), mes: f.getUTCMonth() + 1, dia: f.getUTCDate(), hora: '', tz: TZ, palma: {}, ahora: AHORA});
    var co = L.coincidenciasPorFamilia(lec), rep = 0, mx = 0;
    maxFam = Math.max(maxFam, co.maxFamilias);
    co.temas.forEach(function(x){
      if(x.n >= 2){ temas[x.tema].dos++; rep++; }
      if(x.n >= 3) temas[x.tema].tres++;
      mx = Math.max(mx, x.n);
    });
    total++; repetidos.push(rep); maxObs = Math.max(maxObs, mx);
    if(rep > 0) conAlguno++; if(mx >= 3) conTres++; if(mx >= 4) conCuatro++;
  }
  repetidos.sort(function(a, b){ return a - b; });
  var reparto = {}; repetidos.forEach(function(r){ reparto[r] = (reparto[r] || 0) + 1; });
  Object.keys(reparto).forEach(function(k){ reparto[k] = r1(100 * reparto[k] / total); });
  var porTema = {};
  L.TEMAS.forEach(function(x){ porTema[x] = {dos: r1(100 * temas[x].dos / total), tres: r1(100 * temas[x].tres / total)}; });
  return {
    rango: [iso(desde), iso(hasta)], fechas: total, tz: TZ, hora: '12:00 local', paso: paso,
    maxFamilias: maxFam, maxFamiliasConPalma: maxFam + 1, maxObservado: maxObs,
    pctConAlguno: r1(100 * conAlguno / total), pctConTres: r1(100 * conTres / total), pctConCuatro: r1(100 * conCuatro / total),
    repetidos: {p10: percentil(repetidos, 10), mediana: percentil(repetidos, 50), p90: percentil(repetidos, 90), reparto: reparto},
    temas: porTema
  };
}

if(require.main === module){
  var inicio = Date.now(), tabla = calcular();
  console.log('var TABLA_AZAR = ' + JSON.stringify(tabla) + ';');
  console.error('fechas: ' + tabla.fechas + ' · ' + ((Date.now() - inicio) / 1000).toFixed(1) + ' s');
}
module.exports = {calcular: calcular};
