/* =========================================================
   Sammie Schaakt! - voor ouders
   Instellingen, overzicht, familie aanpassen, spelers beheren.
   (Alleen te bereiken na de rekensom.)
   ========================================================= */

/* ---------- Instellingen (hub) ---------- */
function Settings() {
  const s = Store.data.settings;
  const me = Store.profile();
  app.innerHTML = `
  <div class="screen settings">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Voor ouders</div><div class="spacer"></div></div>
    <div class="settings-body">
      <section class="card player-head">
        <div class="ph-avatar">${Avatars.html(me, 'happy')}</div>
        <div><h3>${me.name}</h3><p class="small">Speelt nu. De instellingen hieronder gelden voor ${me.name}.</p></div>
      </section>
      <div class="hub">
        <button class="hub-btn" id="toOverview"><span>📊</span><b>Overzicht</b><small>Wat gaat goed, wat is lastig?</small></button>
        <button class="hub-btn" id="toFamily"><span>👪</span><b>Tegenstanders</b><small>Poppetjes, namen en niveaus. Of maak er zelf een!</small></button>
        <button class="hub-btn" id="toProfiles"><span>👤</span><b>Spelers</b><small>Kinderen toevoegen of aanpassen</small></button>
      </div>
      <section class="card">
        <h3>Spelen</h3>
        <label class="toggle"><input type="checkbox" id="sound" ${s.sound ? 'checked' : ''}> Geluidjes</label>
        <label class="toggle"><input type="checkbox" id="warn" ${s.warn ? 'checked' : ''}> Pas-op-hulp: waarschuwen als een stuk zomaar weggegeven wordt</label>
      </section>
      <section class="card">
        <h3>Opnieuw beginnen</h3>
        <p class="small">Wist alle voortgang van ${me.name} (sterren, prijzen, potjes). Het poppetje en de familie blijven.</p>
        <button class="btn red" id="reset">Voortgang van ${me.name} wissen</button>
      </section>
      <section class="card">
        <h3>Privacy</h3>
        <p class="small">Sammie Schaakt! werkt helemaal zonder internet. Alles wordt alleen op dit apparaat bewaard, in deze browser. Er wordt niks verstuurd.
        Let op: als je de browsergegevens wist, is de voortgang ook weg.</p>
      </section>
    </div>
  </div>`;
  $('#back').onclick = () => go(Home);
  $('#toOverview').onclick = () => go(Overview, Store.global.current);
  $('#toFamily').onclick = () => go(FamilyAdmin);
  $('#toProfiles').onclick = () => go(ProfilesAdmin);
  $('#sound').onchange = (e) => { s.sound = e.target.checked; Store.save(); applySettings(); };
  $('#warn').onchange = (e) => { s.warn = e.target.checked; Store.save(); };
  $('#reset').onclick = () => ask(`Echt alles van ${me.name} wissen? Alle sterren en bekers zijn dan weg.`, () => {
    Store.reset();
    applySettings();
    go(Settings);
  }, 'Ja, wissen', 'Nee');
}

/* ---------- Overzicht ---------- */
const SKILL_INFO = {
  stars: ['Stukken bewegen', 'Laat elk stuk nog eens lopen en vraag: waar mag hij heen?'],
  capture: ['Slaan', 'Oefen samen: welk stuk kun je nu slaan?'],
  quiz: ['Quizvragen', 'Praat samen over de regels, bijvoorbeeld wat elk stuk waard is.'],
  check: ['Schaak geven', 'Laat zien hoe elk stuk de koning kan aanvallen.'],
  escape: ['Koning redden', 'Drie manieren om schaak op te lossen: weglopen, ertussen zetten of slaan.'],
  mate: ['Schaakmat geven', 'Kijk bij mat-puzzels eerst: waar kan de koning nog heen?'],
  castle: ['Rokeren', 'Koning twee stapjes naar de toren, toren springt eroverheen.'],
  enpassant: ['En passant', 'Een lastige regel. Niet erg als die nog niet zit!'],
  hanging: ['Losse stukken zien', 'Vraag bij elk stuk van de ander: "Wie beschermt dit stuk?"'],
  safe: ['Eigen stukken redden', 'Vraag voor elke zet: "Kan de ander iets van mij pakken?"'],
  fork: ['Vork maken', 'Zoek samen vakjes waar het paard twee stukken tegelijk raakt.'],
  to: ['Goede openingszetten', 'Pionnen naar het midden, dan paarden en lopers eruit, dan rokeren.'],
};

