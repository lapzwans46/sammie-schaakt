/* =========================================================
   Sammie Schaakt! - nog meer spelletjes
   1. Vakjesjacht          vakjes leren vinden (e4, c6...)
   2. Paardensprong        het paard door een doolhof naar de ster
   3. Wie ben ik?          raadsels over de stukken
   4. Pim-vangertje        vang het springende paard
   5. Schatkist bewaken    houd de zwarte pionnen tegen
   6. Mini-schaak          een klein potje op 5x5
   7. Stukken-memory       zoek het stuk bij hoe het loopt
   8. Slaan-race           zoveel mogelijk slaan in een minuut
   Elk spel gebruikt de vaste indeling: Pim links, bord rechts,
   knoppen links 'Opnieuw' en rechts 'Hint'. Zo schuift er niks.
   ========================================================= */

/* ---------- gedeelde hulpjes ---------- */
function gamePlayed(id) {
  const x = Store.data.extra;
  x.played = x.played || {};
  x.played[id] = (x.played[id] || 0) + 1;
  Store.save();
}
/* beste score bewaren; geeft true als het een nieuw record is */
function gameBest(id, score, higher = true) {
  const x = Store.data.extra;
  x.best = x.best || {};
  const old = x.best[id];
  const better = old === undefined || (higher ? score > old : score < old);
  if (better) { x.best[id] = score; Store.save(); }
  return better && old !== undefined;
}
const bestOf = (id) => ((Store.data.extra.best || {})[id]);

/* eigen timers per spel: bij 'Opnieuw' allemaal stoppen */
function gameTimers() {
  const ids = [];
  return {
    later: (fn, ms) => { const t = later(fn, ms); ids.push(t); return t; },
    stop: () => { ids.forEach(clearTimeout); ids.length = 0; },
  };
}

/* standaard scherm voor een spel: Pim, bord, Opnieuw + Hint */
function gameScreen(title, right) {
  app.innerHTML = teacherLayout(title, right);
  $('#back').onclick = () => go(MiniGames);
  const setText = makeSetText();
  $('#actions').innerHTML = '<button class="btn grey" id="again">↺ Opnieuw</button><button class="btn yellow" id="hintBtn">💡 Hint</button>';
  return setText;
}
function gameBoard(onTap, opts = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'board-wrap';
  $('#stage').appendChild(wrap);
  return new BoardView(wrap, { onTap, ...opts });
}

/* einde van een spel: feestje (of niet) en knoppen */
function gameEnd({ trophy, title, text, win = true, onAgain }) {
  if (win) later(() => { Sound.play('win'); confetti(120); }, 300);
  later(() => {
    const m = modal(`
      <div class="trophy">${trophy}</div>
      <h2>${title}</h2>
      <p>${text}</p>
      <div class="modal-buttons">
        <button class="btn green" id="mAgain">Nog een keer</button>
        <button class="btn grey" id="mBack">Naar de spelletjes</button>
      </div>`, 'celebrate');
    Sound.say(`${title} ${text}`.replace(/<[^>]+>/g, ''));
    $('#mAgain', m).onclick = () => { Sound.hush(); closeModal(); onAgain(); };
    $('#mBack', m).onclick = () => go(MiniGames);
    awardBadges(900);
  }, 800);
}
const starLine = (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n);

/* =========================================================
   1. VAKJESJACHT
   Pim noemt een vakje, Sam tikt het aan. 10 vakjes per rondje.
   ========================================================= */
function SquareHunt() {
  const setText = gameScreen('Vakjesjacht', '<div class="progress"><div class="progress-fill" id="prog"></div></div>');
  const T = gameTimers();
  const view = gameBoard((i) => tap(i));
  const ROUNDS = 10;
  let n, goal, firstTry, good, marks, locked, found;

  const draw = () => view.render(new Array(64).fill(null), { marks, stars: found });

  function start() {
    T.stop();
    n = 0; good = 0; found = []; locked = false;
    $('#prog').style.width = '0%';
    next(true);
  }
  function next(first) {
    let g;
    do { g = Math.floor(Math.random() * 64); } while (g === goal || found.includes(g));
    goal = g; firstTry = true; marks = []; locked = false;
    draw();
    setText(first ? `Ik noem een vakje. Jij tikt het aan! Tik op ${Chess.sqName(goal)}.` : `Tik op ${Chess.sqName(goal)}!`);
  }
  function tap(i) {
    if (locked) return;
    if (i === goal) {
      locked = true;
      if (firstTry) good++;
      n++;
      found.push(i);
      marks = [];
      Sound.play('star');
      draw();
      view.pop(i);
      $('#prog').style.width = (n / ROUNDS) * 100 + '%';
      if (n >= ROUNDS) return finish();
      setText(pick(PRAISE), 'happy');
      T.later(() => next(false), 900);
    } else {
      firstTry = false;
      Sound.play('oops');
      marks = [i];
      draw();
      setText(`Dat is ${Chess.sqName(i)}. Zoek ${Chess.sqName(goal)}!`, 'oops');
      T.later(() => { marks = []; draw(); }, 1000);
    }
  }
  function finish() {
    gamePlayed('jacht');
    const rec = gameBest('jacht', good);
    gameEnd({
      trophy: '🎯', title: 'Alle vakjes gevonden!',
      text: `${good} van de ${ROUNDS} in één keer goed.${rec ? ' Nieuw record!' : ''}`,
      onAgain: start,
    });
  }
  $('#again').onclick = () => { Sound.play('tap'); start(); };
  $('#hintBtn').onclick = () => {
    if (locked) return;
    firstTry = false;
    Sound.play('magic');
    const c = goal % 8, r = Math.floor(goal / 8);
    marks = [];
    for (let k = 0; k < 8; k++) { marks.push(r * 8 + k); marks.push(k * 8 + c); }
    draw();
    const nm = Chess.sqName(goal);
    setText(`De ${nm[0]} staat onderaan. De ${nm[1]} staat links. Waar ze elkaar raken, daar is het!`, 'happy');
  };
  start();
}

/* =========================================================
   2. PAARDENSPRONG-DOOLHOF
   Spring met het paard naar de ster. Witte pionnen staan in de weg.
   Vanaf level 5 zijn er zwarte pionnen: spring niet waar die je kunnen pakken!
   ========================================================= */
