/* =========================================================
   Sammie Schaakt! - vrolijke schaakstukken (SVG, met oogjes)
   ========================================================= */
const Pieces = (() => {
  /* Kleurthema's voor de stukken. Wit blijft altijd licht en zwart altijd donker,
     zodat 'wit' en 'zwart' in de lessen blijven kloppen. */
  const THEMES = {
    paars: { name: 'Wit & paars', w: { fill: '#fffaf0', shade: '#f1dfbf', line: '#4a3b5c', eye: '#2b2233' }, b: { fill: '#4b3f6b', shade: '#372d52', line: '#1c1530', eye: '#1c1530' } },
    zwart: { name: 'Wit & zwart', w: { fill: '#ffffff', shade: '#e6e6e6', line: '#333333', eye: '#222222' }, b: { fill: '#3a3a3a', shade: '#262626', line: '#0d0d0d', eye: '#0d0d0d' } },
    hout: { name: 'Hout', w: { fill: '#fbe9c8', shade: '#ecd09c', line: '#5a3b1c', eye: '#2b1d0e' }, b: { fill: '#7a4a24', shade: '#5c3519', line: '#2b170a', eye: '#2b170a' } },
    zee: { name: 'Wit & blauw', w: { fill: '#f4fbff', shade: '#d6ecfa', line: '#1f3d66', eye: '#13253f' }, b: { fill: '#2d4f8f', shade: '#223c6e', line: '#0e1d3a', eye: '#0e1d3a' } },
    rood: { name: 'Wit & rood', w: { fill: '#fff8f2', shade: '#f6dccb', line: '#5e2a2a', eye: '#2b1515' }, b: { fill: '#a8324a', shade: '#842538', line: '#3d0f19', eye: '#3d0f19' } },
  };
  let STYLE = THEMES.paars;

  const eyes = (x1, x2, y, s, big = false) => {
    const r = big ? 6 : 5;
    return [x1, x2].map((x) => `
      <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r + 1.5}" fill="#fff" stroke="${s.line}" stroke-width="1.5"/>
      <ellipse cx="${x + 0.8}" cy="${y + 1}" rx="${r - 2.4}" ry="${r - 1.6}" fill="${s.eye}"/>
      <circle cx="${x + 2}" cy="${y - 1}" r="1.3" fill="#fff"/>`).join('');
  };
  const base = (s) => `<rect x="18" y="80" width="64" height="13" rx="6" fill="${s.shade}" stroke="${s.line}" stroke-width="4"/>`;
  const sw = (s) => `stroke="${s.line}" stroke-width="4" stroke-linejoin="round"`;

  const DRAW = {
    P: (s) => `
      <path d="M33 80 Q36 60 44 54 L56 54 Q64 60 67 80 Z" fill="${s.fill}" ${sw(s)}/>
      ${base(s)}
      <circle cx="50" cy="38" r="18" fill="${s.fill}" ${sw(s)}/>
      ${eyes(43, 57, 37, s)}`,
    R: (s) => `
      <path d="M28 80 L32 44 L68 44 L72 80 Z" fill="${s.fill}" ${sw(s)}/>
      ${base(s)}
      <path d="M23 44 L23 16 L35 16 L35 25 L44 25 L44 16 L56 16 L56 25 L65 25 L65 16 L77 16 L77 44 Z" fill="${s.fill}" ${sw(s)}/>
      ${eyes(43, 57, 59, s)}`,
    B: (s) => `
      <path d="M33 80 Q36 66 42 62 L58 62 Q64 66 67 80 Z" fill="${s.fill}" ${sw(s)}/>
      ${base(s)}
      <path d="M50 17 C33 29 29 46 38 60 L62 60 C71 46 67 29 50 17 Z" fill="${s.fill}" ${sw(s)}/>
      <circle cx="50" cy="13" r="6" fill="${s.fill}" ${sw(s)}/>
      <path d="M58 27 L50 38" stroke="${s.line}" stroke-width="4" stroke-linecap="round"/>
      ${eyes(43, 57, 47, s)}`,
    Q: (s) => `
      <path d="M30 80 L36 54 L64 54 L70 80 Z" fill="${s.fill}" ${sw(s)}/>
      ${base(s)}
      <path d="M26 54 L21 24 L36 39 L42 17 L50 35 L58 17 L64 39 L79 24 L74 54 Z" fill="${s.fill}" ${sw(s)}/>
      <circle cx="21" cy="21" r="5" fill="#ffd34d" stroke="${s.line}" stroke-width="3"/>
      <circle cx="42" cy="14" r="5" fill="#ffd34d" stroke="${s.line}" stroke-width="3"/>
      <circle cx="58" cy="14" r="5" fill="#ffd34d" stroke="${s.line}" stroke-width="3"/>
      <circle cx="79" cy="21" r="5" fill="#ffd34d" stroke="${s.line}" stroke-width="3"/>
      ${eyes(43, 57, 66, s)}`,
    K: (s) => `
      <path d="M30 80 L35 52 L65 52 L70 80 Z" fill="${s.fill}" ${sw(s)}/>
      ${base(s)}
      <rect x="45" y="6" width="10" height="24" rx="3" fill="#ffd34d" stroke="${s.line}" stroke-width="3.5"/>
      <rect x="39" y="12" width="22" height="9" rx="3" fill="#ffd34d" stroke="${s.line}" stroke-width="3.5"/>
      <path d="M27 52 Q22 31 37 29 Q46 29 50 37 Q54 29 63 29 Q78 31 73 52 Z" fill="${s.fill}" ${sw(s)}/>
      ${eyes(43, 57, 64, s)}`,
  };

  DRAW.N = (s) => `
      ${base(s)}
      <path d="M31 80 C33 70 37 64 42 60 C34 61 26 61 21 57 C15 53 16 45 21 41 C27 36 31 32 35 28 L39 13 L48 22 C61 23 74 34 75 54 C76 66 73 74 71 80 Z" fill="${s.fill}" ${sw(s)}/>
      <path d="M50 24 C62 27 69 36 71 50" fill="none" stroke="${s.shade}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="23" cy="48" r="2.4" fill="${s.line}"/>
      <ellipse cx="39" cy="37" rx="6" ry="7.5" fill="#fff" stroke="${s.line}" stroke-width="1.5"/>
      <ellipse cx="38" cy="38" rx="3.6" ry="4.4" fill="${s.eye}"/>
      <circle cx="39.5" cy="36" r="1.4" fill="#fff"/>`;

  let cache = {};
  function setTheme(name) {
    STYLE = THEMES[name] || THEMES.paars;
    cache = {};
  }
  function svg(piece) {
    if (!cache[piece]) {
      const s = STYLE[piece[0]];
      cache[piece] = `<svg viewBox="0 0 100 100" class="piece-svg" aria-hidden="true">${DRAW[piece[1]](s)}</svg>`;
    }
    return cache[piece];
  }

  const NAMES = { P: 'pion', N: 'paard', B: 'loper', R: 'toren', Q: 'koningin', K: 'koning' };
  return { svg, NAMES, THEMES, setTheme };
})();
