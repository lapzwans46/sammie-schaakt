/* =========================================================
   Sammie Schaakt! - extra's
   - Kleuren kiezen (bord en stukken)
   - Spelletjes: Pionnenrace en Bord opzetten
   - Terugkijken met Pim (na een potje)
   - Diploma's om uit te printen
   ========================================================= */

/* ---------------------------------------------------------
   KLEUREN
   --------------------------------------------------------- */
const BOARD_THEMES = {
  gras: { name: 'Gras', light: '#fff1d0', dark: '#7fc26d', frame: '#8a5a3c', frameD: '#5f3c26' },
  zee: { name: 'Zee', light: '#e8f5ff', dark: '#5aa9e6', frame: '#2c5d8a', frameD: '#1b3c5c' },
  hout: { name: 'Hout', light: '#f6d7a7', dark: '#b07a4a', frame: '#6b4226', frameD: '#45291a' },
  snoep: { name: 'Snoep', light: '#ffe6f1', dark: '#f08cb8', frame: '#b34d7a', frameD: '#7d3354' },
  ruimte: { name: 'Ruimte', light: '#dcd7f7', dark: '#7d6cc4', frame: '#3b2f6e', frameD: '#251d47' },
  bos: { name: 'Bos', light: '#ebf3dc', dark: '#4f8a5b', frame: '#2f4f35', frameD: '#1d3222' },
  zon: { name: 'Zon', light: '#fff6c9', dark: '#f2b33d', frame: '#c4682b', frameD: '#86451b' },
};

function applyTheme(board, pieces) {
  const t = BOARD_THEMES[board] || BOARD_THEMES.gras;
  const r = document.documentElement.style;
  r.setProperty('--light-sq', t.light);
  r.setProperty('--dark-sq', t.dark);
  r.setProperty('--frame', t.frame);
  r.setProperty('--frame-d', t.frameD);
  Pieces.setTheme(pieces);
}

function ThemePicker() {
  const s = Store.data.settings;
  const pieceIcons = (k) => {
    Pieces.setTheme(k);
    const html = Pieces.svg('wN') + Pieces.svg('bN');
    return html;
  };
  const pieceButtons = Object.entries(Pieces.THEMES).map(([k, t]) =>
    `<button class="theme-btn ${s.pieces === k ? 'on' : ''}" data-p="${k}"><span class="mini-pieces">${pieceIcons(k)}</span>${t.name}</button>`).join('');
  Pieces.setTheme(s.pieces);

  app.innerHTML = `
  <div class="screen theme">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Kies je kleuren</div><div class="spacer"></div></div>
    <div class="theme-body">
      <div class="theme-preview" id="tpWrap"></div>
      <div class="theme-options card">
        <h4>Het bord</h4>
        <div class="theme-grid">${Object.entries(BOARD_THEMES).map(([k, t]) => `
          <button class="theme-btn ${s.board === k ? 'on' : ''}" data-b="${k}">
            <span class="mini-board" style="--l:${t.light};--d:${t.dark};--f:${t.frame}"><i></i><i></i><i></i><i></i></span>${t.name}
          </button>`).join('')}</div>
        <h4>De stukken</h4>
        <div class="theme-grid">${pieceButtons}</div>
      </div>
    </div>
  </div>`;

  const preview = () => {
    const wrap = $('#tpWrap');
    wrap.innerHTML = '<div class="board-wrap" id="tpBoard"></div>';
    const view = new BoardView($('#tpBoard'));
    const st = Chess.fromFEN('r3k2r/ppp2ppp/2n2q2/3pp3/3PP3/2N2Q2/PPP2PPP/R3K2R w - - 0 1');
    view.render(st.board, { lastMove: { from: Chess.sqIndex('f1'), to: Chess.sqIndex('f3') } });
  };
  const pickB = (k) => { s.board = k; Store.save(); applySettings(); markOn('data-b', k); preview(); Sound.play('tap'); };
  const pickP = (k) => { s.pieces = k; Store.save(); applySettings(); markOn('data-p', k); preview(); Sound.play('tap'); };
  const markOn = (attr, k) => app.querySelectorAll(`[${attr}]`).forEach((b) => b.classList.toggle('on', b.getAttribute(attr) === k));
  app.querySelectorAll('[data-b]').forEach((b) => { b.onclick = () => pickB(b.dataset.b); });
  app.querySelectorAll('[data-p]').forEach((b) => { b.onclick = () => pickP(b.dataset.p); });
  $('#back').onclick = () => go(Home);
  preview();
}

