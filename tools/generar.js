// genera articulos/<id>/index.html y sitemap.xml a partir de articulos.js
// uso: node tools/generar.js
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..');
require(path.join(raiz, 'articulos.js'));
const A = globalThis.ARTICULOS, SITIO = 'https://vantlygo.com', NOMBRE = 'Camino Interior';
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
<meta name="theme-color" content="#0f2e2b">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/png" href="/icons/favicon-32.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="stylesheet" href="/estilo.css">
<script type="application/ld+json">${ld}</script>
</head>
<body class="pagina-articulo">
<header class="nav"><div class="ancho">
  <a class="marca" href="/"><img src="/icons/favicon-32.png" alt="" width="26" height="26"> ${NOMBRE}</a>
  <nav><a href="/#articulos">Artículos</a><a href="/#ejercicios">Ejercicios</a><a href="/#seguimiento">Seguimiento</a><a href="/#comunidad">Comunidad</a></nav>
</div></header>
<main><article class="ancho lectura">
  <a href="/#articulos" class="volver">← Todos los artículos</a>
  <p><span class="etiqueta">${esc(a.tema)}</span> ${a.borrador ? '<span class="etiqueta borrador">Borrador sin revisar</span>' : ''} <span class="etiqueta">${a.minutos} min</span></p>
  <h1>${esc(a.titulo)}</h1>
  <p class="entradilla">${esc(a.resumen)}</p>
  ${a.cuerpo}
  <div class="acciones"><button class="boton sec" id="compartir" type="button">Compartir</button> <a class="boton" href="/articulos/${sig.id}/">Siguiente: ${esc(sig.titulo)} →</a></div>
</article></main>
<footer><div class="ancho">${NOMBRE} · Orientación general; no sustituye ayuda médica ni psicológica.</div></footer>
<script>
document.getElementById('compartir').onclick=function(){var d={title:document.title,url:location.href};
 if(navigator.share){navigator.share(d).catch(function(){})}else if(navigator.clipboard){navigator.clipboard.writeText(d.url);this.textContent='Enlace copiado'}};
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
