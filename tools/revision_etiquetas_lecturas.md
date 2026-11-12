# Revisión de etiquetas de «Lecturas»

Tabla para revisar a mano. Cada texto de las lecturas tiene un **id fijo** (no cambia aunque se reescriba el texto) y de **1 a 3 temas** del vocabulario cerrado de 12. Los temas se eligieron por lo que **dice el propio texto**; el texto de las lecturas no se tocó.

- **Vocabulario (12 temas):** Iniciativa (empezar, dar el primer paso) · Constancia (antes «Estabilidad»: sostener, construir despacio) · Cambio (etapas que se mueven) · Soltar (cerrar ciclos, dejar ir) · Sensibilidad (sentir y percibir) · Vínculos (familia, pareja, amistad) · Cuidado (antes «Servicio»: atender a otros) · Palabra (antes «Comunicación»: decir, escribir, escuchar) · Creatividad (hacer y expresar) · Introspección (mirar hacia dentro, silencio) · Límites (decir no, proteger lo propio) · Libertad (espacio, movimiento, independencia).
- **95 textos con tema:** 12 signos, 12 animales, 13 árboles, 12 números, 9 sefirot, 22 arcanos, 7 días, 6 rasgos de la palma y las 2 lunas fijas de la pestaña «Este mes». Los 5 elementos chinos **no llevan tema** y no entran en el cruce (igual que antes). El I Ching tampoco entra.
- **Columna «antes»:** los temas que tenía con el vocabulario de 8, para comparar.
- **Motivo:** solo en los 33 casos dudosos. Donde no hay motivo, el tema sale literalmente del texto.
- Cambiar una etiqueta es cambiar la lista de temas de esa entrada en `lecturas.js` y volver a generar la tabla del azar (`node tools/azar_coincidencias.js`, ver el comentario en `lecturas.js`); la prueba `tools/pruebas/motor_lecturas.js` avisa si la tabla no cuadra.

Recuento de usos por tema: Constancia 16 · Iniciativa 15 · Sensibilidad 15 · Introspección 14 · Creatividad 13 · Vínculos 12 · Cuidado 11 · Cambio 11 · Soltar 9 · Límites 9 · Libertad 7 · Palabra 6.

### Zodiaco occidental (familia: Sol y Luna)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `signo-aries` | Aries | Iniciativa | Iniciativa |  |
| `signo-tauro` | Tauro | Constancia | Estabilidad | «La lealtad» podría sumar Vínculos; se dejó solo Constancia. |
| `signo-geminis` | Géminis | Palabra | Comunicación |  |
| `signo-cancer` | Cáncer | Cuidado, Vínculos, Sensibilidad | Sensibilidad |  |
| `signo-leo` | Leo | Creatividad | Creatividad, Iniciativa | Se quitó Iniciativa: el texto habla de brillar y expresar, no de empezar. |
| `signo-virgo` | Virgo | Cuidado | Servicio |  |
| `signo-libra` | Libra | Vínculos | Comunicación | El texto habla de relación con los demás y compañía (Vínculos). Antes era Comunicación, que el texto no nombra. «Decidirse sin temer al conflicto» podría ser Límites. |
| `signo-escorpio` | Escorpio | Cambio, Soltar, Introspección | Cambio, Introspección |  |
| `signo-sagitario` | Sagitario | Libertad | Cambio |  |
| `signo-capricornio` | Capricornio | Constancia | Estabilidad |  |
| `signo-acuario` | Acuario | Libertad, Creatividad | Creatividad, Servicio |  |
| `signo-piscis` | Piscis | Sensibilidad, Límites | Sensibilidad, Creatividad | Límites sale de «su reto es poner límites». «La imaginación» podría sumar Creatividad (antes la tenía). |

### Zodiaco chino (familia: Año chino)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `animal-rata` | Rata | Cambio | Comunicación | Cambio por «adaptabilidad». Antes Comunicación, que el texto no nombra. |
| `animal-buey` | Buey | Constancia | Estabilidad |  |
| `animal-tigre` | Tigre | Iniciativa, Libertad | Iniciativa |  |
| `animal-conejo` | Conejo | Sensibilidad, Vínculos | Sensibilidad | Vínculos por «diplomacia». |
| `animal-dragon` | Dragón | Iniciativa | Iniciativa, Creatividad |  |
| `animal-serpiente` | Serpiente | Introspección | Introspección |  |
| `animal-caballo` | Caballo | Libertad | Cambio |  |
| `animal-cabra` | Cabra | Creatividad, Sensibilidad | Creatividad, Sensibilidad |  |
| `animal-mono` | Mono | Creatividad | Creatividad, Comunicación | «Versatilidad» podría ser Cambio. Antes Comunicación, que el texto no nombra. |
| `animal-gallo` | Gallo | Constancia, Palabra | Servicio, Estabilidad | Palabra por «franqueza». |
| `animal-perro` | Perro | Vínculos, Cuidado | Servicio | «Protección» se leyó como cuidar a otros; también podría ser Límites. |
| `animal-cerdo` | Cerdo | Cuidado | Sensibilidad, Servicio | Cuidado por «generosidad»; «disfrute» no encaja en ningún tema. |

