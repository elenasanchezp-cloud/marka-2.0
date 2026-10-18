"""Música con groove y efectos para las piezas con muñecas.
Uso: python3 motor/musica.py eventos.json salida.wav [voz.wav]
eventos.json: {"duracion":31.6,"bpm":118,"inicio":0,"fin":29,"final":29,
  "efectos":[["pop",1.2],["whoosh",2.5],["teclas",8.0,1.0],["sello",18.2],["choque",21.3],["brillo",21.3],["click",3.0],["vuelta",15.0]]}
Si se pasa voz.wav, la música baja cuando hablan (ducking) y se mezcla todo.
"""
import json, sys, wave
import numpy as np
SR = 44100
cfg = json.load(open(sys.argv[1])); D = cfg["duracion"]; N = int(D * SR)
mus = np.zeros(N); sfx = np.zeros(N)
rng = np.random.default_rng(11)
def put(buf, sig, t, g=1.0):
    i = max(0, int(t * SR));
    if i >= N: return
    j = min(N, i + len(sig)); buf[i:j] += sig[:j - i] * g
def env_ad(n, a=.005, dcy=8.0):
    x = np.arange(n) / SR; return np.minimum(1, x / a) * np.exp(-x * dcy)
def lp(x, k):  # paso bajo de un polo (vectorizado por bloques sencillos)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += k * (x[i] - acc); y[i] = acc
    return y
# --- instrumentos
def kick():
    n = int(.4 * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(48 + 120 * np.exp(-x * 35)) / SR) * np.exp(-x * 7) * 1.1
def clap():
    n = int(.25 * SR); x = np.arange(n) / SR; w = rng.standard_normal(n)
    w = np.diff(np.concatenate([[0], w]))
    e = np.exp(-x * 22) + .6 * np.exp(-np.maximum(0, x - .012) * 30) * (x > .012) + .4 * np.exp(-np.maximum(0, x - .024) * 30) * (x > .024)
    return w * e * .35
def hat(o=False):
    n = int((.18 if o else .05) * SR); x = np.arange(n) / SR; w = np.diff(np.concatenate([[0], rng.standard_normal(n)]))
    return w * np.exp(-x * (18 if o else 80)) * .16
def nota(f, d, tipo='pluck'):
    n = int(d * SR); x = np.arange(n) / SR
    if tipo == 'bajo':
        s = np.sin(2 * np.pi * f * x) + .3 * np.sin(4 * np.pi * f * x)
        return s * np.minimum(1, x / .01) * np.exp(-x * 3) * .55
    if tipo == 'pad':
        s = sum(np.sin(2 * np.pi * f * (1 + dt) * x) for dt in (-.004, 0, .004)) / 3
        return s * np.minimum(1, x / .25) * np.minimum(1, (d - x) / .3) * .12
    s = np.sign(np.sin(2 * np.pi * f * x)) * .3 + np.sin(2 * np.pi * f * x)
    return s * env_ad(n, .003, 9) * .16
def hz(m): return 440 * 2 ** ((m - 69) / 12)
# --- efectos
def pop():
    n = int(.12 * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(500 + 900 * np.exp(-x * 40)) / SR) * env_ad(n, .002, 30) * .6
def click():
    n = int(.03 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2400 * x) + rng.standard_normal(n) * .3) * np.exp(-x * 250) * .35
def whoosh(d=.45):
    n = int(d * SR); x = np.linspace(0, 1, n); w = rng.standard_normal(n)
    k = .03 + .3 * np.sin(np.pi * x) ** 2; y = np.empty(n); acc = 0.0
    for i in range(n): acc += k[i] * (w[i] - acc); y[i] = acc
    return y * np.sin(np.pi * x) ** 2 * 1.2
def sello():
    n = int(.3 * SR); x = np.arange(n) / SR
    body = np.sin(2 * np.pi * np.cumsum(90 + 200 * np.exp(-x * 40)) / SR) * np.exp(-x * 14)
    return (body + rng.standard_normal(n) * np.exp(-x * 60) * .6) * .8
def choque():  # tazas que brindan
    n = int(.9 * SR); x = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * dcy) for f, a, dcy in ((2093, .5, 6), (3140, .35, 8), (4400, .2, 10), (5274, .12, 12)))
    return s * .45