const MAZE_LEVELS = [
  { n: 'b1', goal: 'c5', rocks: [] },
  { n: 'g1', goal: 'e6', rocks: ['f3', 'h3'] },
  { n: 'd4', goal: 'd5', rocks: [] },
  { n: 'a8', goal: 'b7', rocks: ['c6'] },
  { n: 'b1', goal: 'e5', rocks: ['d2'], guards: ['c5', 'g5'] },
  { n: 'h1', goal: 'a8', rocks: ['f2', 'e4', 'd5'] },
  { n: 'a1', goal: 'h8', rocks: ['c2', 'd4'], guards: ['e6', 'f4'] },
  { n: 'e1', goal: 'e8', rocks: ['d3', 'g2'], guards: ['d6', 'f6'] },
];

function mazeBoard(L) {
  const b = new Array(64).fill(null);
  b[Chess.sqIndex(L.n)] = 'wN';
  L.rocks.forEach((s) => { b[Chess.sqIndex(s)] = 'wP'; });
  (L.guards || []).forEach((s) => { b[Chess.sqIndex(s)] = 'bP'; });
  return b;
}
/* waar mag het paard heen? niet op eigen pionnen, niet op zwarte pionnen en niet waar een zwarte pion slaat */
function mazeJumps(board, from) {
  const out = [];
  const r = Math.floor(from / 8), c = from % 8;
  for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
    const rr = r + dr, cc = c + dc;
    if (rr < 0 || rr > 7 || cc < 0 || cc > 7) continue;
    const to = rr * 8 + cc;
    if (board[to]) continue;
    out.push(to);
  }
  return out;
}
const mazeDanger = (board, sq) => {
  // een zwarte pion slaat schuin naar beneden: dus van rij-1 naar sq
  const r = Math.floor(sq / 8), c = sq % 8;
  return [c - 1, c + 1].some((cc) => cc >= 0 && cc < 8 && r > 0 && board[(r - 1) * 8 + cc] === 'bP');
};
/* kortste weg (aantal sprongen) en de eerste stap daarvan */
function mazePath(board, from, goal) {
  const prev = new Map([[from, null]]);
  const q = [from];
  while (q.length) {
    const x = q.shift();
    if (x === goal) break;
    for (const y of mazeJumps(board, x)) {
      if (prev.has(y) || mazeDanger(board, y)) continue;
      prev.set(y, x); q.push(y);
    }
  }
  if (!prev.has(goal)) return null;
  const path = [];
  for (let x = goal; x !== null; x = prev.get(x)) path.unshift(x);
  return path; // [from, ..., goal]
}

function KnightMaze() {
  const setText = gameScreen('Paardensprong', '<div class="progress"><div class="progress-fill" id="prog"></div></div>');
  const T = gameTimers();
  const view = gameBoard((i) => tap(i));
  let lv = 0, board, pos, goal, jumps, min, sel, hint, locked, starsWon = 0, marks;

  const draw = (animate) => view.render(board, {
    selected: sel ? pos : null, dests: sel ? mazeJumps(board, pos) : [], stars: [goal], hint, animate, marks,
  });

  function startLevel() {
    T.stop();
    const L = MAZE_LEVELS[lv];
    board = mazeBoard(L);
    pos = Chess.sqIndex(L.n);
    goal = Chess.sqIndex(L.goal);
    min = mazePath(board, pos, goal).length - 1;
    jumps = 0; sel = true; hint = null; locked = false; marks = [];
    $('#prog').style.width = (lv / MAZE_LEVELS.length) * 100 + '%';
    draw();
    const guards = (L.guards || []).length;
    setText(lv === 0 ? `Spring met het paard naar de ster! Lukt het in ${min} sprongen?`
      : guards ? `Level ${lv + 1}. Pas op voor de zwarte pionnen! Lukt het in ${min} sprongen?`
        : `Level ${lv + 1}. Lukt het in ${min} sprongen?`);
  }

  function tap(i) {
    if (locked) return;
    if (i === pos) { sel = !sel; Sound.play('tap'); return draw(); }
    if (!mazeJumps(board, pos).includes(i)) {
      Sound.play('oops');
      view.shake(pos);
      setText(board[i] ? 'Daar staat al een pion. Spring ergens anders heen!' : 'Zo springt een paard niet. Denk aan de L!', 'oops');
      return;
    }
    const from = pos;
    board[from] = null; board[i] = 'wN'; pos = i; jumps++; hint = null;
    Sound.play('move');
    draw({ from, to: i });
    if (mazeDanger(board, i)) {
      locked = true;
      setText('Oei! Een zwarte pion kan je pakken. Probeer het nog eens!', 'oops');
      T.later(() => {
        const r = Math.floor(i / 8), c = i % 8;
        const att = [c - 1, c + 1].map((cc) => (r - 1) * 8 + cc).find((x) => x >= 0 && board[x] === 'bP' && Math.abs((x % 8) - c) === 1);
        board[att] = null; board[i] = 'bP';
        Sound.play('capture');
        draw({ from: att, to: i });
        Sound.play('oops');
      }, 800);
      T.later(startLevel, 2600);
      return;
    }
    if (i === goal) {
      locked = true;
      const st = jumps <= min ? 3 : jumps <= min + 2 ? 2 : 1;
      starsWon += st;
      view.pop(i);
      Sound.play('good');
      setText(st === 3 ? `Wauw! In ${jumps} sprongen. Sneller kan niet!` : `Gelukt in ${jumps} sprongen! Het kan ook in ${min}.`, 'happy');
      T.later(() => {
        lv++;
        if (lv >= MAZE_LEVELS.length) return finish();
        startLevel();
      }, 2400);
      return;
    }
    setText(`${jumps} ${jumps === 1 ? 'sprong' : 'sprongen'}. Waar spring je nu heen?`);
  }

  function finish() {
    $('#prog').style.width = '100%';
    gamePlayed('doolhof');
    const rec = gameBest('doolhof', starsWon);
    gameEnd({
      trophy: '🐴', title: 'Alle levels gehaald!',
      text: `Je verdiende ${starsWon} van de ${MAZE_LEVELS.length * 3} sterren.${rec ? ' Nieuw record!' : ''}`,
      onAgain: () => { lv = 0; starsWon = 0; startLevel(); },
    });
  }
  $('#again').onclick = () => { Sound.play('tap'); startLevel(); };
  $('#hintBtn').onclick = () => {
    if (locked) return;
    const p = mazePath(board, pos, goal);
    if (!p || p.length < 2) return;
    Sound.play('magic');
    hint = { from: pos, to: p[1] };
    sel = true;
    draw();
    setText('Spring naar het gele vakje!', 'happy');
  };
  startLevel();
}

