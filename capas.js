/* capas: interruptor de la capa Cuba. La preferencia se guarda solo en este dispositivo. */
(function(){
'use strict';
var $ = function(id){ return document.getElementById(id); };
if(!$('capa-toggle')) return;
var K = 'ci_capa_cuba', mem = null;
function leer(){ try { return localStorage.getItem(K); } catch(e){ return mem; } }
function guardar(v){ try { localStorage.setItem(K, v); } catch(e){ mem = v; } }
function aplicar(on){
  $('cuba').classList.toggle('oculto', !on); $('menu-cuba').classList.toggle('oculto', !on);
  $('capa-toggle').setAttribute('aria-pressed', on); $('capa-toggle').textContent = 'Capa Cuba: ' + (on ? 'activada' : 'desactivada');
}
aplicar(leer() === '1');
$('capa-toggle').addEventListener('click', function(){ var on = leer() !== '1'; guardar(on ? '1' : '0'); aplicar(on); });
/* sugerencia solo si la zona horaria del dispositivo es la de La Habana y la persona aun no decidio */
var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch(e){}
if(tz === 'America/Havana' && leer() === null){
  $('capa-banner').classList.remove('oculto');
  $('capa-si').addEventListener('click', function(){ guardar('1'); aplicar(true); $('capa-banner').classList.add('oculto'); $('cuba').scrollIntoView({behavior: 'smooth'}); });
  $('capa-no').addEventListener('click', function(){ guardar('0'); $('capa-banner').classList.add('oculto'); });
}
})();