### Árboles celtas (familia: Árboles celtas)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `arbol-abedul` | Abedul | Iniciativa, Cambio | Cambio, Iniciativa |  |
| `arbol-serbal` | Serbal | Límites, Iniciativa | Iniciativa, Estabilidad | Límites por «protección», Iniciativa por «poder personal y éxito». |
| `arbol-fresno` | Fresno | Introspección | Introspección |  |
| `arbol-aliso` | Aliso | Introspección | Introspección |  |
| `arbol-sauce` | Sauce | Cuidado, Sensibilidad | Sensibilidad |  |
| `arbol-espino-blanco` | Espino blanco | Iniciativa | Iniciativa | «Contactos profesionales» podría ser Vínculos. |
| `arbol-roble` | Roble | Constancia, Límites | Estabilidad | Constancia por «fuerza», Límites por «protección». |
| `arbol-acebo` | Acebo | Límites, Constancia | Estabilidad |  |
| `arbol-avellano` | Avellano | Creatividad, Introspección | Creatividad, Introspección |  |
| `arbol-vid` | Vid | Sensibilidad | Sensibilidad |  |
| `arbol-hiedra` | Hiedra | Cambio, Soltar | Cambio | Soltar por «alejar lo negativo»; «cooperar» podría ser Vínculos. |
| `arbol-cana` | Caña | Introspección | Introspección |  |
| `arbol-sauco` | Saúco | Cambio, Soltar, Creatividad | Cambio, Creatividad |  |

### Numerología (familia: Aritmética de la fecha)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `num-1` | Iniciativa y autonomía | Iniciativa, Libertad | Iniciativa |  |
| `num-2` | Cooperación y sensibilidad | Sensibilidad, Vínculos | Sensibilidad |  |
| `num-3` | Expresión y creatividad | Creatividad, Palabra | Creatividad, Comunicación |  |
| `num-4` | Orden y bases firmes | Constancia | Estabilidad |  |
| `num-5` | Cambio y libertad | Cambio, Libertad | Cambio |  |
| `num-6` | Cuidado y responsabilidad | Cuidado, Vínculos | Servicio |  |
| `num-7` | Búsqueda interior | Introspección | Introspección |  |
| `num-8` | Logro y manejo de recursos | Iniciativa, Constancia | Iniciativa, Estabilidad |  |
| `num-9` | Cierre y compasión | Soltar, Cuidado | Servicio | Soltar por «terminar ciclos, soltar»; Cuidado por «compasión». |
| `num-11` | Intuición e inspiración (número maestro) | Sensibilidad, Introspección | Sensibilidad, Introspección |  |
| `num-22` | Construir en grande (número maestro) | Constancia, Creatividad | Estabilidad, Creatividad | «Pide no cargar con demasiado» podría sumar Límites; no se añadió. |
| `num-33` | Servicio a gran escala (número maestro) | Cuidado, Límites | Servicio | Límites por «pide no olvidarse de uno mismo». |

### Cábala (familia: Aritmética de la fecha)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `sefira-1` | Keter | Iniciativa | Iniciativa |  |
| `sefira-2` | Jojmá | Creatividad | Creatividad |  |
| `sefira-3` | Biná | Introspección | Introspección |  |
| `sefira-4` | Jésed | Cuidado | Servicio |  |
| `sefira-5` | Guevurá | Límites | Estabilidad |  |
| `sefira-6` | Tiféret | Sensibilidad | Sensibilidad | Sensibilidad por «la belleza, la armonía»; encaje débil. |
| `sefira-7` | Nétzaj | Constancia | Iniciativa | Constancia por «la perseverancia» (antes Iniciativa). |
| `sefira-8` | Hod | Palabra | Comunicación |  |
| `sefira-9` | Yesod | Constancia, Vínculos | Sensibilidad, Comunicación | Constancia por «el fundamento», Vínculos por «la conexión». Dudoso. |