/* =========================================================
   3. WIE BEN IK?
   Pim vertelt een raadsel. Tik op het goede stuk op het bord.
   ========================================================= */
const RIDDLES = [
  ['K', 'Ik ben het belangrijkst. Ik zet maar één stapje.'],
  ['K', 'Ik heb een kruisje op mijn kroon.'],
  ['K', 'Sta ik schaakmat? Dan is het spel uit!'],
  ['Q', 'Ik ga recht én schuin. Zo ver als ik wil!'],
  ['Q', 'Ik ben het sterkst. Ik ben 9 punten waard.'],
  ['R', 'Ik ga alleen recht. Ik lijk op een kasteel.'],
  ['R', 'Aan het begin sta ik in de hoek.'],
  ['R', 'Ik ben 5 punten waard.'],
  ['B', 'Ik ga alleen schuin. Ik blijf altijd op dezelfde kleur.'],
  ['B', 'Ik heb een puntmuts.'],
  ['N', 'Ik spring als een L.'],
  ['N', 'Ik kan over andere stukken heen springen.'],
  ['N', 'Pim is net als ik!'],
  ['P', 'Ik zet één stapje vooruit. Nooit terug!'],
  ['P', 'Kom ik aan de overkant? Dan verander ik!'],
  ['P', 'Ik ben klein. Ik sla schuin.'],
];
const WHO_SQ = { K: 'b5', Q: 'd5', R: 'f5', B: 'c3', N: 'e3', P: 'g3' };

function WhoAmI() {
  const setText = gameScreen('Wie ben ik?', '<div class="progress"><div class="progress-fill" id="prog"></div></div>');
  const T = gameTimers();
  const view = gameBoard((i) => tap(i));
  const ROUNDS = 8;
  let list, n, cur, firstTry, good, marks, locked, showSq;
  const base = () => { const b = new Array(64).fill(null); Object.entries(WHO_SQ).forEach(([t, s]) => { b[Chess.sqIndex(s)] = 'w' + t; }); return b; };
  const board = base();

  function draw() {
    let dests = [];
    if (showSq !== null) {
      const st = { ...Chess.fromPieces({}), board: board.slice() };
      dests = [...new Set(Chess.pseudoMoves(st, showSq).map((m) => m.to))];
    }
    view.render(board, { marks, selected: showSq, dests });
  }
  function start() {
    T.stop();
    // 8 raadsels, nooit twee keer achter elkaar hetzelfde stuk
    list = [];
    const pool = shuffle(RIDDLES.slice());
    while (list.length < ROUNDS && pool.length) {
      const k = pool.findIndex((r) => !list.length || r[0] !== list[list.length - 1][0]);
      list.push(pool.splice(k < 0 ? 0 : k, 1)[0]);
    }
    n = 0; good = 0;
    $('#prog').style.width = '0%';
    ask();
  }
  function ask() {
    cur = list[n]; firstTry = true; marks = []; locked = false; showSq = null;
    draw();
    setText(`${cur[1]} Wie ben ik?`);
  }
  function tap(i) {
    if (locked) return;
    const p = board[i];
    if (!p) return;
    if (p[1] === cur[0]) {
      locked = true;
      if (firstTry) good++;
      n++;
      $('#prog').style.width = (n / ROUNDS) * 100 + '%';
      Sound.play('good');
      marks = []; showSq = i;
      draw();
      setText(`Ja! Ik ben de ${Pieces.NAMES[cur[0]]}! Zo loop ik.`, 'happy');
      T.later(() => (n >= ROUNDS ? finish() : ask()), 2600);
    } else {
      firstTry = false;
      Sound.play('oops');
      view.shake(i);
      setText(`Nee, dat is de ${Pieces.NAMES[p[1]]}. ${cur[1]}`, 'oops');
    }
  }
  function finish() {
    gamePlayed('wie');
    const rec = gameBest('wie', good);
    gameEnd({
      trophy: '🕵️', title: 'Alle raadsels opgelost!',
      text: `${good} van de ${ROUNDS} in één keer goed.${rec ? ' Nieuw record!' : ''}`,
      onAgain: start,
    });
  }
  $('#again').onclick = () => { Sound.play('tap'); start(); };
  $('#hintBtn').onclick = () => {
    if (locked) return;
    firstTry = false;
    Sound.play('magic');
    const others = Object.keys(WHO_SQ).filter((t) => t !== cur[0]);
    marks = shuffle([cur[0], pick(others)]).map((t) => Chess.sqIndex(WHO_SQ[t]));
    draw();
    setText('Het is één van deze twee!', 'happy');
  };
  start();
}

/* =========================================================
   4. PIM-VANGERTJE
   Vang het zwarte paard. Maar ga nooit staan waar het paard jou kan pakken!
   ========================================================= */