/* ---------------------------------------------------------
   SPELLETJES
   --------------------------------------------------------- */
function MiniGames() {
  const x = Store.data.extra;
  app.innerHTML = `
  <div class="screen choose">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Spelletjes</div><div class="spacer"></div></div>
    <div class="games-grid">
      <div class="game-card">
        <div class="gc-pic">${Pieces.svg('wP')}${Pieces.svg('wP')}${Pieces.svg('bP')}</div>
        <h3>Pionnenrace 🏁</h3>
        <p>Alleen pionnen! Wie het eerst een pion aan de overkant heeft, wint.</p>
        <div class="gc-buttons">
          <button class="btn green" id="raceEasy">Makkelijk</button>
          <button class="btn orange" id="raceHard">Moeilijker</button>
        </div>
        <small>🏆 ${x.raceWins} keer gewonnen</small>
      </div>
      <div class="game-card">
        <div class="gc-pic">${Pieces.svg('wR')}${Pieces.svg('wK')}${Pieces.svg('wN')}</div>
        <h3>Bord opzetten 🧱</h3>
        <p>Zet alle stukken op de goede plek, net als aan het begin van een potje.</p>
        <div class="gc-buttons"><button class="btn blue" id="setup">Starten</button></div>
        <small>✅ ${x.setups} keer gelukt</small>
      </div>
    </div>
  </div>`;
  $('#back').onclick = () => go(Home);
  $('#raceEasy').onclick = () => { Sound.play('tap'); go(PawnRace, 'makkelijk'); };
  $('#raceHard').onclick = () => { Sound.play('tap'); go(PawnRace, 'moeilijker'); };
  $('#setup').onclick = () => { Sound.play('tap'); go(BoardSetup); };
}

/* ---------- Pionnenrace ---------- */
const RACE_FEN = '8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1';
const RACE_LEVELS = {
  makkelijk: { depth: 1, noise: 250, random: 0.9, seeWin: 0.35 },
  moeilijker: { depth: 2, noise: 120, random: 0.4, seeWin: 0.9 },
  hint: { depth: 4, noise: 0, random: 0, seeWin: 1 },
};

/* Wie heeft gewonnen? 'w', 'b' of null */
function raceWinner(s) {
  for (let i = 0; i < 8; i++) if (s.board[i] && s.board[i][0] === 'w') return 'w';
  for (let i = 56; i < 64; i++) if (s.board[i] && s.board[i][0] === 'b') return 'b';
  if (!s.board.some((p) => p && p[0] === 'b')) return 'w';
  if (!s.board.some((p) => p && p[0] === 'w')) return 'b';
  return null;
}

function raceEvalWhite(s) {
  let sc = 0;
  const b = s.board;
  for (let i = 0; i < 64; i++) {
    const p = b[i];
    if (!p) continue;
    const r = Math.floor(i / 8), c = i % 8;
    if (p === 'wP') {
      const adv = 6 - r;
      let passed = true;
      for (let rr = r - 1; rr >= 1 && passed; rr--) for (let cc = c - 1; cc <= c + 1; cc++) if (cc >= 0 && cc < 8 && b[rr * 8 + cc] === 'bP') passed = false;
      sc += 100 + adv * adv * 8 + (passed ? 60 + adv * 45 : 0);
    } else if (p === 'bP') {
      const adv = r - 1;
      let passed = true;
      for (let rr = r + 1; rr <= 6 && passed; rr++) for (let cc = c - 1; cc <= c + 1; cc++) if (cc >= 0 && cc < 8 && b[rr * 8 + cc] === 'wP') passed = false;
      sc -= 100 + adv * adv * 8 + (passed ? 60 + adv * 45 : 0);
    }
  }
  return sc;
}

