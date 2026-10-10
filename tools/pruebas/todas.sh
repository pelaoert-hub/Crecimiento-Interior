#!/usr/bin/env bash
# Ejecuta todas las pruebas: motor de calculo, I Ching/arboles, y las de navegador (movil y escritorio, sin conexion).
# Requiere: node, python3 y Playwright (variables opcionales: PLAYWRIGHT=ruta al modulo, CHROMIUM=ruta al navegador).
AQUI="$(cd "$(dirname "$0")" && pwd)"; RAIZ="$(cd "$AQUI/../.." && pwd)"; PUERTO="${PUERTO:-8790}"
export BASE="http://localhost:$PUERTO"
[ -z "$PLAYWRIGHT" ] && [ -d /opt/node22/lib/node_modules/playwright ] && export PLAYWRIGHT=/opt/node22/lib/node_modules/playwright
[ -z "$CHROMIUM" ] && [ -x /opt/pw-browsers/chromium ] && export CHROMIUM=/opt/pw-browsers/chromium
(cd "$RAIZ" && python3 -m http.server "$PUERTO" >/dev/null 2>&1) & SERV=$!
sleep 1; FALLOS=0
for t in motor_lecturas iching_arboles portada lecturas_ui cuba_capas; do
  if node "$AQUI/$t.js" >/dev/null 2>&1; then echo "ok     $t"; else echo "FALLA  $t"; FALLOS=$((FALLOS+1)); fi
done
kill $SERV 2>/dev/null
[ $FALLOS -eq 0 ] && echo "TODAS LAS PRUEBAS PASAN" || echo "$FALLOS prueba(s) fallan"; exit $FALLOS
