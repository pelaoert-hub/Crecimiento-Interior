/* service worker: la web funciona sin conexion. Subir VERSION al cambiar archivos del cascaron. */
var VERSION = 'anima-v6';
var CASCARON = ['/', '/estilo.css', '/fuentes/Marcellus-400.woff2', '/fuentes/HankenGrotesk.woff2', '/app.js', '/articulos.js', '/lecturas.js', '/lecturas-ui.js', '/iching.js', '/capas.js', '/cuba/', '/cuba-datos.js', '/cuba.js', '/config.js', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/favicon-32.png', '/icons/apple-touch-icon.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(CASCARON); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var r = e.request, u = new URL(r.url);
  if(r.method !== 'GET' || u.origin !== location.origin) return; /* la comunidad (otro dominio) va siempre a la red */
  if(r.mode === 'navigate'){
    /* paginas: red primero para ver cambios; sin red, la copia guardada o la portada */
    e.respondWith(fetch(r).then(function(res){
      var copia = res.clone(); caches.open(VERSION).then(function(c){ c.put(r, copia); }); return res;
    }).catch(function(){ return caches.match(r).then(function(m){ return m || caches.match('/'); }); }));
    return;
  }
  /* resto: copia guardada al instante y se refresca por detras */
  e.respondWith(caches.match(r).then(function(m){
    var red = fetch(r).then(function(res){
      if(res.ok){ var copia = res.clone(); caches.open(VERSION).then(function(c){ c.put(r, copia); }); }
      return res;
    }).catch(function(){ return m; });
    return m || red;
  }));
});
