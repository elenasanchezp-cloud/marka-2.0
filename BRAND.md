# MARKA — Sistema de marca

## Esencia
- **Claim:** Ideas que toman forma.
- **Lema:** No hacemos logos. Hacemos markas.
- **Concepto:** la **K** como forma central: se funde, se inclina, cambia de material. Una silueta, muchos materiales.
- **Servicios:** branding, brand book, identidad de redes sociales, edición de vídeo, campañas creativas, estrategia creativa.

## Color (tokens en `:root` de `index.html`)
| Token | Hex | Uso |
|---|---|---|
| `--carbon` | `#1A1A1A` | fondo principal, texto sobre claro |
| `--hueso` | `#F4F1EB` | texto sobre oscuro, fondos claros |
| `--arena` | `#D9D5CC` | secciones claras |
| `--piedra` | `#B7AEA4` | texto secundario, etiquetas |

Paleta mineral y cálida: nada de colores saturados ni degradados chillones.

## Tipografía
- **Display:** Neue Montreal (fallback Hanken Grotesk) — peso 500, MAYÚSCULAS, tracking −0.045em, interlineado .88.
- **Cuerpo:** Inter 400/500, 16px, interlineado 1.55.
- **Etiquetas:** 11px, MAYÚSCULAS, tracking .24em.

## Tono de voz
Directo, seguro, breve. Frases cortas y contundentes. Se tutea. Sin jerga corporativa ni exclamaciones.
Ejemplos: "Primero entendemos. Después diseñamos." · "La forma es la marka."
Se escribe "marka/markas" en minúscula en frase; "MARKA" en mayúsculas como nombre.

## Movimiento e interacción
Suave y con peso (easing `cubic-bezier(.22,1,.36,1)`), grano de papel, cursor personalizado, scroll con Lenis/GSAP.
Respetar siempre `prefers-reduced-motion`.

## Imágenes
`.webp`, materiales (piedra, metal, luz, negro, macro, escultura). Ligeras (<30 KB si es posible), con `alt` descriptivo.