function raceSearch(s, depth, alpha, beta) {
  const w = raceWinner(s);
  if (w) return w === s.turn ? 100000 + depth : -100000 - depth;
  const moves = qMoves(Chess.legalMoves(s));
  if (!moves.length) return -100000 - depth; // niet meer kunnen zetten = verloren
  if (depth === 0) return (s.turn === 'w' ? 1 : -1) * raceEvalWhite(s);
  let best = -Infinity;
  for (const m of moves) {
    const v = -raceSearch(Chess.makeMove(s, m), depth - 1, -beta, -alpha);
    if (v > best) best = v;
    if (v > alpha) alpha = v;
    if (alpha >= beta) break;
  }
  return best;
}

function racePick(s, levelKey) {
  const cfg = RACE_LEVELS[levelKey];
  const moves = qMoves(Chess.legalMoves(s));
  if (!moves.length) return null;
  // een pion die zo de overkant haalt, zet je altijd
  const win = moves.find((m) => raceWinner(Chess.makeMove(s, m)) === s.turn);
  if (win && Math.random() < cfg.seeWin) return win;
  if (Math.random() < cfg.random) return moves[Math.floor(Math.random() * moves.length)];
  let best = null, bestV = -Infinity;
  for (const m of moves) {
    const v = -raceSearch(Chess.makeMove(s, m), cfg.depth - 1, -Infinity, Infinity) + (Math.random() * 2 - 1) * cfg.noise;
    if (v > bestV) { bestV = v; best = m; }
  }
  return best;
}

function PawnRace(levelKey) {
  app.innerHTML = teacherLayout(`Pionnenrace (${levelKey})`);
  $('#back').onclick = () => go(MiniGames);
  const setText = makeSetText();
  const wrap = document.createElement('div');
  wrap.className = 'board-wrap';
  $('#stage').appendChild(wrap);
  const view = new BoardView(wrap, { onTap: (i) => tap(i) });
  let state, sel, dests, last, busy, over, hint;

  /* eigen timers: 'Opnieuw' zet ze allemaal stop */
  const rlaterIds = [];
  const rlater = (fn, ms) => { const t = later(fn, ms); rlaterIds.push(t); return t; };
  const rlaterStop = () => { rlaterIds.forEach(clearTimeout); rlaterIds.length = 0; };

  const draw = (animate) => view.render(state.board, { selected: sel, dests: dests.map((m) => m.to), lastMove: last, hint, animate });

  function reset() {
    rlaterStop();
    state = Chess.fromFEN(RACE_FEN);
    sel = null; dests = []; last = null; busy = false; over = false; hint = null;
    setText('Pionnenrace! Wie is het eerst aan de overkant? Jij begint!');
    draw();
  }

  $('#actions').innerHTML = '<button class="btn grey" id="again">↺ Opnieuw</button><button class="btn yellow" id="hintBtn">💡 Hint</button>';
  $('#again').onclick = () => { Sound.play('tap'); reset(); };
  $('#hintBtn').onclick = () => {
    if (busy || over) return;
    const m = racePick(state, 'hint');
    if (!m) return;
    Sound.play('magic');
    hint = { from: m.from, to: m.to };
    sel = m.from;
    dests = qMoves(Chess.legalMoves(state, m.from));
    draw();
    setText('Probeer deze pion!', 'happy');
  };

  function tap(i) {
    if (busy || over) return;
    const mv = dests.find((m) => m.to === i);
    if (sel !== null && mv) return move(mv);
    const p = state.board[i];
    if (p === 'wP') {
      const ms = qMoves(Chess.legalMoves(state, i));
      if (!ms.length) { view.shake(i); Sound.play('oops'); setText('Deze pion staat vast. Probeer een andere!', 'oops'); sel = null; dests = []; return draw(); }
      Sound.play('tap');
      sel = i; dests = ms;
      return draw();
    }
    sel = null; dests = [];
    draw();
  }

  function finish(kidWon, why) {
    over = true;
    draw();
    if (kidWon) {
      Store.data.extra.raceWins++;
      Store.save();
      rlater(() => { Sound.play('win'); confetti(120); }, 300);
    } else rlater(() => Sound.play('lose'), 300);
    rlater(() => {
      const m = modal(`
        <div class="trophy">${kidWon ? '🏁' : '🐴'}</div>
        <h2>${kidWon ? 'Jij wint!' : 'Pim wint deze keer'}</h2>
        <p>${why}</p>
        <div class="modal-buttons">
          <button class="btn green" id="mAgain">Nog een keer</button>
          <button class="btn grey" id="mBack">Naar de spelletjes</button>
        </div>`, 'celebrate');
      $('#mAgain', m).onclick = () => { closeModal(); reset(); };
      $('#mBack', m).onclick = () => go(MiniGames);
      awardBadges(900);
    }, 900);
  }

  function move(m) {
    state = Chess.makeMove(state, m);
    last = { from: m.from, to: m.to };
    sel = null; dests = []; hint = null;
    Sound.play(m.captured ? 'capture' : 'move');
    draw({ from: m.from, to: m.to });
    if (raceWinner(state) === 'w') return finish(true, 'Jouw pion was het eerst aan de overkant!');
    if (!qMoves(Chess.legalMoves(state)).length) return finish(true, 'Pim kan niet meer zetten. Jij wint!');
    setText(m.captured ? 'Hap! Jij pakte mijn pion.' : 'Hmm, even denken...', m.captured ? 'oops' : '');
    busy = true;
    rlater(() => {
      const pm = racePick(state, levelKey);
      state = Chess.makeMove(state, pm);
      last = { from: pm.from, to: pm.to };
      busy = false;
      Sound.play(pm.captured ? 'capture' : 'move');
      draw({ from: pm.from, to: pm.to });
      if (raceWinner(state) === 'b') return finish(false, 'Mijn pion was het eerst. Nog een keer?');
      if (!qMoves(Chess.legalMoves(state)).length) return finish(false, 'Jouw pionnen staan vast. Pim wint.');
      setText(pm.captured ? 'Hap! Die pion is van mij. Jouw beurt!' : 'Jouw beurt!');
    }, 800);
  }

  reset();
}