function CatchPim(levelKey) {
  const hard = levelKey === 'moeilijker';
  const mine = hard ? 'R' : 'Q';
  const setText = gameScreen(`Pim-vangertje (${levelKey})`);
  const T = gameTimers();
  const view = gameBoard((i) => tap(i));
  let state, sel, dests, last, locked, moves, hint, marks, prevState;
  const nameMine = Pieces.NAMES[mine];

  const knightAt = () => state.board.findIndex((p) => p === 'bN');
  const meAt = () => state.board.findIndex((p) => p && p[0] === 'w');
  const knightJumps = (s, k) => Chess.pseudoMoves({ ...s, turn: 'b' }, k).map((m) => m.to);
  const attackedByMe = (b, sq) => Chess.isAttacked(b, sq, 'w');
  const draw = (animate) => view.render(state.board, { selected: sel, dests: dests.map((m) => m.to), lastMove: last, animate, hint, marks });

  function start() {
    T.stop();
    // beginplek: het paard staat veilig, en ik ook
    for (let tries = 0; tries < 200; tries++) {
      const a = Math.floor(Math.random() * 64), b = Math.floor(Math.random() * 64);
      if (a === b) continue;
      const pcs = {}; pcs[Chess.sqName(a)] = 'w' + mine; pcs[Chess.sqName(b)] = 'bN';
      const s = Chess.fromPieces(pcs, 'w');
      if (attackedByMe(s.board, b) || knightJumps(s, b).includes(a)) continue;
      state = s; break;
    }
    sel = meAt(); dests = qMoves(Chess.legalMoves(state, sel)); last = null; locked = false; moves = 0; hint = null; marks = [];
    draw();
    setText(`Vang Pim met je ${nameMine}! Maar pas op: ga niet staan waar Pim jou kan pakken.`);
  }

  function tap(i) {
    if (locked) return;
    const mv = dests.find((m) => m.to === i);
    if (sel !== null && mv) return doMove(mv);
    if (state.board[i] && state.board[i][0] === 'w') {
      sel = i; dests = qMoves(Chess.legalMoves(state, i)); Sound.play('tap'); return draw();
    }
    if (sel !== null && state.board[i] === 'bN') {
      Sound.play('oops'); view.shake(sel);
      setText(`Daar kan je ${nameMine} niet in één keer heen.`, 'oops');
    }
  }

  function doMove(m) {
    prevState = state;
    state = Chess.makeMove(state, m);
    state.turn = 'w';
    moves++;
    last = { from: m.from, to: m.to }; sel = null; dests = []; hint = null; marks = [];
    Sound.play(m.captured ? 'capture' : 'move');
    draw({ from: m.from, to: m.to });
    if (m.captured) return finish();
    locked = true;
    const k = knightAt();
    // sta ik waar het paard kan springen? Hap!
    if (knightJumps(state, k).includes(m.to)) {
      setText('Oei...', 'oops');
      T.later(() => {
        state = Chess.makeMove({ ...state, turn: 'b' }, { from: k, to: m.to, piece: 'bN', captured: 'w' + mine });
        last = { from: k, to: m.to };
        Sound.play('capture');
        draw({ from: k, to: m.to });
        setText(`Hap! Pim pakt je ${nameMine}. Daar kon Pim heen springen. Nog een kans!`, 'oops');
      }, 600);
      T.later(() => {
        state = prevState; moves--; last = null; sel = meAt(); dests = qMoves(Chess.legalMoves(state, sel)); locked = false;
        marks = knightJumps(state, knightAt());
        draw();
        T.later(() => { marks = []; draw(); }, 1800);
      }, 3600);
      return;
    }
    // Pim springt weg: liefst naar een veilig vakje
    T.later(() => {
      const jumps = knightJumps(state, k).filter((sq) => !state.board[sq]);
      const safe = jumps.filter((sq) => {
        const b = state.board.slice(); b[k] = null; b[sq] = 'bN';
        return !attackedByMe(b, sq);
      });
      let to;
      if (safe.length) {
        // makkelijk: een veilig vakje, zomaar. Moeilijker: het vakje met de meeste uitwegen.
        if (!hard || Math.random() < 0.3) to = pick(safe);
        else {
          const score = (sq) => { const b = state.board.slice(); b[k] = null; b[sq] = 'bN'; return knightJumps({ ...state, board: b }, sq).filter((x) => !b[x] && !attackedByMe(b, x)).length; };
          to = safe.sort((a, b) => score(b) - score(a))[0];
        }
      } else to = jumps.length ? pick(jumps) : k;
      if (to !== k) {
        state = Chess.makeMove({ ...state, turn: 'b' }, { from: k, to, piece: 'bN' });
        state.turn = 'w';
        last = { from: k, to };
        Sound.play('move');
      }
      sel = meAt(); dests = qMoves(Chess.legalMoves(state, sel));
      locked = false;
      draw({ from: k, to });
      setText(safe.length ? pick(['Hihi, mis! Probeer nog eens.', 'Ik spring weg!', 'Vang me dan!', 'Jouw beurt!']) : 'Oei! Ik kon nergens veilig heen...', safe.length ? '' : 'oops');
    }, 700);
  }

  function finish() {
    locked = true;
    gamePlayed('vangen');
    const st = moves <= 4 ? 3 : moves <= 8 ? 2 : 1;
    const rec = gameBest('vangen-' + levelKey, moves, false);
    setText('Gevangen!', 'happy');
    gameEnd({
      trophy: '🐴', title: 'Je hebt Pim gevangen!',
      text: `In ${moves} zetten. ${starLine(st)}${rec ? ' Nieuw record!' : ''}`,
      onAgain: start,
    });
  }

  $('#again').onclick = () => { Sound.play('tap'); start(); };
  $('#hintBtn').onclick = () => {
    if (locked) return;
    Sound.play('magic');
    const me = meAt(), k = knightAt();
    const all = qMoves(Chess.legalMoves(state, me));
    let best = all.find((m) => m.captured);
    if (!best) {
      const danger = new Set(knightJumps(state, k));
      // veilige zet die Pim zo weinig mogelijk veilige vakjes laat
      const rate = (m) => {
        const b = state.board.slice(); b[m.from] = null; b[m.to] = 'w' + mine;
        return knightJumps({ ...state, board: b }, k).filter((x) => !b[x] && !attackedByMe(b, x)).length;
      };
      best = all.filter((m) => !danger.has(m.to)).sort((a, b) => rate(a) - rate(b))[0];
    }
    if (!best) return;
    marks = knightJumps(state, k);
    hint = { from: best.from, to: best.to };
    sel = me; dests = all;
    draw();
    setText('De blauwe vakjes zijn gevaarlijk: daar kan Pim heen. Probeer het gele vakje!', 'happy');
  };
  start();
}

/* =========================================================
   5. SCHATKIST BEWAKEN
   Zwarte pionnen lopen naar jouw schat (de onderste rij). Sla ze voor ze er zijn!
   Pas op: pionnen slaan schuin. Je hebt 3 hartjes.
   ========================================================= */
