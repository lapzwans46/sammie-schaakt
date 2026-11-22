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

  /* ---------- Voorlezen ----------
     Sam leest nog niet zo goed: Pim leest zijn zinnetjes voor met de Nederlandse stem
     van het apparaat (werkt zonder internet). Geen Nederlandse stem? Dan blijft het stil. */
  let voiceOn = true;
  let voice = null;
  const synth = window.speechSynthesis || null;
  function findVoice() {
    if (!synth) return;
    const vs = synth.getVoices() || [];
    voice = vs.find((v) => /^nl[-_]NL/i.test(v.lang)) || vs.find((v) => /^nl/i.test(v.lang)) || null;
  }
  if (synth) {
    findVoice();
    try { synth.addEventListener('voiceschanged', findVoice); } catch (e) { synth.onvoiceschanged = findVoice; }
  }
  function say(text) {
    try {
      if (!synth) return;
      synth.cancel();
      if (!voiceOn || !text) return;
      if (!voice) findVoice();
      if (!voice) return;
      // emoji's en pijltjes niet voorlezen
      const clean = String(text).replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}️]/gu, '').trim();
      if (!clean) return;
      const u = new SpeechSynthesisUtterance(clean.toLowerCase() === clean ? clean : clean.replace(/\b([A-Z]{3,})\b/g, (w) => w.toLowerCase()));
      u.voice = voice; u.lang = voice.lang; u.rate = 0.9; u.pitch = 1.1;
      synth.speak(u);
    } catch (e) { /* geen stem, geen probleem */ }
  }

  return {
    play,
    say,
    hush: () => { try { synth && synth.cancel(); } catch (e) { /* ok */ } },
    canSpeak: () => { if (!voice) findVoice(); return !!voice; },
    unlock: () => { try { ac(); } catch (e) { /* ok */ } },
    setSound: (v) => { enabled = v; },
    setVoice: (v) => { voiceOn = v; if (!v) try { synth && synth.cancel(); } catch (e) { /* ok */ } },
  };
})();
