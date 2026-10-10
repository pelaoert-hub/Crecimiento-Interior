# Camino Interior

Web de crecimiento personal y espiritualidad, instalable en el móvil como app (PWA). Sitio estático: HTML, CSS y JavaScript, sin dependencias ni CDN.

Dominio previsto: **vantlygo.com** (pendiente de liberar/transferir a Vercel).

## Qué tiene

- **Artículos** (6 borradores, páginas propias en `/articulos/<id>/`).
- **Ejercicios:** respiración guiada (calma 4·4·6 y caja), silencio con temporizador y campana, gratitud, examen del día.
- **Seguimiento:** hábitos con rachas, anillo de progreso y diario. Se guarda solo en el dispositivo de cada persona.
- **Comunidad** con moderación previa (desactivada hasta conectar Supabase).
- **App instalable:** `manifest.webmanifest`, iconos (normales y *maskable*), `sw.js` (funciona sin conexión), botón de instalar y guía para iPhone.
- Modo claro/oscuro, barra inferior tipo app en el móvil, accesible por teclado y con movimiento reducido respetado.

## Estructura

    index.html · estilo.css · app.js     la portada y su lógica
    articulos.js                         los artículos (fuente única)
    tools/generar.js                     genera articulos/*/index.html y sitemap.xml
    sw.js · manifest.webmanifest         la parte de app instalable
    icons/                               logo en SVG y PNG
    config.js                            datos de la comunidad (vacío = desactivada)
    supabase/comunidad.sql               tabla y reglas de la comunidad (NO aplicado)
    vercel.json · .vercelignore          despliegue

## Trabajar

    python3 -m http.server 8000          # probar en local
    node tools/generar.js                # tras tocar articulos.js

Al cambiar archivos de la web, **subir `VERSION` en `sw.js`** para que los móviles reciban la versión nueva.

## Publicar en vantlygo.com

1. Proyecto nuevo en Vercel con este repositorio (sin comando de construcción; ya viene en `vercel.json`).
2. Settings → Domains → añadir `vantlygo.com`.
3. Comunidad: crear un proyecto de Supabase propio, aplicar `supabase/comunidad.sql` y rellenar `config.js`. Los mensajes se aprueban a mano en el panel.
4. Revisar los artículos y quitar `borrador: true`; luego `node tools/generar.js`. Los borradores llevan `noindex` y no están en el sitemap.
5. Comprobar en el dominio real: que cargue, que se pueda instalar y que `robots.txt` y `sitemap.xml` respondan.

## Reglas de contenido

- Nada se presenta como verificado si no lo está. Lo que escribe la comunidad se marca como aporte de la comunidad.
- Los textos de salud son orientación general, con aviso de consultar a un profesional.
- Las reflexiones del día son textos propios, sin atribuir a nadie.