const TREASURE_SETUP = {
  makkelijk: { pieces: { d1: 'wQ' }, pawns: ['a7', 'c7', 'e7', 'g7', 'b6'] },
  moeilijker: { pieces: { a1: 'wR', g1: 'wN' }, pawns: ['a7', 'b6', 'c7', 'd6', 'e7', 'f6', 'h7'] },
};

function Treasure(levelKey) {
  const setText = gameScreen(`Schatkist bewaken (${levelKey})`, '<div class="hearts" id="hearts"></div>');
  const T = gameTimers();
  const view = gameBoard((i) => tap(i));
  let state, sel, dests, last, locked, hearts, gold, hint;

  const pawns = () => state.board.map((p, i) => (p === 'bP' ? i : -1)).filter((i) => i >= 0);
  const mineLeft = () => state.board.some((p) => p && p[0] === 'w');
  const pawnHits = (b, sq) => { // kan een zwarte pion op sq slaan?
    const r = Math.floor(sq / 8), c = sq % 8;
    return r > 0 && [c - 1, c + 1].some((cc) => cc >= 0 && cc < 8 && b[(r - 1) * 8 + cc] === 'bP');
  };
  const draw = (animate) => view.render(state.board, { selected: sel, dests: dests.map((m) => m.to), lastMove: last, animate, hint, stars: gold });
  const showHearts = () => { $('#hearts').innerHTML = '❤️'.repeat(hearts) + '🤍'.repeat(3 - hearts); };

  function start() {
    T.stop();
    const S = TREASURE_SETUP[levelKey];
    const pcs = { ...S.pieces };
    S.pawns.forEach((s) => { pcs[s] = 'bP'; });
    state = Chess.fromPieces(pcs, 'w');
    gold = [56, 57, 58, 59, 60, 61, 62, 63];
    sel = null; dests = []; last = null; locked = false; hearts = 3; hint = null;
    showHearts();
    draw();
    setText('De zwarte pionnen willen jouw schat! Sla ze, voor ze onderaan zijn. Pas op: pionnen slaan schuin.');
  }

  function tap(i) {
    if (locked) return;
    const mv = dests.find((m) => m.to === i);
    if (sel !== null && mv) return doMove(mv);
    const p = state.board[i];
    if (p && p[0] === 'w') { sel = i; dests = qMoves(Chess.legalMoves(state, i)); Sound.play('tap'); return draw(); }
    if (sel !== null && p === 'bP') {
      Sound.play('oops'); view.shake(sel);
      setText(`Daar kan je ${Pieces.NAMES[state.board[sel][1]]} niet in één keer heen.`, 'oops');
    }
  }

  function doMove(m) {
    state = Chess.makeMove(state, m);
    state.turn = 'w';
    last = { from: m.from, to: m.to }; sel = null; dests = []; hint = null;
    Sound.play(m.captured ? 'capture' : 'move');
    draw({ from: m.from, to: m.to });
    if (!pawns().length) return finish(true);
    locked = true;
    T.later(blackMove, 750);
  }

  function blackMove() {
    const b = state.board;
    const opts = [];
    for (const i of pawns()) {
      const r = Math.floor(i / 8), c = i % 8;
      for (const cc of [c - 1, c + 1]) {
        if (cc < 0 || cc > 7 || r === 7) continue;
        const to = (r + 1) * 8 + cc;
        if (b[to] && b[to][0] === 'w') opts.push({ from: i, to, take: true, r });
      }
      if (r < 7 && !b[i + 8]) opts.push({ from: i, to: i + 8, take: false, r });
    }
    if (!opts.length) { locked = false; setText('De pionnen staan vast. Jouw beurt!'); return; }
    // slaan kan? Dan doen ze dat. Anders loopt (meestal) de voorste pion.
    const takes = opts.filter((o) => o.take);
    let o;
    if (takes.length) o = takes[0];
    else {
      const far = Math.max(...opts.map((x) => x.r));
      o = Math.random() < 0.6 ? pick(opts.filter((x) => x.r === far)) : pick(opts);
    }
    const taken = b[o.to];
    const nb = b.slice(); nb[o.from] = null; nb[o.to] = 'bP';
    last = { from: o.from, to: o.to };
    Sound.play(taken ? 'capture' : 'move');
    let msg = 'Jouw beurt!', mood = '';
    if (taken) { msg = `Hap! Een pion pakt je ${Pieces.NAMES[taken[1]]}!`; mood = 'oops'; }
    if (o.to >= 56) {
      // bij de schat: een hartje kwijt, de pion gaat weg met een stukje goud
      nb[o.to] = null;
      gold = gold.filter((g) => g !== o.to);
      hearts--;
      showHearts();
      msg = 'Oei! Een pion pakt een stukje van je schat.'; mood = 'oops';
      T.later(() => Sound.play('oops'), 200);
    }
    state = { ...state, board: nb, turn: 'w' };
    draw({ from: o.from, to: o.to });
    if (hearts <= 0) return finish(false, 'De pionnen hebben je schat gepakt.');
    if (!mineLeft()) return finish(false, 'Je hebt geen stukken meer.');
    if (!pawns().length) return finish(true);
    locked = false;
    setText(msg, mood);
  }

  function finish(won, why) {
    locked = true;
    gamePlayed('schat');
    if (won) {
      const rec = gameBest('schat-' + levelKey, hearts);
      setText('Je schat is veilig!', 'happy');
      gameEnd({ trophy: '💰', title: 'Je schat is veilig!', text: `Nog ${hearts} ${hearts === 1 ? 'hartje' : 'hartjes'} over. ${starLine(hearts)}${rec ? ' Nieuw record!' : ''}`, onAgain: start });
    } else {
      Sound.play('lose');
      setText(why, 'oops');
      gameEnd({ trophy: '🏴‍☠️', title: 'Helaas!', text: `${why} Probeer het nog eens!`, win: false, onAgain: start });
    }
  }

  $('#again').onclick = () => { Sound.play('tap'); start(); };
  $('#hintBtn').onclick = () => {
    if (locked) return;
    const all = [];
    state.board.forEach((p, i) => { if (p && p[0] === 'w') all.push(...qMoves(Chess.legalMoves(state, i))); });
    const after = (m) => { const b = state.board.slice(); b[m.from] = null; b[m.to] = m.piece; return b; };
    const rate = (m) => {
      const b = after(m);
      let sc = 0;
      if (pawnHits(b, m.to)) sc -= 1000;                          // niet laten pakken
      if (m.captured) sc += 100 + Math.floor(m.to / 8) * 10;       // slaan, liefst de voorste
      // een pion bedreigen die bijna bij de schat is
      sc += Chess.pseudoMoves({ ...state, board: b, turn: 'w' }, m.to).filter((x) => x.captured).reduce((t, x) => t + Math.floor(x.to / 8), 0);
      return sc;
    };
    const best = all.sort((a, b) => rate(b) - rate(a))[0];
    if (!best) return;
    Sound.play('magic');
    hint = { from: best.from, to: best.to };
    sel = best.from; dests = qMoves(Chess.legalMoves(state, best.from));
    draw();
    setText(best.captured ? 'Sla deze pion! Daar kan niemand je terugpakken.' : 'Zet je stuk op het gele vakje.', 'happy');
  };
  start();
}

