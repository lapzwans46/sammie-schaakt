/* Puzzelcontrole: zie puzzelcontrole.html. Gebruikt dezelfde regels als de app (GOALS in app.js). */
(() => {
  const san = (m) => m.piece[1] + Chess.sqName(m.from) + (m.captured ? 'x' : '-') + Chess.sqName(m.to);
  const MULTI_OK = ['to']; // uitleg-opdrachten ('zet een paard naar het midden'): meer goede zetten mag

  function problemsWithPosition(st) {
    const s = Chess.fromFEN(st.fen);
    const p = [];
    for (const c of ['w', 'b']) {
      const kings = s.board.filter((x) => x === c + 'K').length;
      if (kings !== 1) p.push(`${kings} ${c === 'w' ? 'witte' : 'zwarte'} koningen`);
    }
    if (p.length) return p;
    if (s.turn !== 'w') p.push('zwart is aan zet');
    if (Chess.inCheck(s, 'b')) p.push('zwart staat al schaak (je kunt de koning slaan)');
    if (st.goal !== 'escape' && Chess.inCheck(s, 'w')) p.push('wit staat schaak');
    if (st.goal === 'escape' && !Chess.inCheck(s, 'w')) p.push('wit staat niet schaak');
    for (let i = 0; i < 8; i++) {
      if ((s.board[i] || '')[1] === 'P' || (s.board[56 + i] || '')[1] === 'P') p.push('pion op de eerste of laatste rij');
    }
    return p;
  }

  function checkGoal(st) {
    const bad = problemsWithPosition(st);
    if (bad.length) return { ok: false, msg: 'Ongeldig: ' + bad.join(', ') };
    const s = Chess.fromFEN(st.fen);
    const g = GOALS[st.goal];
    if (st.goal === 'stopmate' && !blackMatesIn1({ ...s, turn: 'b', ep: null })) return { ok: false, msg: 'Er is geen matdreiging van zwart' };
    if (!g) return { ok: false, msg: `Onbekend doel '${st.goal}'` };
    const sols = qMoves(Chess.legalMoves(s)).filter((m) => g.ok(Chess.makeMove(s, m), m, st));
    const list = sols.map(san).join(' ');
    if (!sols.length) return { ok: false, msg: 'Geen oplossing!' };
    if (sols.length > 1 && !MULTI_OK.includes(st.goal)) return { ok: false, msg: `${sols.length} oplossingen: ${list}` };
    return { ok: true, msg: (sols.length > 1 ? `${sols.length} goede zetten (mag hier): ` : 'Eén oplossing: ') + list };
  }

  /* Vooruit denken (goal 'plan', of een filmpje met demoWin):
     - bij ELKE zet van wit is er precies één goede zet, en dat is de zet uit de oplossing
       (een goede zet = wint, wat zwart daarna ook doet);
     - wit is niet eerder klaar dan bedoeld;
     - de zet van zwart is een geldige zet, en zwart verliest daarmee niet sneller;
     - bij een pak-opdracht staat het stuk na het pakken veilig;
     - ALLE SCENARIO'S: ook als zwart iets anders terugzet dan in de oplossing,
       heeft wit op elk moment precies één goede zet. */
  function firstDual(s, k, win, path) {
    const sols = Plan.solutions(s, k, win);
    if (sols.length !== 1) return `${path.join(' ') || 'begin'}: ${sols.length} goede zetten (${sols.map(Plan.moveStr).join(' ') || 'geen'})`;
    const m = sols[0];
    if (Plan.wins(s, m, win)) return null;
    const s2 = Chess.makeMove(s, m);
    for (const r of qMoves(Chess.legalMoves(s2))) {
      const d = firstDual(Chess.makeMove(s2, r), k - 1, win, path.concat(Plan.moveStr(m), Plan.moveStr(r)));
      if (d) return d;
    }
    return null;
  }
  function checkPlan(fen, line, win, say) {
    const bad = problemsWithPosition({ fen, goal: 'plan' });
    if (bad.length) return { ok: false, msg: 'Ongeldig: ' + bad.join(', ') };
    if (!line || line.length % 2 !== 1) return { ok: false, msg: 'line moet wit-zwart-wit... zijn (oneven aantal)' };
    const n = (line.length + 1) / 2;
    if (say && say.length < n - 1) return { ok: false, msg: `say heeft ${say.length} zinnen, nodig: ${n - 1}` };
    let s = Chess.fromFEN(fen);
    for (let k = 0; k < n; k++) {
      const left = n - k;
      const sols = Plan.solutions(s, left, win);
      const names = sols.map(Plan.moveStr).join(' ');
      if (sols.length !== 1) return { ok: false, msg: `zet ${k + 1}: ${sols.length} goede zetten (${names || 'geen'})` };
      if (Plan.moveStr(sols[0]) !== line[2 * k]) return { ok: false, msg: `zet ${k + 1}: de goede zet is ${names}, niet ${line[2 * k]}` };
      const m = sols[0];
      if (left > 1 && Plan.wins(s, m, win)) return { ok: false, msg: `zet ${k + 1} is al meteen raak` };
      const s2 = Chess.makeMove(s, m);
      if (left === 1) {
        if (!Plan.wins(s, m, win)) return { ok: false, msg: 'laatste zet is niet raak' };
        if (win !== 'mate' && Chess.gameStatus(s2) !== 'checkmate' && Chess.isAttacked(s2.board, m.to, 'b')) return { ok: false, msg: 'na het pakken kan zwart terugpakken' };
        break;
      }
      const r = Plan.find(s2, line[2 * k + 1]);
      if (!r) return { ok: false, msg: `zwart kan ${line[2 * k + 1]} niet zetten` };
      s = Chess.makeMove(s2, r);
      if (left - 2 >= 1 && Plan.forced(s, left - 2, win)) return { ok: false, msg: `zwart ${line[2 * k + 1]} verliest sneller: kies een beter antwoord` };
    }
    const dual = firstDual(Chess.fromFEN(fen), n, win, []);
    if (dual) return { ok: false, msg: 'Als zwart anders speelt: ' + dual };
    return { ok: true, msg: 'Eén weg, ook als zwart anders speelt: ' + line.join(' ') };
  }

  function checkFree(st) {
    const s = st.fen ? Chess.fromFEN(st.fen) : Chess.fromPieces(st.pieces, 'w');
    const f = freeSolution(st.type, s, (st.stars || []).map(Chess.sqIndex));
    return f ? { ok: true, msg: 'Te doen' } : { ok: false, msg: 'Niet te doen!' };
  }

  const rows = [];
  LESSONS.forEach((l, li) => l.steps.forEach((st, si) => {
    let r = null;
    if (st.type === 'goal' && st.goal === 'plan') r = checkPlan(st.fen, st.line, st.win, st.say);
    else if (st.type === 'goal') r = checkGoal(st);
    else if (st.type === 'talk' && st.demoWin) r = checkPlan(st.fen, st.demo, st.demoWin, null);
    else if (st.type === 'stars' || st.type === 'capture') r = checkFree(st);
    if (r) rows.push({ where: `Les ${li + 1} (${l.title}), stap ${si + 1}`, kind: st.demoWin ? 'filmpje' : (st.goal === 'plan' ? `plan-${st.win}` : st.goal || st.type), text: st.text, ...r });
  }));
  PUZZLES.forEach((p, i) => rows.push({
    where: `Puzzel ${i + 1} (niveau ${p.level || 1})`, kind: p.goal === 'plan' ? `plan-${p.win}` : p.goal, text: p.text,
    ...(p.goal === 'plan' ? checkPlan(p.fen, p.line, p.win, p.say) : checkGoal(p)),
  }));

  const fout = rows.filter((r) => !r.ok);
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  document.getElementById('rows').innerHTML = rows.map((r) =>
    `<tr class="${r.ok ? '' : 'bad'}"><td>${esc(r.where)}</td><td>${esc(r.kind)}</td><td>${r.ok ? '✅' : '❌'} <code>${esc(r.msg)}</code></td><td>${esc(r.text)}</td></tr>`).join('');
  const sum = document.getElementById('sum');
  sum.textContent = fout.length ? `❌ ${fout.length} van ${rows.length} opdrachten kloppen niet` : `✅ Alle ${rows.length} opdrachten kloppen`;
  sum.className = 'sum ' + (fout.length ? 'bad' : 'ok');
  document.title = fout.length ? 'FOUT' : 'OK';
  // platte tekst, handig voor een automatische controle (headless browser)
  const pre = document.getElementById('tekst');
  pre.textContent = [sum.textContent].concat(fout.map((r) => `FOUT ${r.where} [${r.kind}] ${r.msg}`)).join('\n');
})();
