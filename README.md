# Ánima

Web de silencio, conciencia y espiritualidad, instalable en el móvil como app (PWA). Sitio estático: HTML, CSS y JavaScript, sin dependencias ni CDN (las tipografías están en `fuentes/`).

Dominio previsto: **vantlygo.com** (pendiente de liberar/transferir a Vercel).

## Qué tiene

- **Portada inmersiva:** cielo de estrellas, mandala que gira despacio, menú a pantalla completa.
- **Hoy:** fase real de la luna (calculada), carta de reflexión (textos propios, no predice nada) e intención del día.
- **Lecturas:** a partir de la fecha de nacimiento (y opcionalmente nombre, hora y palma de la mano) se muestran, por separado y luego cruzadas, las miradas de la astrología occidental (Sol y Luna calculados astronómicamente), la astrología china, la numerología pitagórica, la cábala, el tarot y la quiromancia, con pestañas para la base, hoy, el mes y el año. Siempre con aviso de que es una mirada simbólica y no una predicción. Todo se calcula en el dispositivo; no se envía nada.
- **I Ching:** tirada con tres monedas (método clásico), con hexagrama, líneas móviles y segundo hexagrama. La tabla de hexagramas se comprobó contra Wikipedia (64 combinaciones únicas, casos conocidos).
- **Árboles celtas:** dentro de las lecturas, marcado como calendario moderno inventado por Robert Graves en 1948, no antiguo.
- **Capa Cuba** (`/cuba/`): tradiciones afrocubanas. Se activa con un interruptor en el menú; si el dispositivo tiene la zona horaria de La Habana, se sugiere una sola vez. Incluye 20 orishas con su santo católico, el sincretismo, el diloggún (letras, orishas que hablan en cada una, tirada simbólica), Ifá (los 16 odu mayores y el tablero) y Palo Monte (mpungos y métodos de adivinación). Cada dato indica su fuente.
- **Cinco salas de práctica:** respirar (loto que se abre, patrones calma y caja), silencio (temporizador con cuenco), gratitud, soltar (el texto se disuelve y no se guarda) y examen del día.
- **Tradiciones:** zazen, lectio divina, metta y examen de conciencia, en resumen general (en revisión).
- **Biblioteca:** 9 artículos en borrador, con página propia en `/articulos/<id>/`.
- **Velas (comunidad)** con moderación previa; desactivada hasta conectar Supabase.
- **Mi práctica:** hábitos con lunas de los últimos 14 días y diario. Se guarda solo en el dispositivo.
- **App instalable:** manifiesto, iconos (normales y *maskable*), `sw.js` (funciona sin conexión), botón de instalar y guía para iPhone.

## Estructura

    index.html · estilo.css · app.js     la portada y su lógica
    articulos.js                         los artículos (fuente única)
    lecturas.js · lecturas-ui.js         motor de cálculo y textos de las lecturas / su interfaz
    iching.js                            I Ching (datos, tirada e interfaz)
    capas.js                             interruptor de la capa Cuba
    cuba/ · cuba-datos.js · cuba.js      la capa Cuba (página, datos con fuentes, interfaz)
    tools/generar.js                     genera articulos/*/index.html y sitemap.xml
    sw.js · manifest.webmanifest         la parte de app instalable
    icons/ · fuentes/                    logo (flor de loto) y tipografías (Marcellus, Hanken Grotesk)
    config.js                            datos de la comunidad (vacío = desactivada)
    supabase/comunidad.sql               tabla y reglas de las velas (NO aplicado)
    vercel.json · .vercelignore          despliegue

## Trabajar

    python3 -m http.server 8000          # probar en local
    node tools/generar.js                # tras tocar articulos.js

Al cambiar archivos de la web, **subir `VERSION` en `sw.js`** para que los móviles reciban la versión nueva.

## Publicar en vantlygo.com

1. Proyecto nuevo en Vercel con este repositorio (sin comando de construcción; ya viene en `vercel.json`).
2. Settings → Domains → añadir `vantlygo.com`.
3. Velas: crear un proyecto de Supabase propio, aplicar `supabase/comunidad.sql` y rellenar `config.js`. Los mensajes se aprueban a mano en el panel.
4. Revisar los artículos y las tradiciones; quitar `borrador: true`; luego `node tools/generar.js`. Los borradores llevan `noindex` y no están en el sitemap.
5. Comprobar en el dominio real: que cargue, que se pueda instalar y que `robots.txt` y `sitemap.xml` respondan.

## Lecturas: qué se calcula y qué no

- Se calcula: Sol y Luna (fórmulas de Meeus, comprobadas con sus ejemplos y con lunas nuevas y llenas conocidas), Año Nuevo Chino (comprobado en 33 años conocidos), numerología pitagórica, arcanos por fecha, día de la semana.
- No se calcula: ascendente, casas ni otros planetas (necesitan lugar exacto y tablas completas). Se dice en la propia web.
- La asociación de sefirot con números de fecha es una adaptación moderna, no doctrina cabalística tradicional; también se dice en la web.
- Los textos son interpretaciones generales en revisión. No incluyen predicciones de salud, dinero ni muerte.

## Capa Cuba: cómo se contrastó

Estas religiones son de tradición oral: el conocimiento se transmite por iniciación y no hay un texto único que lo recoja. «Contrastado» solo significa que **varias fuentes públicas coinciden**; no lo confirma la propia tradición. La confirmación solo puede venir de practicantes iniciados.

Cada dato de `cuba-datos.js` lleva los números de las fuentes públicas (lista `FUENTES`) donde se contrastó, y la página los muestra.

- Lo que aparece en **una sola fuente** se marca así. Lo que las fuentes **contradicen** (el santo de Ochosi, Osun u Osain; algunos colores; la fecha de Elegguá, que una fuente da como 3 de junio) se avisa o se deja fuera.
- Los fragmentos del diloggún entre comillas son literales de la fuente 5 (Proyecto Orunmila). Los orishas que hablan en cada letra son de la fuente 4 (EcuRed). Las preguntas «para pensar» son de Ánima y no pertenecen a la tradición.
- Las letras 13 a 16 solo las leen los babalawos, según la fuente 4; no se muestra lectura. Ifá no se simula.
- Las fuentes son divulgativas y públicas. **No se ha consultado a practicantes.** La página está marcada `noindex` y pendiente de revisión por santeros, babalawos y paleros antes de publicarse.
- Todas las páginas se consultaron el 10 de octubre de 2026. Si cambian, hay que recomprobar.

### Obras para profundizar

La capa Cuba incluye una sección «Para profundizar» con obras escritas (Lydia Cabrera, *El Monte*; Wande Abimbola; E. Bolaji Idowu; Fu-Kiau Bunseki). **Solo se comprobó que existen y de qué tratan; no se usaron como fuente de los datos ni se reproduce su contenido.** *El Monte* tiene derechos de autor, y la web no indica usos de las plantas porque algunas son tóxicas y usarlas como remedio sin guía puede dañar la salud.

## Reglas de contenido

- Nada se presenta como verificado si no lo está. Lo que escribe la comunidad se marca como aporte de la comunidad.
- Los textos de salud son orientación general, con aviso de consultar a un profesional.
- Las reflexiones y cartas son textos propios, sin atribuir a nadie.
- Las descripciones de tradiciones espirituales son resúmenes generales y se revisan antes de publicar.