/* ---------- Bord opzetten ---------- */
const SETUP_TIPS = {
  P: 'Pionnen staan op een rij, vooraan.',
  R: 'Torens staan in de hoeken.',
  N: 'Paarden staan naast de torens.',
  B: 'Lopers staan naast de paarden.',
  Q: 'De koningin staat op haar eigen kleur.',
  K: 'De koning staat naast de koningin.',
};

function BoardSetup() {
  const START = Chess.fromFEN(Chess.START_FEN).board;
  const ORDER = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'];
  let color = 'w';
  let board = new Array(64).fill(null);
  let tray = [];
  let pick = null; // index in de bak
  let mistakes = 0;
  let hint = null;

  /* eigen timers: 'Opnieuw' zet ze allemaal stop */
  const slaterIds = [];
  const slater = (fn, ms) => { const t = later(fn, ms); slaterIds.push(t); return t; };
  const slaterStop = () => { slaterIds.forEach(clearTimeout); slaterIds.length = 0; };

  app.innerHTML = teacherLayout('Bord opzetten');
  $('#back').onclick = () => go(MiniGames);
  const setText = makeSetText();
  const stage = $('#stage');
  // het bord staat op dezelfde plek als in de lessen; de bak met stukken staat bij Pim
  stage.innerHTML = '<div class="board-wrap" id="sbw"></div>';
  $('#actions').insertAdjacentHTML('afterend', '<div class="tray" id="tray"></div>');
  const view = new BoardView($('#sbw'), { onTap: (i) => tapSquare(i) });

  $('#actions').innerHTML = '<button class="btn grey" id="again">↺ Opnieuw</button><button class="btn yellow" id="hintBtn">💡 Hint</button>';
  $('#again').onclick = () => { Sound.play('tap'); start(); };
  $('#hintBtn').onclick = () => {
    if (!tray.length) return;
    if (pick === null) pick = 0;
    const type = tray[pick];
    const sq = START.findIndex((p, i) => p === color + type && !board[i]);
    hint = { from: sq, to: sq };
    Sound.play('magic');
    draw();
    setText(`${SETUP_TIPS[type]} Kijk naar het gele vakje!`, 'happy');
  };

  function start() {
    slaterStop();
    color = 'w';
    board = new Array(64).fill(null);
    mistakes = 0;
    fillTray();
    setText('Zet de witte stukken op hun plek! Tik op een stuk. Tik dan op het vakje.');
  }

  function fillTray() {
    tray = ORDER.slice();
    pick = null; hint = null;
    draw();
  }

  function draw() {
    view.render(board, { hint });
    $('#tray').innerHTML = tray.map((t, i) => `<button class="tray-piece ${i === pick ? 'on' : ''}" data-i="${i}" aria-label="${Pieces.NAMES[t]}">${Pieces.svg(color + t)}</button>`).join('')
      || '<div class="tray-empty">Alles staat! 🎉</div>';
    $('#tray').querySelectorAll('.tray-piece').forEach((b) => {
      b.onclick = () => { pick = +b.dataset.i; hint = null; Sound.play('tap'); draw(); const t = tray[pick]; setText(`Waar hoort ${t === 'N' ? 'het' : 'de'} ${Pieces.NAMES[t]}? Tik op het vakje.`); };
    });
  }

  function tapSquare(i) {
    if (pick === null) {
      if (tray.length) { Sound.play('oops'); setText('Kies eerst een stuk uit de bak!', 'oops'); }
      return;
    }
    const type = tray[pick];
    if (!board[i] && START[i] === color + type) {
      board[i] = color + type;
      tray.splice(pick, 1);
      pick = tray.length ? Math.min(pick, tray.length - 1) : null;
      // het volgende stuk van dezelfde soort alvast klaarzetten
      const same = tray.indexOf(type);
      if (same >= 0) pick = same;
      hint = null;
      Sound.play('move');
      view.pop(i);
      draw();
      setText(pick === null ? '' : 'Goed zo! En de volgende?', 'happy');
      if (!tray.length) colorDone();
    } else {
      mistakes++;
      Sound.play('oops');
      view.render(board, { marks: [i] });
      slater(() => draw(), 600);
      setText(board[i] ? 'Daar staat al iets!' : `Bijna! ${SETUP_TIPS[type]}`, 'oops');
    }
  }

  function colorDone() {
    Sound.play('good');
    confetti(60);
    if (color === 'w') {
      setText('Super! Nu de zwarte stukken. Die staan bovenaan.', 'happy');
      slater(() => { color = 'b'; fillTray(); }, 1800);
    } else {
      Store.data.extra.setups++;
      Store.save();
      slater(() => {
        Sound.play('win');
        confetti(120);
        const m = modal(`
          <div class="trophy">🧱</div>
          <h2>Het bord staat klaar!</h2>
          <p>${mistakes === 0 ? 'Alles in één keer goed. Wauw!' : 'Goed gedaan! Nu kun je een potje beginnen.'}</p>
          <div class="modal-buttons">
            <button class="btn green" id="mPlay">Speel een potje</button>
            <button class="btn blue" id="mAgain">Nog een keer</button>
            <button class="btn grey" id="mBack">Naar de spelletjes</button>
          </div>`, 'celebrate');
        $('#mPlay', m).onclick = () => go(ChooseOpponent);
        $('#mAgain', m).onclick = () => { closeModal(); start(); };
        $('#mBack', m).onclick = () => go(MiniGames);
        awardBadges(900);
      }, 700);
    }
  }

  start();
}

