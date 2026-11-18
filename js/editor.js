/* =========================================================
   Sammie Schaakt! - poppetjesmaker
   AvatarEditor({ title, person: {name, look, level?}, canRename, showLevel,
                  onSave(person), onCancel(), onReset(), onDelete() })
   ========================================================= */
const EDIT_OPTIONS = {
  hairStyles: [
    ['short', 'Kort'], ['spiky', 'Piekjes'], ['curly', 'Krullen'], ['long', 'Lang'], ['bob', 'Bob'],
    ['ponytail', 'Staart'], ['pigtails', 'Staartjes'], ['bun', 'Knot'], ['bald', 'Kaal'],
  ],
  hair: ['#2b2b2b', '#4a2f1b', '#6b3e26', '#8a5a2b', '#a5522b', '#e2793a', '#c9a15a', '#f2c94c', '#e4e4e4', '#cfcfd8', '#ff5d8f', '#4a9df8'],
  skin: ['#fde3cf', '#f7d3b5', '#f0c7a2', '#e0ac80', '#c68b5e', '#a86b43', '#8a5233', '#5e3820'],
  shirt: ['#ff7a45', '#e63946', '#ef476f', '#ff70a6', '#9b5de5', '#4361ee', '#118ab2', '#2ec4b6', '#3f8f5a', '#2d6a4f', '#ffcf33', '#264653'],
  extras: [
    ['glasses', 'Bril'], ['mustache', 'Snor'], ['beard', 'Baard'], ['freckles', 'Sproetjes'],
    ['bow', 'Strikje'], ['earrings', 'Oorbellen'], ['necklace', 'Ketting'], ['collar', 'Kraagje'],
  ],
};

/* Korte uitleg per niveau (voor ouders) */
const LEVEL_TEXT = {
  1: 'zet bijna altijd zomaar wat',
  2: 'zet vaak zomaar wat',
  3: 'pakt heel soms iets',
  4: 'pakt soms een los stuk',
  5: 'pakt vaker een los stuk',
  6: 'let een beetje op',
  7: 'let wat beter op',
  8: 'let goed op',
  9: 'let heel goed op',
  10: 'maakt weinig foutjes',
  11: 'de sterkste, maar te verslaan',
};