/* =========================================================
   6. MINI-SCHAAK
   Een echt potje op een klein bord van 5 bij 5 (vakjes a1 t/m e5). Sneller klaar!
   Pionnen zetten altijd één stapje en rokeren kan niet.
   ========================================================= */
const MINI_FEN = '8/8/8/rnbqk3/ppppp3/8/PPPPP3/RNBQK3 w - - 0 1';
const MINI_REGION = { r0: 3, r1: 7, c0: 0, c1: 4 };
const miniIn = (i) => Math.floor(i / 8) >= 3 && i % 8 <= 4;

function miniMoves(s, all = false) {
  const out = [];
  for (const m of Chess.legalMoves(s)) {
    if (!miniIn(m.to) || m.flag === 'double' || m.flag === 'castleK' || m.flag === 'castleQ') continue;
    if (m.promo && !all && m.promo !== 'Q') continue;
    // witte pion op rij 5 = de overkant: dan promoveren
    if (m.piece === 'wP' && Math.floor(m.to / 8) === 3) {
      for (const t of all ? ['Q', 'R', 'B', 'N'] : ['Q']) out.push({ ...m, promo: t });
      continue;
    }
    out.push(m);
  }
  return out;
}
function miniStatus(s) {
  if (!miniMoves(s).length) return Chess.inCheck(s, s.turn) ? 'mate' : 'stalemate';
  if (!s.board.some((p) => p && p[1] !== 'K')) return 'kings';
  return null;
}
const MINI_VAL = { P: 100, N: 300, B: 300, R: 500, Q: 900, K: 0 };
function miniEval(s) { // vanuit wie aan zet is
  let sc = 0;
  s.board.forEach((p, i) => {
    if (!p) return;
    const r = Math.floor(i / 8), c = i % 8;
    const center = 4 - Math.abs(c - 2) - Math.abs(r - 5);
    const v = MINI_VAL[p[1]] + (p[1] === 'K' ? 0 : center * 6) + (p === 'wP' ? (7 - r) * 12 : p === 'bP' ? (r - 3) * 12 : 0);
    sc += p[0] === 'w' ? v : -v;
  });
  return s.turn === 'w' ? sc : -sc;
}
function miniSearch(s, d, a, b) {
  const ms = miniMoves(s);
  if (!ms.length) return Chess.inCheck(s, s.turn) ? -100000 - d : 0;
  if (d === 0) return miniEval(s);
  ms.sort((x, y) => (y.captured ? MINI_VAL[y.captured[1]] : 0) - (x.captured ? MINI_VAL[x.captured[1]] : 0));
  for (const m of ms) {
    const v = -miniSearch(Chess.makeMove(s, m), d - 1, -b, -a);
    if (v > a) a = v;
    if (a >= b) break;
  }
  return a;
}
function miniBest(s, depth, noise = 0) {
  let best = null, bv = -Infinity;
  for (const m of miniMoves(s)) {
    const v = -miniSearch(Chess.makeMove(s, m), depth - 1, -Infinity, Infinity) + (Math.random() * 2 - 1) * noise;
    if (v > bv) { bv = v; best = m; }
  }
  return best;
}