/* ---------------------------------------------------------
   TERUGKIJKEN MET PIM
   Pim zoekt de belangrijkste momenten uit het potje:
   één ding dat goed ging en hooguit twee dingen om van te leren.
   --------------------------------------------------------- */
function analyzeGame(history, oppName) {
  const name = (p) => Pieces.NAMES[p[1]];
  const moments = [];
  history.forEach((h, idx) => {
    if (h.before.turn !== 'w') return;
    const m = h.m;
    const nr = Math.floor(idx / 2) + 1;
    const after = Chess.makeMove(h.before, m);
    const gain = m.captured ? AI.VAL[m.captured[1]] : 0;
    const legal = qMoves(Chess.legalMoves(h.before));

    if (Chess.gameStatus(after) === 'checkmate') {
      moments.push({ kind: 'good', score: 5000, idx, nr, h, text: 'Schaakmat! Mooie zet!' });
      return;
    }
    const mate = legal.find((x) => Chess.gameStatus(Chess.makeMove(h.before, x)) === 'checkmate');
    if (mate) {
      moments.push({ kind: 'missed', score: 3000, idx, nr, h, better: mate, text: 'Hier kon je schaakmat geven! Zie jij hoe?', show: `Zet je ${name(mate.piece)} op het gele vakje!` });
      return;
    }
    const lossAfter = Tactics.loss(after);
    const net = lossAfter.loss - gain;
    const before = Chess.inCheck(h.before, 'w') ? { loss: 0 } : Tactics.loss({ ...h.before, turn: 'b', ep: null });
    if (net >= 200 && net > before.loss) {
      const better = AI.hint(h.before);
      moments.push({
        kind: 'oops', score: net, idx, nr, h, after, danger: lossAfter.sq, better,
        text: `Oei! ${oppName} kon je ${name(lossAfter.piece)} pakken.`,
        show: better ? `Beter was: je ${name(better.piece)} op het gele vakje.` : 'Kijk goed of je stukken veilig staan.',
      });
      return;
    }
    const free = legal.filter((x) => x.captured && AI.VAL[x.captured[1]] >= 300)
      .map((x) => {
        const a = Chess.makeMove(h.before, x);
        const v = AI.VAL[x.captured[1]] - (Chess.isAttacked(a.board, x.to, 'b') ? AI.VAL[x.piece[1]] : 0);
        return { x, v };
      })
      .filter((o) => o.v >= 200).sort((a, b) => b.v - a.v)[0];
    if (free && gain < free.v) {
      moments.push({
        kind: 'missed', score: free.v, idx, nr, h, better: free.x,
        text: `Kijk goed! Hier kon je iets gratis pakken.`,
        show: `Je kon de ${name(free.x.captured)} gratis pakken met je ${name(free.x.piece)}!`,
      });
      return;
    }
    if (gain >= 300 && net <= 0) {
      moments.push({ kind: 'good', score: gain, idx, nr, h, text: `Goed gezien! Je pakte de ${name(m.captured)} van ${oppName}.` });
    } else if (!m.captured && Tactics.targets(after, m.to).length >= 2 && lossAfter.loss < 200) {
      moments.push({ kind: 'good', score: 450, idx, nr, h, marks: Tactics.targets(after, m.to), text: 'Twee stukken tegelijk aangevallen. Slim!' });
    } else if (m.flag === 'castleK' || m.flag === 'castleQ') {
      moments.push({ kind: 'good', score: 150, idx, nr, h, text: 'Netjes gerokeerd! Je koning staat veilig.' });
    }
  });
  const good = moments.filter((x) => x.kind === 'good').sort((a, b) => b.score - a.score).slice(0, 1);
  const learn = moments.filter((x) => x.kind !== 'good').sort((a, b) => b.score - a.score).slice(0, 2).sort((a, b) => a.idx - b.idx);
  return good.concat(learn);
}