### Tarot (familia: Aritmética de la fecha)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `arcano-0` | El Loco | Iniciativa, Cambio | Cambio, Iniciativa |  |
| `arcano-1` | El Mago | Iniciativa | Iniciativa |  |
| `arcano-2` | La Sacerdotisa | Introspección | Introspección |  |
| `arcano-3` | La Emperatriz | Creatividad, Cuidado | Creatividad, Sensibilidad |  |
| `arcano-4` | El Emperador | Límites, Constancia | Estabilidad |  |
| `arcano-5` | El Hierofante | Palabra, Vínculos | Servicio, Estabilidad | Palabra por «enseñanza», Vínculos por «valores compartidos». «Tradición» podría ser Constancia. |
| `arcano-6` | Los Enamorados | Vínculos | Sensibilidad |  |
| `arcano-7` | El Carro | Iniciativa | Iniciativa |  |
| `arcano-8` | La Fuerza | Sensibilidad, Constancia | Sensibilidad | Constancia por «paciencia». |
| `arcano-9` | El Ermitaño | Introspección | Introspección |  |
| `arcano-10` | La Rueda de la Fortuna | Cambio | Cambio |  |
| `arcano-11` | La Justicia | Límites | Estabilidad, Servicio | Límites por «equilibrio» y la pregunta «¿Estoy siendo justo conmigo y con los demás?». Dudoso. |
| `arcano-12` | El Colgado | Introspección, Soltar | Introspección |  |
| `arcano-13` | La Muerte | Soltar, Cambio | Cambio |  |
| `arcano-14` | La Templanza | Constancia | Estabilidad | Constancia por «moderación» y «paciencia». |
| `arcano-15` | El Diablo | Soltar | Introspección | Soltar por la pregunta «¿Qué hábito o apego me cuesta soltar?». |
| `arcano-16` | La Torre | Cambio, Libertad | Cambio |  |
| `arcano-17` | La Estrella | Sensibilidad | Sensibilidad | «Renovación» podría ser Cambio. |
| `arcano-18` | La Luna | Introspección, Sensibilidad | Introspección |  |
| `arcano-19` | El Sol | Creatividad | Creatividad | Creatividad por «alegría y vitalidad»; encaje débil. |
| `arcano-20` | El Juicio | Cambio, Introspección | Cambio |  |
| `arcano-21` | El Mundo | Soltar | Estabilidad | Soltar por «culminación» (cerrar un ciclo). Dudoso. |

### Día planetario (familia: Aritmética de la fecha)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `dia-domingo` | domingo | Creatividad | Creatividad | Creatividad por «vitalidad e identidad»; encaje débil. |
| `dia-lunes` | lunes | Sensibilidad, Vínculos | Sensibilidad |  |
| `dia-martes` | martes | Iniciativa | Iniciativa |  |
| `dia-miercoles` | miércoles | Palabra | Comunicación |  |
| `dia-jueves` | jueves | Cuidado | Servicio |  |
| `dia-viernes` | viernes | Vínculos, Sensibilidad | Sensibilidad |  |
| `dia-sabado` | sábado | Constancia | Estabilidad |  |

### Quiromancia (familia: Quiromancia)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `palma-corazon-curva` | Línea del corazón curva | Sensibilidad | Sensibilidad |  |
| `palma-corazon-recta` | Línea del corazón recta | Vínculos | Estabilidad | «Reserva al mostrar el afecto» podría ser Límites. |
| `palma-cabeza-recta` | Línea de la cabeza recta | Constancia | Estabilidad |  |
| `palma-cabeza-curva` | Línea de la cabeza curva | Creatividad | Creatividad |  |
| `palma-vida-amplia` | Línea de la vida amplia y curva | Iniciativa | Iniciativa | Iniciativa por «vitalidad»; «apertura a la experiencia» podría ser Libertad. |
| `palma-vida-cerrada` | Línea de la vida pegada al pulgar | Límites | Introspección | Límites por «cuidar la energía y la cautela». |

### Lunas del mes (familia: Sol y Luna)

| id | texto | temas nuevos | antes | motivo (solo en dudosos) |
|---|---|---|---|---|
| `fase-luna-nueva` | Luna nueva | Iniciativa | Iniciativa |  |
| `fase-luna-llena` | Luna llena | Soltar | Cambio | Soltar por «de balance y de soltar» (antes Cambio). |
