/* =========================================================
   Sammie Schaakt! - cartoon-poppetjes (Mii-stijl, getekend in SVG)
   Een poppetje wordt gemaakt uit een 'look' (zie family.js).
   Gezichten: happy, laugh, surprised, sad, thinking, wink
   ========================================================= */
const Avatars = (() => {
  function darken(hex, f = 0.82) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return `rgb(${r},${g},${b})`;
  }

  const OUT = '#3a2c40';

  function hairBack(look) {
    const h = look.hair;
    switch (look.hairStyle) {
      case 'bun':
        return `<circle cx="100" cy="30" r="24" fill="${h}" stroke="${darken(h)}" stroke-width="3"/>`;
      case 'long':
        return `<path d="M34 100 Q30 40 100 32 Q170 40 166 100 L170 168 Q140 176 132 150 L68 150 Q60 176 30 168 Z" fill="${h}" stroke="${darken(h)}" stroke-width="3"/>`;
      case 'bob':
        return `<path d="M30 134 Q24 40 100 32 Q176 40 170 134 Q156 146 144 132 L56 132 Q44 146 30 134 Z" fill="${h}" stroke="${darken(h)}" stroke-width="3"/>`;
      case 'ponytail':
        return `<path d="M150 70 Q196 80 186 150 Q182 176 166 184 Q176 150 160 112 Z" fill="${h}" stroke="${darken(h)}" stroke-width="3"/>`;
      case 'pigtails':
        return `<ellipse cx="26" cy="118" rx="17" ry="30" fill="${h}" stroke="${darken(h)}" stroke-width="3" transform="rotate(18 26 118)"/>
                <ellipse cx="174" cy="118" rx="17" ry="30" fill="${h}" stroke="${darken(h)}" stroke-width="3" transform="rotate(-18 174 118)"/>`;
      default:
        return '';
    }
  }

  function hairFront(look) {
    const h = look.hair, d = darken(h);
    switch (look.hairStyle) {
      case 'bald':
        return `
          <ellipse cx="42" cy="82" rx="13" ry="22" fill="${h}" stroke="${d}" stroke-width="3"/>
          <ellipse cx="158" cy="82" rx="13" ry="22" fill="${h}" stroke="${d}" stroke-width="3"/>
          <path d="M92 36 Q100 26 108 34" fill="none" stroke="${h}" stroke-width="5" stroke-linecap="round"/>`;
      case 'bun': {
        let curls = '';
        for (let a = -168; a <= -12; a += 19.5) {
          const rad = (a * Math.PI) / 180;
          const x = 100 + 56 * Math.cos(rad), y = 95 + 56 * Math.sin(rad);
          curls += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="${h}" stroke="${d}" stroke-width="3"/>`;
        }
        // binnenkant opvullen zodat er geen gaatjes zijn
        return `<path d="M48 80 Q100 20 152 80 Q130 64 100 62 Q70 64 48 80 Z" fill="${h}"/>${curls}`;
      }
      case 'curly': {
        let curls = '';
        for (let a = -182; a <= 2; a += 15.3) {
          const rad = (a * Math.PI) / 180;
          const x = 100 + 58 * Math.cos(rad), y = 92 + 56 * Math.sin(rad);
          curls += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="${h}" stroke="${d}" stroke-width="3"/>`;
        }
        return `<path d="M44 86 Q100 10 156 86 Q130 66 100 64 Q70 66 44 86 Z" fill="${h}"/>${curls}`;
      }
      case 'short':
        return `<path d="M40 92 Q36 34 100 33 Q164 34 160 92 Q156 70 146 62 Q120 52 96 60 Q70 56 52 66 Q44 76 40 92 Z" fill="${h}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>`;
      case 'bob':
        return `<path d="M38 96 Q36 34 100 33 Q164 34 162 96 L154 70 Q100 62 46 70 Z" fill="${h}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>`;
      case 'ponytail':
        return `<path d="M40 94 Q36 34 100 33 Q164 34 160 94 Q154 66 132 58 Q96 52 70 64 Q50 72 40 94 Z" fill="${h}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
                <circle cx="160" cy="72" r="7" fill="${look.bowColor || '#ff5d8f'}" stroke="${OUT}" stroke-width="2.5"/>`;
      case 'pigtails':
        return `<path d="M40 94 Q36 34 100 33 Q164 34 160 94 Q150 66 124 60 L100 70 L76 60 Q50 66 40 94 Z" fill="${h}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
                <circle cx="40" cy="96" r="7" fill="${look.bowColor || '#ffd34d'}" stroke="${OUT}" stroke-width="2.5"/>
                <circle cx="160" cy="96" r="7" fill="${look.bowColor || '#ffd34d'}" stroke="${OUT}" stroke-width="2.5"/>`;
      case 'long':
        return `<path d="M38 96 Q36 34 100 34 Q164 34 162 96 Q150 66 118 60 Q112 70 100 64 Q76 62 52 72 Q42 82 38 96 Z" fill="${h}" stroke="${d}" stroke-width="3"/>`;
      case 'spiky':
      default:
        return `<path d="M38 94 Q34 34 100 32 Q166 34 162 94 Q156 68 136 60 L128 44 L116 58 Q104 50 92 58 L80 42 L72 62 Q50 68 38 94 Z" fill="${h}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>`;
    }
  }

  function eyes(look, mood) {
    const ec = look.eyes || '#2b2233';
    if (mood === 'laugh') {
      return `<path d="M68 100 Q78 88 88 100" fill="none" stroke="${ec}" stroke-width="5" stroke-linecap="round"/>
              <path d="M112 100 Q122 88 132 100" fill="none" stroke="${ec}" stroke-width="5" stroke-linecap="round"/>`;
    }
    const dy = mood === 'thinking' ? -4 : 0;
    const dx = mood === 'thinking' ? 3 : 0;
    const ry = mood === 'surprised' ? 12 : 10;
    const one = (x, wink) => wink
      ? `<path d="M${x - 10} 99 Q${x} 92 ${x + 10} 99" fill="none" stroke="${ec}" stroke-width="5" stroke-linecap="round"/>`
      : `<ellipse cx="${x + dx}" cy="${98 + dy}" rx="7.5" ry="${ry}" fill="${ec}"/>
         <circle cx="${x + dx + 2.5}" cy="${94 + dy}" r="2.8" fill="#fff"/>`;
    return one(78, false) + one(122, mood === 'wink');
  }

  function brows(look, mood) {
    const c = look.brows || darken(look.hair, 0.7);
    let l = 'M66 80 Q78 74 90 79', r = 'M110 79 Q122 74 134 80';
    if (mood === 'sad') { l = 'M66 78 Q78 78 90 72'; r = 'M110 72 Q122 78 134 78'; }
    if (mood === 'surprised') { l = 'M66 74 Q78 66 90 72'; r = 'M110 72 Q122 66 134 74'; }
    if (mood === 'thinking') { l = 'M66 80 Q78 78 90 80'; r = 'M110 72 Q122 64 134 72'; }
    return `<path d="${l}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
            <path d="${r}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
  }

  function mouth(mood) {
    switch (mood) {
      case 'surprised':
        return `<ellipse cx="100" cy="138" rx="8" ry="10" fill="#7a2335" stroke="${OUT}" stroke-width="3"/>`;
      case 'sad':
        return `<path d="M86 142 Q100 130 114 142" fill="none" stroke="${OUT}" stroke-width="4.5" stroke-linecap="round"/>`;
      case 'thinking':
        return `<path d="M88 138 Q100 136 112 132" fill="none" stroke="${OUT}" stroke-width="4.5" stroke-linecap="round"/>`;
      case 'laugh':
        return `<path d="M80 128 Q100 158 120 128 Z" fill="#7a2335" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>
                <path d="M90 142 Q100 136 110 142 Q100 152 90 142 Z" fill="#ef7b8b"/>`;
      default: // happy, wink
        return `<path d="M84 130 Q100 148 116 130" fill="none" stroke="${OUT}" stroke-width="4.5" stroke-linecap="round"/>`;
    }
  }

  function beard(look) {
    if (!look.beard) return '';
    const c = look.beardColor || look.hair;
    return `<path d="M46 104 Q48 170 100 172 Q152 170 154 104 Q146 128 124 132 Q100 124 76 132 Q54 128 46 104 Z" fill="${c}" stroke="${darken(c)}" stroke-width="3" stroke-linejoin="round"/>
            <path d="M84 133 Q100 128 116 133 Q100 139 84 133 Z" fill="${darken(c, 0.7)}" opacity=".35"/>`;
  }

  function extras(look) {
    let s = '';
    if (look.freckles) {
      for (const [x, y] of [[58, 114], [66, 120], [56, 124], [142, 114], [134, 120], [144, 124]]) {
        s += `<circle cx="${x}" cy="${y}" r="2.2" fill="#c47a4a" opacity=".7"/>`;
      }
    }
    if (look.bow) {
      const b = look.bowColor || '#ff5d8f';
      s += `<path d="M134 44 L116 32 L118 58 Z M134 44 L152 32 L150 58 Z" fill="${b}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="134" cy="45" r="6" fill="${b}" stroke="${OUT}" stroke-width="3"/>`;
    }
    if (look.mustache) {
      s += `<path d="M78 126 Q88 114 100 122 Q112 114 122 126 Q110 126 100 128 Q90 126 78 126 Z" fill="${look.mustacheColor || look.hair}" stroke="${darken(look.mustacheColor || look.hair)}" stroke-width="2.5"/>`;
    }
    if (look.glasses) {
      const g = look.glassesColor || '#5b4a8a';
      s += `<circle cx="78" cy="98" r="17" fill="rgba(255,255,255,.18)" stroke="${g}" stroke-width="4.5"/>
            <circle cx="122" cy="98" r="17" fill="rgba(255,255,255,.18)" stroke="${g}" stroke-width="4.5"/>
            <path d="M95 96 Q100 92 105 96" fill="none" stroke="${g}" stroke-width="4.5"/>
            <path d="M61 96 L44 92 M139 96 L156 92" stroke="${g}" stroke-width="4"/>`;
    }
    if (look.earrings) {
      s += `<circle cx="39" cy="118" r="5" fill="#ffd34d" stroke="${OUT}" stroke-width="2"/>
            <circle cx="161" cy="118" r="5" fill="#ffd34d" stroke="${OUT}" stroke-width="2"/>`;
    }
    return s;
  }

  function shirt(look) {
    const c = look.shirt || '#4a90e2';
    let deco = '';
    if (look.collar) {
      deco = `<path d="M82 172 L100 196 L118 172" fill="#fff" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`;
    }
    if (look.necklace) {
      deco += `<path d="M78 176 Q100 200 122 176" fill="none" stroke="#fff6c9" stroke-width="5" stroke-dasharray="1 8" stroke-linecap="round"/>`;
    }
    return `<path d="M22 222 Q26 176 100 170 Q174 176 178 222 Z" fill="${c}" stroke="${OUT}" stroke-width="4"/>${deco}`;
  }

  /* Maak het poppetje als SVG-string */
  function svg(look, mood = 'happy') {
    const skin = look.skin || '#f7d3b5';
    const sd = darken(skin, 0.88);
    return `<svg viewBox="0 0 200 220" class="avatar-svg" aria-hidden="true">
      ${hairBack(look)}
      ${shirt(look)}
      <rect x="86" y="148" width="28" height="28" rx="10" fill="${sd}"/>
      <circle cx="39" cy="102" r="13" fill="${skin}" stroke="${OUT}" stroke-width="4"/>
      <circle cx="161" cy="102" r="13" fill="${skin}" stroke="${OUT}" stroke-width="4"/>
      <ellipse cx="100" cy="98" rx="62" ry="64" fill="${skin}" stroke="${OUT}" stroke-width="4"/>
      <circle cx="64" cy="122" r="10" fill="#ff8fa3" opacity=".45"/>
      <circle cx="136" cy="122" r="10" fill="#ff8fa3" opacity=".45"/>
      ${hairFront(look)}
      ${brows(look, mood)}
      ${eyes(look, mood)}
      ${beard(look)}
      <ellipse cx="100" cy="114" rx="7" ry="5.5" fill="${sd}"/>
      ${mouth(mood)}
      ${extras(look)}
    </svg>`;
  }

  /* Een familielid of speler tonen */
  function html(person, mood = 'happy') {
    return svg(person.look, mood);
  }

  return { svg, html };
})();
