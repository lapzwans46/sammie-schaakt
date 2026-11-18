/* =========================================================
   Sammie Schaakt! - schaakregels
   Bord: array van 64 vakjes. Index 0 = a8 (linksboven), 63 = h1.
   Stuk: string van 2 tekens, kleur + soort, bv. 'wK', 'bP'.
   ========================================================= */
const Chess = (() => {
  const FILES = 'abcdefgh';

  const sqName = (i) => FILES[i % 8] + (8 - Math.floor(i / 8));
  const sqIndex = (n) => (8 - parseInt(n[1], 10)) * 8 + FILES.indexOf(n[0]);
  const row = (i) => Math.floor(i / 8);
  const col = (i) => i % 8;
  const other = (c) => (c === 'w' ? 'b' : 'w');

  const KNIGHT = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  const KING = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const ROOK = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const BISHOP = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  /* Regels die aan of uit kunnen. En passant staat uit: te ingewikkeld voor nu. */
  const RULES = { enPassant: false };

  function fromFEN(fen) {
    const [placement, turn, castle, ep, half, full] = fen.trim().split(/\s+/);
    const board = new Array(64).fill(null);
    let i = 0;
    for (const ch of placement) {
      if (ch === '/') continue;
      if (/\d/.test(ch)) { i += parseInt(ch, 10); continue; }
      const color = ch === ch.toUpperCase() ? 'w' : 'b';
      board[i++] = color + ch.toUpperCase();
    }
    const c = castle || '-';
    return {
      board,
      turn: turn || 'w',
      castling: { wK: c.includes('K'), wQ: c.includes('Q'), bK: c.includes('k'), bQ: c.includes('q') },
      ep: ep && ep !== '-' ? sqIndex(ep) : null,
      half: parseInt(half || '0', 10),
      full: parseInt(full || '1', 10),
    };
  }

  /* Maak een stelling van losse stukken, bv. { d4: 'wR', e8: 'bK' } */
  function fromPieces(pieces, turn = 'w') {
    const board = new Array(64).fill(null);
    for (const [sq, p] of Object.entries(pieces)) board[sqIndex(sq)] = p;
    return { board, turn, castling: { wK: false, wQ: false, bK: false, bQ: false }, ep: null, half: 0, full: 1 };
  }

  function positionKey(s) {
    const c = s.castling;
    return s.board.map((p) => p || '..').join('') + s.turn +
      (c.wK ? 'K' : '') + (c.wQ ? 'Q' : '') + (c.bK ? 'k' : '') + (c.bQ ? 'q' : '') + (s.ep ?? '-');
  }

  function findKing(board, color) {
    const k = color + 'K';
    for (let i = 0; i < 64; i++) if (board[i] === k) return i;
    return -1;
  }

  function isAttacked(board, sq, by) {
    const r = row(sq), c = col(sq);
    // pion
    const pr = by === 'w' ? r + 1 : r - 1;
    if (pr >= 0 && pr < 8) {
      for (const dc of [-1, 1]) {
        const cc = c + dc;
        if (cc >= 0 && cc < 8 && board[pr * 8 + cc] === by + 'P') return true;
      }
    }
    for (const [dr, dc] of KNIGHT) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr * 8 + cc] === by + 'N') return true;
    }
    for (const [dr, dc] of KING) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr * 8 + cc] === by + 'K') return true;
    }
    for (const [dirs, types] of [[ROOK, 'RQ'], [BISHOP, 'BQ']]) {
      for (const [dr, dc] of dirs) {
        let rr = r + dr, cc = c + dc;
        while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
          const p = board[rr * 8 + cc];
          if (p) {
            if (p[0] === by && types.includes(p[1])) return true;
            break;
          }
          rr += dr; cc += dc;
        }
      }
    }
    return false;
  }

  function inCheck(state, color) {
    const k = findKing(state.board, color);
    return k >= 0 && isAttacked(state.board, k, other(color));
  }

  function pseudoMoves(state, onlyFrom = null) {
    const { board, turn } = state;
    const moves = [];
    const enemy = other(turn);
    const add = (from, to, extra = {}) =>
      moves.push({ from, to, piece: board[from], captured: board[to], ...extra });

    for (let from = 0; from < 64; from++) {
      if (onlyFrom !== null && from !== onlyFrom) continue;
      const p = board[from];
      if (!p || p[0] !== turn) continue;
      const t = p[1], r = row(from), c = col(from);

      if (t === 'P') {
        const dir = turn === 'w' ? -1 : 1;
        const startRow = turn === 'w' ? 6 : 1;
        const promoRow = turn === 'w' ? 0 : 7;
        const r1 = r + dir;
        const pushPawn = (to, extra = {}) => {
          if (row(to) === promoRow) {
            for (const promo of ['Q', 'R', 'B', 'N']) add(from, to, { ...extra, promo });
          } else add(from, to, extra);
        };
        if (r1 >= 0 && r1 < 8) {
          const one = r1 * 8 + c;
          if (!board[one]) {
            pushPawn(one);
            const two = (r + 2 * dir) * 8 + c;
            if (r === startRow && !board[two]) add(from, two, { flag: 'double' });
          }
          for (const dc of [-1, 1]) {
            const cc = c + dc;
            if (cc < 0 || cc > 7) continue;
            const to = r1 * 8 + cc;
            if (board[to] && board[to][0] === enemy) pushPawn(to);
            else if (RULES.enPassant && state.ep === to) add(from, to, { flag: 'ep', captured: enemy + 'P' });
          }
        }
      } else if (t === 'N' || t === 'K') {
        for (const [dr, dc] of t === 'N' ? KNIGHT : KING) {
          const rr = r + dr, cc = c + dc;
          if (rr < 0 || rr > 7 || cc < 0 || cc > 7) continue;
          const to = rr * 8 + cc;
          if (!board[to] || board[to][0] === enemy) add(from, to);
        }
        if (t === 'K') {
          const homeRow = turn === 'w' ? 7 : 0;
          const kSq = homeRow * 8 + 4;
          if (from === kSq && !isAttacked(board, kSq, enemy)) {
            const cr = state.castling;
            if (cr[turn + 'K'] && board[kSq + 3] === turn + 'R' && !board[kSq + 1] && !board[kSq + 2] &&
                !isAttacked(board, kSq + 1, enemy) && !isAttacked(board, kSq + 2, enemy)) {
              add(from, kSq + 2, { flag: 'castleK' });
            }
            if (cr[turn + 'Q'] && board[kSq - 4] === turn + 'R' && !board[kSq - 1] && !board[kSq - 2] && !board[kSq - 3] &&
                !isAttacked(board, kSq - 1, enemy) && !isAttacked(board, kSq - 2, enemy)) {
              add(from, kSq - 2, { flag: 'castleQ' });
            }
          }
        }
      } else {
        const dirs = t === 'R' ? ROOK : t === 'B' ? BISHOP : ROOK.concat(BISHOP);
        for (const [dr, dc] of dirs) {
          let rr = r + dr, cc = c + dc;
          while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
            const to = rr * 8 + cc;
            if (board[to]) {
              if (board[to][0] === enemy) add(from, to);
              break;
            }
            add(from, to);
            rr += dr; cc += dc;
          }
        }
      }
    }
    return moves;
  }

  function makeMove(state, m) {
    const board = state.board.slice();
    const turn = state.turn;
    const castling = { ...state.castling };
    board[m.to] = m.promo ? turn + m.promo : board[m.from];
    board[m.from] = null;
    if (m.flag === 'ep') board[m.to + (turn === 'w' ? 8 : -8)] = null;
    if (m.flag === 'castleK') { board[m.to - 1] = board[m.to + 1]; board[m.to + 1] = null; }
    if (m.flag === 'castleQ') { board[m.to + 1] = board[m.to - 2]; board[m.to - 2] = null; }

    if (m.piece[1] === 'K') { castling[turn + 'K'] = false; castling[turn + 'Q'] = false; }
    for (const sq of [m.from, m.to]) {
      if (sq === 63) castling.wK = false;
      if (sq === 56) castling.wQ = false;
      if (sq === 7) castling.bK = false;
      if (sq === 0) castling.bQ = false;
    }
    return {
      board,
      turn: other(turn),
      castling,
      ep: m.flag === 'double' ? (m.from + m.to) / 2 : null,
      half: m.piece[1] === 'P' || m.captured ? 0 : state.half + 1,
      full: state.full + (turn === 'b' ? 1 : 0),
    };
  }

  /* Alle echte zetten (je eigen koning mag niet schaak blijven staan).
     Zonder koning op het bord (lesjes) wordt dat overgeslagen. */
  function legalMoves(state, onlyFrom = null) {
    const turn = state.turn;
    const hasKing = findKing(state.board, turn) >= 0;
    const moves = pseudoMoves(state, onlyFrom);
    if (!hasKing) return moves;
    return moves.filter((m) => !inCheck(makeMove(state, m), turn));
  }

  function insufficientMaterial(board) {
    const minors = [];
    for (const p of board) {
      if (!p || p[1] === 'K') continue;
      if (p[1] === 'B' || p[1] === 'N') minors.push(p);
      else return false;
    }
    return minors.length <= 1;
  }

  /* Uitslag: 'checkmate' | 'stalemate' | 'material' | 'fifty' | 'repetition' | null */
  function gameStatus(state, history = []) {
    const moves = legalMoves(state);
    if (moves.length === 0) return inCheck(state, state.turn) ? 'checkmate' : 'stalemate';
    if (insufficientMaterial(state.board)) return 'material';
    if (state.half >= 100) return 'fifty';
    const key = positionKey(state);
    if (history.filter((k) => k === key).length >= 3) return 'repetition';
    return null;
  }

  function perft(state, depth) {
    if (depth === 0) return 1;
    let n = 0;
    for (const m of legalMoves(state)) n += perft(makeMove(state, m), depth - 1);
    return n;
  }

  return {
    START_FEN, RULES, FILES, sqName, sqIndex, row, col, other,
    fromFEN, fromPieces, positionKey, findKing, isAttacked, inCheck,
    pseudoMoves, legalMoves, makeMove, gameStatus, perft,
  };
})();
