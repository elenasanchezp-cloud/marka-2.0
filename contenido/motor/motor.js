// Utilidades de animación deterministas: todo depende de t (segundos), nada del reloj.
(function () {
  // Easing de marca: cubic-bezier(.22,1,.36,1)
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
    const dx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let i = 0; i < 8; i++) { const d = dx(t); if (Math.abs(d) < 1e-6) break; t -= (sx(t) - x) / d; } return sy(Math.min(1, Math.max(0, t))); };
  }
  const M = {};
  M.ease = bezier(.22, 1, .36, 1);
  M.inOut = bezier(.65, 0, .35, 1);
  M.clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  M.p = (t, a, b) => M.clamp((t - a) / (b - a));           // progreso lineal 0..1
  M.e = (t, a, b) => M.ease(M.p(t, a, b));                  // progreso con easing
  M.lerp = (a, b, k) => a + (b - a) * k;
  // Muelle amortiguado: 0 → 1 con rebote
  M.spring = (t, a, dur = .9, f = 2.4, damp = 5) => { const x = M.clamp((t - a) / dur); if (x <= 0) return 0; return 1 - Math.exp(-damp * x) * Math.cos(f * Math.PI * 2 * x * .5); };
  M.vis = (el, on) => { el.style.display = on ? '' : 'none'; };
  M.$ = s => document.querySelector(s);
  M.$$ = s => [...document.querySelectorAll(s)];
  M.set = (el, o) => { for (const k in o) el.style[k] = o[k]; };
  // Grano de papel: desplaza la textura cada fotograma de forma pseudoaleatoria
  M.grano = t => { const g = document.getElementById('grano'); if (!g) return; const f = Math.floor(t * 24); g.style.backgroundPosition = `${(f * 137) % 400}px ${(f * 263) % 400}px`; };
  M.kSvg = (fill = 'currentColor') => `<svg viewBox="0 0 860 864" aria-hidden="true"><path fill="${fill}" d="${window.K_PATH}"/></svg>`;
  window.M = M;
})();
