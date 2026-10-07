# Propuestas y presupuestos

Plantillas de MARKA para vender. **Los precios los pones tú**: aquí no hay tarifas inventadas.

1. Copia `PROPUESTA-PLANTILLA.md` a `<cliente>-propuesta.md` y rellénala con el `BRIEFING.md`.
   Pide a Claude: *"Redacta la propuesta para <cliente> a partir de su BRIEFING.md, con el tono de MARKA (directo, breve, tuteo). Marca [PENDIENTE] lo que falte."*
2. Copia `partidas-ejemplo.csv`, pon conceptos y precios reales, y genera el presupuesto:
   ```bash
   node kit-cliente/herramientas/presupuesto.mjs partidas.csv --cliente "Café Norte" --num 2026-001 --iva 21
   ```
   Saca `presupuesto.html` y `presupuesto.pdf` con base, IVA (y IRPF si lo indicas) y total. Revisa los impuestos con tu gestoría.
3. Envía propuesta + presupuesto. Al aceptarse, `scripts/nuevo-repo-cliente.sh`.