function readProfileData(id) {
  if (id === Store.global.current) return Store.data;
  try { return JSON.parse(localStorage.getItem('sammieschaak-p-' + id) || 'null'); } catch (e) { return null; }
}

function Overview(pid) {
  const prof = Store.global.profiles.find((p) => p.id === pid) || Store.profile();
  const d = readProfileData(prof.id) || {};
  const stats = d.stats || { skills: {}, lessons: {}, games: [], warn: { shown: 0, ignored: 0, pieces: {} } };
  const lessons = d.lessons || {};
  const games = stats.games || [];
  const played = games.filter((g) => !g.together);
  const won = played.filter((g) => g.result === 'win').length;
  const dailyCount = ((d.daily || {}).days || []).length;

  // vaardigheden in lesvolgorde
  const order = ['stars', 'capture', 'quiz', 'check', 'escape', 'mate', 'castle', 'enpassant', 'hanging', 'safe', 'fork', 'to'];
  const skills = order.filter((k) => stats.skills[k] && stats.skills[k].n > 0)
    .map((k) => ({ k, n: stats.skills[k].n, first: stats.skills[k].first, rate: stats.skills[k].first / stats.skills[k].n }));
  const weakest = skills.filter((x) => x.n >= 3 && x.k !== 'stars').sort((a, b) => a.rate - b.rate).slice(0, 2).filter((x) => x.rate < 0.75);

  const hardLessons = Object.entries(stats.lessons || {})
    .map(([id, v]) => ({ l: LESSONS.find((x) => x.id === id), wrong: v.wrong }))
    .filter((x) => x.l && x.wrong > 0).sort((a, b) => b.wrong - a.wrong).slice(0, 3);

  const w = stats.warn || { shown: 0, ignored: 0, pieces: {} };
  const topPiece = Object.entries(w.pieces || {}).sort((a, b) => b[1] - a[1])[0];

  const tips = [];
  weakest.forEach((x) => tips.push(`<b>${SKILL_INFO[x.k][0]}</b>: ${SKILL_INFO[x.k][1]}`));
  if (w.shown >= 3 && w.ignored / w.shown > 0.5) tips.push('<b>Pas-op-hulp</b>: de waarschuwing wordt vaak weggeklikt. Kijk samen waarom het stuk in gevaar was.');
  if (topPiece && topPiece[1] >= 3) tips.push(`<b>${Pieces.NAMES[topPiece[0]][0].toUpperCase() + Pieces.NAMES[topPiece[0]].slice(1)}</b> komt het vaakst in gevaar. Let daar samen extra op.`);
  if (played.length >= 3 && won === 0) tips.push('<b>Potjes</b>: nog niet gewonnen. Speel samen tegen Opa en gebruik de 💡 Tip-knop.');
  if (!tips.length) tips.push(skills.length ? 'Het gaat goed! Gewoon lekker doorgaan.' : 'Nog niet genoeg gespeeld om iets te zeggen. Kom later terug.');

  const resultIcon = { win: '🏆 gewonnen', loss: '😅 verloren', draw: '🤝 gelijk' };

  app.innerHTML = `
  <div class="screen settings overview">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Overzicht</div><div class="spacer"></div></div>
    <div class="settings-body wide">
      ${Store.global.profiles.length > 1 ? `<div class="chips center">${Store.global.profiles.map((p) =>
        `<button class="chip ${p.id === prof.id ? 'on' : ''}" data-p="${p.id}">${p.name}</button>`).join('')}</div>` : ''}
      <section class="card player-head">
        <div class="ph-avatar">${Avatars.html(prof, 'happy')}</div>
        <div><h3>${prof.name}</h3><p class="small">Alles wat hier staat is alleen op dit apparaat bijgehouden.</p></div>
      </section>

      <div class="tiles">
        <div class="tile"><small>Lessen klaar</small><b>${Object.keys(lessons).length}<span>/${LESSONS.length}</span></b></div>
        <div class="tile"><small>Puzzels opgelost</small><b>${d.puzzles || 0}</b></div>
        <div class="tile"><small>Potjes gewonnen</small><b>${won}<span>/${played.length}</span></b></div>
        <div class="tile"><small>Puzzels van de dag</small><b>${dailyCount}</b></div>
        <div class="tile"><small>Prijzen</small><b>${(d.badges || []).length}<span>/${getBadges().length}</span></b></div>
      </div>

      <section class="card">
        <h3>Wat kun je samen oefenen?</h3>
        <ul class="tips">${tips.map((t) => `<li>${t}</li>`).join('')}</ul>
      </section>

      <section class="card">
        <h3>Vaardigheden <small class="small">in één keer goed</small></h3>
        ${skills.length ? `<div class="skill-bars">${skills.map((x) => {
          const pct = Math.round(x.rate * 100);
          const weak = weakest.some((y) => y.k === x.k);
          return `<div class="skill-row" title="${SKILL_INFO[x.k][0]}: ${x.first} van de ${x.n} keer in één keer goed (${pct}%)">
            <span class="sk-label">${SKILL_INFO[x.k][0]}${weak ? ' <em class="sk-flag">💪 oefenen</em>' : ''}</span>
            <span class="sk-track"><span class="sk-fill" style="width:${Math.max(pct, 2)}%"></span></span>
            <span class="sk-val">${pct}% <small>(${x.first}/${x.n})</small></span>
          </div>`;
        }).join('')}</div>` : '<p class="small">Nog geen opdrachten gedaan.</p>'}
      </section>

      <div class="two-col">
        <section class="card">
          <h3>Lastigste lessen</h3>
          ${hardLessons.length ? `<ol>${hardLessons.map((x) => `<li>${x.l.title} <small class="small">(${x.wrong} keer fout)</small></li>`).join('')}</ol>` : '<p class="small">Nog geen fouten. Knap!</p>'}
        </section>
        <section class="card">
          <h3>Pas-op-hulp</h3>
          <p>${w.shown} keer gewaarschuwd, ${w.shown - w.ignored} keer toch een andere zet gekozen.</p>
          ${topPiece ? `<p class="small">Vaakst in gevaar: ${Pieces.NAMES[topPiece[0]]} (${topPiece[1]}x)</p>` : ''}
        </section>
      </div>

      <section class="card">
        <h3>Laatste potjes</h3>
        ${games.length ? `<table class="games">
          <thead><tr><th>Datum</th><th>Tegen</th><th>Uitslag</th><th>Zetten</th><th>💡</th><th>↩️</th><th>⚠️</th></tr></thead>
          <tbody>${games.slice(0, 12).map((g) => `<tr>
            <td>${g.date.slice(8, 10)}-${g.date.slice(5, 7)}</td>
            <td>${g.opp}${g.together ? ' 👫' : ''}</td>
            <td>${resultIcon[g.result]}</td>
            <td>${Math.ceil((g.moves || 0) / 2)}</td>
            <td>${g.hints || 0}</td><td>${g.undos || 0}</td><td>${g.warns || 0}</td></tr>`).join('')}</tbody>
        </table><p class="small">💡 = tips gevraagd, ↩️ = zetten teruggenomen, ⚠️ = pas-op-waarschuwingen</p>` : '<p class="small">Nog geen potjes gespeeld.</p>'}
      </section>
    </div>
  </div>`;
  $('#back').onclick = () => go(Settings);
  app.querySelectorAll('.chip[data-p]').forEach((c) => { c.onclick = () => go(Overview, c.dataset.p); });
}

