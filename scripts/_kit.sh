#!/usr/bin/env bash
# Funciones compartidas por nuevo-cliente.sh y nuevo-repo-cliente.sh
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

validar() { # slug nombre
  [ -n "${1:-}" ] && [ -n "${2:-}" ] || return 1
  [[ "$1" =~ ^[a-z0-9-]+$ ]] || { echo "El slug solo admite a-z, 0-9 y guiones"; return 1; }
}

crear_kit() { # destino slug nombre email
  local dest="$1" slug="$2" nombre="$3" email="$4"
  [ ! -e "$dest" ] || { echo "Ya existe $dest"; return 1; }
  mkdir -p "$dest"
  cp -a "$ROOT/kit-cliente/." "$dest/"
  cp -r "$ROOT/plantilla" "$dest/web"
  local inicial esc
  inicial="$(printf '%s' "$nombre" | cut -c1 | tr '[:lower:]' '[:upper:]')"
  esc() { printf '%s' "$1" | sed -e 's/[\/&|]/\\&/g'; }
  while IFS= read -r -d '' f; do
    sed -i \
      -e "s|{{CLIENTE}}|$(esc "$nombre")|g" \
      -e "s|{{SLUG}}|$(esc "$slug")|g" \
      -e "s|{{EMAIL}}|$(esc "$email")|g" \
      -e "s|{{ANYO}}|$(date +%Y)|g" \
      -e "s|{{I}}|$(esc "$inicial")|g" "$f"
  done < <(find "$dest" -type f \( -name '*.md' -o -name '*.html' -o -name '*.svg' -o -name '*.yml' \) -print0)
}
