#!/usr/bin/env bash
# Genera los PDF de revision a partir de cuba-datos.js y los deja en revision/
# Requiere: node y python3 con reportlab, y la fuente DejaVu Sans.
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"; RAIZ="$(cd "$AQUI/../.." && pwd)"
node -e "require('$RAIZ/cuba-datos.js');require('fs').writeFileSync('$AQUI/cuba.json',JSON.stringify(globalThis.CUBA))"
python3 "$AQUI/hacer_revision.py"
python3 "$AQUI/hacer_anexo.py"
mkdir -p "$RAIZ/revision"
mv "$AQUI"/*.pdf "$RAIZ/revision/"
rm -f "$AQUI/cuba.json"
echo "PDF en $RAIZ/revision/"