/* ---------- Tegenstanders (familie + zelf gemaakt) ---------- */
function FamilyAdmin() {
  app.innerHTML = `
  <div class="screen choose">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Tegenstanders</div><div class="spacer"></div></div>
    <p class="choose-sub">Tik op iemand om het poppetje, de naam of het niveau aan te passen. Of maak een nieuwe tegenstander.</p>
    <div class="opp-grid small">
      <button class="opp-card soon add-profile" id="addOpp">
        <div class="opp-avatar mystery">+</div>
        <div class="opp-name">Nieuwe tegenstander</div>
        <div class="opp-intro">Kies zelf hoe goed die speelt</div>
      </button>
      ${FAMILY.opponents.map((o, i) => `
        <button class="opp-card" data-i="${i}">
          <div class="opp-step">${i + 1}</div>
          ${o.custom ? '<span class="opp-custom">zelf gemaakt</span>' : ''}
          <div class="opp-avatar">${Avatars.html(o, 'happy')}</div>
          <div class="opp-name">${o.name}</div>
          <div class="opp-intro">niveau ${o.level} · ${LEVEL_TEXT[o.level]}</div>
        </button>`).join('')}
    </div>
  </div>`;
  $('#back').onclick = () => go(Settings);

  $('#addOpp').onclick = () => {
    AvatarEditor({
      title: 'Nieuwe tegenstander',
      person: { name: 'Nieuw', level: 3, look: { skin: '#f7d3b5', hair: '#4a2f1b', hairStyle: 'short', shirt: '#2ec4b6' } },
      canRename: true,
      showLevel: true,
      onSave: (p) => {
        Store.global.custom = Store.global.custom || [];
        Store.global.custom.push({ id: 'c' + Date.now().toString(36), name: p.name, level: p.level, look: p.look });
        Store.saveGlobal();
        applyFamily();
        go(FamilyAdmin);
      },
      onCancel: () => go(FamilyAdmin),
    });
  };

  app.querySelectorAll('.opp-card[data-i]').forEach((b) => {
    b.onclick = () => {
      const o = FAMILY.opponents[+b.dataset.i];
      const base = FAMILY_BASE.find((x) => x.id === o.id);
      AvatarEditor({
        title: `${o.name} aanpassen`,
        person: { name: o.name, look: o.look, level: o.level },
        canRename: true,
        showLevel: true,
        onSave: (p) => {
          if (o.custom) {
            const c = Store.global.custom.find((x) => x.id === o.id);
            Object.assign(c, { name: p.name, level: p.level, look: p.look });
          } else {
            Store.global.family[o.id] = { name: p.name, look: p.look, level: p.level };
          }
          Store.saveGlobal();
          applyFamily();
          go(FamilyAdmin);
        },
        onReset: o.custom ? null : () => {
          delete Store.global.family[o.id];
          Store.saveGlobal();
          applyFamily();
          go(FamilyAdmin);
        },
        onDelete: o.custom ? () => {
          Store.global.custom = Store.global.custom.filter((x) => x.id !== o.id);
          Store.saveGlobal();
          applyFamily();
          go(FamilyAdmin);
        } : null,
        onCancel: () => go(FamilyAdmin),
      });
      if (base) $('#edReset') && ($('#edReset').title = `Standaard: niveau ${base.level}`);
    };
  });
}

