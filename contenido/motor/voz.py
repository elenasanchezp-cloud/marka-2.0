"""Voz provisional de personajes («animalese»): una sílaba sintetizada por cada sílaba del guion,
con el timbre de su vocal. Sirve para sincronizar bocas hasta tener voz real.
Uso: python3 motor/voz.py guion.json voz.wav silabas.js
Escribe en silabas.js window.SIL (sílabas) y window.PAL (palabras) para animar bocas y subtítulos.
"""
import json, sys, wave, re, unicodedata
import numpy as np
SR = 44100
g = json.load(open(sys.argv[1]))
N = int(g["duracion"] * SR); voz = np.zeros(N)
rng = np.random.default_rng(3)
FORM = {'a': (850, 1600), 'e': (520, 2100), 'i': (330, 2700), 'o': (520, 950), 'u': (380, 880)}
V = 'aeiouáéíóúü'

def base(c): return unicodedata.normalize('NFD', c)[0]

def silabas(palabra):
    p = palabra.lower(); grupos = []
    for m in re.finditer(r'[aeiouáéíóúü]+', p):
        s = m.group(); fuertes = [base(c) for c in s if base(c) in 'aeo' or c in 'áéíóú']
        grupos.append(base(fuertes[0]) if fuertes else base(s[-1]))
    return grupos or ['a']

def silaba(d, f0, vocal, cons, pend):
    n = int(d * SR); x = np.arange(n) / SR
    f = f0 * (1 + pend * x / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    F1, F2 = FORM[vocal]; s = np.zeros(n)
    for k in range(1, 24):
        fk = k * f0
        if fk > 5000: break
        a = np.exp(-((fk - F1) / 260) ** 2) + .7 * np.exp(-((fk - F2) / 380) ** 2) + .08 / k
        s += a * np.sin(k * ph)
    env = np.minimum(1, x / .012) * np.exp(-x / (d * .55)) * np.minimum(1, (d - x) / .02)
    s *= env
    if cons:
        m = int(.018 * SR); w = rng.standard_normal(m) * np.exp(-np.arange(m) / SR * 160) * .35
        s[:m] += w
    return s / 3

SIL, PAL = [], []
for li, (q, t0, t1, txt) in enumerate(g["lineas"]):
    palabras = [w for w in re.findall(r"[\wáéíóúüñÁÉÍÓÚÑ]+", txt)]
    sil = [(wi, v, w) for wi, w in enumerate(palabras) for v in silabas(w)]
    n = len(sil); gaps = len(palabras) - 1
    u = (t1 - t0) / (n + gaps * .35 + .3)
    t = t0; prev = -1; pregunta = txt.strip().endswith('?')
    for k, (wi, v, w) in enumerate(sil):
        if wi != prev and prev >= 0: t += u * .35
        if wi != prev: PAL.append([li, wi, round(t, 3), w])
        d = u * (1.3 if k == n - 1 else 1) * (1 + rng.uniform(-.12, .12))
        quienes = ['E', 'A'] if q == 'B' else [q]
        for qq in quienes:
            vo = g["voces"][qq]
            prog = k / max(1, n - 1)
            f0 = vo["f0"] * (1 + rng.uniform(-vo["var"], vo["var"])) * ((1 + .25 * prog) if pregunta else (1 - .12 * prog))
            sig = silaba(d * .92, f0, v, w[0].lower() not in V, .1 if pregunta else -.05)
            i = int(t * SR); j = min(N, i + len(sig)); voz[i:j] += sig[:j - i] * (.8 if q == 'B' else 1)
            SIL.append([qq, round(t, 3), round(t + d * .92, 3), v])
        t += u; prev = wi
voz = np.tanh(voz * 1.5); voz /= np.max(np.abs(voz)) + 1e-9; voz *= .9
with wave.open(sys.argv[2], 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((voz * 32767).astype(np.int16).tobytes())
lineas = [[q, t0, t1, txt] for q, t0, t1, txt in g["lineas"]]
open(sys.argv[3], 'w').write('window.SIL=' + json.dumps(SIL) + ';\nwindow.PAL=' + json.dumps(PAL, ensure_ascii=False) + ';\nwindow.LIN=' + json.dumps(lineas, ensure_ascii=False) + ';\n')
print('voz lista', len(SIL), 'sílabas')