function MiniChess(levelKey) {
  const hard = levelKey === 'moeilijker';
  const setText = gameScreen(`Mini-schaak (${levelKey})`);
  const T = gameTimers();
  const view = gameBoard((i) => tap(i), { region: MINI_REGION });
  let state, sel, dests, last, locked, over, hint, plies;
  const checkSq = () => (Chess.inCheck(state, state.turn) ? Chess.findKing(state.board, state.turn) : null);
  const draw = (animate) => view.render(state.board, { selected: sel, dests: dests.map((m) => m.to), lastMove: last, animate, hint, check: checkSq() });

  function start() {
    T.stop();
    state = Chess.fromFEN(MINI_FEN);
    sel = null; dests = []; last = null; locked = false; over = false; hint = null; plies = 0;
    draw();
    setText('Mini-schaak! Een klein bord, een snel potje. Pionnen zetten één stapje. Jij begint!');
  }

  function tap(i) {
    if (locked || over) return;
    const mv = dests.find((m) => m.to === i);
    if (sel !== null && mv) {
      if (mv.promo) {
        locked = true;
        return askPromotion('w', (t) => { locked = false; play({ ...mv, promo: t }); });
      }
      return play(mv);
    }
    const p = state.board[i];
    if (p && p[0] === 'w') {
      const ms = miniMoves(state).filter((m) => m.from === i);
      if (!ms.length) {
        view.shake(i); Sound.play('oops');
        setText(Chess.inCheck(state, 'w') ? 'Je koning staat schaak! Red hem eerst.' : 'Dit stuk kan nu niet zetten.', 'oops');
        sel = null; dests = []; return draw();
      }
      Sound.play('tap'); sel = i; dests = ms; return draw();
    }
    sel = null; dests = []; draw();
  }

  function apply(m) {
    state = Chess.makeMove(state, m);
    last = { from: m.from, to: m.to }; sel = null; dests = []; hint = null; plies++;
    Sound.play(m.captured ? 'capture' : 'move');
    draw({ from: m.from, to: m.to });
  }
  function ended() {
    const st = miniStatus(state);
    if (st === 'mate') { finish(state.turn === 'b' ? 'win' : 'loss'); return true; }
    if (st || plies >= 120) { finish('draw', st === 'stalemate' ? 'Pat! Er kan niemand meer zetten.' : 'Er zijn alleen nog koningen, of het duurde heel lang.'); return true; }
    return false;
  }
  function play(m) {
    apply(m);
    if (m.promo) setText(`Toverij! Je pion is nu een ${PROMO_NAME[m.promo]}!`, 'happy');
    if (ended()) return;
    locked = true;
    if (!m.promo) setText(Chess.inCheck(state, 'b') ? 'Schaak! Pim denkt na...' : 'Pim denkt na...');
    T.later(() => {
      let pm;
      const ms = miniMoves(state);
      if (!hard && Math.random() < 0.35) pm = pick(ms);
      else pm = miniBest(state, hard ? 3 : 1, hard ? 20 : 120);
      apply(pm);
      if (ended()) return;
      locked = false;
      if (Chess.inCheck(state, 'w')) { Sound.play('check'); setText('Schaak! Red je koning!', 'oops'); }
      else setText(pm.captured ? `Hap! Ik pak je ${Pieces.NAMES[pm.captured[1]]}. Jouw beurt!` : 'Jouw beurt!');
    }, 700);
  }

  function finish(result, why = '') {
    over = true;
    gamePlayed('mini');
    if (result === 'win') {
      Store.data.extra.miniWins = (Store.data.extra.miniWins || 0) + 1;
      Store.save();
      setText('Schaakmat! Jij wint!', 'happy');
      gameEnd({ trophy: '🏆', title: 'Schaakmat! Jij wint!', text: `Al ${Store.data.extra.miniWins} keer gewonnen met mini-schaak.`, onAgain: start });
    } else if (result === 'loss') {
      Sound.play('lose');
      setText('Schaakmat... Pim wint deze keer.', 'oops');
      gameEnd({ trophy: '🐴', title: 'Pim wint deze keer', text: 'Niet erg! Nog een potje?', win: false, onAgain: start });
    } else {
      setText('Gelijkspel!');
      gameEnd({ trophy: '🤝', title: 'Gelijkspel!', text: why, win: false, onAgain: start });
    }
  }

  $('#again').onclick = () => { Sound.play('tap'); if (over || plies === 0) return start(); ask('Wil je opnieuw beginnen?', start); };
  $('#hintBtn').onclick = () => {
    if (locked || over) return;
    setText('Even denken...');
    T.later(() => {
      const h = miniBest(state, 3, 5);
      if (!h) return;
      Sound.play('magic');
      hint = { from: h.from, to: h.to };
      sel = h.from; dests = miniMoves(state).filter((m) => m.from === h.from);
      draw();
      setText(`Tip: zet je ${Pieces.NAMES[h.piece[1]]} op het gele vakje.`, 'happy');
    }, 50);
  };
  start();
}

/* =========================================================
   7. STUKKEN-MEMORY
   Draai twee kaartjes om. Zoek het stuk bij het plaatje van hoe het loopt.
   ========================================================= */
function moveCard(t) {
  // klein bordje van 5x5 met het stuk in het midden en stipjes waar het heen mag
  const dots = new Set();
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const dr = r - 2, dc = c - 2;
      if (!dr && !dc) continue;
      const straight = !dr || !dc, diag = Math.abs(dr) === Math.abs(dc);
      const ok = t === 'R' ? straight : t === 'B' ? diag : t === 'Q' ? straight || diag
        : t === 'K' ? Math.max(Math.abs(dr), Math.abs(dc)) === 1
          : t === 'N' ? Math.abs(dr * dc) === 2
            : (dr === -1 && dc === 0) || (dr === -2 && dc === 0);
      if (ok) dots.add(r * 5 + c);
    }
  }
  const hits = t === 'P' ? new Set([6, 8]) : new Set();
  let cells = '';
  for (let k = 0; k < 25; k++) {
    const r = Math.floor(k / 5), c = k % 5;
    const inner = k === 12 ? Pieces.svg('w' + t) : dots.has(k) ? '<i class="mc-dot"></i>' : hits.has(k) ? '<i class="mc-hit">✕</i>' : '';
    cells += `<span class="${(r + c) % 2 ? 'd' : 'l'}">${inner}</span>`;
  }
  return `<div class="mc-grid">${cells}</div>`;
}