/* Alleen gewone tekens in namen, zodat er niks geks op het scherm komt */
const cleanName = (t) => (t || '').replace(/[<>"'&`\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);

function AvatarEditor(opts) {
  const p = JSON.parse(JSON.stringify(opts.person));
  p.look = p.look || {};
  delete p.photo;
  let mood = 'happy';

  app.innerHTML = `
  <div class="screen editor">
    <div class="topbar">
      <button class="round-btn" id="back" aria-label="Terug">←</button>
      <div class="title">${opts.title}</div>
      <div class="spacer"></div>
    </div>
    <div class="editor-body">
      <div class="editor-preview card">
        <div class="ed-avatar" id="edAvatar"></div>
        <div class="ed-moods" id="edMoods"></div>
        ${opts.canRename ? `<label class="ed-name">Naam <input class="text-input" id="edName" maxlength="16" value="${p.name}"></label>` : `<div class="ed-title">${p.name}</div>`}
        <div class="ed-buttons">
          <button class="btn green" id="edSave">Opslaan ✓</button>
          ${opts.onReset ? '<button class="btn grey" id="edReset">Standaard terugzetten</button>' : ''}
          ${opts.onDelete ? '<button class="btn red" id="edDelete">Weghalen</button>' : ''}
        </div>
      </div>
      <div class="editor-controls card" id="edPanel"></div>
    </div>
  </div>`;

  const preview = () => { $('#edAvatar').innerHTML = Avatars.svg(p.look, mood); };
  $('#edMoods').innerHTML = ['happy', 'laugh', 'surprised', 'sad', 'thinking', 'wink']
    .map((m) => `<button class="mood-btn" data-m="${m}">${Avatars.svg(p.look, m)}</button>`).join('');
  const refreshMoods = () => app.querySelectorAll('.mood-btn').forEach((b) => { b.innerHTML = Avatars.svg(p.look, b.dataset.m); });
  app.querySelectorAll('.mood-btn').forEach((b) => { b.onclick = () => { mood = b.dataset.m; preview(); }; });

  const swatches = (key, colors) => `<div class="swatches">${colors.map((c) =>
    `<button class="swatch ${p.look[key] === c ? 'on' : ''}" data-k="${key}" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>`;

  function panel() {
    const L = p.look;
    const stars = (lv) => '★'.repeat(Math.min(5, Math.ceil((lv * 5) / 11)));
    $('#edPanel').innerHTML = `
      ${opts.showLevel ? `
        <h4>Hoe goed speelt ${p.name || 'deze tegenstander'}?</h4>
        <div class="level-grid">${Object.keys(AI.LEVELS).map((lv) => `
          <button class="level-btn ${+lv === p.level ? 'on' : ''}" data-lv="${lv}">
            <b>${lv}</b><span class="lv-stars">${stars(+lv)}</span><small>${LEVEL_TEXT[lv]}</small>
          </button>`).join('')}</div>` : ''}
      <h4>Kapsel</h4>
      <div class="hair-grid">${EDIT_OPTIONS.hairStyles.map(([k, label]) => `
        <button class="hair-btn ${L.hairStyle === k ? 'on' : ''}" data-h="${k}">
          ${Avatars.svg({ ...L, hairStyle: k, beard: false, mustache: false }, 'happy')}<span>${label}</span></button>`).join('')}</div>
      <h4>Haarkleur</h4>${swatches('hair', EDIT_OPTIONS.hair)}
      <h4>Huidskleur</h4>${swatches('skin', EDIT_OPTIONS.skin)}
      <h4>Shirt</h4>${swatches('shirt', EDIT_OPTIONS.shirt)}
      <h4>Extra's</h4>
      <div class="chips">${EDIT_OPTIONS.extras.map(([k, label]) =>
        `<button class="chip ${L[k] ? 'on' : ''}" data-x="${k}">${label}</button>`).join('')}</div>`;
    const P = $('#edPanel');
    P.querySelectorAll('.level-btn').forEach((b) => { b.onclick = () => { p.level = +b.dataset.lv; changed(); }; });
    P.querySelectorAll('.hair-btn').forEach((b) => { b.onclick = () => { L.hairStyle = b.dataset.h; changed(); }; });
    P.querySelectorAll('.swatch').forEach((b) => {
      b.onclick = () => {
        L[b.dataset.k] = b.dataset.c;
        if (b.dataset.k === 'hair') { L.beardColor = b.dataset.c; L.mustacheColor = b.dataset.c; }
        changed();
      };
    });
    P.querySelectorAll('.chip').forEach((b) => { b.onclick = () => { L[b.dataset.x] = !L[b.dataset.x]; changed(); }; });
  }

  function changed() {
    Sound.play('tap');
    const y = window.scrollY;
    preview();
    refreshMoods();
    panel();
    window.scrollTo(0, y);
  }

  $('#back').onclick = () => opts.onCancel();
  $('#edSave').onclick = () => {
    if (opts.canRename) p.name = cleanName($('#edName').value) || opts.person.name;
    Sound.play('good');
    opts.onSave(p);
  };
  if ($('#edName')) $('#edName').oninput = (e) => { p.name = e.target.value; };
  if ($('#edReset')) $('#edReset').onclick = () => ask('Terugzetten naar het standaard-poppetje?', () => opts.onReset());
  if ($('#edDelete')) $('#edDelete').onclick = () => ask(`${p.name} weghalen?`, () => opts.onDelete(), 'Ja, weghalen', 'Nee');

  preview();
  panel();
}
