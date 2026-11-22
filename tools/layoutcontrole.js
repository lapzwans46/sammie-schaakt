/* Layoutcontrole: zie layoutcontrole.html.
   Meet op alle schermen met een bord waar het bord, Pim, de tekstballon en de knoppenrij staan,
   ook na een goed antwoord of een opgeloste opdracht. Alles hoort overal op dezelfde plek te staan,
   en er mag niets buiten het scherm vallen (schuiven). */
Sound.play = () => {}; window.confetti = () => {};
try { localStorage.clear(); } catch (e) { /* ok */ }
const Orig = BoardView;
BoardView = class extends Orig { constructor(c, o) { super(c, o); window.__bv = this; } render(b, o) { this.__opts = o || {}; return super.render(b, o); } };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const li = (id) => LESSONS.findIndex((l) => l.id === id);
const step = (id, si) => { LESSONS.push({ world: 99, id: 'x', title: 'Test', steps: [LESSONS[li(id)].steps[si]] }); go(LessonPlayer, LESSONS.length - 1); LESSONS.pop(); };
const answerQuiz = async () => { const b = [...document.querySelectorAll('.quiz-btn')].find((x) => x.dataset.i == window.__ok); if (b) b.click(); await wait(1200); };
const solve = async () => {
  for (let k = 0; k < 6 && !document.querySelector('#next'); k++) {
    document.getElementById('hintBtn').click(); await wait(30);
    const h = __bv.__opts.hint; if (!h) { await wait(800); continue; }
    __bv.onTap(h.from); await wait(30); __bv.onTap(h.to); await wait(30);
    const pr = document.querySelector('.promo-btn'); if (pr) pr.click();
    await wait(2800);
  }
};
const quizStep = (id, si) => () => { window.__ok = LESSONS[li(id)].steps[si].options.findIndex((o) => o.ok); step(id, si); };
const SC = [
  ['les praten+bord', () => step('toren', 1)],
  ['les filmpje lange tekst', () => step('aftrek', 1)],
  ['les quiz+bord', quizStep('mat', 4)],
  ['  ...na goed antwoord', null, answerQuiz],
  ['les quiz lange knoppen', quizStep('mat2', 3)],
  ['les opdracht 1 zet', () => step('schaak', 6)],
  ['  ...opgelost', null, solve],
  ['les 3 zetten', () => step('toets3', 1)],
  ['les promoveren', () => step('pionrace', 5)],
  ['les stop het mat', () => step('dreiging', 4)],
  ['puzzels makkelijk', () => go(Puzzles, 1)],
  ['puzzels superdenker', () => go(Puzzles, 3)],
  ['puzzel vd dag', () => go(DailyPuzzle)],
  ['pionnenrace', () => go(PawnRace, 'makkelijk')],
  ['bord opzetten', () => go(BoardSetup)],
  ['vakjesjacht', () => go(SquareHunt)],
  ['paardensprong', () => go(KnightMaze)],
  ['wie ben ik', () => go(WhoAmI)],
  ['pim-vangertje', () => go(CatchPim, 'makkelijk')],
  ['schatkist', () => go(Treasure, 'makkelijk')],
  ['mini-schaak', () => go(MiniChess, 'makkelijk')],
  ['memory', () => go(PieceMemory)],
  ['slaan-race', () => go(CaptureRace, 'makkelijk')],
  ['potje opa', () => go(Game, 0)],
  ['samen spelen', () => go(Game, -1, FAMILY.opponents[1])],
];
(async () => {
  const rows = [];
  const pos = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return `${Math.round(b.left)},${Math.round(b.top)} (${Math.round(b.width)}x${Math.round(b.height)})`; };
  for (const [name, fn, then] of SC) {
    try { if (fn) { fn(); await wait(1500); } if (then) await then(); } catch (e) { rows.push({ name, err: e.message }); continue; }
    rows.push({
      name,
      bord: pos(document.querySelector('.board-wrap')),
      pim: pos(document.querySelector('.teacher-face')),
      ballon: pos(document.querySelector('.teacher-bubble')),
      knoppen: pos(document.querySelector('#actions > #hintBtn, #actions > #next')), // de rechter knop: Hint of Verder
      links: pos(document.querySelector('#actions > #again, #actions > #replay')),
      schuift: document.documentElement.scrollHeight > innerHeight + 1 || document.documentElement.scrollWidth > innerWidth + 1,
    });
  }
  // wat het vaakst voorkomt is 'de vaste plek'; alles wat afwijkt is fout
  const most = (k) => { const c = {}; rows.forEach((r) => { if (r[k]) c[r[k]] = (c[r[k]] || 0) + 1; }); return Object.keys(c).sort((a, b) => c[b] - c[a])[0]; };
  const vast = { bord: most('bord'), pim: most('pim'), ballon: most('ballon'), knoppen: most('knoppen'), links: most('links') };
  const fout = [];
  rows.forEach((r) => {
    if (r.err) fout.push(`${r.name}: fout bij openen (${r.err})`);
    ['bord', 'pim', 'ballon', 'knoppen', 'links'].forEach((k) => { if (r[k] && r[k] !== vast[k]) fout.push(`${r.name}: ${k} staat op ${r[k]}, hoort ${vast[k]}`); });
    if (r.schuift) fout.push(`${r.name}: past niet op het scherm (schuift)`);
  });
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  document.getElementById('rows').innerHTML = rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${r.bord || '-'}</td><td>${r.pim || '-'}</td><td>${r.ballon || '-'}</td><td>${r.knoppen || '-'}</td><td>${r.schuift ? '❌' : '✅'}</td></tr>`).join('');
  const sum = document.getElementById('sum');
  sum.textContent = (fout.length ? `❌ ${fout.length} afwijkingen` : `✅ Alles staat op dezelfde plek (${rows.length} schermen)`) + ` — venster ${innerWidth}x${innerHeight}`;
  sum.className = 'sum ' + (fout.length ? 'bad' : 'ok');
  document.title = fout.length ? 'FOUT' : 'OK';
  document.getElementById('tekst').textContent = [sum.textContent].concat(fout).join(String.fromCharCode(10));
  document.getElementById('app').style.display = 'none';
  document.getElementById('report').hidden = false;
})();
