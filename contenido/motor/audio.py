"""Pista de audio sintetizada para las piezas: base rítmica + golpes + whooshes.
Uso: python3 motor/audio.py eventos.json salida.wav
eventos.json: {"duracion":31,"bpm":120,"inicio_base":3,"golpes":[0.6,...],"whoosh":[0.2,...],"wash":28.5}
"""
import json, sys, wave
import numpy as np
SR = 44100
cfg = json.load(open(sys.argv[1]))
N = int(cfg["duracion"] * SR)
mix = np.zeros(N)
rng = np.random.default_rng(7)

def put(sig, t, gain=1.0):
    i = max(0, int(t * SR))
    if i >= N: return
    j = min(N, i + len(sig)); mix[i:j] += sig[:j - i] * gain

def kick():
    n = int(.35 * SR); x = np.arange(n) / SR
    f = 50 + 110 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 9)

def hat():
    n = int(.06 * SR); x = np.arange(n) / SR
    w = rng.standard_normal(n); w = np.diff(np.concatenate([[0], w]))
    return w * np.exp(-x * 70) * .25

def golpe():
    n = int(.5 * SR); x = np.arange(n) / SR
    body = np.sin(2 * np.pi * np.cumsum(70 + 160 * np.exp(-x * 25)) / SR) * np.exp(-x * 7)
    noise = rng.standard_normal(n) * np.exp(-x * 40) * .5
    return body + noise

def whoosh(d=.55, rev=False):
    n = int(d * SR); x = np.linspace(0, 1, n)
    w = rng.standard_normal(n)
    # filtro paso bajo con corte que sube y baja
    out = np.zeros(n); a = 0.0; y = 0.0
    for i in range(n):
        a = .02 + .35 * np.sin(np.pi * x[i]) ** 2
        y += a * (w[i] - y); out[i] = y
    env = np.sin(np.pi * x) ** 2 if not rev else x ** 3
    return out * env * 1.6

def pad(d):
    n = int(d * SR); x = np.arange(n) / SR
    sig = sum(np.sin(2 * np.pi * f * x) for f in (55, 82.4, 110, 164.8)) / 4
    return sig * np.minimum(1, x / 1.5) * np.minimum(1, (d - x) / 1.5) * .18

bpm = cfg.get("bpm", 120); beat = 60 / bpm
ini = cfg.get("inicio_base", 0); fin = cfg.get("fin_base", cfg["duracion"] - 2.5)
put(pad(cfg["duracion"]), 0)
t = ini
while t < fin:
    put(kick(), t, .9)
    put(hat(), t + beat / 2, 1)
    t += beat
for g in cfg.get("golpes", []): put(golpe(), g, .8)
for w in cfg.get("whoosh", []): put(whoosh(), w - .3, .7)
if "wash" in cfg:
    put(whoosh(1.2, rev=True), cfg["wash"] - 1.2, .9)
    put(golpe(), cfg["wash"], 1)
    n = int(2.2 * SR); x = np.arange(n) / SR
    put(np.sin(2 * np.pi * 220 * x) * np.exp(-x * 2.2) * .25 + np.sin(2 * np.pi * 330 * x) * np.exp(-x * 2.6) * .15, cfg["wash"])
mix = np.tanh(mix * 1.2); mix /= np.max(np.abs(mix)) + 1e-9; mix *= .89
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[2], 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes(pcm.tobytes())
print("audio listo", sys.argv[2])
