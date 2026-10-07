#!/usr/bin/env bash
# Uso: scripts/nuevo-cliente.sh <slug> "<Nombre cliente>" [email]
# Crea clientes/<slug>/ con BRIEFING.md, BRAND.md y una web base en web/.
set -euo pipefail
[ $# -ge 2 ] || { echo 'Uso: scripts/nuevo-cliente.sh <slug> "<Nombre cliente>" [email]'; exit 1; }
slug="$1"; nombre="$2"; email="${3:-hola@ejemplo.com}"
[[ "$slug" =~ ^[a-z0-9-]+$ ]] || { echo "El slug solo admite a-z, 0-9 y guiones"; exit 1; }
root="$(cd "$(dirname "$0")/.." && pwd)"
dest="$root/clientes/$slug"
[ ! -e "$dest" ] || { echo "Ya existe clientes/$slug"; exit 1; }
mkdir -p "$dest/assets"
cp "$root/clientes/_plantilla/BRIEFING.md" "$root/clientes/_plantilla/BRAND.md" "$dest/"
cp -r "$root/plantilla" "$dest/web"
inicial="$(printf '%s' "$nombre" | cut -c1 | tr '[:lower:]' '[:upper:]')"
esc() { printf '%s' "$1" | sed -e 's/[\/&|]/\\&/g'; }
for f in "$dest"/BRIEFING.md "$dest"/BRAND.md "$dest"/web/index.html "$dest"/web/icon.svg; do
  sed -i \
    -e "s|{{CLIENTE}}|$(esc "$nombre")|g" \
    -e "s|{{EMAIL}}|$(esc "$email")|g" \
    -e "s|{{ANYO}}|$(date +%Y)|g" \
    -e "s|{{I}}|$(esc "$inicial")|g" "$f"
done
cat <<MSG
Creado clientes/$slug
  1. Rellena clientes/$slug/BRIEFING.md y BRAND.md
  2. Pide a Claude: "genera la web de clientes/$slug a partir del briefing"
  3. Rama:   git checkout -b web/$slug
  4. Vercel: nuevo proyecto con Root Directory = clientes/$slug/web
MSG
