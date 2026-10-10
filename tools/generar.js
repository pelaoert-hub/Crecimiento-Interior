// genera articulos/<id>/index.html y sitemap.xml a partir de articulos.js
// uso: node tools/generar.js
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..');
require(path.join(raiz, 'articulos.js'));
const A = globalThis.ARTICULOS, SITIO = 'https://vantlygo.com', NOMBRE = 'Ánima';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

A.forEach((a, i) => {
  const url = SITIO + '/articulos/' + a.id + '/';
  const sig = A[(i + 1) % A.length];
  const ld = JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:a.titulo,description:a.resumen,inLanguage:'es',mainEntityOfPage:url,publisher:{'@type':'Organization',name:NOMBRE}});
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(a.titulo)} · ${NOMBRE}</title>
<meta name="description" content="${esc(a.resumen)}">
${a.borrador ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(a.titulo)}"><meta property="og:description" content="${esc(a.resumen)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITIO}/icons/icon-512.png">
<meta name="theme-color" content="#0a0820">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/png" href="/icons/favicon-32.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="preload" href="/fuentes/Marcellus-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/estilo.css">
<script type="application/ld+json">${ld}</script>
</head>
<body class="pagina-articulo">
<canvas class="estrellas" id="estrellas" aria-hidden="true"></canvas>
<header class="cab"><div class="ancho">
  <a class="marca" href="/"><img src="/icons/favicon-32.png" alt="" width="26" height="26">${NOMBRE}</a>
  <a class="btn-menu" href="/#biblioteca" style="text-decoration:none">Biblioteca</a>
</div></header>
<main><article class="lectura">
  <a href="/#biblioteca" class="volver">← Biblioteca</a>
  <p style="margin-top:18px"><span class="etiqueta">${esc(a.tema)}</span> <span class="etiqueta">${a.minutos} min</span> ${a.borrador ? '<span class="etiqueta" style="color:#f3d4a8">Borrador sin revisar</span>' : ''}</p>
  <h1>${esc(a.titulo)}</h1>
  <p class="entradilla">${esc(a.resumen)}</p>
  ${a.cuerpo}
  <div class="acciones"><button class="boton" id="compartir" type="button">Compartir</button> <a class="boton lleno" href="/articulos/${sig.id}/">Siguiente: ${esc(sig.titulo)} →</a></div>
</article></main>
<footer><div class="ancho">${NOMBRE} · Orientación general; no sustituye ayuda médica ni psicológica.</div></footer>
<script>
document.getElementById('compartir').onclick=function(){var d={title:document.title,url:location.href};
 if(navigator.share){navigator.share(d).catch(function(){})}else if(navigator.clipboard){navigator.clipboard.writeText(d.url);this.textContent='Enlace copiado'}};
(function(){var c=document.getElementById('estrellas'),x=c.getContext('2d');if(!x)return;var D=Math.min(devicePixelRatio||1,2),W=c.width=innerWidth*D,H=c.height=innerHeight*D,n=Math.round(innerWidth*innerHeight/11000);
 x.fillStyle='#fff';for(var i=0;i<n;i++){x.globalAlpha=.3+Math.random()*.5;x.beginPath();x.arc(Math.random()*W,Math.random()*H,(Math.random()*1.1+.3)*D,0,6.3);x.fill()}})();
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(function(){});
</script>
</body>
</html>
`;
  fs.mkdirSync(path.join(raiz, 'articulos', a.id), { recursive: true });
  fs.writeFileSync(path.join(raiz, 'articulos', a.id, 'index.html'), html);
});

// sitemap: solo lo revisado (los borradores llevan noindex y no se listan)
const urls = [SITIO + '/'].concat(A.filter(a => !a.borrador).map(a => SITIO + '/articulos/' + a.id + '/'));
fs.writeFileSync(path.join(raiz, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(u => '  <url><loc>' + u + '</loc></url>').join('\n') + '\n</urlset>\n');
console.log('generados', A.length, 'articulos;', urls.length, 'url en el sitemap');
