#!/usr/bin/env bash
# Uso: herramientas/lanzar.sh https://dominio-del-cliente.com
# Convierte la demo (noindex) en web pública: quita noindex, abre robots.txt, canonical/OG y sitemap.
set -euo pipefail
d="${1:-}"; [[ "$d" =~ ^https?://[^/]+/?$ ]] || { echo 'Uso: herramientas/lanzar.sh https://dominio.com'; exit 1; }
d="${d%/}"; w="$(cd "$(dirname "$0")/.." && pwd)/web"
sed -i '/name="robots" content="noindex/d' "$w/index.html"
printf 'User-agent: *\nAllow: /\nSitemap: %s/sitemap.xml\n' "$d" > "$w/robots.txt"
printf '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>%s/</loc><lastmod>%s</lastmod></url>\n</urlset>\n' "$d" "$(date +%F)" > "$w/sitemap.xml"
sed -i "/X-Robots-Tag/d" "$w/vercel.json"
grep -q 'rel="canonical"' "$w/index.html" || sed -i "s|</title>|</title>\n<link rel=\"canonical\" href=\"$d/\">|" "$w/index.html"
echo "Lanzada: $d"
echo "Revisa: og:image (JPG 1200x630), JSON-LD y 'node herramientas/auditoria-web.mjs web/index.html'"