def brillo():
    n = int(1.2 * SR); out = np.zeros(n)
    for i, m in enumerate((84, 88, 91, 96, 100)):
        sig = np.sin(2 * np.pi * hz(m) * np.arange(int(.5 * SR)) / SR) * env_ad(int(.5 * SR), .002, 7) * .2
        j = int(i * .06 * SR); out[j:j + len(sig)] += sig[:n - j]
    return out
def teclas(d):
    n = int(d * SR); out = np.zeros(n); t = 0.0
    while t < d - .05:
        c = click() * rng.uniform(.5, 1); j = int(t * SR); out[j:j + len(c)] += c[:n - j]; t += rng.uniform(.06, .13)
    return out
def vuelta():  # giro de pantalla
    n = int(.6 * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(300 + 1200 * x / .6) / SR) * np.sin(np.pi * x / .6) * .25 + whoosh(.6)[:n] * .5
def obturador():
    n = int(.12 * SR); x = np.arange(n) / SR
    return rng.standard_normal(n) * (np.exp(-x * 90) + .7 * np.exp(-np.maximum(0, x - .06) * 90) * (x > .06)) * .4
# --- patrón musical (Fa mayor luminoso: F - Am - Dm - Bb)
bpm = cfg.get("bpm", 118); b = 60 / bpm; ini = cfg.get("inicio", 0); fin = cfg.get("fin", D - 2.6)
acordes = [(53, 57, 60, 64), (57, 60, 64, 67), (50, 53, 57, 60), (58, 62, 65, 69)]
bajos = [41, 45, 38, 46]
mel = [72, 74, 76, 79, 77, 76, 74, 72, 69, 72, 74, 77, 76, 74, 72, 74]
t = ini; paso = 0
while t < fin:
    bar = (paso // 16) % 4; st = paso % 16
    if st % 4 == 0: put(mus, kick(), t, .9)
    if st in (4, 12): put(mus, clap(), t, 1)
    if st % 2 == 1: put(mus, hat(st in (7, 15)), t, 1)
    if st in (0, 3, 6, 10, 12): put(mus, nota(hz(bajos[bar]), b * .9, 'bajo'), t, 1)
    if st == 0: [put(mus, nota(hz(m), b * 4, 'pad'), t) for m in acordes[bar]]
    if st in (2, 6, 10, 14): [put(mus, nota(hz(m + 12), b * .5), t, .5) for m in acordes[bar][1:]]
    if paso >= 32 and st % 2 == 0: put(mus, nota(hz(mel[(paso // 2) % 16]), b * .45), t, .55)
    t += b / 4; paso += 1
fz = cfg.get("final")
if fz:
    put(mus, sello(), fz, 1); [put(mus, nota(hz(m), 2.2, 'pad'), fz, 2.2) for m in (53, 60, 65, 69)]; put(sfx, brillo(), fz, .9)
F = {"pop": pop, "click": click, "whoosh": whoosh, "sello": sello, "choque": choque, "brillo": brillo, "vuelta": vuelta, "obturador": obturador}
for ev in cfg.get("efectos", []):
    k, tt = ev[0], ev[1]
    if k == "teclas": put(sfx, teclas(ev[2]), tt, .9)
    elif k == "whoosh": put(sfx, whoosh(), tt - .25, .8)
    else: put(sfx, F[k](), tt, ev[2] if len(ev) > 2 else 1)
mus /= np.max(np.abs(mus)) + 1e-9
if len(sys.argv) > 3:
    with wave.open(sys.argv[3]) as f: voz = np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(float) / 32767
    voz = np.pad(voz, (0, max(0, N - len(voz))))[:N]
    e = np.abs(voz); k = int(.12 * SR); e = np.convolve(e, np.ones(k) / k, 'same')
    duck = 1 - .55 * np.clip(e / (np.percentile(e[e > 1e-4], 70) + 1e-9), 0, 1)
    mix = mus * .5 * duck + voz * .9 + sfx * .55
else:
    mix = mus * .6 + sfx * .55
mix = np.tanh(mix * 1.05); mix /= np.max(np.abs(mix)) + 1e-9; mix *= .93
with wave.open(sys.argv[2], 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('música lista', sys.argv[2])
