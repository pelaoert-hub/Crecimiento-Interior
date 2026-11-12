# Ánima

Web de silencio, conciencia y espiritualidad, instalable en el móvil como app (PWA). Sitio estático: HTML, CSS y JavaScript, sin dependencias ni CDN (las tipografías están en `fuentes/`).

Dominio: **animaquieta.app** (registrado en Vercel).

## Qué tiene

- **Portada inmersiva:** cielo de estrellas, mandala que gira despacio, menú a pantalla completa.
- **Hoy:** fase real de la luna (calculada), carta de reflexión (textos propios, no predice nada) e intención del día.
- **Lecturas:** a partir de la fecha de nacimiento (y opcionalmente nombre, hora y palma de la mano) se muestran, por separado y luego cruzadas, las miradas de la astrología occidental (Sol y Luna calculados astronómicamente), la astrología china, la numerología pitagórica, la cábala, el tarot y la quiromancia, con pestañas para la base, hoy, el mes y el año. Siempre con aviso de que es una mirada simbólica y no una predicción. Todo se calcula en el dispositivo; no se envía nada.
- **I Ching:** tirada con tres monedas (método clásico), con hexagrama, líneas móviles y segundo hexagrama. La tabla de hexagramas se comprobó contra Wikipedia (64 combinaciones únicas, casos conocidos).
- **Árboles celtas:** dentro de las lecturas, marcado como calendario moderno inventado por Robert Graves en 1948, no antiguo.
- **Capa Cuba** (`/cuba/`): tradiciones afrocubanas. Se activa con un interruptor en el menú; si el dispositivo tiene la zona horaria de La Habana, se sugiere una sola vez. Incluye 20 orishas con su santo católico, el sincretismo, el diloggún (letras, orishas que hablan en cada una, tirada simbólica), Ifá (los 16 odu mayores y el tablero) y Palo Monte (mpungos y métodos de adivinación). Cada dato indica su fuente.
- **Cinco salas de práctica:** respirar (loto que se abre, patrones calma y caja), silencio (temporizador con cuenco), gratitud, soltar (el texto se disuelve y no se guarda) y examen del día.
- **Tradiciones:** zazen, lectio divina, metta y examen de conciencia, en resumen general (revisadas, según indicó el autor).
- **Biblioteca:** 9 artículos, con página propia en `/articulos/<id>/`.
- **Velas (comunidad)** con moderación previa. Los textos de aviso ya están en la portada (apodo en vez de nombre completo, nada de datos de salud de otras personas, revisión «cada pocos días», aviso de crisis sin teléfonos y enlace a Privacidad). **Están conectadas** a un proyecto de Supabase propio de Ánima (`anima`, región UE `eu-central-1`, separado del de Puentes) mediante `config.js` (URL y clave publicable, pública por diseño; la seguridad la ponen las reglas del SQL).
  - **Moderar:** panel de Supabase → Table Editor → `comunidad_mensajes`. Marcar `aprobado` publica la vela; borrar la fila la rechaza. La consulta de pendientes está en los comentarios de `supabase/comunidad.sql`.
  - **Apagarlas:** vaciar `url` y `clavePublica` en `config.js` y subir `VERSION` en `sw.js` para que se actualice la copia sin conexión. La web vuelve a mostrar que las velas no están disponibles.
  - **Nota sobre el SQL:** el aplicado en el proyecto incluye, además de la tabla y las dos reglas originales, permisos mínimos para `anon` (desde la migración 2: `INSERT` de nombre, texto y `token_hash`, y `SELECT` de las aprobadas sin `token_hash`), dos comprobaciones de que nombre y texto no estén vacíos y un índice para la lista pública. Ese SQL es el que está en `supabase/comunidad.sql`.
  - **Retirar la propia vela (sin cuentas):** al enviar, el navegador crea una clave secreta aleatoria (16 bytes, 32 caracteres hexadecimales) y manda a la base de datos solo su huella SHA-256 (columna `token_hash`). La clave se guarda únicamente en ese navegador (`localStorage`, clave `ci_mis_velas`, máximo 20 velas). El bloque «Mis velas», bajo el formulario, las muestra con un botón «Retirar» que llama a la función `retirar_vela` (`POST /rest/v1/rpc/retirar_vela`): borra de verdad la fila cuya huella coincide, aprobada o no. `anon` no puede leer `token_hash`, ni hacer `UPDATE` ni `DELETE` directos. SQL completo en la «migración 2» al final de `supabase/comunidad.sql` (aplicada el 4/11/2026).
    - **Límites:** solo funciona desde el mismo navegador o app donde se envió. Si se borran los datos del navegador o se cambia de dispositivo, la clave se pierde; el respaldo es el correo (pelaoert@gmail.com, con apodo y texto) y borrar la fila a mano desde el panel, que sigue valiendo. Si el navegador no tiene `crypto.subtle` (página sin https), la vela se envía sin huella y la web avisa de que no podrá retirarse desde ahí.
    - **Aviso del advisor de Supabase:** `retirar_vela` es `SECURITY DEFINER` y ejecutable por `anon`, y el advisor lo marca. Es a propósito: hace una sola cosa (borrar por huella exacta) y valida la entrada.
  - **Pendiente:** no hay límite contra el envío masivo (spam); la moderación previa evita que se publique, pero no que lleguen filas.
