// Personajes vectoriales de Elena y Aitana, redibujados del boceto de Elena y montados por piezas
// (cuerpo, brazos con codo, manos, cabeza, ojos, párpados, cejas, boca por visemas, pelo con inercia).
// Uso: Personajes.svg('elena', pose) -> <g> con el personaje. Pose (todo opcional):
//   x, y, s (escala), giro (inclinación del cuerpo, grados), dobla (torso sobre la cadera), aplasta (+ estira / - aplasta)
//   cabeza (grados), cabezaY, mira [x,y] (-1..1), parpadeo (0..1), cejas [izq, der] (-1 tristes .. 1 arriba),
//   enfado (0..1, cejas en V), boca {abre, ancho, sonrisa, o}, brazoI/brazoD [hombro, codo] (grados, 0 = abajo, + hacia fuera),
//   manoI/manoD ('puno' | 'abierta' | 'dedo'), pelo (inercia lateral en px), rubor (0..1), pierna [izq, der] (grados)
(function () {
  const C = {
    elena: {
      piel: '#C68A5F', pielS: '#A86F49', labio: '#A0564C', labioS: '#7E3E37', iris: '#4A2A17', ceja: '#3A2214',
      pelo: '#4B2C1B', peloS: '#35200F', mecha: '#B9854B', alto: 1, cabeza: 1,
      chaqueta: '#22201F', chaquetaS: '#151414', top: '#F1EEE8', pantalon: '#5B5A5C', pantalonS: '#48474A', zapato: '#EDEAE4',
    },
    aitana: {
      piel: '#E2AE86', pielS: '#C78E68', labio: '#D2897C', labioS: '#B06A60', iris: '#5F7A3A', ceja: '#A8834C',
      pelo: '#E3C07C', peloS: '#C59A56', mecha: '#F2DBA4', alto: .84, cabeza: 1.06,
      chaqueta: '#1F2142', chaquetaS: '#15162E', top: '#F4F1EB', pantalon: '#E9DFCB', pantalonS: '#D3C6AD', zapato: '#6B4026',
    },
  };
  const f = n => (Math.round(n * 10) / 10);
  const P = (...a) => a.map(v => typeof v === 'number' ? f(v) : v).join(' ');
  const rad = d => d * Math.PI / 180;

  function ojo(c, lado, b, mira, ceja, enfado) {
    // lado: -1 ojo de la izquierda de pantalla, 1 derecha. Centro en 0,0.
    const rx = 31, ry = 25, ext = lado; // el rabillo exterior va hacia fuera
    const lowC = ry * 1.25;
    const upC = (-2 * ry - 4) * (1 - b) + lowC * b;
    const xl = -rx - 4, xr = rx + 4, yo = 2;
    const sup = `M${P(xl, yo + (ext < 0 ? -3 : 3))} Q${P(0, upC)} ${P(xr, yo + (ext < 0 ? 3 : -3))}`;
    const forma = `${sup} Q${P(0, lowC)} ${P(xl, yo + (ext < 0 ? -3 : 3))} Z`;
    const id = 'o' + Math.random().toString(36).slice(2, 8);
    const ix = mira[0] * 11, iy = mira[1] * 7 + 2;
    const pest = ext < 0
      ? `M${P(xl, yo - 3)} q-12,-4 -18,-14 M${P(xl + 5, yo - 9)} q-8,-6 -11,-16`
      : `M${P(xr, yo - 3)} q12,-4 18,-14 M${P(xr - 5, yo - 9)} q8,-6 11,-16`;
    const cy = -ry - 24 - ceja * 14 + enfado * 6;
    const ca = (enfado * 16 - Math.min(0, ceja) * 10) * -ext; // V de enfado / caída triste
    const cejaP = `M${P(-30 * ext * -1, 6)} Q${P(0, -9)} ${P(32 * ext * -1, -1)}`;
    return `<defs><clipPath id="${id}"><path d="${forma}"/></clipPath></defs>
      <path d="${forma}" fill="#FBF8F3"/>
      <g clip-path="url(#${id})">
        <circle cx="${f(ix)}" cy="${f(iy)}" r="20" fill="${c.iris}"/>
        <circle cx="${f(ix)}" cy="${f(iy)}" r="11" fill="#140B06"/>
        <circle cx="${f(ix - 7)}" cy="${f(iy - 8)}" r="6" fill="#fff"/>
        <circle cx="${f(ix + 7)}" cy="${f(iy + 6)}" r="2.6" fill="#fff" opacity=".8"/>
        <path d="M${xl},-60 L${xr},-60 L${xr},${f(upC / 2 + 7)} Q0,${f(upC + 10)} ${xl},${f(upC / 2 + 7)} Z" fill="${c.pielS}" opacity=".25"/>
      </g>
      <path d="${sup}" fill="none" stroke="#1A0F0A" stroke-width="7" stroke-linecap="round"/>
      <path d="${pest}" fill="none" stroke="#1A0F0A" stroke-width="4.5" stroke-linecap="round"/>
      <g transform="translate(0 ${f(cy)}) rotate(${f(ca)})"><path d="${cejaP}" fill="none" stroke="${c.ceja}" stroke-width="10" stroke-linecap="round"/></g>`;
  }

  function boca(c, m) {
    const abre = m.abre || 0, o = m.o || 0, son = m.sonrisa ?? .3;
    const w = (25 + (m.ancho || 0) * 8 + son * 5) * (1 - o * .4);
    const h = abre * 34 * (1 + o * .3);
    const s = son * 9;
    const upI = -h * .55 + s * .2, loI = h * 1.55 + s * 1.2;
    const L = `M${P(-w, -s)}`;
    const interior = `${L} Q${P(0, upI)} ${P(w, -s)} Q${P(0, loI)} ${P(-w, -s)} Z`;
    const id = 'b' + Math.random().toString(36).slice(2, 8);
    const sup = `${L} C${P(-w * .55, -s - 15)} ${P(-9, -15 + upI * .4)} 0,${f(-10 + upI * .45)} C${P(9, -15 + upI * .4)} ${P(w * .55, -s - 15)} ${P(w, -s)} Q${P(0, upI)} ${P(-w, -s)} Z`;
    const inf = `${L} Q${P(0, loI)} ${P(w, -s)} Q${P(0, loI + 26)} ${P(-w, -s)} Z`;
    return `<defs><clipPath id="${id}"><path d="${interior}"/></clipPath></defs>
      <path d="${interior}" fill="#4A1518"/>
      <g clip-path="url(#${id})">
        <rect x="${f(-w)}" y="${f(Math.min(upI, -s) - 20)}" width="${f(2 * w)}" height="${f(20 + h * .42 + 4)}" fill="#FBF7F0"/>
        <ellipse cx="0" cy="${f(loI * .55 + 4)}" rx="${f(w * .6)}" ry="${f(Math.max(4, h * .35))}" fill="#C4555A"/>
      </g>
      <path d="${inf}" fill="${c.labio}"/>
      <path d="${sup}" fill="${c.labioS}"/>
      <ellipse cx="${f(-w * .25)}" cy="${f(loI * .5 + 12)}" rx="${f(w * .22)}" ry="3.5" fill="#fff" opacity=".22"/>
      <path d="M${P(-w - 3, -s + 1)} q-4,-3 -5,-7 M${P(w + 3, -s + 1)} q4,-3 5,-7" stroke="${c.labioS}" stroke-width="3" fill="none" stroke-linecap="round" opacity="${f(.4 + son * .5)}"/>`;
  }

  // Pelo trasero (detrás del cuerpo) y delantero (encima de la cara)
  function peloAtras(n, c, sw) {
    if (n === 'elena') return `<path d="M-120,-200 C-150,-120 -150,40 -160,${f(270)} L${f(-150 + sw)},${f(330)} L${f(150 + sw)},${f(330)} L160,270 C150,40 150,-120 120,-200 Z" fill="${c.peloS}"/>`;
    let d = `M-118,-200 C-170,-60 -175,80 -185,170`;
    for (let i = 0; i <= 8; i++) { const x = -185 + i * 46.25 + sw * (1 - Math.abs(i - 4) / 6); d += ` Q${f(x + 23)},${f(290 + (i % 2 ? 26 : -8))} ${f(x + 46)},${f(275)}`; }
    d += ` C175,60 170,-60 118,-200 Z`;
    return `<path d="${d}" fill="${c.peloS}"/>`;
  }
  function peloDelante(n, c, sw, giro) {
    const g = giro * 10;
    if (n === 'elena') {
      const casco = `M${f(-128 + g)},-120 C-135,-215 -80,-268 ${f(4 + g)},-268 C80,-268 135,-215 ${f(128 + g)},-120 L${f(110 + g)},-95 C100,-170 70,-215 ${f(8 + g)},-232 C-30,-205 -70,-200 -88,-175 C-100,-150 -105,-120 ${f(-110 + g)},-95 Z`;
      const mI = `M-133,-130 C-138,-40 -132,90 ${f(-128 + sw)},${f(290)} L${f(-70 + sw)},${f(305)} C-82,170 -100,40 -105,-110 Z`;
      const mD = `M133,-130 C138,-40 132,90 ${f(128 + sw)},${f(290)} L${f(70 + sw)},${f(305)} C82,170 100,40 105,-110 Z`;
      return `<path d="${mI}" fill="${c.pelo}"/><path d="${mD}" fill="${c.pelo}"/><path d="${casco}" fill="${c.pelo}"/>
        <path d="M${f(-95 + g)},-210 C-118,-120 -112,90 ${f(-100 + sw)},${f(285)}" stroke="${c.mecha}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>
        <path d="M${f(95 + g)},-210 C118,-120 114,90 ${f(102 + sw)},${f(288)}" stroke="${c.mecha}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>
        <path d="M${f(-30 + g)},-255 C-70,-240 -100,-200 -116,-140" stroke="${c.mecha}" stroke-width="5" fill="none" opacity=".55"/>
        <path d="M${f(4 + g)},-266 L${f(8 + g)},-232" stroke="${c.peloS}" stroke-width="4"/>`;
    }
    const casco = `M${f(-128 + g)},-110 C-140,-215 -80,-272 ${f(0 + g)},-272 C82,-272 140,-215 ${f(130 + g)},-110 L${f(112 + g)},-120 C105,-180 70,-222 ${f(-20 + g)},-226 C-40,-200 -80,-190 -100,-160 C-110,-140 -112,-125 ${f(-112 + g)},-110 Z`;
    let mI = `M-132,-120 C-150,-20 -150,80 -165,120`;
    let mD = `M132,-120 C150,-20 150,80 165,120`;
    for (let i = 0; i < 4; i++) {  mI += ` q${f(-22 + sw * .3)},22 ${f(sw * .25)},44`; mD += ` q${f(22 + sw * .3)},22 ${f(sw * .25)},44`; }
    mI += ` L${f(-95 + sw)},${f(300)} C-100,140 -96,40 -100,-100 Z`;
    mD += ` L${f(95 + sw)},${f(300)} C100,140 96,40 100,-100 Z`;
    return `<path d="${mI}" fill="${c.pelo}"/><path d="${mD}" fill="${c.pelo}"/><path d="${casco}" fill="${c.pelo}"/>
      <path d="M${f(-100 + g)},-200 C-130,-100 -150,40 -140,130 q-15,30 0,55 q15,30 ${f(4 + sw * .5)},70" stroke="${c.mecha}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M${f(100 + g)},-200 C130,-100 150,40 140,130 q15,30 0,55 q-15,30 ${f(-4 + sw * .5)},70" stroke="${c.mecha}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M${f(-20 + g)},-262 C30,-250 80,-215 108,-150" stroke="${c.mecha}" stroke-width="6" fill="none" opacity=".6"/>`;
  }

  function cabeza(n, c, p) {
    const giro = p.giroCara || 0, g = giro * 14;
    const b = boca(c, p.boca || {});
    const cara = `M0,-252 C72,-252 116,-205 116,-140 C116,-80 86,-34 46,-9 C26,3 -26,3 -46,-9 C-86,-34 -116,-80 -116,-140 C-116,-205 -72,-252 0,-252 Z`;
    const pend = n === 'elena'
      ? `<circle cx="${f(-108 + g * .3)}" cy="-66" r="17" fill="none" stroke="#D8B15A" stroke-width="4"/><circle cx="${f(108 + g * .3)}" cy="-66" r="17" fill="none" stroke="#D8B15A" stroke-width="4"/>`
      : `<circle cx="${f(-110 + g * .3)}" cy="-78" r="7" fill="#F7F2EA"/><circle cx="${f(110 + g * .3)}" cy="-78" r="7" fill="#F7F2EA"/>`;
    const pecas = [[-62, -92], [-52, -84], [-70, -82], [62, -92], [52, -84], [70, -82]].map(([x, y]) => `<circle cx="${f(x + g)}" cy="${y}" r="2" fill="${c.pielS}" opacity=".55"/>`).join('');
    const ru = .35 + (p.rubor || 0) * .45;
    return `${pend}
      <ellipse cx="-114" cy="-118" rx="14" ry="22" fill="${c.pielS}"/><ellipse cx="114" cy="-118" rx="14" ry="22" fill="${c.pielS}"/>
      <path d="${cara}" fill="${c.piel}"/>
      <path d="M-116,-150 C-112,-60 -60,-10 0,-2 C-40,-20 -90,-70 -100,-160 Z" fill="${c.pielS}" opacity=".18"/>
      <ellipse cx="${f(-68 + g)}" cy="-90" rx="25" ry="14" fill="#E06C6C" opacity="${f(ru)}"/>
      <ellipse cx="${f(68 + g)}" cy="-90" rx="25" ry="14" fill="#E06C6C" opacity="${f(ru)}"/>
      ${pecas}
      <g transform="translate(${f(-48 + g)} -132)">${ojo(c, -1, p.parpadeo || 0, p.mira || [0, 0], (p.cejas || [0, 0])[0], p.enfado || 0)}</g>
      <g transform="translate(${f(48 + g)} -132)">${ojo(c, 1, p.parpadeo || 0, p.mira || [0, 0], (p.cejas || [0, 0])[1], p.enfado || 0)}</g>
      <path d="M${f(-4 + g * 1.2)},-96 q-7,12 2,16 q8,1 10,-4" fill="none" stroke="${c.pielS}" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(${f(g * 1.1)} -44) scale(1.25)">${b}</g>`;
  }

  function brazo(c, n, lado, sh, a1, a2, mano, L1, L2, grosor) {
    const ex = sh[0] + lado * L1 * Math.sin(rad(a1)), ey = sh[1] + L1 * Math.cos(rad(a1));
    const a = a1 + a2;
    const hx = ex + lado * L2 * Math.sin(rad(a)), hy = ey + L2 * Math.cos(rad(a));
    const ang = Math.atan2(hy - ey, hx - ex) * 180 / Math.PI;
    let m;
    const pi = c.piel;
    if (mano === 'dedo') m = `<ellipse cx="0" cy="0" rx="25" ry="22" fill="${pi}"/><rect x="10" y="-9" width="44" height="17" rx="8.5" fill="${pi}"/><ellipse cx="-2" cy="-18" rx="10" ry="8" fill="${c.pielS}"/>`;
    else if (mano === 'abierta') m = `<ellipse cx="6" cy="0" rx="27" ry="25" fill="${pi}"/>${[-24, -8, 8, 24].map((y, i) => `<rect x="18" y="${y - 7}" width="${34 - Math.abs(i - 1.5) * 5}" height="14" rx="7" fill="${pi}"/>`).join('')}<ellipse cx="2" cy="${lado < 0 ? 28 : -28}" rx="16" ry="9" fill="${pi}"/>`;
    else m = `<ellipse cx="4" cy="0" rx="28" ry="25" fill="${pi}"/><path d="M14,-14 q16,6 4,18" stroke="${c.pielS}" stroke-width="3" fill="none"/>`;
    const puno = n === 'elena' ? c.chaquetaS : c.chaquetaS;
    return `<path d="M${P(sh[0], sh[1])} L${P(ex, ey)}" stroke="${c.chaqueta}" stroke-width="${grosor + 6}" stroke-linecap="round" fill="none"/>
      <path d="M${P(ex, ey)} L${P(hx, hy)}" stroke="${c.chaqueta}" stroke-width="${grosor}" stroke-linecap="round" fill="none"/>
      <path d="M${P(ex + (hx - ex) * .82, ey + (hy - ey) * .82)} L${P(ex + (hx - ex) * .97, ey + (hy - ey) * .97)}" stroke="${puno}" stroke-width="${grosor - 2}" stroke-linecap="butt"/>
      <g transform="translate(${f(hx)} ${f(hy)}) rotate(${f(ang)}) scale(1.3 ${f(1.3 * lado)})">${m}</g>`;
  }

  function cuerpo(n, c, p) {
    const pi = p.pierna || [0, 0];
    let piernas, torso;
    if (n === 'elena') {
      piernas = [-1, 1].map((l, i) => { const a = pi[i]; const fx = l * 70 + Math.sin(rad(a)) * 720 * -1 * 0; const kx = l * 66 + Math.sin(rad(a)) * 350, ky = -400 + (1 - Math.cos(rad(a))) * 40; const px = l * 72 + Math.sin(rad(a)) * 700, py = -40 - (1 - Math.cos(rad(a))) * 60;
        return `<path d="M${l * 62},-760 L${f(kx)},${f(ky)} L${f(px)},${f(py)}" stroke="${c.pantalon}" stroke-width="128" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="${f(px + l * 10)}" cy="${f(py + 30)}" rx="70" ry="32" fill="${c.zapato}"/>`; }).join('');
      torso = `<path d="M-120,-800 L120,-800 L135,-700 L-135,-700 Z" fill="${c.pantalon}"/>
        <path d="M-12,-790 q-6,60 -2,110 M12,-790 q6,60 2,110" stroke="#3E3D40" stroke-width="4" fill="none"/>
        <path d="M-72,-860 L72,-860 L76,-795 L-76,-795 Z" fill="${c.piel}"/><ellipse cx="0" cy="-818" rx="4" ry="6" fill="${c.pielS}"/>
        <path d="M-82,-1140 Q0,-1090 82,-1140 L80,-860 Q0,-848 -80,-860 Z" fill="${c.top}"/>
        <path d="M-165,-1135 C-205,-1110 -215,-1000 -210,-640 L-85,-640 L-78,-1100 Z" fill="${c.chaqueta}"/>
        <path d="M165,-1135 C205,-1110 215,-1000 210,-640 L85,-640 L78,-1100 Z" fill="${c.chaqueta}"/>
        <path d="M-80,-1110 L-86,-640 M80,-1110 L86,-640" stroke="#6E6A66" stroke-width="3"/>
        <path d="M-95,-1150 C-130,-1190 -160,-1160 -165,-1135 L-82,-1100 Z M95,-1150 C130,-1190 160,-1160 165,-1135 L82,-1100 Z" fill="${c.chaquetaS}"/>`;
    } else {
      piernas = [-1, 1].map((l, i) => { const a = pi[i]; const kx = l * 58 + Math.sin(rad(a)) * 300, ky = -330 + (1 - Math.cos(rad(a))) * 30; const px = l * 62 + Math.sin(rad(a)) * 600, py = -36 - (1 - Math.cos(rad(a))) * 50;
        return `<path d="M${l * 55},-640 L${f(kx)},${f(ky)} L${f(px)},${f(py)}" stroke="${c.pantalon}" stroke-width="130" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="${f(px + l * 10)}" cy="${f(py + 28)}" rx="60" ry="26" fill="${c.zapato}"/>`; }).join('');
      torso = `<path d="M-115,-700 L115,-700 L128,-590 L-128,-590 Z" fill="${c.pantalon}"/>
        <rect x="-118" y="-712" width="236" height="26" rx="4" fill="#6B4026"/><rect x="-16" y="-714" width="32" height="30" rx="4" fill="none" stroke="#C9A15A" stroke-width="5"/>
        <path d="M-125,-955 C-160,-940 -150,-760 -122,-700 L122,-700 C150,-760 160,-940 125,-955 Q0,-985 -125,-955 Z" fill="${c.chaqueta}"/>
        <path d="M-55,-965 L0,-860 L55,-965 Z" fill="${c.top}"/>
        <path d="M-55,-965 L-6,-900 L-34,-880 Z M55,-965 L6,-900 L34,-880 Z" fill="#FFFFFF"/>
        <path d="M-60,-962 L0,-850 L60,-962" stroke="${c.chaquetaS}" stroke-width="10" fill="none"/>
        ${[-90, -60, -30, 30, 60, 90].map(x => `<path d="M${x},-930 q-4,110 0,210" stroke="${c.chaquetaS}" stroke-width="3" fill="none" opacity=".6"/>`).join('')}`;
    }
    return { piernas, torso };
  }

  function svg(n, p0) {
    const p = Object.assign({ x: 540, y: 1800, s: 1, giro: 0, dobla: 0, aplasta: 0, cabeza: 0, cabezaY: 0, pelo: 0 }, p0);
    const c = C[n];
    const E = n === 'elena';
    const shY = E ? -1125 : -945, shW = E ? 168 : 128, cuello = E ? -1145 : -965;
    const L1 = E ? 240 : 200, L2 = E ? 225 : 185, gros = E ? 74 : 60;
    const sq = p.aplasta;
    const cu = cuerpo(n, c, p);
    const hs = c.cabeza * (E ? 1.02 : 1) * 1.38;
    const hy = cuello - 70 + p.cabezaY;
    const bI = p.brazoI || [8, -8], bD = p.brazoD || [8, -8];
    const sw = p.pelo;
    const bI_ = brazo(c, n, -1, [-shW + 10, shY + 30], bI[0], bI[1], p.manoI || 'puno', L1, L2, gros);
    const bD_ = brazo(c, n, 1, [shW - 10, shY + 30], bD[0], bD[1], p.manoD || 'puno', L1, L2, gros);
    const tH = `translate(0 ${f(hy)}) rotate(${f(p.cabeza)}) scale(${f(hs)})`;
    const pa = `<g transform="${tH}">${peloAtras(n, c, sw)}</g>`;
    const cab = `<g transform="${tH}">
        <path d="M-30,-20 L-34,100 L34,100 L30,-20 Z" fill="${c.pielS}"/>
        ${cabeza(n, c, p)}
        ${peloDelante(n, c, sw, p.giroCara || 0)}
      </g>`;
    const atras = p.brazoAtras ? [p.brazoAtras === 'I' ? bI_ : '', p.brazoAtras === 'D' ? bD_ : ''].join('') : '';
    const delante = [p.brazoAtras === 'I' ? '' : bI_, p.brazoAtras === 'D' ? '' : bD_].join('');
    const hipY = E ? -760 : -640;
    return `<g transform="translate(${f(p.x)} ${f(p.y)}) scale(${f(p.s * c.alto * (1 - sq * .5))} ${f(p.s * c.alto * (1 + sq))}) rotate(${f(p.giro)})">
      <g transform="translate(0 ${f(-hipY * .28)}) rotate(${f(p.dobla)} 0 ${hipY})">${pa}</g>
      <g transform="scale(1 .72)">${cu.piernas}</g>
      <g transform="translate(0 ${f(-hipY * .28)}) rotate(${f(p.dobla)} 0 ${hipY})">
        ${atras}
        <path d="M${E ? -30 : -26},${cuello - 20} L${E ? -32 : -28},${cuello + 60} L${E ? 32 : 28},${cuello + 60} L${E ? 30 : 26},${cuello - 20} Z" fill="${c.pielS}"/>
        ${cu.torso}
        ${cab}
        ${delante}
      </g>
    </g>`;
  }
  window.Personajes = { svg, C };
})();
