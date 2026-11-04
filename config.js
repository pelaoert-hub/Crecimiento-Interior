// datos de conexion de la comunidad; vacio = la comunidad queda desactivada
// la clave "anon" es publica por diseno, pero la seguridad la ponen las reglas del SQL
window.CONFIG_COMUNIDAD = { url: 'https://vxnaztujvdbhbgherpoa.supabase.co', clavePublica: 'sb_publishable_VOxGQkz0kC6G6shMdmt-bA_5OwvRAuk' };

// INTERRUPTORES DE PUBLICACION (este es el unico sitio donde se cambian)
// false = la app no muestra ese contenido (ni entradas, ni enlaces, ni menu).
// El contenido sigue en el repositorio: nada esta borrado.
// Para volver a mostrarlo hacen falta DOS cosas, no una:
//   1) poner aqui true, y
//   2) quitar de .vercelignore las lineas de ese contenido (si no, Vercel no publica las paginas)
//   y despues subir VERSION en sw.js (y, para la capa Cuba, volver a poner en CASCARON de sw.js
//   '/cuba/', '/cuba-datos.js' y '/cuba.js'). Detalle en el README, seccion "Ocultar y mostrar".
window.MOSTRAR_CAPA_CUBA = true;    // capa Cuba: visible (para ocultarla de nuevo: false aqui, ver README)
window.MOSTRAR_BORRADORES = false;  // articulos con borrador:true en articulos.js
