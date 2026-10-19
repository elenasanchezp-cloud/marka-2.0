# Contribuir a MARKA

Gracias por colaborar. Este archivo explica las reglas básicas para contribuir a este repositorio.

## Flujo básico
1. Crea una rama nueva desde main con nombre claro:
   - feature/<descripción>
   - web/<cliente-slug>
   - mejora/<qué>
2. Haz commits pequeños y descriptivos.
3. Push a la rama y abre un Pull Request hacia `main`.
4. En el PR usa la plantilla. Añade la URL de vista previa de Vercel si aplica.
5. Pide revisión y espera la aprobación. Cuando esté aprobado, fusiona.

## Local
```bash
python3 -m http.server 8000
# abre http://localhost:8000

git checkout -b feature/mi-cambio
git add .
git commit -m "feat: descripción corta"
git push -u origin feature/mi-cambio


`.github/workflows/check-links.yml`
```yaml
name: Check links

on:
  push:
    branches:
      - '**'
  pull_request:
    branches:
      - '**'

jobs:
  lychee:
    name: Lychee link check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run lychee (link checker)
        uses: lycheeverse/lychee-action@v2
        with:
          args: '.'
