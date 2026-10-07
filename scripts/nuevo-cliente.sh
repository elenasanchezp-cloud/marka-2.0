#!/usr/bin/env bash
# Uso: scripts/nuevo-cliente.sh <slug> "<Nombre cliente>" [email]
# Crea clientes/<slug>/ DENTRO de este repo (kit completo + web base).
# Para un repo independiente por cliente usa scripts/nuevo-repo-cliente.sh
set -euo pipefail
source "$(dirname "$0")/_kit.sh"
validar "${1:-}" "${2:-}" || { echo 'Uso: scripts/nuevo-cliente.sh <slug> "<Nombre cliente>" [email]'; exit 1; }
slug="$1"; nombre="$2"; email="${3:-hola@ejemplo.com}"
crear_kit "$ROOT/clientes/$slug" "$slug" "$nombre" "$email"
# dentro del monorepo no hacen falta los ficheros de repo del kit
rm -rf "$ROOT/clientes/$slug/.github" "$ROOT/clientes/$slug/.gitignore"
cat <<MSG
Creado clientes/$slug
  1. Rellena clientes/$slug/BRIEFING.md y BRAND.md
  2. Pide a Claude: "Siguiendo BRAND.md, genera la web de clientes/$slug"
  3. Rama:   git checkout -b web/$slug
  4. Vercel: Root Directory = clientes/$slug/web
MSG