function Review(info) {
  const oppName = info.opp.name;
  const moments = analyzeGame(info.history, oppName);
  let k = -1;
  app.innerHTML = teacherLayout('Terugkijken met Pim', '<div class="progress"><div class="progress-fill" id="prog"></div></div>');
  const back = () => go(info.together ? TogetherSetup : ChooseOpponent);
  $('#back').onclick = back;
  const setText = makeSetText();
  const stage = $('#stage');
  const actions = $('#actions');

  const board = (state, opts) => {
    stage.innerHTML = '<div class="board-wrap" id="rbw"></div>';
    new BoardView($('#rbw')).render(state.board, opts);
  };

  function show() {
    $('#prog').style.width = ((k + 1) / (moments.length + 1)) * 100 + '%';
    if (k === -1) {
      const last = info.history[info.history.length - 1];
      board(Chess.makeMove(last.before, last.m), { lastMove: { from: last.m.from, to: last.m.to } });
      setText(moments.length
        ? 'Ik keek naar jouw potje. Kijk je mee?'
        : 'Ik keek naar jouw potje. Goed gespeeld!', 'happy');
      actions.innerHTML = moments.length
        ? '<button class="btn green huge" id="next">Laat zien ▶</button>'
        : '<button class="btn green huge" id="done">Klaar</button>';
    } else {
      const mo = moments[k];
      const lastMove = { from: mo.h.m.from, to: mo.h.m.to };
      const isLast = k === moments.length - 1;
      if (mo.kind === 'good') {
        board(Chess.makeMove(mo.h.before, mo.h.m), { lastMove, marks: mo.marks || [] });
        setText(`Zet ${mo.nr}: ${mo.text}`, 'happy');
      } else if (mo.kind === 'oops') {
        board(mo.after, { lastMove, marks: mo.danger !== null ? [mo.danger] : [] });
        setText(`Zet ${mo.nr}: ${mo.text}`);
      } else {
        board(mo.h.before, {});
        setText(`Zet ${mo.nr}: ${mo.text}`);
      }
      actions.innerHTML = (mo.kind !== 'good' ? '<button class="btn yellow" id="reveal">💡 Wat was beter?</button>' : '')
        + (isLast ? '<button class="btn green huge" id="done">Klaar</button>' : '<button class="btn green huge" id="next">Volgende ▶</button>');
      if ($('#reveal')) {
        $('#reveal').onclick = () => {
          Sound.play('magic');
          if (mo.better) board(mo.h.before, { hint: { from: mo.better.from, to: mo.better.to } });
          setText(mo.show, 'happy');
          $('#reveal').remove();
        };
      }
    }
    if ($('#next')) $('#next').onclick = () => { Sound.play('tap'); k++; show(); };
    if ($('#done')) {
      $('#done').onclick = () => {
        Sound.play('good');
        const m = modal(`<h2>Goed bekeken!</h2><p>Zin in nog een potje?</p>
          <div class="modal-buttons">
            <button class="btn green" id="mAgain">Nog een potje</button>
            <button class="btn grey" id="mBack">Terug</button>
          </div>`);
        $('#mAgain', m).onclick = () => (info.together ? go(Game, -1, info.opp) : go(Game, info.oi));
        $('#mBack', m).onclick = back;
      };
    }
  }
  show();
}