function PieceMemory() {
  const setText = gameScreen('Stukken-memory', '<div class="progress"><div class="progress-fill" id="prog"></div></div>');
  const T = gameTimers();
  const wrap = document.createElement('div');
  wrap.className = 'board-wrap memory-wrap';
  $('#stage').appendChild(wrap);
  const TYPES = ['K', 'Q', 'R', 'B', 'N', 'P'];
  let cards, open, done, turns, locked;

  function start() {
    T.stop();
    cards = shuffle(TYPES.flatMap((t) => [{ t, kind: 'piece' }, { t, kind: 'move' }]));
    open = []; done = new Set(); turns = 0; locked = false;
    $('#prog').style.width = '0%';
    render();
    setText('Draai twee kaartjes om. Zoek het stuk bij het plaatje van hoe het loopt!');
  }
  function render() {
    wrap.innerHTML = `<div class="memory">${cards.map((c, i) => `
      <button class="mem-card ${open.includes(i) || done.has(i) ? 'up' : ''} ${done.has(i) ? 'done' : ''}" data-i="${i}" aria-label="kaartje">
        <span class="mem-back">?</span>
        <span class="mem-front">${c.kind === 'piece' ? `<span class="mem-piece">${Pieces.svg('w' + c.t)}</span>` : moveCard(c.t)}</span>
      </button>`).join('')}</div>`;
    wrap.querySelectorAll('.mem-card').forEach((b) => { b.onclick = () => flip(+b.dataset.i); });
  }
  function flip(i) {
    if (locked || open.includes(i) || done.has(i)) return;
    Sound.play('tap');
    open.push(i);
    render();
    if (open.length < 2) return;
    turns++;
    const [a, b] = open.map((k) => cards[k]);
    if (a.t === b.t && a.kind !== b.kind) {
      open.forEach((k) => done.add(k));
      open = [];
      Sound.play('good');
      $('#prog').style.width = (done.size / cards.length) * 100 + '%';
      render();
      const name = Pieces.NAMES[a.t];
      if (done.size === cards.length) return finish();
      setText(`Ja! Zo loopt ${a.t === 'N' ? 'het' : 'de'} ${name}.`, 'happy');
    } else {
      locked = true;
      setText('Hmm, die horen niet bij elkaar. Onthoud waar ze liggen!', 'oops');
      T.later(() => { open = []; locked = false; render(); }, 1300);
    }
  }
  function finish() {
    gamePlayed('memory');
    const rec = gameBest('memory', turns, false);
    const st = turns <= 10 ? 3 : turns <= 15 ? 2 : 1;
    setText('Alles gevonden!', 'happy');
    gameEnd({ trophy: '🃏', title: 'Alles gevonden!', text: `In ${turns} beurten. ${starLine(st)}${rec ? ' Nieuw record!' : ''}`, onAgain: start });
  }
  $('#again').onclick = () => { Sound.play('tap'); start(); };
  $('#hintBtn').onclick = () => {
    if (locked) return;
    const t = cards.find((c, i) => !done.has(i)).t;
    const pair = cards.map((c, i) => (c.t === t && !done.has(i) ? i : -1)).filter((i) => i >= 0);
    Sound.play('magic');
    pair.forEach((i) => wrap.querySelector(`.mem-card[data-i="${i}"]`).classList.add('peek'));
    setText('Kijk goed! Deze twee horen bij elkaar.', 'happy');
    locked = true;
    T.later(() => { locked = false; render(); }, 1500);
  };
  start();
}

/* =========================================================
   8. SLAAN-RACE
   Sla in één minuut zoveel mogelijk zwarte stukken. De tijd loopt pas als je begint.
   ========================================================= */
function CaptureRace(levelKey) {
  const mine = levelKey === 'moeilijker' ? 'N' : 'Q';
  const setText = gameScreen(`Slaan-race (${levelKey})`, '<div class="progress timer"><div class="progress-fill" id="prog"></div></div>');
  const T = gameTimers();
  const view = gameBoard((i) => tap(i));
  const TIME = 60000;
  let state, sel, dests, last, score, running, over, t0, hint, tick;

  const meAt = () => state.board.findIndex((p) => p && p[0] === 'w');
  const draw = (animate) => view.render(state.board, { selected: sel, dests: dests.map((m) => m.to), lastMove: last, animate, hint });
  const showScore = () => { const el = $('#tText'); if (el) el.textContent = `Gepakt: ${score} ${score ? '⭐' : ''}`; };

  function spawn() {
    // altijd 3 zwarte stukken; minstens één kun je meteen slaan
    const types = ['P', 'P', 'N', 'B', 'R'];
    const b = state.board;
    const reach = qMoves(Chess.legalMoves(state, meAt())).map((m) => m.to);
    let count = b.filter((p) => p && p[0] === 'b').length;
    const canTake = () => qMoves(Chess.legalMoves(state, meAt())).some((m) => m.captured);
    if (!canTake()) {
      const empty = reach.filter((sq) => !b[sq]);
      if (empty.length) { b[pick(empty)] = 'b' + pick(types); count++; }
    }
    while (count < 3) {
      const sq = Math.floor(Math.random() * 64);
      if (b[sq]) continue;
      b[sq] = 'b' + pick(types); count++;
    }
  }
  function start() {
    T.stop(); clearInterval(tick);
    const pcs = { d4: 'w' + mine };
    state = Chess.fromPieces(pcs, 'w');
    spawn();
    sel = meAt(); dests = qMoves(Chess.legalMoves(state, sel)); last = null; score = 0; running = false; over = false; hint = null;
    $('#prog').style.width = '100%';
    draw();
    setText(`Sla zoveel mogelijk zwarte stukken met je ${Pieces.NAMES[mine]}! De tijd loopt als je begint.`);
  }
  function startClock() {
    running = true; t0 = Date.now();
    tick = setInterval(() => {
      const left = Math.max(0, TIME - (Date.now() - t0));
      const bar = $('#prog');
      if (!bar) { clearInterval(tick); return; }
      bar.style.width = (left / TIME) * 100 + '%';
      bar.classList.toggle('low', left < 10000);
      if (left <= 0) { clearInterval(tick); finish(); }
    }, 200);
  }
  function tap(i) {
    if (over) return;
    const mv = dests.find((m) => m.to === i);
    if (sel !== null && mv) {
      if (!running) startClock();
      state = Chess.makeMove(state, mv);
      state.turn = 'w';
      last = { from: mv.from, to: mv.to }; hint = null;
      Sound.play(mv.captured ? 'capture' : 'move');
      if (mv.captured) { score++; T.later(() => { Sound.play('star'); view.pop(mv.to); }, 120); spawn(); }
      sel = meAt(); dests = qMoves(Chess.legalMoves(state, sel));
      draw({ from: mv.from, to: mv.to });
      showScore();
      return;
    }
    if (state.board[i] && state.board[i][0] === 'w') { sel = i; dests = qMoves(Chess.legalMoves(state, i)); return draw(); }
  }
  function finish() {
    over = true;
    gamePlayed('race60');
    const rec = gameBest('race60-' + levelKey, score);
    const best = bestOf('race60-' + levelKey);
    gameEnd({
      trophy: '⏱️', title: 'De tijd is om!',
      text: `Je pakte ${score} stukken!${rec ? ' Nieuw record!' : best !== undefined ? ` Je record is ${best}.` : ''}`,
      onAgain: start,
    });
  }
  $('#again').onclick = () => { Sound.play('tap'); start(); };
  $('#hintBtn').onclick = () => {
    if (over) return;
    const m = qMoves(Chess.legalMoves(state, meAt())).find((x) => x.captured);
    if (!m) return;
    Sound.play('magic');
    hint = { from: m.from, to: m.to };
    draw();
  };
  screenCleanup = () => clearInterval(tick);
  start();
}