/* ---------- Spelers beheren ---------- */
function ProfilesAdmin() {
  const profs = Store.global.profiles;
  app.innerHTML = `
  <div class="screen choose">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Spelers</div><div class="spacer"></div></div>
    <p class="choose-sub">Elk kind heeft een eigen voortgang, eigen prijzen en een eigen overzicht.</p>
    <div class="opp-grid small">
      ${profs.map((p) => `
        <div class="opp-card">
          <div class="opp-avatar">${Avatars.html(p, 'happy')}</div>
          <div class="opp-name">${p.name}</div>
          <div class="opp-intro">${p.id === Store.global.current ? 'Speelt nu' : ''}</div>
          <div class="card-actions">
            <button class="btn blue small-btn" data-edit="${p.id}">Aanpassen</button>
            ${profs.length > 1 ? `<button class="btn grey small-btn" data-del="${p.id}">Weghalen</button>` : ''}
          </div>
        </div>`).join('')}
      <button class="opp-card soon add-profile" id="addP">
        <div class="opp-avatar mystery">+</div>
        <div class="opp-name">Nieuwe speler</div>
      </button>
    </div>
  </div>`;
  $('#back').onclick = () => go(Settings);
  $('#addP').onclick = () => newProfile(() => go(ProfilesAdmin));
  app.querySelectorAll('[data-edit]').forEach((b) => {
    b.onclick = () => {
      const p = profs.find((x) => x.id === b.dataset.edit);
      AvatarEditor({
        title: `${p.name} aanpassen`,
        person: p,
        canRename: true,
        onSave: (np) => {
          Object.assign(p, { name: np.name, look: np.look });
          Store.saveGlobal();
          go(ProfilesAdmin);
        },
        onCancel: () => go(ProfilesAdmin),
      });
    };
  });
  app.querySelectorAll('[data-del]').forEach((b) => {
    b.onclick = () => {
      const p = profs.find((x) => x.id === b.dataset.del);
      ask(`${p.name} weghalen? Alle voortgang van ${p.name} is dan weg.`, () => {
        Store.removeProfile(p.id);
        applySettings();
        go(ProfilesAdmin);
      }, 'Ja, weghalen', 'Nee');
    };
  });
}
