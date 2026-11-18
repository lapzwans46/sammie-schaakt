/* =========================================================
   Sammie Schaakt! - het bord op het scherm
   ========================================================= */
class BoardView {
  constructor(container, { onTap = () => {}, coords = true } = {}) {
    this.el = document.createElement('div');
    this.el.className = 'board';
    this.squares = [];
    for (let i = 0; i < 64; i++) {
      const sq = document.createElement('div');
      const r = Math.floor(i / 8), c = i % 8;
      sq.className = 'sq ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
      sq.dataset.i = i;
      if (coords && c === 0) sq.insertAdjacentHTML('beforeend', `<span class="coord rank">${8 - r}</span>`);
      if (coords && r === 7) sq.insertAdjacentHTML('beforeend', `<span class="coord file">${'abcdefgh'[c]}</span>`);
      const holder = document.createElement('div');
      holder.className = 'holder';
      sq.appendChild(holder);
      this.el.appendChild(sq);
      this.squares.push({ sq, holder, piece: undefined, deco: '' });
    }
    container.appendChild(this.el);

    /* Tikken én slepen: tik op een stuk en dan op een vakje,
       of sleep het stuk met je vinger naar het vakje. */
    this.onTap = onTap;
    this.drag = null;
    this.el.addEventListener('pointerdown', (e) => this.down(e));
    this.el.addEventListener('pointermove', (e) => this.move(e));
    this.el.addEventListener('pointerup', (e) => this.up(e));
    // iPad breekt een sleepbeweging soms af (systeemgebaar, lang drukken):
    // dan zetten we het stuk toch neer op de laatste plek van de vinger.
    this.el.addEventListener('pointercancel', () => this.finish());
    this.el.addEventListener('lostpointercapture', () => this.finish());
    this.el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /* Welk vakje ligt onder de vinger? Net naast het bord telt het dichtstbijzijnde randvakje
     (kinderen schieten vaak iets door). Ver naast het bord: geen vakje. */
  squareAt(x, y) {
    const r = this.el.getBoundingClientRect();
    const cell = r.width / 8;
    if (x < r.left - cell || y < r.top - cell || x > r.right + cell || y > r.bottom + cell) return null;
    const c = Math.min(7, Math.max(0, Math.floor(((x - r.left) / r.width) * 8)));
    const row = Math.min(7, Math.max(0, Math.floor(((y - r.top) / r.height) * 8)));
    return row * 8 + c;
  }

  down(e) {
    const sq = e.target.closest && e.target.closest('.sq');
    if (!sq) return;
    e.preventDefault();
    this.cancel();
    const i = +sq.dataset.i;
    this.onTap(i);
    const s = this.squares[i];
    const piece = s.holder.querySelector('.piece');
    if (piece && s.sq.classList.contains('selected')) {
      this.drag = { i, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, piece, moved: false };
      try { this.el.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    }
  }

  move(e) {
    const d = this.drag;
    if (!d) return;
    e.preventDefault();
    d.lx = e.clientX; d.ly = e.clientY;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 10) return;
    d.moved = true;
    d.piece.style.transition = 'none';
    d.piece.style.transform = `translate(${dx}px, ${dy}px) scale(1.15)`;
    d.piece.style.zIndex = 10;
  }

  up(e) {
    if (this.drag) { this.drag.lx = e.clientX; this.drag.ly = e.clientY; }
    this.finish();
  }

  /* Sleepbeweging afronden: stuk neerzetten op de laatste plek van de vinger */
  finish() {
    const d = this.drag;
    this.drag = null;
    if (!d || !d.moved) return;
    d.piece.style.transform = '';
    d.piece.style.zIndex = '';
    const t = this.squareAt(d.lx, d.ly);
    if (t !== null && t !== d.i) {
      this.dropped = true; // na slepen niet nog eens laten 'vliegen'
      this.onTap(t);
      this.dropped = false;
    }
  }

  cancel() {
    const d = this.drag;
    this.drag = null;
    if (d) { d.piece.style.transform = ''; d.piece.style.zIndex = ''; }
  }

  /* opts: selected, dests[], lastMove{from,to}, check, stars[], marks[], hint{from,to}, animate{from,to} */
  render(board, opts = {}) {
    const dests = new Set(opts.dests || []);
    const stars = new Set(opts.stars || []);
    const marks = new Set(opts.marks || []);
    for (let i = 0; i < 64; i++) {
      const s = this.squares[i];
      const p = board[i];
      const cls = [];
      if (opts.selected === i) cls.push('selected');
      if (opts.lastMove && (opts.lastMove.from === i || opts.lastMove.to === i)) cls.push('last');
      if (opts.check === i) cls.push('in-check');
      if (marks.has(i)) cls.push('marked');
      if (opts.hint && (opts.hint.from === i || opts.hint.to === i)) cls.push('hint');
      s.sq.classList.remove('selected', 'last', 'in-check', 'marked', 'hint');
      if (cls.length) s.sq.classList.add(...cls);

      let deco = '';
      if (stars.has(i) && !p) deco += '<div class="star">★</div>';
      if (stars.has(i) && p) deco += '<div class="star under">★</div>';
      if (dests.has(i)) deco += p ? '<div class="ring"></div>' : '<div class="dot"></div>';

      if (s.piece !== p || s.deco !== deco) {
        s.holder.innerHTML = deco + (p ? `<div class="piece">${Pieces.svg(p)}</div>` : '');
        s.piece = p;
        s.deco = deco;
      }
    }
    if (opts.animate && !this.dropped) this.animate(opts.animate.from, opts.animate.to);
  }

  animate(from, to) {
    const el = this.squares[to].holder.querySelector('.piece');
    if (!el) return;
    const dx = (from % 8) - (to % 8);
    const dy = Math.floor(from / 8) - Math.floor(to / 8);
    el.style.transition = 'none';
    el.style.transform = `translate(${dx * 100}%, ${dy * 100}%)`;
    el.style.zIndex = 5;
    el.getBoundingClientRect(); // forceer tekenen
    el.style.transition = 'transform .28s cubic-bezier(.3,1.3,.5,1)';
    el.style.transform = '';
    setTimeout(() => { el.style.zIndex = ''; }, 300);
  }

  shake(i) {
    const el = this.squares[i].holder.querySelector('.piece');
    if (!el) return;
    el.classList.remove('shake');
    el.getBoundingClientRect();
    el.classList.add('shake');
  }

  pop(i) {
    const s = this.squares[i].sq;
    const b = document.createElement('div');
    b.className = 'burst';
    b.textContent = '★';
    s.appendChild(b);
    setTimeout(() => b.remove(), 700);
  }
}
