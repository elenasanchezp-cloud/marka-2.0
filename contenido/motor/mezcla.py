"""Mezcla música y voz. Uso: python3 motor/mezcla.py musica.wav voz.wav salida.wav [vol_musica=0.45]"""
import sys, wave
import numpy as np
def lee(p):
    with wave.open(p) as f: return np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(float) / 32767, f.getframerate()
m, sr = lee(sys.argv[1]); v, _ = lee(sys.argv[2]); vm = float(sys.argv[4]) if len(sys.argv) > 4 else .45
n = max(len(m), len(v)); o = np.zeros(n); o[:len(m)] += m * vm; o[:len(v)] += v
o = np.tanh(o * 1.1); o /= np.max(np.abs(o)) + 1e-9; o *= .9
with wave.open(sys.argv[3], 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes((o * 32767).astype(np.int16).tobytes())
print('mezcla lista', sys.argv[3])