- **Privacidad** (`/privacidad/`): resumen en lenguaje sencillo de qué datos recoge Ánima. Casi todo se queda en el navegador; las velas son la única excepción (apodo, texto, fecha y la huella de la clave de retiro, en Supabase, UE). Cada persona puede retirar su vela desde «Mis velas»; el contacto de respaldo es pelaoert@gmail.com, visible en la web por decisión expresa del autor. Sin plazo de conservación inventado: se conservan hasta que se retiren.
- **Mi práctica:** hábitos con lunas de los últimos 14 días y diario. Se guarda solo en el dispositivo.
- **App instalable:** manifiesto, iconos (normales y *maskable*), `sw.js` (funciona sin conexión), botón de instalar y guía para iPhone.

## Estructura del proyecto

Esta carpeta es **autosuficiente e independiente de Puentes**: contiene la web, sus pruebas y las herramientas para generar los documentos de revisión.

    index.html · estilo.css · app.js     la portada y su lógica
    articulos.js                         los artículos (fuente única)
    lecturas.js · lecturas-ui.js         motor de cálculo y textos de las lecturas / su interfaz
    iching.js                            I Ching (datos, tirada e interfaz)
    capas.js                             interruptor de la capa Cuba
    cuba/ · cuba-datos.js · cuba.js      la capa Cuba (página, datos con fuentes, interfaz)
    privacidad/                          página de privacidad (a mano; está en el sitemap y en el precaché de sw.js)
    sw.js · manifest.webmanifest         la parte de app instalable
    icons/ · fuentes/                    logo (flor de loto) y tipografías (Marcellus, Hanken Grotesk)
    config.js                            datos de la comunidad (vacío = desactivada)
    supabase/comunidad.sql               tabla y reglas de las velas (aplicado en el proyecto «anima»)
    vercel.json · .vercelignore          despliegue
    articulos/ · sitemap.xml             generados por tools/generar.js

    tools/
      generar.js                         genera articulos/*/index.html y sitemap.xml
      pruebas/todas.sh                   ejecuta las 5 baterías de pruebas
      vista_previa/construir.py          crea un único HTML con todo incrustado
      revision_pdf/generar.sh            crea los PDF de revisión para practicantes
    revision/                            PDF y vista previa generados (NO se publica; está en .gitignore)

## Herramientas

    bash tools/pruebas/todas.sh            # pruebas: motor, I Ching/árboles, portada, lecturas, capa Cuba
    node tools/generar.js                  # tras tocar articulos.js
    python3 tools/vista_previa/construir.py   # revision/anima_prueba.html
    bash tools/revision_pdf/generar.sh        # revision/*.pdf

Las pruebas necesitan Playwright (variables opcionales `PLAYWRIGHT` y `CHROMIUM`), y los PDF, `reportlab` y la fuente DejaVu Sans.

## Descargar todo

En GitHub: botón *Code* → *Download ZIP*, o `https://github.com/pelaoert-hub/Crecimiento-Interior/archive/refs/heads/main.zip`. La carpeta `revision/` no se publica: se regenera con las herramientas de arriba.

## Trabajar

    python3 -m http.server 8000          # probar en local
    node tools/generar.js                # tras tocar articulos.js

Al cambiar archivos de la web, **subir `VERSION` en `sw.js`** para que los móviles reciban la versión nueva.

## Ocultar y mostrar (capa Cuba y artículos)

Ahora mismo **la capa Cuba y los 9 artículos están visibles** en la web publicada, sin la marca `noindex` y sin la etiqueta de borrador, y el `sitemap.xml` incluye `/cuba/` y los 9 artículos. Antes estuvieron ocultos; el contenido nunca se borró (`cuba/`, `cuba-datos.js`, `cuba.js`, `articulos/`, `articulos.js`). Ocultar o mostrar depende de dos cosas:

- **La app** lo decide con dos interruptores al final de `config.js`: `MOSTRAR_CAPA_CUBA` (ahora, `true`) y `MOSTRAR_BORRADORES` (ahora, `false`, que solo afecta a artículos con `borrador: true`; hoy no hay ninguno). Con `MOSTRAR_CAPA_CUBA = false` desaparecen el interruptor y el aviso de la capa Cuba, su sección y su enlace del menú. Con la lista de artículos vacía (o todos en borrador y `MOSTRAR_BORRADORES = false`) desaparecen la sección Biblioteca y el enlace al artículo de metta.
- **Vercel** publica lo que `.vercelignore` no lista. Hoy solo ignora `tools`, `supabase`, `README.md`, `.gitignore` y `.github`. Si se añaden `cuba`, `cuba-datos.js`, `cuba.js` o `articulos`, esas rutas responden 404.

**Para ocultar otra vez la capa Cuba:** en `config.js` poner `MOSTRAR_CAPA_CUBA = false`; en `.vercelignore` añadir `cuba`, `cuba-datos.js` y `cuba.js`; en `sw.js` quitar `'/cuba/'`, `'/cuba-datos.js'` y `'/cuba.js'` de `CASCARON` (si no, la instalación del service worker falla con 404) y subir `VERSION`; en `tools/generar.js` quitar `/cuba/` del sitemap y volver a ejecutarlo.

**Para ocultar otra vez los artículos:** poner `borrador: true` en los que se quiera ocultar y ejecutar `node tools/generar.js` (esas páginas vuelven a llevar `noindex` y salen del sitemap); con `MOSTRAR_BORRADORES = false` la app no los lista. Si además no deben publicarse sus páginas, añadir `articulos` a `.vercelignore`. Subir `VERSION` en `sw.js` en cualquier caso.

**Aviso para las pruebas:** con la capa Cuba y la Biblioteca visibles, `tools/pruebas/cuba_capas.js` y las partes de `portada.js` que miran la Biblioteca y `/articulos/` deben pasar. Si se vuelve a ocultar algo, fallarán a propósito hasta restablecerlo.

## Publicar en animaquieta.app

1. Proyecto nuevo en Vercel con este repositorio (sin comando de construcción; ya viene en `vercel.json`).
2. Settings → Domains → añadir `animaquieta.app`.
3. Velas: ya hay un proyecto de Supabase propio (`anima`), con `supabase/comunidad.sql` aplicado y `config.js` rellenado. Los mensajes se aprueban a mano en el panel. Comprobar de vez en cuando que se siguen revisando: la web promete «cada pocos días». Antes de publicar, comprobar que `/privacidad/` sigue siendo verdad: que el proyecto de Supabase esté de verdad en la Unión Europea, que el correo de contacto funcione y que se revisen las velas «cada pocos días», como dice la web. Si algo cambia, corregir también esa página.
4. Revisar los artículos y las tradiciones; quitar `borrador: true`; luego `node tools/generar.js`. Los borradores llevan `noindex` y no están en el sitemap.
5. Comprobar en el dominio real: que cargue, que se pueda instalar y que `robots.txt` y `sitemap.xml` respondan.

## Mantener activa la base de datos

El proyecto de Supabase (`anima`) está en el plan gratuito, y ese plan **pausa los proyectos con poca actividad en 7 días** (<https://supabase.com/docs/guides/platform/free-project-pausing>). Ya pasó una vez. Para evitarlo, `.github/workflows/mantener-activo.yml` ("Mantener activa la base de datos") hace **una consulta de lectura muy pequeña cada día** (06:17 UTC) a `comunidad_mensajes`, con la clave publicable (que es pública por diseño y ya está en `config.js`). No usa secretos ni acciones de terceros, y no tiene permisos sobre el repositorio.

- **Lanzarla a mano:** pestaña *Actions* → "Mantener activa la base de datos" → *Run workflow*.
- **Saber si falla:** si Supabase no responde 200, la tarea termina en error: llega un correo de GitHub y aparece en rojo en *Actions*.
- **`.github` no se publica:** está en `.vercelignore`.

Limitaciones reales:

1. **GitHub desactiva las tareas programadas de un repositorio público tras 60 días sin actividad en el repositorio** ("In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days", <https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/disabling-and-enabling-a-workflow>). Mientras haya commits o cambios en el repositorio, sigue activa. Si se desactiva: *Actions* → el flujo → *Enable workflow*.
2. **Solo ayuda si esa consulta cuenta como actividad.** Supabase dice que basta con "unas pocas peticiones a la base de datos al día" y que se puede evitar la pausa "haciendo llamadas a la API" del proyecto, pero **no publica el umbral exacto** ni dice expresamente que la API REST cuente. Por eso la tarea es diaria y no cada varios días. Si Supabase vuelve a avisar de una pausa, hay que revisar esto.
3. **Si el proyecto ya está pausado**, la tarea falla y avisa, pero **no lo reactiva**: se restaura a mano en el panel de Supabase (*Resume project*; hay 90 días para hacerlo desde la pausa).
4. La única forma garantizada de que no se pause es el plan Pro (de pago).

## Lecturas: qué se calcula y qué no

- Se calcula: Sol y Luna (fórmulas de Meeus, comprobadas con sus ejemplos y con lunas nuevas y llenas conocidas), Año Nuevo Chino (comprobado en 33 años conocidos), numerología pitagórica, arcanos por fecha, día de la semana.
- No se calcula: ascendente, casas ni otros planetas (necesitan lugar exacto y tablas completas). Se dice en la propia web.
- La asociación de sefirot con números de fecha es una adaptación moderna, no doctrina cabalística tradicional; también se dice en la web.
- Los textos son interpretaciones generales en revisión. No incluyen predicciones de salud, dinero ni muerte.

### «Lo que se repite y lo que te dice algo»

> **Pendiente: revisión de los textos nuevos (origen, descripciones de temas, conclusiones, avisos del azar y frases de la interfaz en `TEXTOS_UI`) por la persona que decida el autor, ANTES de fusionar en main.** También siguen pendientes de revisión las 33 etiquetas dudosas de `tools/revision_etiquetas_lecturas.md`.

**Qué hace.** Bajo el formulario, la persona elige qué tradiciones mirar (zodiaco occidental, zodiaco chino, árboles celtas, numerología, cábala, tarot, día planetario y, si rellenó la palma, quiromancia); todas vienen marcadas y cada una tiene su «De dónde viene» (`ORIGENES`). Lo que no se elige no se muestra ni cuenta. El I Ching queda aparte: es una tirada al azar y no se cruza con la fecha. Bajo cada texto de las tarjetas (en las cuatro pestañas) hay tres opciones: «Me dice algo», «No me dice nada» y «No sé» (por defecto; no cuenta).

**No es adivinación.** No predice nada ni dice qué significa nada. Solo cuenta coincidencias de etiquetas, y lo dice; la conclusión siempre termina con una pregunta que admite «dejarlo estar».

**Las dos medidas, separadas:**
1. **Lo que se repite entre tradiciones:** temas que aparecen en 2 o más **familias** distintas de las elegidas («aparece en N de M familias»). Numerología, cábala, tarot y día planetario salen de las mismas cifras de la fecha y cuentan como **una** familia.
2. **Lo que tú marcaste:** temas de los textos marcados «Me dice algo», con cuántas veces.

La conclusión solo cruza los temas que están en las dos, ordenados primero por lo que marcó la persona, y elige una de las 6 plantillas de `CONCLUSIONES`. Sin marcas no hay conclusión, solo una invitación a marcar sin presión. Toda la lógica está en la función pura `Lecturas.resumen(tarjetasElegidas, marcas)` (y `Lecturas.elegir(tarjetas, claves)`), probada en node; `lecturas-ui.js` solo pinta. Si falta la hora y ese día la Luna **o el Sol** cambian de signo, ese texto (el item lleva `incierto: true`) no se puede marcar ni cuenta en lo que se repite, y la tarjeta lo dice con `TEXTOS_UI.luna_incierta` o `TEXTOS_UI.sol_incierto`; si lo son los dos, se tratan igual y el cruce sigue con las demás familias. La detección es una sola y es la que ya generaba el aviso de la tarjeta. En «Tu base» se muestra una vez el aviso del azar; en las otras pestañas, el aviso del efecto Barnum, porque la tabla del azar solo describe «Tu base».

**Cuándo se muestran las cifras del azar.** Solo cuando son exactas: `Lecturas.azarExacto(claves, hayNombre, hayPalma)` (función pura) es verdadera si están marcadas las 7 tradiciones que salen de la fecha, no hay nombre completo (la numerología por nombre añade cifras) y no hay palma con quiromancia elegida; la tabla se calculó así. En ese caso `Lecturas.textoAzar(...)` muestra `AVISOS_AZAR[0]` con la mediana y, si hay conclusión, `AVISOS_AZAR[1]` con el porcentaje del tema. Si la persona desmarca una tradición, escribe el nombre o rellena la palma, se muestra `AVISO_AZAR_SIN_CIFRAS`, que dice lo mismo en general y sin ningún número. `leer()` devuelve `resumen.conNombre` (2 o más letras, como usa la numerología) y `resumen.conPalma` para que la interfaz no tenga que adivinarlo.

**Limitación conocida.** `TABLA_AZAR` supone las 12:00 de La Habana y cuenta el Sol y la Luna de ese momento; no descuenta los textos inciertos de los días de cambio de signo sin hora. No se recalcula: en esos días la persona ve un Sol o una Luna menos en el cruce que la tabla.

**Datos.** Todo se calcula en el dispositivo y funciona sin conexión; no se envía nada. Las marcas (`ci_resonancias`, `{idTexto: "si"|"no"}`) y las tradiciones elegidas (`ci_lectura_trads`) se guardan en `localStorage` **solo** si «Recordar mis datos» está marcado; al desmarcarlo o al pulsar «Borrar mis datos» se borran junto con `ci_lectura`. Sin guardar, todo funciona igual durante la visita. Las marcas van por id de texto: si el mismo texto sale en dos pestañas, la marca es la misma.

**Tabla del azar (`TABLA_AZAR`).** Se genera con `node tools/azar_coincidencias.js` (recorre todas las fechas de 1930 a 2010 con el motor real) y se pega en `lecturas.js` entre `TABLA_AZAR_INICIO` y `TABLA_AZAR_FIN`. **Cambiar cualquier etiqueta de tema obliga a regenerarla**; si no, `tools/pruebas/motor_lecturas.js` falla avisando de que no cuadra.

## Capa Cuba: cómo se contrastó

Estas religiones son de tradición oral: el conocimiento se transmite por iniciación y no hay un texto único que lo recoja. «Contrastado» solo significa que **varias fuentes públicas coinciden**; no lo confirma la propia tradición. La confirmación solo puede venir de practicantes iniciados.

Cada dato de `cuba-datos.js` lleva los números de las fuentes públicas (lista `FUENTES`) donde se contrastó, y la página los muestra.

- Lo que aparece en **una sola fuente** se marca así. Lo que las fuentes **contradicen** (el santo de Ochosi, Osun u Osain; algunos colores; la fecha de Elegguá, que una fuente da como 3 de junio) se avisa o se deja fuera.
- Los fragmentos del diloggún entre comillas son literales de la fuente 5 (Proyecto Orunmila). Los orishas que hablan en cada letra son de la fuente 4 (EcuRed). Las preguntas «para pensar» son de Ánima y no pertenecen a la tradición.
- Las letras 13 a 16 solo las leen los babalawos, según la fuente 4; no se muestra lectura. Ifá no se simula.
- Las fuentes son divulgativas y públicas. **Revisada por practicantes (según indicó el autor).** Las prácticas y su interpretación varían según la región de Cuba: lo recogido es una versión general y hay variantes regionales. La página se publicó sin la marca `noindex`.
- Todas las páginas se consultaron el 10 de octubre de 2026. Si cambian, hay que recomprobar.

### Obras para profundizar

La capa Cuba incluye una sección «Para profundizar» con obras escritas (Lydia Cabrera, *El Monte*; Wande Abimbola; E. Bolaji Idowu; Fu-Kiau Bunseki). **Solo se comprobó que existen y de qué tratan; no se usaron como fuente de los datos ni se reproduce su contenido.** *El Monte* tiene derechos de autor, y la web no indica usos de las plantas porque algunas son tóxicas y usarlas como remedio sin guía puede dañar la salud.

## Reglas de contenido

- Nada se presenta como verificado si no lo está. Lo que escribe la comunidad se marca como aporte de la comunidad.
- Los textos de salud son orientación general, con aviso de consultar a un profesional.
- Las reflexiones y cartas son textos propios, sin atribuir a nadie.
- Las descripciones de tradiciones espirituales son resúmenes generales y se revisan antes de publicar.
