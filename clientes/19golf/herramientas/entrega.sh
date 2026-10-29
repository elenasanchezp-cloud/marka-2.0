#!/usr/bin/env bash
# Uso: herramientas/entrega.sh <version> "<resumen>"      ej.: herramientas/entrega.sh v1.0.0 "Web + brand book"
# Anota la entrega en ENTREGAS.md, crea la etiqueta git y la sube. GitHub crea la release (workflow release.yml).
set -euo pipefail
[[ "${1:-}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] && [ -n "${2:-}" ] || { echo 'Uso: herramientas/entrega.sh vX.Y.Z "resumen"'; exit 1; }
v="$1"; msg="$2"
[ -z "$(git status --porcelain)" ] || { echo "Hay cambios sin commitear. Haz commit antes de entregar."; exit 1; }
git rev-parse "$v" >/dev/null 2>&1 && { echo "La etiqueta $v ya existe"; exit 1; }
printf '\n## %s — %s\n%s\n' "$v" "$(date +%Y-%m-%d)" "$msg" >> ENTREGAS.md
git add ENTREGAS.md && git commit -q -m "Entrega $v: $msg"
git tag -a "$v" -m "$msg"
echo "Etiqueta $v creada. Para publicarla:"
echo "  git push origin HEAD && git push origin $v"
