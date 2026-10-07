#!/usr/bin/env bash
# Uso: scripts/nuevo-repo-cliente.sh <slug> "<Nombre cliente>" [email] [carpeta-destino]
# Crea un repo INDEPENDIENTE (git init, commit inicial) listo para subir a GitHub como privado.
set -euo pipefail
source "$(dirname "$0")/_kit.sh"
validar "${1:-}" "${2:-}" || { echo 'Uso: scripts/nuevo-repo-cliente.sh <slug> "<Nombre cliente>" [email] [destino]'; exit 1; }
slug="$1"; nombre="$2"; email="${3:-hola@ejemplo.com}"
dest="${4:-$ROOT/../marka-$slug}"
crear_kit "$dest" "$slug" "$nombre" "$email"
git -C "$dest" init -q -b main
git -C "$dest" add -A
git -C "$dest" commit -q -m "Arranca el proyecto de $nombre desde el kit de MARKA"
dest="$(cd "$dest" && pwd)"
cat <<MSG
Repo creado en $dest
  1. Crea en GitHub un repo PRIVADO llamado marka-$slug (sin README)
  2. cd "$dest" && git remote add origin git@github.com:<tu-usuario>/marka-$slug.git && git push -u origin main
  3. Rellena BRIEFING.md y BRAND.md con el cliente
  4. Pide a Claude: "Siguiendo BRAND.md, haz [web / 10 posts / guion de 30 s / campaña]"
  5. Vercel: Root Directory = web
MSG