/* ---------------------------------------------------------
   DIPLOMA'S
   --------------------------------------------------------- */
function diplomaList() {
  return WORLDS.map((w) => ({ key: w.nr, title: `Wereld ${w.nr}: ${w.title}`, world: w, color: w.color, done: worldDone(w.nr) }))
    .concat([{ key: 4, title: 'Schaakmeester', color: '#e8a400', done: WORLDS.every((w) => worldDone(w.nr)), grand: true }]);
}

/* Geeft de diploma's terug die nu net verdiend zijn */
function checkDiplomas() {
  const d = Store.data.diplomas;
  const fresh = [];
  diplomaList().forEach((x) => {
    if (x.done && !d[x.key]) { d[x.key] = todayStr(); fresh.push(x.key); }
  });
  if (fresh.length) Store.save();
  return fresh;
}
const diplomaCount = () => { checkDiplomas(); return Object.keys(Store.data.diplomas).length; };

function Diplomas() {
  checkDiplomas();
  const list = diplomaList();
  app.innerHTML = `
  <div class="screen choose">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Diploma's</div><div class="spacer"></div></div>
    <p class="choose-sub">Maak een wereld af. Dan krijg je een diploma!</p>
    <div class="dip-grid">
      ${list.map((x) => {
        const lessons = x.grand ? LESSONS : LESSONS.filter((l) => l.world === x.key);
        const done = lessons.filter((l) => Store.data.lessons[l.id]).length;
        return `<button class="dip-card ${x.done ? 'got' : ''}" data-k="${x.key}" style="--dc:${x.color}">
          <div class="dip-icon">${x.done ? '🎓' : '📜'}</div>
          <b>${x.title}</b>
          <small>${x.done ? 'Bekijken en printen' : `${done} van de ${lessons.length} lessen`}</small>
        </button>`;
      }).join('')}
    </div>
  </div>`;
  $('#back').onclick = () => go(Home);
  app.querySelectorAll('.dip-card').forEach((b) => {
    b.onclick = () => {
      const x = list.find((y) => y.key === +b.dataset.k);
      if (!x.done) {
        Sound.play('oops');
        b.classList.remove('shake'); b.getBoundingClientRect(); b.classList.add('shake');
        return;
      }
      Sound.play('tap');
      go(DiplomaView, x.key);
    };
  });
}

