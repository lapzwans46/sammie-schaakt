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
      sq.addEventListener('pointerdown', (e) => { e.preventDefault(); onTap(i); });
      this.el.appendChild(sq);
      this.squares.push({ sq, holder, piece: undefined, deco: '' });
    }
    container.appendChild(this.el);
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
    if (opts.animate) this.animate(opts.animate.from, opts.animate.to);
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
