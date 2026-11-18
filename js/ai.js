/* =========================================================
   Sammie Schaakt! - de computer-tegenstander
   Niveau 1 = heel makkelijk ... niveau 6 = best sterk.
   ========================================================= */
const AI = (() => {
  const VAL = { P: 100, N: 300, B: 320, R: 500, Q: 900, K: 0 };
  const MATE = 100000;

  // Plaatswaarde-tabellen vanuit wit gezien (index 0 = a8)
  const PST = {
    P: [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5,
      0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
    N: [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30,
      -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50],
    B: [-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10,
      -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10, -10, -10, -10, -10, -20],
    R: [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0],
    Q: [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5,
      0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20],
    K: [-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30,
      -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20],
  };

  /* Score vanuit wit gezien */
  function evaluateWhite(board) {
    let s = 0;
    for (let i = 0; i < 64; i++) {
      const p = board[i];
      if (!p) continue;
      const t = p[1];
      if (p[0] === 'w') s += VAL[t] + PST[t][i];
      else s -= VAL[t] + PST[t][(7 - Math.floor(i / 8)) * 8 + (i % 8)];
    }
    return s;
  }
  const evaluate = (state) => (state.turn === 'w' ? 1 : -1) * evaluateWhite(state.board);

  // Alleen promoveren tot koningin, dat scheelt rekenwerk
  const usefulMoves = (moves) => moves.filter((m) => !m.promo || m.promo === 'Q');

  function order(moves) {
    for (const m of moves) {
      m._o = (m.captured ? 10 * VAL[m.captured[1]] - VAL[m.piece[1]] + 1000 : 0) + (m.promo ? 800 : 0);
    }
    return moves.sort((a, b) => b._o - a._o);
  }

  let nodes = 0, deadline = Infinity, aborted = false;

  function quiesce(state, alpha, beta, qdepth) {
    nodes++;
    const stand = evaluate(state);
    if (stand >= beta) return stand;
    if (stand > alpha) alpha = stand;
    if (qdepth <= 0) return alpha;
    const moves = order(usefulMoves(Chess.pseudoMoves(state)).filter((m) => m.captured || m.promo));
    for (const m of moves) {
      const next = Chess.makeMove(state, m);
      if (Chess.inCheck(next, state.turn)) continue;
      const score = -quiesce(next, -beta, -alpha, qdepth - 1);
      if (score >= beta) return score;
      if (score > alpha) alpha = score;
    }
    return alpha;
  }

  function search(state, depth, alpha, beta, ply, useQ) {
    if ((++nodes & 1023) === 0 && performance.now() > deadline) aborted = true;
    if (aborted) return 0;
    if (depth <= 0) return useQ ? quiesce(state, alpha, beta, 4) : evaluate(state);

    let legal = 0;
    let best = -Infinity;
    for (const m of order(usefulMoves(Chess.pseudoMoves(state)))) {
      const next = Chess.makeMove(state, m);
      if (Chess.inCheck(next, state.turn)) continue;
      legal++;
      const score = -search(next, depth - 1, -beta, -alpha, ply + 1, useQ);
      if (score > best) best = score;
      if (score > alpha) alpha = score;
      if (alpha >= beta) break;
    }
    if (legal === 0) return Chess.inCheck(state, state.turn) ? -MATE + ply : 0;
    return best;
  }

  /* Niveaus 1 (heel makkelijk) t/m 11 (het sterkst).
     Bewust heel mild: Sam is 7. Niveau 11 is even sterk als het oude niveau 6.
     Te makkelijk? Verlaag 'random' en 'noise' (of zet findMate eerder aan).
     random = kans op een gokzet, noise = 'slordigheid', findMate = ziet schaakmat in één zet */
  const LEVELS = {
    1: { name: 'Beginner', random: 0.92, depth: 1, noise: 280, findMate: false },
    2: { name: 'Heel makkelijk', random: 0.88, depth: 1, noise: 260, findMate: false },
    3: { name: 'Makkelijk', random: 0.84, depth: 1, noise: 240, findMate: false },
    4: { name: 'Makkelijk+', random: 0.8, depth: 1, noise: 220, findMate: false },
    5: { name: 'Gemiddeld', random: 0.75, depth: 1, noise: 200, findMate: false },
    6: { name: 'Gemiddeld+', random: 0.7, depth: 1, noise: 175, findMate: false },
    7: { name: 'Lastig', random: 0.65, depth: 1, noise: 150, findMate: true },
    8: { name: 'Lastig+', random: 0.6, depth: 1, noise: 130, findMate: true },
    9: { name: 'Moeilijk', random: 0.55, depth: 1, noise: 115, findMate: true },
    10: { name: 'Heel moeilijk', random: 0.51, depth: 1, noise: 100, findMate: true },
    11: { name: 'Meester', random: 0.47, depth: 1, noise: 90, findMate: true },
  };

  function isMate(next) {
    return Chess.inCheck(next, next.turn) && Chess.legalMoves(next).length === 0;
  }

  /* margin: zetten die meer dan 'margin' slechter zijn hoeven niet precies berekend te worden */
  function rootScores(state, depth, useQ, timeMs, margin = Infinity) {
    deadline = performance.now() + timeMs;
    aborted = false;
    nodes = 0;
    const moves = order(usefulMoves(Chess.legalMoves(state)));
    const scored = [];
    let best = -Infinity;
    for (const m of moves) {
      const next = Chess.makeMove(state, m);
      const floor = best - margin;
      const score = isMate(next) ? MATE : -search(next, depth - 1, -Infinity, -floor, 1, useQ);
      if (score > best) best = score;
      if (aborted) break;
      scored.push({ move: m, score });
    }
    return scored;
  }

  function chooseMove(state, levelNr) {
    const lvl = LEVELS[levelNr] || LEVELS[1];
    const moves = usefulMoves(Chess.legalMoves(state));
    if (moves.length === 0) return null;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (lvl.findMate) {
      const mate = moves.find((m) => isMate(Chess.makeMove(state, m)));
      if (mate) return mate;
    }
    if (Math.random() < lvl.random) {
      // Een gokje. Soms toch iets slaan als dat kan.
      const caps = moves.filter((m) => m.captured);
      if (caps.length && Math.random() < 0.4) return pick(caps);
      return pick(moves);
    }

    let best = null;
    // Iteratief dieper zoeken binnen de tijd
    for (let d = 1; d <= lvl.depth; d++) {
      const scored = rootScores(state, d, !!lvl.quiesce, 2500, 2 * lvl.noise + 1);
      if (aborted && best) break;
      if (!scored.length) break;
      for (const s of scored) s.noisy = s.score + (Math.random() * 2 - 1) * lvl.noise;
      scored.sort((a, b) => b.noisy - a.noisy);
      best = scored[0].move;
      if (aborted) break;
    }
    return best || pick(moves);
  }

  /* Tip voor Sam: een goede zet (zonder gekke gokjes) */
  function hint(state) {
    const scored = rootScores(state, 2, true, 1500, 11);
    if (!scored.length) return null;
    scored.sort((a, b) => b.score - a.score);
    const top = scored[0].score;
    const good = scored.filter((s) => s.score >= top - 10);
    return good[Math.floor(Math.random() * good.length)].move;
  }

  return { chooseMove, hint, LEVELS, VAL, evaluateWhite };
})();

/* =========================================================
   Tactiek-hulpjes: losse stukken en vorken herkennen
   ========================================================= */
const Tactics = (() => {
  const V = AI.VAL;
  const val = (p) => (p[1] === 'K' ? 10000 : V[p[1]]);

  /* state: de ander is aan zet. Hoeveel kan de ander van mij winnen met één slag?
     Geeft { loss, sq, piece } terug (loss in centipionnen, 0 = alles veilig). */
  function loss(state) {
    const me = Chess.other(state.turn);
    let best = { loss: 0, sq: null, piece: null };
    for (const m of Chess.legalMoves(state)) {
      if (!m.captured || m.captured[0] !== me) continue;
      const after = Chess.makeMove(state, m);
      const defended = Chess.isAttacked(after.board, m.to, me);
      const gain = defended ? V[m.captured[1]] - val(m.piece) : V[m.captured[1]];
      if (gain > best.loss) best = { loss: gain, sq: m.to, piece: m.captured };
    }
    return best;
  }

  /* Hoeveel belangrijke stukken (koning of minstens een paard waard) valt het stuk op sq aan? */
  function targets(state, sq) {
    const p = state.board[sq];
    if (!p) return [];
    const s = { ...state, turn: p[0], ep: null };
    return Chess.pseudoMoves(s, sq)
      .filter((m) => m.captured && m.captured[0] !== p[0] && (m.captured[1] === 'K' || V[m.captured[1]] >= 300))
      .map((m) => m.to);
  }

  return { loss, targets };
})();
