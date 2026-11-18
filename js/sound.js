/* =========================================================
   Sammie Schaakt! - geluidjes (zelf gemaakt, geen bestanden)
   ========================================================= */
const Sound = (() => {
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type = 'sine', vol = 0.2, slide = 0) {
    const a = ac();
    if (!a || !enabled) return;
    const t = a.currentTime + start;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  const fx = {
    tap: () => tone(660, 0, 0.08, 'sine', 0.12),
    move: () => { tone(320, 0, 0.09, 'triangle', 0.25, 0.7); },
    capture: () => { tone(520, 0, 0.12, 'square', 0.12, 0.5); tone(260, 0.06, 0.15, 'triangle', 0.2, 0.6); },
    star: () => { tone(880, 0, 0.1, 'sine', 0.2); tone(1320, 0.08, 0.18, 'sine', 0.18); },
    good: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.2)),
    oops: () => { tone(300, 0, 0.18, 'sine', 0.2, 0.75); tone(220, 0.15, 0.25, 'sine', 0.18, 0.8); },
    check: () => { tone(740, 0, 0.12, 'square', 0.1); tone(740, 0.16, 0.12, 'square', 0.1); },
    win: () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, i === 5 ? 0.6 : 0.2, 'triangle', 0.22)),
    lose: () => [392, 349, 330, 262].forEach((f, i) => tone(f, i * 0.2, 0.3, 'triangle', 0.18)),
    magic: () => [784, 988, 1175, 1568, 1976].forEach((f, i) => tone(f, i * 0.06, 0.2, 'sine', 0.15)),
  };

  function play(name) {
    try { fx[name] && fx[name](); } catch (e) { /* geen geluid, geen probleem */ }
  }

  return {
    play,
    unlock: () => { try { ac(); } catch (e) { /* ok */ } },
    setSound: (v) => { enabled = v; },
  };
})();