/* Gouden medaille (SVG) */
function medalSvg(color) {
  const pts = [];
  for (let i = 0; i < 32; i++) {
    const r = i % 2 ? 44 : 50, a = (Math.PI * 2 * i) / 32;
    pts.push(`${(60 + r * Math.cos(a)).toFixed(1)},${(60 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<svg viewBox="0 0 120 150" class="dip-medal-svg" aria-hidden="true">
    <path d="M38 96 L24 146 L44 134 L56 148 L62 104 Z" fill="${color}" stroke="#3a2c40" stroke-width="3" stroke-linejoin="round"/>
    <path d="M82 96 L96 146 L76 134 L64 148 L58 104 Z" fill="${color}" stroke="#3a2c40" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="${pts.join(' ')}" fill="#ffd34d" stroke="#c98a00" stroke-width="3"/>
    <circle cx="60" cy="60" r="34" fill="#ffe680" stroke="#c98a00" stroke-width="3"/>
    <path d="M60 36 L67 52 L84 53 L71 64 L75 81 L60 72 L45 81 L49 64 L36 53 L53 52 Z" fill="#fff6c9" stroke="#c98a00" stroke-width="2.5" stroke-linejoin="round"/>
  </svg>`;
}

function DiplomaView(key) {
  checkDiplomas();
  const x = diplomaList().find((y) => y.key === key);
  const date = Store.data.diplomas[key] || todayStr();
  const nice = new Date(date + 'T12:00:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const lessons = x.grand ? [] : LESSONS.filter((l) => l.world === key);
  const what = x.grand
    ? 'heeft <b>alle lessen</b> van Sammie Schaakt! gehaald.<br>Jij bent nu een echte <b>schaakmeester</b>!'
    : `heeft <b>wereld ${key}: ${x.world.title}</b> helemaal gehaald!`;
  const flagColors = ['#ff5d8f', '#ffd34d', '#4cc9f0', '#7bd389', '#9b5de5', '#ff8c42'];
  const flags = Array.from({ length: 18 }, (_, i) => `<i style="background:${flagColors[i % flagColors.length]}"></i>`).join('');
  const sparkles = [[4, 30], [95, 28], [24, 40], [76, 40], [31, 88], [67, 88]]
    .map(([l, t], i) => `<span class="dip-spark" style="left:${l}%;top:${t}%;animation-delay:${i * 0.2}s">★</span>`).join('');
  app.innerHTML = `
  <div class="screen diploma-screen">
    <div class="topbar no-print">
      <button class="round-btn" id="back" aria-label="Terug">←</button>
      <div class="title">Jouw diploma</div>
      <button class="btn yellow" id="print">🖨️ Printen</button>
    </div>
    <p class="print-tip no-print">Tip voor het printen: kies <b>liggend</b> en <b>A4</b>.</p>
    <div class="diploma" style="--dc:${x.color}">
      <div class="dip-inner">
        <div class="dip-bunting">${flags}</div>
        ${sparkles}
        <div class="dip-head">
          <div class="dip-ribbon"><span>Gefeliciteerd!</span></div>
          <div class="dip-title">${x.grand ? 'Meesterdiploma' : 'Diploma'}</div>
          <div class="dip-app">♞ Sammie Schaakt! ♞</div>
        </div>
        <div class="dip-main">
          <div class="dip-av">${Avatars.html(Store.profile(), 'laugh')}</div>
          <div class="dip-text">
            <div class="dip-name">${playerName()}</div>
            <p>${what}</p>
            ${lessons.length ? `<div class="dip-lessons">${lessons.map((l) => `<span>⭐ ${l.title}</span>`).join('')}</div>` : ''}
          </div>
          <div class="dip-medal">${medalSvg(x.color)}</div>
        </div>
        <div class="dip-foot">
          <div class="dip-date">📅 ${nice}</div>
          <div class="dip-pieces">${['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'].map((pc) => Pieces.svg(pc)).join('')}</div>
          <div class="dip-sign"><div class="dip-pim">${Pieces.svg('wN')}</div><div><span>Pim</span><small>Pim het Paard</small></div></div>
        </div>
      </div>
    </div>
  </div>`;
  $('#back').onclick = () => go(Diplomas);
  $('#print').onclick = () => { try { window.print(); } catch (e) { /* printen niet mogelijk */ } };
  later(() => { Sound.play('win'); confetti(160); }, 300);
}
