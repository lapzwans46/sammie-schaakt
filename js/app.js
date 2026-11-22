/* =========================================================
   Sammie Schaakt! - de app
   Alles blijft op dit apparaat (localStorage). Geen internet.
   ========================================================= */

/* ---------- Opslag ----------
   Globaal (alle spelers):   spelers, wie er nu speelt, aanpassingen aan de familie
   Per speler:               lessen, potjes, prijzen, puzzels, dagreeks, overzicht, instellingen */
const Store = (() => {
  const GKEY = 'sammieschaak-global';
  const PKEY = (id) => 'sammieschaak-p-' + id;
  const OLD = 'sammieschaak-v1';
  const defP = () => ({
    lessons: {}, wins: {}, played: {}, badges: [], puzzles: 0,
    daily: { days: [] }, // datums waarop de puzzel van de dag gedaan is
    stats: { skills: {}, lessons: {}, games: [], warn: { shown: 0, ignored: 0, pieces: {} } },
    extra: { raceWins: 0, setups: 0 },   // spelletjes
    diplomas: {},                         // wereld -> datum van het diploma
    settings: { sound: true, warn: true, board: 'gras', pieces: 'paars' },
  });
  const defG = () => ({
    profiles: [{ id: 'sammie', name: 'Sam', look: JSON.parse(JSON.stringify(FAMILY.player.look)) }],
    current: 'sammie',
    family: {},
    custom: [],
  });
  const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

  let g = read(GKEY);
  if (!g) {
    g = defG();
    const old = read(OLD); // data van de eerste versie overnemen
    if (old) {
      if (old.settings && old.settings.name) g.profiles[0].name = old.settings.name;
      delete (old.settings || {}).name;
      write(PKEY('sammie'), old);
    }
    write(GKEY, g);
  }
  g = Object.assign(defG(), g);
  // foto's worden niet meer gebruikt: opruimen (scheelt ook opslagruimte)
  Object.values(g.family || {}).forEach((x) => { delete x.photo; });
  (g.profiles || []).forEach((p) => { delete p.photo; });

  let d;
  function load(id) {
    const raw = read(PKEY(id)) || {};
    const base = defP();
    d = Object.assign(base, raw);
    d.settings = Object.assign(defP().settings, raw.settings || {});
    d.daily = Object.assign(defP().daily, raw.daily || {});
    const oldDaily = raw.daily || {};
    if (!Array.isArray(oldDaily.days)) d.daily.days = oldDaily.last ? [oldDaily.last] : [];
    delete d.daily.streak; delete d.daily.best; delete d.daily.last;
    d.stats = Object.assign(defP().stats, raw.stats || {});
    d.stats.warn = Object.assign(defP().stats.warn, (raw.stats || {}).warn || {});
    d.extra = Object.assign(defP().extra, raw.extra || {});
  }
  // Eén keer alle spel-voortgang wissen (schone start, november 2026).
  // Spelers en poppetjes blijven staan. Verhoog RESET_VERSIE om dit nog eens te doen.
  const RESET_VERSIE = 1;
  if ((g.resetVersie || 0) < RESET_VERSIE) {
    (g.profiles || []).forEach((p) => { try { localStorage.removeItem(PKEY(p.id)); } catch (e) { /* ok */ } });
    try { localStorage.removeItem(OLD); } catch (e) { /* ok */ }
    g.resetVersie = RESET_VERSIE;
    write(GKEY, g);
  }
  if (!g.profiles.find((p) => p.id === g.current)) g.current = g.profiles[0].id;
  // de eerste speler heet Sam (in een eerdere versie stond hier 'Sammie')
  g.profiles.forEach((p) => { if (p.id === 'sammie' && p.name === 'Sammie') p.name = 'Sam'; });
  load(g.current);

  return {
    get data() { return d; },
    get global() { return g; },
    profile() { return g.profiles.find((p) => p.id === g.current); },
    save() { write(PKEY(g.current), d); write(GKEY, g); },
    saveGlobal() { return write(GKEY, g); },
    switchTo(id) { write(PKEY(g.current), d); g.current = id; write(GKEY, g); load(id); },
    addProfile(p) {
      p.id = 'p' + Date.now().toString(36);
      g.profiles.push(p);
      write(GKEY, g);
      return p;
    },
    removeProfile(id) {
      if (g.profiles.length <= 1) return;
      g.profiles = g.profiles.filter((p) => p.id !== id);
      try { localStorage.removeItem(PKEY(id)); } catch (e) { /* ok */ }
      if (g.current === id) { g.current = g.profiles[0].id; load(g.current); }
      write(GKEY, g);
    },
    reset() { d = defP(); write(PKEY(g.current), d); },
  };
})();

/* Familie + zelfgemaakte tegenstanders
   - Store.global.family[id]  = aanpassingen aan een familielid (naam, uiterlijk, niveau)
   - Store.global.custom      = zelf toegevoegde tegenstanders
   De ladder loopt van makkelijk naar moeilijk (op niveau). */
const FAMILY_BASE = JSON.parse(JSON.stringify(FAMILY.opponents));
const LEVEL_INTRO = {
  1: 'speelt heel rustig. Een goede eerste tegenstander!',
  2: 'let goed op. Laat je stukken niet zomaar staan!',
  3: 'ziet het als je een stuk laat staan. Kijk goed!',
  4: 'denkt al een zet vooruit. Pas goed op je stukken!',
  5: 'speelt slim. Denk goed na voor je zet!',
  6: 'speelt netjes en slim. Een echte uitdaging!',
  7: 'denkt een paar zetten vooruit. Lastig hoor!',
  8: 'ziet bijna alles. Laat niks los staan!',
  9: 'is heel sterk. Gebruik alles wat je geleerd hebt!',
  10: 'is een echte schaakkampioen. Kun jij winnen?',
  11: 'is de allersterkste. De laatste uitdaging!',
};
const genericSay = () => ({
  start: ['Hoi Sam! Zin in een potje?', 'Kom maar op, Sam!'],
  think: ['Even denken...', 'Hmm, wat zal ik doen?', 'Eens kijken...'],
  lostPiece: ['Oei! Goed gezien!', 'Oh nee, mijn stuk!'],
  tookPiece: ['Die pak ik!', 'Hap! Die is van mij.'],
  gaveCheck: ['Schaak! Pas op je koning!'],
  gotCheck: ['Oei, mijn koning staat schaak!'],
  win: ['Ik heb gewonnen! Nog een keer?'],
  lose: ['Jij hebt gewonnen! Knap hoor!'],
  draw: ['Gelijkspel! Goed gespeeld.'],
});

function applyFamily() {
  const ov = Store.global.family || {};
  const list = FAMILY_BASE.map((base, i) => {
    const o = JSON.parse(JSON.stringify(base));
    const x = ov[o.id] || {};
    if (x.name) o.name = x.name;
    if (x.look) o.look = JSON.parse(JSON.stringify(x.look));
    if (x.level) {
      o.level = x.level;
      if (x.level !== base.level) o.intro = `${o.name} ${LEVEL_INTRO[o.level]}`;
    }
    o.order = i;
    return o;
  });
  (Store.global.custom || []).forEach((c, i) => {
    list.push({
      id: c.id, name: c.name, level: c.level, look: JSON.parse(JSON.stringify(c.look)), custom: true,
      intro: `${c.name} ${LEVEL_INTRO[c.level]}`, say: genericSay(), order: 100 + i,
    });
  });
  list.sort((a, b) => a.level - b.level || a.order - b.order);
  FAMILY.opponents.length = 0;
  list.forEach((o) => FAMILY.opponents.push(o));
}
applyFamily();

/* ---------- Overzicht bijhouden (voor ouders) ---------- */
const Stats = {
  skill(key, firstTry) {
    const s = Store.data.stats.skills;
    s[key] = s[key] || { n: 0, first: 0 };
    s[key].n++;
    if (firstTry) s[key].first++;
    Store.save();
  },
  lessonWrong(id) {
    const l = Store.data.stats.lessons;
    l[id] = l[id] || { wrong: 0 };
    l[id].wrong++;
    Store.save();
  },
  game(entry) {
    const g = Store.data.stats.games;
    g.unshift({ date: new Date().toISOString().slice(0, 10), ...entry });
    if (g.length > 50) g.length = 50;
    Store.save();
  },
};

const todayStr = (dt = new Date()) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
const yesterdayStr = () => { const t = new Date(); t.setDate(t.getDate() - 1); return todayStr(t); };
const dailyDone = () => Store.data.daily.days.length;
const dailyToday = () => Store.data.daily.days.includes(todayStr());

/* ---------- Hulpjes ---------- */
const app = document.getElementById('app');
const $ = (sel, root = document) => root.querySelector(sel);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const playerName = () => Store.profile().name || 'Sam';
/* In teksten staat 'Sam'; dat wordt de naam van wie er speelt */
const personal = (t) => (t || '').replace(/\bSam\b/g, playerName());
const PRAISE = ['Super!', 'Goed zo!', 'Wauw, knap!', 'Top gedaan!', 'Geweldig!', 'Jij bent een kanjer!', 'Helemaal goed!'];
const totalWins = () => Object.values(Store.data.wins).reduce((a, b) => a + b, 0);
const lessonsDone = () => LESSONS.filter((l) => Store.data.lessons[l.id]).length;
const qMoves = (moves) => moves.filter((m) => !m.promo || m.promo === 'Q');

let screenCleanup = null;
let timers = [];
const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

function go(screen, ...args) {
  // Staat er een nieuwe versie klaar en gaan we naar het startscherm? Dan nu verversen.
  if (screen === Home && window.__updateReady) { location.reload(); return; }
  window.__screen = screen;
  timers.forEach(clearTimeout);
  timers = [];
  if (screenCleanup) screenCleanup();
  screenCleanup = null;
  closeModal();
  app.innerHTML = '';
  screen(...args);
  window.scrollTo(0, 0);
}

function applySettings() {
  const s = Store.data.settings;
  Sound.setSound(s.sound);
  applyTheme(s.board, s.pieces);
}

function confetti(n = 90) {
  const layer = document.createElement('div');
  layer.className = 'confetti';
  const colors = ['#ff5d8f', '#ffd34d', '#4cc9f0', '#7bd389', '#9b5de5', '#ff8c42'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('i');
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = pick(colors);
    c.style.animationDelay = Math.random() * 0.6 + 's';
    c.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
    c.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
    c.style.setProperty('--r', Math.random() * 720 + 'deg');
    if (Math.random() < 0.4) c.style.borderRadius = '50%';
    layer.appendChild(c);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 4200);
}

/* ---------- Pop-up venster ---------- */
function modal(html, cls = '') {
  closeModal();
  const m = document.createElement('div');
  m.className = 'modal-back';
  m.id = 'modal';
  m.innerHTML = `<div class="modal ${cls}">${html}</div>`;
  document.body.appendChild(m);
  return m;
}
function closeModal() { const m = $('#modal'); if (m) m.remove(); }

function ask(question, onYes, yes = 'Ja', no = 'Nee') {
  const m = modal(`<h2>${question}</h2>
    <div class="modal-buttons"><button class="btn green" id="mYes">${yes}</button><button class="btn grey" id="mNo">${no}</button></div>`);
  $('#mYes', m).onclick = () => { closeModal(); onYes(); };
  $('#mNo', m).onclick = closeModal;
}

/* =========================================================
   PRIJZEN (bekers en stickers)
   ========================================================= */
const worldDone = (nr) => LESSONS.filter((l) => l.world === nr).every((l) => Store.data.lessons[l.id]);
function getBadges() {
  return [
    { id: 'les1', icon: '📘', title: 'Eerste les', desc: 'Haal je eerste les', test: () => lessonsDone() >= 1 },
    { id: 'w1', icon: '♞', title: 'Stukkenkenner', desc: 'Maak wereld 1 af', test: () => worldDone(1) },
    { id: 'w2', icon: '📜', title: 'Regelbaas', desc: 'Maak wereld 2 af', test: () => worldDone(2) },
    { id: 'w3', icon: '🎓', title: 'Schaakmeester', desc: 'Maak wereld 3 af', test: () => worldDone(3) },
    { id: 'w4', icon: '🔭', title: 'Vooruitdenker', desc: 'Maak wereld 4 af', test: () => worldDone(4) },
    { id: 'w5', icon: '🚀', title: 'Superdenker', desc: 'Maak wereld 5 af', test: () => worldDone(5) },
    { id: 'win1', icon: '🏆', title: 'Eerste winst', desc: 'Win je eerste potje', test: () => totalWins() >= 1 },
    { id: 'win10', icon: '🥇', title: 'Tien keer gewonnen', desc: 'Win 10 potjes', test: () => totalWins() >= 10 },
    { id: 'puz10', icon: '🧩', title: 'Puzzelaar', desc: 'Los 10 puzzels op', test: () => Store.data.puzzles >= 10 },
    { id: 'puz50', icon: '🧠', title: 'Puzzelkoning', desc: 'Los 50 puzzels op', test: () => Store.data.puzzles >= 50 },
    { id: 'lvl2', icon: '💪', title: 'Moeilijk rondje', desc: 'Maak een puzzelrondje op Moeilijker', test: () => (Store.data.extra.rounds2 || 0) >= 1 },
    { id: 'lvl3', icon: '🦉', title: 'Slimme uil', desc: 'Maak een puzzelrondje op Superdenker', test: () => (Store.data.extra.rounds3 || 0) >= 1 },
    { id: 'daily3', icon: '📅', title: 'Dagpuzzelaar', desc: 'Doe 3 keer de puzzel van de dag', test: () => dailyDone() >= 3 },
    { id: 'daily10', icon: '🌟', title: 'Dagpuzzel-ster', desc: 'Doe 10 keer de puzzel van de dag', test: () => dailyDone() >= 10 },
    { id: 'race1', icon: '🏁', title: 'Pionnenkampioen', desc: 'Win een pionnenrace', test: () => Store.data.extra.raceWins >= 1 },
    { id: 'setup', icon: '🧱', title: 'Bord-bouwer', desc: 'Zet het hele bord goed klaar', test: () => Store.data.extra.setups >= 1 },
    { id: 'samen', icon: '👫', title: 'Samen gespeeld', desc: 'Speel een potje samen met iemand', test: () => Store.data.stats.games.some((g) => g.together) },
    ...FAMILY.opponents.map((o) => ({
      id: 'beat-' + o.id, person: o, title: `${o.name} verslagen`, desc: `Win van ${o.name}`,
      test: () => (Store.data.wins[o.id] || 0) >= 1,
    })),
    { id: 'champ', icon: '👑', title: 'Kampioen van de familie', desc: 'Win van iedereen', test: () => FAMILY.opponents.every((o) => Store.data.wins[o.id]) },
  ];
}

function badgeIcon(b) {
  return b.person ? `<div class="badge-avatar">${Avatars.html(b.person, 'laugh')}</div>` : `<div class="badge-emoji">${b.icon}</div>`;
}

/* Kijk of er nieuwe prijzen zijn verdiend en laat ze zien */
function awardBadges(delay = 1500) {
  const d = Store.data;
  const fresh = getBadges().filter((b) => !d.badges.includes(b.id) && b.test());
  if (!fresh.length) return;
  fresh.forEach((b) => d.badges.push(b.id));
  Store.save();
  fresh.forEach((b, i) => setTimeout(() => toast(b), delay + i * 3300));
}

function toast(b) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `${badgeIcon(b)}<div><small>Nieuwe prijs!</small><b>${b.title}</b></div>`;
  document.body.appendChild(t);
  Sound.play('magic');
  setTimeout(() => t.classList.add('out'), 2800);
  setTimeout(() => t.remove(), 3300);
}

/* =========================================================
   HOME
   ========================================================= */
function Home() {
  const [o1, o2] = FAMILY.opponents;
  const me = Store.profile();
  const doneToday = dailyToday();
  app.innerHTML = `
  <div class="screen home">
    <button class="corner-btn" id="parent" aria-label="Instellingen">⚙️</button>
    <button class="corner-btn left" id="theme" aria-label="Kleuren kiezen">🎨</button>
    <h1 class="logo"><span class="l1">Sammie</span><span class="l2">Schaakt!</span></h1>
    <div class="hero">
      <button class="hero-avatar bob" id="who" aria-label="Wie speelt er?">${Avatars.html(me, 'laugh')}</button>
      <div class="bubble hero-bubble">Hoi ${playerName()}!<br>Wat gaan we doen?
        ${Store.global.profiles.length > 1 ? '<small class="switch-hint">Ben jij het niet? Tik op het poppetje.</small>' : ''}</div>
    </div>
    <button class="daily-btn ${doneToday ? 'done' : ''}" id="toDaily">
      <span class="daily-cal">📅</span>
      <span class="daily-text"><b>Puzzel van de dag</b><small>${doneToday ? 'Gedaan! Morgen weer een nieuwe.' : 'Doe je de puzzel van vandaag?'}</small></span>
      <span class="daily-streak">${doneToday ? '✅' : '🧩'}</span>
    </button>
    <div class="home-buttons">
      <button class="big-btn blue" id="toLessons">
        <div class="big-icon">${Pieces.svg('wN')}</div>
        <div class="big-text"><b>Lessen</b><small>${lessonsDone()} van de ${LESSONS.length} klaar</small></div>
      </button>
      <button class="big-btn orange" id="toPlay">
        <div class="big-icon duo"><div>${Avatars.html(o1)}</div><div>${o2 ? Avatars.html(o2) : ''}</div></div>
        <div class="big-text"><b>Spelen</b><small>🏆 ${totalWins()} keer gewonnen</small></div>
      </button>
      <button class="big-btn green" id="toPuzzles">
        <div class="big-icon emoji">🧩</div>
        <div class="big-text"><b>Puzzels</b><small>${Store.data.puzzles} opgelost</small></div>
      </button>
      <button class="big-btn pink" id="toGames">
        <div class="big-icon emoji">🏁</div>
        <div class="big-text"><b>Spelletjes</b><small>Pionnenrace en bord opzetten</small></div>
      </button>
      <button class="big-btn purple" id="toPrizes">
        <div class="big-icon emoji">🏅</div>
        <div class="big-text"><b>Prijzen</b><small>${Store.data.badges.length} van de ${getBadges().length}</small></div>
      </button>
      <button class="big-btn teal" id="toDiplomas">
        <div class="big-icon emoji">🎓</div>
        <div class="big-text"><b>Diploma's</b><small>${diplomaCount()} van de ${WORLDS.length + 1}</small></div>
      </button>
    </div>
  </div>`;
  $('#toLessons').onclick = () => { Sound.play('tap'); go(LessonMap); };
  $('#toPlay').onclick = () => { Sound.play('tap'); go(ChooseOpponent); };
  $('#toPuzzles').onclick = () => { Sound.play('tap'); go(PuzzleChoose); };
  $('#toPrizes').onclick = () => { Sound.play('tap'); go(Prizes); };
  $('#toDaily').onclick = () => { Sound.play('tap'); go(DailyPuzzle); };
  $('#toGames').onclick = () => { Sound.play('tap'); go(MiniGames); };
  $('#toDiplomas').onclick = () => { Sound.play('tap'); go(Diplomas); };
  $('#theme').onclick = () => { Sound.play('tap'); go(ThemePicker); };
  $('#who').onclick = () => { Sound.play('tap'); go(WhoPlays); };
  $('#parent').onclick = () => { Sound.play('tap'); go(Settings); };
}

/* =========================================================
   WIE SPEELT ER? (spelers kiezen)
   ========================================================= */
function WhoPlays() {
  const profs = Store.global.profiles;
  app.innerHTML = `
  <div class="screen choose">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Wie speelt er?</div><div class="spacer"></div></div>
    <div class="opp-grid">
      ${profs.map((p) => `
        <button class="opp-card profile ${p.id === Store.global.current ? 'current' : ''}" data-id="${p.id}">
          <div class="opp-avatar">${Avatars.html(p, 'laugh')}</div>
          <div class="opp-name">${p.name}</div>
          ${p.id === Store.global.current ? '<div class="opp-intro">Speelt nu ✓</div>' : ''}
        </button>`).join('')}
      <button class="opp-card soon add-profile" id="addP">
        <div class="opp-avatar mystery">+</div>
        <div class="opp-name">Nieuwe speler</div>
        <div class="opp-intro">Maak je eigen poppetje</div>
      </button>
    </div>
  </div>`;
  $('#back').onclick = () => go(Home);
  app.querySelectorAll('.opp-card[data-id]').forEach((b) => {
    b.onclick = () => {
      Store.switchTo(b.dataset.id);
      applySettings();
      Sound.play('good');
      go(Home);
    };
  });
  $('#addP').onclick = () => newProfile(() => go(WhoPlays));
}

function newProfile(done) {
  AvatarEditor({
    title: 'Nieuwe speler',
    person: { name: 'Nieuwe speler', look: { skin: '#f7d3b5', hair: '#6b3e26', hairStyle: 'short', shirt: '#4361ee' } },
    canRename: true,
    onSave: (p) => {
      const np = Store.addProfile({ name: p.name, look: p.look });
      Store.switchTo(np.id);
      applySettings();
      done();
    },
    onCancel: done,
  });
}

/* =========================================================
   LESSEN-KAART (met werelden)
   ========================================================= */
/* Alles is meteen open. De eerstvolgende les die nog niet klaar is, krijgt een 'Nu!'-label. */
const nextLesson = () => LESSONS.findIndex((l) => !Store.data.lessons[l.id]);

function LessonMap() {
  const tile = (l, i) => {
    const done = !!Store.data.lessons[l.id];
    const now = i === nextLesson();
    return `<button class="lesson-tile ${done ? 'done' : ''} ${now ? 'now' : ''}" data-i="${i}">
      ${now ? '<div class="now-tag">Nu!</div>' : ''}
      <div class="num">${i + 1}</div>
      <div class="tile-icon">${Pieces.svg(l.icon)}</div>
      <div class="tile-title">${l.title}</div>
      <div class="tile-state">${done ? '⭐' : '▶'}</div>
    </button>`;
  };
  const worlds = WORLDS.map((w) => {
    const list = LESSONS.map((l, i) => [l, i]).filter(([l]) => l.world === w.nr);
    const done = list.filter(([l]) => Store.data.lessons[l.id]).length;
    return `<section class="world" style="--wc:${w.color}">
      <h2 class="world-title"><span>Wereld ${w.nr}</span> ${w.title} <small>${done}/${list.length} ⭐</small></h2>
      <div class="lesson-grid">${list.map(([l, i]) => tile(l, i)).join('')}</div>
    </section>`;
  }).join('');
  app.innerHTML = `
  <div class="screen map">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Lessen</div><div class="spacer"></div></div>
    <div class="worlds">${worlds}</div>
  </div>`;
  $('#back').onclick = () => go(Home);
  app.querySelectorAll('.lesson-tile').forEach((b) => {
    b.onclick = () => {
      const i = +b.dataset.i;
      Sound.play('tap');
      go(LessonPlayer, i);
    };
  });
  const next = nextLesson();
  if (next > 3) app.querySelector(`.lesson-tile[data-i="${next}"]`).scrollIntoView({ block: 'center' });
}

/* =========================================================
   OPDRACHTEN (gedeeld door lessen en puzzels)
   ========================================================= */
const GOALS = {
  check: {
    ok: (s) => Chess.inCheck(s, 'b'),
    wrong: () => 'Bijna! De koning staat nog niet schaak.',
  },
  mate: {
    ok: (s) => Chess.gameStatus(s) === 'checkmate',
    wrong: (s) => (Chess.inCheck(s, 'b') ? 'Schaak! Maar de koning kan nog weg.' : 'Nog geen schaakmat. Probeer nog eens!'),
  },
  castle: {
    ok: (s, m) => m.flag === 'castleK' || m.flag === 'castleQ',
    wrong: () => 'Zet de koning twee stapjes naar de toren!',
  },
  escape: { ok: () => true, wrong: () => 'Probeer nog eens!' },
  hanging: {
    ok: (s, m) => !!m.captured && !Chess.isAttacked(s.board, m.to, 'b'),
    wrong: (s, m) => (m.captured ? 'Oei! Dat stuk wordt beschermd. Zoek een ander!' : 'Je moet een stuk pakken!'),
  },
  safe: {
    ok: (s) => Tactics.loss(s).loss < 100,
    wrong: () => 'Oei! Zwart kan nog iets van jou pakken.',
    danger: (s) => Tactics.loss(s).sq,
  },
  fork: {
    ok: (s, m) => Tactics.targets(s, m.to).length >= 2 && Tactics.loss(s).loss < 200,
    wrong: (s, m) => (Tactics.targets(s, m.to).length >= 2
      ? 'Mooi! Maar zwart kan jouw stuk pakken.'
      : 'Val twee stukken tegelijk aan!'),
  },
  to: {
    ok: (s, m, step) => m.piece[1] === step.piece && step.squares.includes(Chess.sqName(m.to)),
    wrong: () => 'Bijna! Probeer nog eens.',
  },
};

/* =========================================================
   VOORUIT DENKEN: opdrachten van 2 of 3 zetten (goal: 'plan')
   step.win   'mate' = geef schaakmat, of 'Q'/'R'/... = pak dat zwarte stuk
   step.line  ['h1-h8', 'g8-g7', 'h8-a8', ...]: wit, zwart, wit, ... (zwart zet vanzelf)
   step.say   wat Pim zegt na elke zet van zwart
   Schaakmat telt bij een pak-opdracht ook als goed (dat is nog beter).
   ========================================================= */
const Plan = {
  moveStr: (m) => Chess.sqName(m.from) + '-' + Chess.sqName(m.to),
  /* is de opdracht met deze zet (in stelling s) meteen gelukt? */
  wins(s, m, win) {
    if (win !== 'mate' && m.captured === 'b' + win) return true;
    const n = Chess.makeMove(s, m);
    // schaakmat kan alleen met schaak: die snelle test eerst
    return Chess.inCheck(n, 'b') && Chess.gameStatus(n) === 'checkmate';
  },
  /* kan wit (aan zet) het in hooguit n zetten afdwingen, wat zwart ook doet?
     Schaakzetten eerst proberen: die werken het vaakst, dus dan zijn we sneller klaar. */
  forced(s, n, win) {
    const ms = qMoves(Chess.legalMoves(s));
    if (n > 1) ms.sort((a, b) => Plan.isCheck(s, b) - Plan.isCheck(s, a));
    return ms.some((m) => Plan.good(s, m, n, win));
  },
  isCheck: (s, m) => (Chess.inCheck(Chess.makeMove(s, m), 'b') ? 1 : 0),
  good(s, m, n, win) {
    if (Plan.wins(s, m, win)) return true;
    if (n <= 1) return false;
    const s2 = Chess.makeMove(s, m);
    const replies = qMoves(Chess.legalMoves(s2));
    if (!replies.length) return false; // pat
    return replies.every((r) => Plan.forced(Chess.makeMove(s2, r), n - 1, win));
  },
  /* alle goede zetten voor wit, met nog n zetten te gaan */
  solutions(s, n, win) { return qMoves(Chess.legalMoves(s)).filter((m) => Plan.good(s, m, n, win)); },
  /* na een foute zet van wit: een zet van zwart waarmee hij ontsnapt */
  refute(s2, nLeft, win) {
    const replies = qMoves(Chess.legalMoves(s2));
    if (!replies.length) return null;
    return replies.find((r) => nLeft <= 0 || !Plan.forced(Chess.makeMove(s2, r), nLeft, win)) || null;
  },
  find(s, str) { return qMoves(Chess.legalMoves(s)).find((m) => Plan.moveStr(m) === str) || null; },
  /* in hoeveel zetten (hooguit max) kan wit het nog afdwingen? (max + 1 = niet) */
  distance(s, max, win) {
    for (let k = 1; k <= max; k++) if (Plan.forced(s, k, win)) return k;
    return max + 1;
  },
  /* zwart kiest zelf: het antwoord waarna wit het langst nodig heeft (bij gelijk: liefst de koning) */
  defend(s2, max, win) {
    let best = null, bestD = -1;
    for (const r of qMoves(Chess.legalMoves(s2))) {
      const d = Plan.distance(Chess.makeMove(s2, r), max, win);
      if (d > bestD || (d === bestD && r.piece[1] === 'K' && best.piece[1] !== 'K')) { best = r; bestD = d; }
    }
    return best;
  },
};

/* Zoek een goede oplossing (voor de hulp na twee keer fout) */
function findSolution(step) {
  const s = Chess.fromFEN(step.fen);
  const g = GOALS[step.goal];
  return qMoves(Chess.legalMoves(s)).find((m) => g.ok(Chess.makeMove(s, m), m, step));
}

/* Bij 'sterren pakken' en 'alles slaan': staat er naast pionnen ook een ander wit stuk,
   dan zijn die pionnen obstakels en blijven ze staan. */
const isObstacle = (board, sq) => board[sq] === 'wP' && board.some((p) => p && p[0] === 'w' && p[1] !== 'P');

/* Eerste zet van de kortste oplossing bij 'sterren pakken' of 'alles slaan' */
function freeSolution(type, state, stars) {
  const done = (s, left) => (type === 'stars' ? left.length === 0 : !s.board.some((p) => p && p[0] === 'b'));
  const queue = [[state, [...stars], null, 0]];
  const seen = new Set();
  while (queue.length) {
    const [s, left, first, d] = queue.shift();
    if (done(s, left)) return first;
    if (d >= 10) continue;
    for (const m of qMoves(Chess.legalMoves(s))) {
      if (isObstacle(s.board, m.from)) continue;
      const n = Chess.makeMove(s, m);
      n.turn = 'w'; n.ep = null;
      const l2 = left.filter((x) => x !== m.to);
      const key = n.board.join() + '|' + l2.join();
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push([n, l2, first || m, d + 1]);
    }
  }
  return null;
}

/*
  Speelt één opdracht af: stars, capture of goal.
  ui = { stage, actions, setText(text, mood), onSolved(firstTry) }
*/
function Exercise(step, ui) {
  const wrap = document.createElement('div');
  wrap.className = 'board-wrap';
  ui.stage.appendChild(wrap);
  const view = new BoardView(wrap, { onTap: (i) => tap(i) });
  const freeMode = step.type === 'stars' || step.type === 'capture';
  let state, stars, selected, dests, last, locked, hint = null, marks = [];
  let wrongCount = 0;
  let usedHint = false;
  const task = ui.taskText || step.text;
  /* vooruit denken: welke zet uit step.line is nu aan de beurt, en de stelling op dat moment */
  const isPlan = step.goal === 'plan';
  const planN = isPlan ? (step.line.length + 1) / 2 : 1;
  /* pi = plek in step.line; wm = zetten van wit gedaan; budget = hoeveel zetten wit heeft.
     free = Sam koos een andere weg die ook werkt (een omweg). Dan verdedigt zwart zich zelf
     en mag elke zet die nog steeds werkt. */
  let pi = 0, planStart = null, wm = 0, budget = planN, free = false;
  const planText = () => {
    const left = budget - wm;
    const say = free ? (left === 1 ? 'Nog één zet!' : 'Goed bezig! Ga zo door.')
      : wm === 0 ? task : (step.say && step.say[wm - 1]) || 'Nu jij weer!';
    return `Zet ${wm + 1} van ${budget}: ` + say;
  };
  const taskNow = () => (isPlan ? planText() : task);

  /* eigen timers: 'Opnieuw' zet ze allemaal stop */
  const elaterIds = [];
  const elater = (fn, ms) => { const t = later(fn, ms); elaterIds.push(t); return t; };
  const elaterStop = () => { elaterIds.forEach(clearTimeout); elaterIds.length = 0; };

  const reset = () => {
    elaterStop();
    state = step.fen ? Chess.fromFEN(step.fen) : Chess.fromPieces(step.pieces, 'w');
    stars = new Set((step.stars || []).map(Chess.sqIndex));
    selected = null; dests = []; last = null; locked = false; marks = [];
    pi = 0; planStart = state; wm = 0; budget = planN; free = false;
    draw();
  };
  /* vooruit denken: terug naar het begin van deze zet (niet van de hele opdracht) */
  const planBack = () => {
    elaterStop();
    state = planStart;
    selected = null; dests = []; locked = false; marks = []; hint = null;
    last = null;
    draw();
  };
  const checkSq = () => (Chess.inCheck(state, state.turn) ? Chess.findKing(state.board, state.turn) : null);
  const draw = (animate) => view.render(state.board, {
    selected, dests: dests.map((m) => m.to), stars: [...stars], lastMove: last, check: checkSq(), animate, hint, marks,
  });

  ui.actions.innerHTML = `<button class="btn grey" id="again">↺ Opnieuw</button><button class="btn yellow" id="hintBtn">💡 Hint</button>`;
  $('#again', ui.actions).onclick = () => { Sound.play('tap'); reset(); ui.setText(taskNow()); };
  $('#hintBtn', ui.actions).onclick = () => showHint();

  /* Pim helpt alleen als je zelf op 'Hint' drukt */
  function showHint() {
    if (locked) return;
    const sol = freeMode ? freeSolution(step.type, state, stars)
      : isPlan ? (free ? Plan.solutions(state, budget - wm, step.win)[0] : Plan.find(state, step.line[pi])) : findSolution(step);
    if (!sol) return;
    Sound.play('magic');
    usedHint = true;
    hint = { from: sol.from, to: sol.to };
    selected = sol.from;
    dests = qMoves(Chess.legalMoves(state, sol.from));
    marks = [];
    draw();
    const name = Pieces.NAMES[sol.piece[1]];
    ui.setText(`Tik op je ${name}. Tik dan op het gele vakje!`, 'happy');
  }

  const solvedNow = (m) => {
    if (step.type === 'stars') return stars.size === 0;
    if (step.type === 'capture') return !state.board.some((p) => p && p[0] === 'b');
    return GOALS[step.goal].ok(state, m, step);
  };

  function tap(i) {
    if (locked) return;
    const mv = dests.find((m) => m.to === i);
    if (selected !== null && mv) return doMove(mv);
    const p = state.board[i];
    if (p && p[0] === 'w' && freeMode && isObstacle(state.board, i)) {
      view.shake(i);
      Sound.play('oops');
      ui.setText('Deze pion blijft staan. Hij staat alleen in de weg!', 'oops');
      selected = null; dests = [];
      return draw();
    }
    if (p && p[0] === 'w') {
      const ms = qMoves(Chess.legalMoves(state, i));
      if (!ms.length) {
        view.shake(i);
        Sound.play('oops');
        if (Chess.inCheck(state, 'w')) ui.setText('Je koning staat schaak! Red hem eerst.', 'oops');
        selected = null; dests = [];
        return draw();
      }
      Sound.play('tap');
      selected = i; dests = ms;
      return draw();
    }
    selected = null; dests = [];
    draw();
  }

  function doMove(m) {
    if (m.promo && !m.picked) {
      locked = true;
      return askPromotion('w', (t) => {
        locked = false;
        const real = withPromo(state, m, t);
        real.picked = true;
        doMove(real);
      });
    }
    const next = Chess.makeMove(state, m);
    if (freeMode) { next.turn = 'w'; next.ep = null; }
    state = next;
    last = { from: m.from, to: m.to };
    selected = null; dests = []; hint = null;
    Sound.play(m.captured ? 'capture' : 'move');
    if (stars.has(m.to)) { stars.delete(m.to); elater(() => { Sound.play('star'); view.pop(m.to); }, 150); }
    draw({ from: m.from, to: m.to });
    if (m.promo) { elater(() => Sound.play('magic'), 250); ui.setText(`Toverij! Je pion is nu een ${PROMO_NAME[m.promo]}!`, 'happy'); }

    if (isPlan) return planMove(m);
    if (solvedNow(m)) {
      locked = true;
      Stats.skill(step.goal || step.type, wrongCount === 0 && !usedHint);
      if (step.goal === 'fork') { marks = Tactics.targets(state, m.to); draw(); }
      elater(() => {
        Sound.play('good');
        confetti(50);
        ui.setText(pick(PRAISE), 'happy');
        ui.onSolved(wrongCount === 0 && !usedHint);
      }, 450);
    } else if (step.type === 'goal') {
      locked = true;
      wrongCount++;
      if (ui.lessonId) Stats.lessonWrong(ui.lessonId);
      const g = GOALS[step.goal];
      if (g.danger) { const d = g.danger(state); if (d !== null) { marks = [d]; draw(); } }
      elater(() => { Sound.play('oops'); ui.setText(g.wrong(state, m), 'oops'); }, 400);
      elater(() => {
        reset();
        ui.setText(wrongCount >= 2 ? task + ' Lukt het niet? Druk op 💡.' : task);
      }, 2600);
    }
  }

  /* Vooruit denken: is dit de goede zet? Dan zet zwart terug.
     - de zet uit de oplossing: zwart zet de zet uit step.line;
     - een andere weg die ook werkt, met hooguit één zet extra (bv. eerst de andere toren
       bij het trappetje): ook goed! Dan krijgt Sam een zet extra en verdedigt zwart zich zelf;
     - fout: zwart laat zien hoe hij ontsnapt, en Sam probeert die zet opnieuw. */
  function planSolved() {
    Stats.skill('plan', wrongCount === 0 && !usedHint);
    elater(() => {
      Sound.play('good');
      confetti(50);
      ui.setText(pick(PRAISE), 'happy');
      ui.onSolved(wrongCount === 0 && !usedHint);
    }, 450);
  }
  function blackReplies(r, text) {
    elater(() => { Sound.play('good'); ui.setText(text, 'happy'); }, 350);
    elater(() => {
      const rr = r();
      state = Chess.makeMove(state, rr);
      last = { from: rr.from, to: rr.to };
      Sound.play(rr.captured ? 'capture' : 'move');
      draw({ from: rr.from, to: rr.to });
      wm++;
      planStart = state;
      elater(() => { locked = false; ui.setText(planText()); }, 700);
    }, 1500);
  }
  function planMove(m) {
    locked = true;
    const nLeft = budget - wm;             // zetten van wit die nog over zijn (incl. deze)
    const before = planStart;
    // 1. de zet uit de oplossing
    if (!free && Plan.moveStr(m) === step.line[pi]) {
      if (pi + 1 >= step.line.length) return planSolved();
      const reply = step.line[pi + 1];
      pi += 2;
      return blackReplies(() => Plan.find(state, reply), 'Goed zo! Wat doet zwart nu?');
    }
    // 2. (na een omweg) een zet die nog steeds werkt
    if (free && Plan.good(before, m, nLeft, step.win)) {
      if (Plan.wins(before, m, step.win)) return planSolved();
      return blackReplies(() => Plan.defend(state, nLeft - 1, step.win), 'Goed zo! Wat doet zwart nu?');
    }
    // Eerst de zet laten zien, dan pas rekenen (dat kan op een iPad even duren)
    elater(() => {
      // 3. een omweg: zo lukt het ook, met één zet extra. Dat rekenen we gewoon goed!
      if (!free && nLeft <= 3 && Plan.good(before, m, nLeft + 1, step.win)) {
        free = true;
        budget++;
        Sound.play('good');
        ui.setText(`Dat kan ook! Het duurt wel één zetje langer. Je krijgt ${budget} zetten.`, 'happy');
        elater(() => {
          const rr = Plan.defend(state, nLeft, step.win);
          state = Chess.makeMove(state, rr);
          last = { from: rr.from, to: rr.to };
          Sound.play(rr.captured ? 'capture' : 'move');
          draw({ from: rr.from, to: rr.to });
          wm++;
          planStart = state;
          elater(() => { locked = false; ui.setText(planText()); }, 700);
        }, 2000);
        return;
      }
      // 4. fout
      wrongCount++;
      if (ui.lessonId) Stats.lessonWrong(ui.lessonId);
      Sound.play('oops');
      const mated = Chess.gameStatus(state) === 'checkmate';
      const r = mated ? null : Plan.refute(state, nLeft - 1, step.win);
      const what = step.win === 'mate' ? 'Zo ontsnapt de koning' : `Zo redt zwart zijn ${PIECE_NAME_NL[step.win] || 'stuk'}`;
      ui.setText(r ? 'Oei! Kijk wat zwart dan doet...' : 'Hmm, dat werkt niet.', 'oops');
      let t = 0;
      if (r) {
        t = 1200;
        elater(() => {
          state = Chess.makeMove(state, r);
          last = { from: r.from, to: r.to };
          Sound.play(r.captured ? 'capture' : 'move');
          draw({ from: r.from, to: r.to });
          ui.setText(`Zie je? ${what}. Denk nog eens vooruit!`, 'oops');
        }, t);
      }
      elater(() => {
        planBack();
        ui.setText(wrongCount >= 2 ? planText() + ' Lukt het niet? Druk op 💡.' : planText());
      }, t + 2600);
    }, 400);
  }

  reset();
  if (isPlan) ui.setText(planText());
}

/* Pion aan de overkant: kies waarin hij verandert */
const PROMO_NAME = { Q: 'koningin', R: 'toren', B: 'loper', N: 'paard' };
const PIECE_NAME_NL = { Q: 'koningin', R: 'toren', B: 'loper', N: 'paard', P: 'pion' };
function askPromotion(color, onPick) {
  Sound.play('magic');
  const m = modal(`
    <h2>Je pion is aan de overkant!</h2>
    <p>Waar verandert hij in?</p>
    <div class="promo-grid">${['Q', 'R', 'B', 'N'].map((t) => `
      <button class="promo-btn" data-t="${t}">${Pieces.svg(color + t)}<span>${PROMO_NAME[t]}</span></button>`).join('')}
    </div>`, 'promo');
  m.querySelectorAll('.promo-btn').forEach((b) => {
    b.onclick = () => { closeModal(); onPick(b.dataset.t); };
  });
}
/* Zoek de zet met de gekozen promotie */
const withPromo = (state, m, t) => Chess.legalMoves(state, m.from).find((x) => x.to === m.to && x.promo === t);

/* =========================================================
   LES SPELEN
   ========================================================= */
function teacherLayout(title, right = '<div class="spacer"></div>') {
  return `
  <div class="screen lesson">
    <div class="topbar">
      <button class="round-btn" id="back" aria-label="Terug">←</button>
      <div class="title">${title}</div>
      ${right}
    </div>
    <div class="lesson-body">
      <div class="teacher-col">
        <div class="teacher">
          <div class="teacher-face bob">${Pieces.svg('wN')}</div>
          <div class="bubble teacher-bubble"><span id="tText"></span></div>
        </div>
        <div class="actions" id="actions"></div>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>`;
}

function makeSetText() {
  return (t, mood = '') => {
    const el = $('#tText');
    el.textContent = personal(t);
    el.parentElement.className = 'bubble teacher-bubble ' + mood;
  };
}

function LessonPlayer(li) {
  const lesson = LESSONS[li];
  let si = 0;
  app.innerHTML = teacherLayout(`Les ${li + 1}: ${lesson.title}`, '<div class="progress"><div class="progress-fill" id="prog"></div></div>');
  $('#back').onclick = () => go(LessonMap);

  const setText = makeSetText();
  const actions = $('#actions');
  const stage = $('#stage');

  function nextButton(label = 'Verder ▶', pulse = false) {
    actions.innerHTML = `<button class="btn green huge ${pulse ? 'pulse' : ''}" id="next">${label}</button>`;
    $('#next').onclick = () => { Sound.play('tap'); advance(); };
  }

  function advance() {
    si++;
    if (si >= lesson.steps.length) return finish();
    show();
  }

  function finish() {
    $('#prog').style.width = '100%';
    Store.data.lessons[lesson.id] = true;
    const newDiploma = checkDiplomas().includes(lesson.world);
    Store.save();
    Sound.play('win');
    confetti();
    const hasNext = li + 1 < LESSONS.length;
    const m = modal(`
      <div class="sticker">${Pieces.svg(lesson.icon)}</div>
      <h2>Les klaar!</h2>
      <p>Je krijgt een ster! ⭐</p>
      ${newDiploma ? `<p class="world-unlock">🎓 Wereld ${lesson.world} is af! Je krijgt een diploma!</p>` : ''}
      <div class="modal-buttons">
        ${newDiploma ? `<button class="btn orange" id="mDiploma">🎓 Bekijk je diploma</button>` : ''}
        ${hasNext ? '<button class="btn green" id="mNext">Volgende les ▶</button>' : '<button class="btn orange" id="mPlay">Ga spelen! ♟️</button>'}
        <button class="btn blue" id="mMap">Naar de lessen</button>
      </div>`, 'celebrate');
    if (hasNext) $('#mNext', m).onclick = () => go(LessonPlayer, li + 1);
    else $('#mPlay', m).onclick = () => go(ChooseOpponent);
    $('#mMap', m).onclick = () => go(LessonMap);
    if ($('#mDiploma', m)) $('#mDiploma', m).onclick = () => go(DiplomaView, lesson.world);
    awardBadges();
  }

  function show() {
    const step = lesson.steps[si];
    $('#prog').style.width = (si / lesson.steps.length) * 100 + '%';
    stage.innerHTML = '';
    actions.innerHTML = '';
    setText(step.text);

    demoStop();
    if (step.type === 'talk') {
      const b = (step.pieces || step.fen) ? showBoard(step) : null;
      nextButton();
      if (b && step.demo) {
        actions.insertAdjacentHTML('afterbegin', '<button class="btn blue" id="replay">🔁 Nog eens</button>');
        $('#replay').onclick = () => { Sound.play('tap'); playDemo(b, step); };
        demoTimers.push(later(() => playDemo(b, step), 900));
      }
    } else if (step.type === 'quiz') {
      showQuiz(step);
    } else {
      Exercise(step, { stage, actions, setText, lessonId: lesson.id, onSolved: () => nextButton('Verder ▶', true) });
    }
  }

  function showBoard(step) {
    const wrap = document.createElement('div');
    wrap.className = 'board-wrap';
    stage.appendChild(wrap);
    const view = new BoardView(wrap);
    const st = step.fen ? Chess.fromFEN(step.fen) : Chess.fromPieces(step.pieces);
    let dests = [];
    if (step.showMoves) {
      const from = Chess.sqIndex(step.showMoves);
      const s2 = { ...st, turn: st.board[from][0] };
      dests = [...new Set(Chess.pseudoMoves(s2, from).map((m) => m.to))];
    }
    const k = Chess.inCheck(st, st.turn) ? Chess.findKing(st.board, st.turn) : null;
    view.render(st.board, {
      selected: step.showMoves ? Chess.sqIndex(step.showMoves) : null,
      dests, marks: (step.mark || []).map(Chess.sqIndex), check: k,
    });
    return { view, st };
  }

  /* Filmpje: step.demo = ['e1-g1', ...]. De stukken bewegen vanzelf (langzaam),
     zodat Sam ziet hoe een zet gaat. Rokeren laat ook de toren bewegen. */
  let demoTimers = [];
  function demoStop() { demoTimers.forEach(clearTimeout); demoTimers = []; }
  function playDemo({ view, st }, step) {
    demoStop();
    let s = st;
    view.render(s.board, {});
    const SLOW = 650;
    // Met demoSay vertelt Pim bij elke zet wat er gebeurt: dan iets langzamer, om te kunnen lezen.
    const GAP = step.demoSay ? 2800 : 1500;
    if (step.demoSay) setText(step.text);
    step.demo.forEach((mv, n) => {
      demoTimers.push(later(() => {
        const [a, b] = mv.split('-').map(Chess.sqIndex);
        const s2 = { ...s, turn: s.board[a][0] };
        const m = Chess.pseudoMoves(s2, a).find((x) => x.to === b && (!x.promo || x.promo === 'Q'))
          || { from: a, to: b, piece: s.board[a], captured: s.board[b] };
        s = Chess.makeMove(s2, m);
        const last = n === step.demo.length - 1;
        const k = Chess.inCheck(s, s.turn) ? Chess.findKing(s.board, s.turn) : null;
        view.render(s.board, { lastMove: { from: a, to: b }, check: k, marks: last ? (step.markAfter || []).map(Chess.sqIndex) : [] });
        view.animate(a, b, SLOW);
        if (m.flag === 'castleK') view.animate(b + 1, b - 1, SLOW + 250);
        if (m.flag === 'castleQ') view.animate(b - 2, b + 1, SLOW + 250);
        Sound.play(m.captured ? 'capture' : 'move');
        if (step.demoSay && step.demoSay[n]) setText(step.demoSay[n], last ? 'happy' : '');
      }, (step.demoSay ? 1200 : 500) + n * GAP));
    });
  }

  function showQuiz(step) {
    const box = document.createElement('div');
    box.className = 'quiz';
    // Quiz met een bordje erbij: bord rechts, knoppen onder Pim
    const withBoard = !!(step.pieces || step.fen);
    if (withBoard) { showBoard(step); box.classList.add('small'); }
    box.innerHTML = step.options.map((o, i) => `
      <button class="quiz-btn" data-i="${i}">
        ${o.piece ? `<div class="quiz-piece">${Pieces.svg(o.piece)}</div>` : ''}
        <span>${o.label}</span>
      </button>`).join('');
    (withBoard ? actions : stage).appendChild(box);
    let solved = false;
    let wrong = 0;
    box.querySelectorAll('.quiz-btn').forEach((b) => {
      b.onclick = () => {
        if (solved) return;
        const o = step.options[+b.dataset.i];
        if (o.ok) {
          solved = true;
          Stats.skill('quiz', wrong === 0);
          b.classList.add('right');
          Sound.play('good');
          confetti(40);
          setText(pick(PRAISE), 'happy');
          if (withBoard) {
            box.querySelectorAll('.quiz-btn:not(.right)').forEach((x) => x.remove());
            box.insertAdjacentHTML('beforeend', '<button class="btn green huge pulse" id="next">Verder ▶</button>');
            $('#next').onclick = () => { Sound.play('tap'); advance(); };
          } else nextButton('Verder ▶', true);
        } else {
          b.classList.remove('shake'); b.getBoundingClientRect(); b.classList.add('shake', 'wrong');
          Sound.play('oops');
          wrong++;
          Stats.lessonWrong(lesson.id);
          setText('Nee, probeer nog eens!', 'oops');
        }
      };
    });
  }

  show();
}

/* =========================================================
   PUZZELS
   ========================================================= */
/* Puzzels in drie niveaus (zie js/puzzles.js). Niveau 1 = bewust makkelijk, met simpele woorden. */
const PUZZLE_TEXT = {
  check: 'Val de zwarte koning aan!',
  mate: 'Geef schaakmat!',
  hanging: 'Pak een stuk dat niemand beschermt!',
  safe: 'Red je stuk! Zet het op een veilig vakje.',
  fork: 'Val twee stukken tegelijk aan!',
};
const PUZZLE_LEVELS = [
  { level: 1, stars: '⭐', title: 'Makkelijk', desc: 'Schaak, mat in één, los stuk pakken, stuk redden', color: 'green' },
  { level: 2, stars: '⭐⭐', title: 'Moeilijker', desc: 'Vork maken, en twee zetten vooruit denken', color: 'blue' },
  { level: 3, stars: '⭐⭐⭐', title: 'Superdenker', desc: 'Drie zetten vooruit, en slimme stille zetten', color: 'purple' },
];
/* uit deze lessen komen extra puzzels: les-id -> niveau */
const PUZZLE_LESSONS = { schaak: 1, mat: 1, los: 1, redden: 1, vork: 2, spies: 2, vork2: 2, mat2: 2, toets2: 2, trap3: 3, jacht: 3, slim3: 3, toets3: 3 };

function puzzlePool(level = 1) {
  const fromLessons = [];
  for (const l of LESSONS) {
    if (PUZZLE_LESSONS[l.id] !== level) continue;
    for (const st of l.steps) {
      if (st.type !== 'goal') continue;
      if (st.goal === 'plan') {
        const n = (st.line.length + 1) / 2;
        const what = st.win === 'mate' ? 'Geef schaakmat' : `Pak de ${PIECE_NAME_NL[st.win]}`;
        fromLessons.push({ ...st, text: `${what}! Je hebt ${n} zetten.`, say: st.say });
      } else if (PUZZLE_TEXT[st.goal]) fromLessons.push({ goal: st.goal, text: PUZZLE_TEXT[st.goal], fen: st.fen });
    }
  }
  return PUZZLES.filter((p) => (p.level || 1) === level).concat(fromLessons);
}

/* Puzzel van de dag: alleen de makkelijke, zodat het altijd te doen is */
const dailyPool = () => puzzlePool(1);

/* Kies eerst hoe moeilijk */
function PuzzleChoose() {
  const last = Store.data.extra.puzzleLevel || 1;
  app.innerHTML = `
  <div class="screen choose">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Puzzels</div><div class="spacer"></div></div>
    <p class="choose-sub">Hoe moeilijk wil je het?</p>
    <div class="puz-levels">
      ${PUZZLE_LEVELS.map((l) => `
        <button class="big-btn ${l.color} puz-level ${l.level === last ? 'last' : ''}" data-l="${l.level}">
          <div class="puz-stars">${l.stars}</div>
          <div class="big-text"><b>${l.title}</b><small>${l.desc}</small></div>
        </button>`).join('')}
    </div>
  </div>`;
  $('#back').onclick = () => go(Home);
  app.querySelectorAll('.puz-level').forEach((b) => {
    b.onclick = () => {
      Sound.play('tap');
      Store.data.extra.puzzleLevel = +b.dataset.l;
      Store.save();
      go(Puzzles, +b.dataset.l);
    };
  });
}

function Puzzles(level = 1) {
  const pool = puzzlePool(level);
  const lv = PUZZLE_LEVELS.find((l) => l.level === level) || PUZZLE_LEVELS[0];
  const ROUND = 5;
  const round = shuffle(pool).slice(0, Math.min(ROUND, pool.length));
  const results = [];
  let pi = 0;

  app.innerHTML = teacherLayout(`Puzzels: ${lv.title}`, '<div class="puzzle-stars" id="pstars"></div>');
  $('#back').onclick = () => go(PuzzleChoose);
  const setText = makeSetText();
  const stage = $('#stage');
  const actions = $('#actions');

  const drawStars = () => {
    $('#pstars').innerHTML = round.map((_, i) =>
      `<span class="${i < results.length ? (results[i] ? 'got' : 'half') : i === pi ? 'now' : ''}">${i < results.length ? (results[i] ? '★' : '✓') : '☆'}</span>`).join('');
  };

  function show() {
    drawStars();
    stage.innerHTML = '';
    const p = round[pi];
    // bij vooruit-denk-puzzels zet Pim er zelf 'Zet 1 van 2' voor
    const taskText = p.goal === 'plan' ? p.text : `Puzzel ${pi + 1}: ${p.text}`;
    setText(taskText);
    Exercise({ type: 'goal', ...p }, {
      stage, actions, setText, taskText,
      onSolved: (first) => {
        results.push(first);
        Store.data.puzzles++;
        Store.save();
        drawStars();
        awardBadges(800);
        const last = pi + 1 >= round.length;
        actions.innerHTML = `<button class="btn green huge pulse" id="next">${last ? 'Klaar! ▶' : 'Volgende puzzel ▶'}</button>`;
        $('#next').onclick = () => { Sound.play('tap'); pi++; if (last) finish(); else show(); };
      },
    });
  }

  function finish() {
    const stars = results.filter(Boolean).length;
    if (level >= 2) { Store.data.extra['rounds' + level] = (Store.data.extra['rounds' + level] || 0) + 1; Store.save(); awardBadges(1200); }
    Sound.play('win');
    confetti(stars * 25 + 30);
    const m = modal(`
      <div class="trophy">🧩</div>
      <h2>Rondje klaar!</h2>
      <div class="big-stars">${results.map((r) => (r ? '★' : '✓')).join(' ')}</div>
      <p>${stars === round.length ? 'Alles in één keer goed. Wauw!' : `${stars} in één keer goed. Knap!`}</p>
      <p class="small">Je hebt al ${Store.data.puzzles} puzzels opgelost.</p>
      <div class="modal-buttons">
        <button class="btn green" id="mAgain">Nog een rondje</button>
        <button class="btn grey" id="mHome">Naar huis</button>
      </div>`, 'celebrate');
    $('#mAgain', m).onclick = () => go(Puzzles, level);
    $('#mHome', m).onclick = () => go(Home);
  }

  show();
}

/* =========================================================
   PUZZEL VAN DE DAG
   ========================================================= */
function dailyPick(pool) {
  const key = todayStr();
  let h = 7;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

function DailyPuzzle() {
  const pool = dailyPool();
  app.innerHTML = teacherLayout('Puzzel van de dag');
  $('#back').onclick = () => go(Home);
  const setText = makeSetText();
  const already = dailyToday();
  const p = dailyPick(pool);
  const taskText = (already ? 'Al gedaan! Nog een keer? ' : '') + p.text;
  setText(taskText);
  Exercise({ type: 'goal', ...p }, {
    stage: $('#stage'), actions: $('#actions'), setText, taskText,
    onSolved: () => {
      const dl = Store.data.daily;
      const first = !dailyToday(); // niet dubbel tellen na 'Opnieuw'
      if (first) {
        dl.days.push(todayStr());
        if (dl.days.length > 400) dl.days = dl.days.slice(-400);
        Store.data.puzzles++;
        Store.save();
      }
      later(() => {
        Sound.play('win');
        confetti(120);
        const m = modal(`
          <div class="trophy">🧩</div>
          <h2>${first ? 'Puzzel van de dag: gelukt!' : 'Weer goed!'}</h2>
          <p>Deze week:</p>
          <div class="week">${weekDots()}</div>
          <p>Morgen is er een nieuwe puzzel.</p>
          <div class="modal-buttons"><button class="btn green" id="mHome">Naar huis</button><button class="btn blue" id="mMore">Meer puzzels</button></div>`, 'celebrate');
        $('#mHome', m).onclick = () => go(Home);
        $('#mMore', m).onclick = () => go(PuzzleChoose);
        awardBadges(900);
      }, 900);
    },
  });
}

/* De laatste 7 dagen: een sterretje op de dagen dat de puzzel gedaan is.
   Geen reeks die 'kapot' kan gaan: een dag overslaan is helemaal niet erg. */
function weekDots() {
  const set = new Set(Store.data.daily.days);
  const names = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  let html = '';
  for (let i = 6; i >= 0; i--) {
    const t = new Date();
    t.setDate(t.getDate() - i);
    const done = set.has(todayStr(t));
    html += `<span class="wd ${done ? 'on' : ''} ${i === 0 ? 'today' : ''}"><i>${done ? '⭐' : ''}</i>${names[t.getDay()]}</span>`;
  }
  return html;
}

/* =========================================================
   PRIJZENKAST
   ========================================================= */
function Prizes() {
  const have = new Set(Store.data.badges);
  app.innerHTML = `
  <div class="screen prizes">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Prijzenkast</div><div class="spacer"></div></div>
    <div class="shelf">
      ${getBadges().map((b) => `
        <div class="badge ${have.has(b.id) ? 'got' : ''}">
          ${have.has(b.id) ? badgeIcon(b) : '<div class="badge-emoji mystery">?</div>'}
          <b>${b.title}</b>
          <small>${b.desc}</small>
        </div>`).join('')}
    </div>
  </div>`;
  $('#back').onclick = () => go(Home);
}

/* =========================================================
   TEGENSTANDER KIEZEN (de ladder)
   ========================================================= */
/* Iedereen is meteen te kiezen. De eerste die nog niet verslagen is, krijgt een 'Nu!'-label. */
const nextOpp = () => FAMILY.opponents.findIndex((o) => !Store.data.wins[o.id]);
/* Sterren met halve sterren: niveau 1 = ½ ster, niveau 11 = 5 sterren */
const levelStars = (level) => Math.min(5, Math.max(0.5, Math.round((level * 10) / 11) / 2));
const oppStars = (o) => levelStars(o.level);
function starsHtml(n) {
  const full = Math.floor(n), half = n - full >= 0.5;
  return '<span class="st full">★</span>'.repeat(full) + (half ? '<span class="st half">★</span>' : '')
    + '<span class="st empty">★</span>'.repeat(5 - full - (half ? 1 : 0));
}

function ChooseOpponent() {
  const cards = FAMILY.opponents.map((o, i) => {
    const now = i === nextOpp();
    const s = oppStars(o);
    return `
    <button class="opp-card ${now ? 'now' : ''}" data-i="${i}">
      ${now ? '<div class="now-tag">Probeer mij!</div>' : ''}
      <div class="opp-step">${i + 1}</div>
      <div class="opp-avatar">${Avatars.html(o, 'happy')}</div>
      <div class="opp-name">${o.name}</div>
      <div class="opp-stars" aria-label="${s} sterren">${starsHtml(s)}</div>
      <div class="opp-intro">${o.intro}</div>
      <div class="opp-wins">🏆 ${Store.data.wins[o.id] || 0}</div>
    </button>`;
  }).join('');
  app.innerHTML = `
  <div class="screen choose">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Tegen wie wil je spelen?</div><div class="spacer"></div></div>
    <button class="together-btn" id="together">
      <span class="tg-icons">${Avatars.html(Store.profile(), 'laugh')}<b>+</b><span class="tg-q">?</span></span>
      <span><b>Samen spelen</b><small>Speel op deze tablet tegen iemand die naast je zit</small></span>
    </button>
    <div class="opp-grid">${cards}</div>
  </div>`;
  $('#back').onclick = () => go(Home);
  $('#together').onclick = () => { Sound.play('tap'); go(TogetherSetup); };
  app.querySelectorAll('.opp-card').forEach((b) => {
    b.onclick = () => {
      const i = +b.dataset.i;
      Sound.play('tap');
      go(Game, i);
    };
  });
  const next = nextOpp();
  if (next > 2) app.querySelector(`.opp-card[data-i="${next}"]`).scrollIntoView({ block: 'center' });
}

/* =========================================================
   SAMEN SPELEN: kies wie er meespeelt
   ========================================================= */
function TogetherSetup() {
  const guest = { id: 'gast', name: 'Gast', look: { skin: '#f0c7a2', hair: '#6b3e26', hairStyle: 'short', shirt: '#9c93aa' } };
  const people = FAMILY.opponents.concat(
    Store.global.profiles.filter((p) => p.id !== Store.global.current),
    [guest],
  );
  app.innerHTML = `
  <div class="screen choose">
    <div class="topbar"><button class="round-btn" id="back" aria-label="Terug">←</button><div class="title">Met wie speel je samen?</div><div class="spacer"></div></div>
    <p class="choose-sub">${playerName()} speelt met wit (onderaan). De ander speelt met zwart (bovenaan).</p>
    <div class="opp-grid small">
      ${people.map((p, i) => `
        <button class="opp-card" data-i="${i}">
          <div class="opp-avatar">${Avatars.html(p, 'happy')}</div>
          <div class="opp-name">${p.name}</div>
        </button>`).join('')}
    </div>
  </div>`;
  $('#back').onclick = () => go(ChooseOpponent);
  app.querySelectorAll('.opp-card').forEach((b) => {
    b.onclick = () => { Sound.play('tap'); go(Game, -1, people[+b.dataset.i]); };
  });
}

/* =========================================================
   EEN POTJE SPELEN
   ========================================================= */
/* oi = plek op de ladder; of oi = -1 en human = persoon voor samen spelen */
function Game(oi, human = null) {
  const together = !!human;
  const opp = together ? human : FAMILY.opponents[oi];
  const me = 'w';
  const player = Store.profile();
  let G;

  /* eigen timers: 'Opnieuw' zet ze allemaal stop */
  const glaterIds = [];
  const glater = (fn, ms) => { const t = later(fn, ms); glaterIds.push(t); return t; };
  const glaterStop = () => { glaterIds.forEach(clearTimeout); glaterIds.length = 0; };

  app.innerHTML = `
  <div class="screen game">
    <div class="topbar">
      <button class="round-btn" id="back" aria-label="Terug">←</button>
      <div class="title">${together ? `${playerName()} en ${opp.name} spelen samen` : `Potje tegen ${opp.name}`}</div>
      <div class="spacer"></div>
    </div>
    <div class="game-body">
      <div class="side opp-side">
        <div class="player-card" id="oppCard">
          <div class="pc-avatar" id="oppFace"></div>
          <div class="pc-info"><div class="pc-name">${opp.name}</div><div class="captured" id="capOpp"></div></div>
        </div>
        <div class="bubble opp-bubble" id="oppSay"></div>
      </div>
      <div class="board-zone"><div class="board-wrap" id="bw"><div class="banner" id="banner"></div></div></div>
      <div class="side me-side">
        <div class="player-card me" id="meCard">
          <div class="pc-avatar" id="meFace">${Avatars.html(player, 'happy')}</div>
          <div class="pc-info"><div class="pc-name">${playerName()}</div><div class="captured" id="capMe"></div></div>
        </div>
        <div class="turn" id="turn"></div>
        <div class="game-buttons">
          <button class="tool" id="hint"><span class="ti">💡</span>Tip</button>
          <button class="tool" id="undo"><span class="ti">↩️</span>Terug</button>
          <button class="tool" id="restart"><span class="ti">🔄</span>Opnieuw</button>
        </div>
      </div>
    </div>
  </div>`;

  const view = new BoardView($('#bw'), { onTap: (i) => tap(i) });
  let bubbleTimer = null;
  let bannerTimer = null;

  function oppSay(lines, mood = 'happy') {
    $('#oppFace').innerHTML = Avatars.html(opp, mood);
    const el = $('#oppSay');
    if (!lines || together) { el.classList.remove('show'); return; }
    el.textContent = personal(Array.isArray(lines) ? pick(lines) : lines);
    el.classList.remove('show'); el.getBoundingClientRect(); el.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => el.classList.remove('show'), 5000);
  }
  function oppMood(mood) { $('#oppFace').innerHTML = Avatars.html(opp, mood); }

  function banner(text, kind = '') {
    const b = $('#banner');
    b.textContent = text;
    b.className = 'banner show ' + kind;
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => { b.className = 'banner'; }, 2600);
  }

  function newGame() {
    glaterStop();
    closeModal();
    G = {
      state: Chess.fromFEN(Chess.START_FEN),
      keys: [], snaps: [], last: null, sel: null, dests: [], marks: [],
      busy: false, over: false, hint: null, capMe: [], capOpp: [],
      hints: 0, undos: 0, warns: 0, ignored: 0,
      history: [], // alle zetten, voor 'terugkijken met Pim'
    };
    G.keys.push(Chess.positionKey(G.state));
    draw();
    if (together) { oppMood('laugh'); banner(`${playerName()} begint met wit!`, 'good'); } else oppSay(opp.say.start, 'laugh');
  }

  const checkSq = () => (Chess.inCheck(G.state, G.state.turn) ? Chess.findKing(G.state.board, G.state.turn) : null);

  function draw(animate) {
    view.render(G.state.board, {
      selected: G.sel, dests: G.dests.map((m) => m.to), lastMove: G.last, check: checkSq(), hint: G.hint, marks: G.marks, animate,
    });
    const sortCap = (arr) => arr.slice().sort((a, b) => AI.VAL[b[1]] - AI.VAL[a[1]]).map((p) => `<span>${Pieces.svg(p)}</span>`).join('');
    $('#capMe').innerHTML = sortCap(G.capMe);
    $('#capOpp').innerHTML = sortCap(G.capOpp);
    const t = $('#turn');
    if (G.over) { t.textContent = 'Het potje is klaar'; t.className = 'turn'; }
    else if (G.busy) { t.textContent = `${opp.name} denkt na...`; t.className = 'turn wait'; }
    else if (together) {
      const whiteTurn = G.state.turn === 'w';
      t.textContent = whiteTurn ? `${playerName()} is aan de beurt (wit)` : `${opp.name} is aan de beurt (zwart)`;
      t.className = 'turn mine ' + (whiteTurn ? '' : 'black');
    } else { t.textContent = 'Jij bent aan de beurt!'; t.className = 'turn mine'; }
    $('#meCard').classList.toggle('active', !G.over && G.state.turn === 'w');
    $('#oppCard').classList.toggle('active', !G.over && G.state.turn === 'b');
    $('#undo').disabled = !G.snaps.length || G.busy || (G.over && G.result !== 'loss');
    $('#hint').disabled = G.busy || G.over;
  }

  function tap(i) {
    const side = together ? G.state.turn : me;
    if (G.busy || G.over || G.state.turn !== side) return;
    const mv = G.dests.find((m) => m.to === i);
    if (G.sel !== null && mv) return tryMove(mv);
    const p = G.state.board[i];
    G.marks = [];
    if (p && p[0] === side) {
      const ms = qMoves(Chess.legalMoves(G.state, i));
      if (!ms.length) {
        view.shake(i);
        Sound.play('oops');
        if (Chess.inCheck(G.state, side)) banner('Schaak! Red je koning! 👑', 'warn');
        else banner('Dit stuk kan nu niet.', '');
        G.sel = null; G.dests = [];
        return draw();
      }
      Sound.play('tap');
      G.sel = i; G.dests = ms;
      return draw();
    }
    if (p && p[0] !== side && G.sel === null) {
      banner(together ? `Nu is ${side === 'w' ? playerName() : opp.name} aan de beurt!` : 'Jij bent wit!');
    }
    G.sel = null; G.dests = [];
    draw();
  }

  /* Pas-op-hulp: waarschuw als Sam zomaar een stuk weggeeft */
  function tryMove(m) {
    if (m.promo && !m.picked) {
      const st = G.state;
      return askPromotion(st.turn, (t) => {
        const real = withPromo(st, m, t);
        real.picked = true;
        tryMove(real);
      });
    }
    if (Store.data.settings.warn && G.state.turn === me) {
      const next = Chess.makeMove(G.state, m);
      if (Chess.gameStatus(next) !== 'checkmate') {
        const gain = m.captured ? AI.VAL[m.captured[1]] : 0;
        const after = Tactics.loss(next);
        const before = Chess.inCheck(G.state, me) ? { loss: 0 } : Tactics.loss({ ...G.state, turn: 'b', ep: null });
        const net = after.loss - gain;
        if (net >= 200 && net > before.loss) return warn(m, after);
      }
    }
    playerMove(m);
  }

  function warn(m, danger) {
    Sound.play('check');
    G.warns++;
    const sw = Store.data.stats.warn;
    sw.shown++;
    sw.pieces[danger.piece[1]] = (sw.pieces[danger.piece[1]] || 0) + 1;
    Store.save();
    const sameSq = danger.sq === m.to;
    const name = Pieces.NAMES[danger.piece[1]];
    G.marks = [sameSq ? m.from : danger.sq];
    draw();
    const m2 = modal(`
      <div class="modal-avatar">${Pieces.svg(danger.piece)}</div>
      <h2>Pas op!</h2>
      <p>Dan kan ${together ? 'zwart' : opp.name} je ${name} pakken!</p>
      <p class="small">Weet je het zeker?</p>
      <div class="modal-buttons">
        <button class="btn green" id="wOther">Andere zet</button>
        <button class="btn grey" id="wDo">Toch doen</button>
      </div>`);
    $('#wOther', m2).onclick = () => { closeModal(); G.sel = null; G.dests = []; G.marks = []; draw(); };
    $('#wDo', m2).onclick = () => { closeModal(); G.marks = []; G.ignored++; Store.data.stats.warn.ignored++; Store.save(); playerMove(m); };
  }

  function apply(m) {
    G.history.push({ before: G.state, m });
    G.state = Chess.makeMove(G.state, m);
    G.keys.push(Chess.positionKey(G.state));
    G.last = { from: m.from, to: m.to };
    G.sel = null; G.dests = []; G.hint = null; G.marks = [];
    Sound.play(m.captured ? 'capture' : 'move');
  }

  function playerMove(m) {
    G.snaps.push({
      state: G.state, keys: G.keys.slice(), last: G.last, capMe: G.capMe.slice(), capOpp: G.capOpp.slice(),
      hist: G.history.length,
    });
    const mover = G.state.turn;
    apply(m);
    if (together && mover === 'b') return blackHumanMove(m);
    if (m.captured) G.capMe.push(m.captured);
    if (m.promo) { banner(`Toverij! Je pion is nu een ${PROMO_NAME[m.promo]}!`, 'good'); glater(() => Sound.play('magic'), 200); }
    if (m.flag === 'castleK' || m.flag === 'castleQ') banner('Goed zo! Gerokeerd! 🏰', 'good');

    const st = Chess.gameStatus(G.state, G.keys);
    if (st) { draw({ from: m.from, to: m.to }); return end(st); }

    if (together) {
      draw({ from: m.from, to: m.to });
      if (Chess.inCheck(G.state, 'b')) { banner(`Schaak! ${opp.name}, red je koning! 👑`, 'warn'); oppMood('surprised'); glater(() => Sound.play('check'), 250); }
      else if (m.captured) oppMood('sad');
      else oppMood('thinking');
      $('#meFace').innerHTML = Avatars.html(player, m.captured ? 'laugh' : 'happy');
      return;
    }

    let reacted = false;
    if (Chess.inCheck(G.state, 'b')) { oppSay(opp.say.gotCheck, 'surprised'); reacted = true; glater(() => Sound.play('check'), 250); }
    else if (m.captured && AI.VAL[m.captured[1]] >= 100) { oppSay(opp.say.lostPiece, 'sad'); reacted = true; }

    G.busy = true;
    draw({ from: m.from, to: m.to });
    if (!reacted) glater(() => { if (Math.random() < 0.35) oppSay(opp.say.think, 'thinking'); else oppMood('thinking'); }, 300);
    else glater(() => oppMood('thinking'), 1600);

    const startT = performance.now();
    glater(() => {
      const am = AI.chooseMove(G.state, opp.level);
      const minWait = reacted ? 1900 : 900 + Math.random() * 700;
      glater(() => opponentMove(am), Math.max(0, minWait - (performance.now() - startT)));
    }, 350);
  }

  /* Samen spelen: zwart (een mens) heeft gezet */
  function blackHumanMove(m) {
    if (m.captured) G.capOpp.push(m.captured);
    if (m.promo) banner(`Toverij! De pion van ${opp.name} is nu een ${PROMO_NAME[m.promo]}!`, 'good');
    draw({ from: m.from, to: m.to });
    const st = Chess.gameStatus(G.state, G.keys);
    if (st) return end(st);
    if (Chess.inCheck(G.state, me)) {
      glater(() => Sound.play('check'), 250);
      banner(`Schaak! ${playerName()}, red je koning! 👑`, 'warn');
      oppMood('wink');
      $('#meFace').innerHTML = Avatars.html(player, 'surprised');
    } else {
      oppMood(m.captured ? 'laugh' : 'happy');
      $('#meFace').innerHTML = Avatars.html(player, m.captured ? 'sad' : 'thinking');
    }
  }

  function opponentMove(m) {
    if (!m) return;
    apply(m);
    if (m.captured) G.capOpp.push(m.captured);
    G.busy = false;
    draw({ from: m.from, to: m.to });

    const st = Chess.gameStatus(G.state, G.keys);
    if (st) return end(st);
    if (Chess.inCheck(G.state, me)) {
      glater(() => Sound.play('check'), 250);
      banner('Schaak! Red je koning! 👑', 'warn');
      oppSay(opp.say.gaveCheck, 'wink');
    } else if (m.captured) {
      oppSay(opp.say.tookPiece, 'laugh');
    } else {
      oppMood('happy');
    }
  }

  function undo() {
    if (G.busy || !G.snaps.length || (G.over && G.result !== 'loss')) return;
    Sound.play('tap');
    G.undos++;
    const s = G.snaps.pop();
    G.history.length = s.hist;
    Object.assign(G, { state: s.state, keys: s.keys, last: s.last, capMe: s.capMe, capOpp: s.capOpp, over: false, result: null, sel: null, dests: [], hint: null, marks: [] });
    closeModal();
    oppMood('happy');
    draw();
    banner('Zet terug. Probeer nog eens!');
  }

  function showHint() {
    if (G.busy || G.over) return;
    Sound.play('tap');
    $('#turn').textContent = 'Pim denkt even mee...';
    glater(() => {
      const h = AI.hint(G.state);
      if (!h) return;
      G.hints++;
      G.hint = { from: h.from, to: h.to };
      G.sel = h.from;
      G.dests = qMoves(Chess.legalMoves(G.state, h.from));
      draw();
      const name = Pieces.NAMES[h.piece[1]];
      banner('💡 ' + (h.captured ? `Tip: sla met je ${name}!` : `Tip: zet je ${name} op het gele vakje.`), 'good');
    }, 120);
  }

  const DRAW_TEXT = {
    stalemate: 'Pat! Zwart kan geen zet meer doen. Gelijkspel.',
    material: 'Te weinig stukken over. Gelijkspel!',
    fifty: 'Heel lang niks geslagen. Gelijkspel!',
    repetition: 'Steeds dezelfde zetten. Gelijkspel!',
  };

  function end(st) {
    G.over = true;
    G.busy = false;
    draw();
    const d = Store.data;
    const whiteWon = st === 'checkmate' && G.state.turn === 'b';
    const blackWon = st === 'checkmate' && G.state.turn === 'w';
    G.result = whiteWon ? 'win' : blackWon ? 'loss' : 'draw';
    if (together) G.result = 'together';
    const nextOpp = together ? null : FAMILY.opponents[oi + 1];
    const firstWin = !together && whiteWon && !d.wins[opp.id];
    let html;

    if (together) {
      Stats.game({ opp: opp.name, together: true, result: whiteWon ? 'win' : blackWon ? 'loss' : 'draw', moves: G.keys.length - 1, hints: G.hints, undos: G.undos, warns: G.warns });
      if (st === 'checkmate') {
        const winner = whiteWon ? player : opp;
        const loser = whiteWon ? opp : player;
        glater(() => { Sound.play('win'); confetti(140); }, 300);
        oppMood(blackWon ? 'laugh' : 'happy');
        $('#meFace').innerHTML = Avatars.html(player, whiteWon ? 'laugh' : 'happy');
        html = `<div class="trophy">🏆</div><h2>Schaakmat! ${winner.name} wint!</h2>
          <div class="duo-avatars"><div>${Avatars.html(winner, 'laugh')}</div><div>${Avatars.html(loser, 'happy')}</div></div>
          <p>Goed gespeeld! Geef een high five ✋</p>`;
      } else {
        html = `<div class="trophy">🤝</div><h2>Gelijkspel!</h2><p>${DRAW_TEXT[st]}</p>`;
      }
    } else {
      d.played[opp.id] = (d.played[opp.id] || 0) + 1;
      Stats.game({ opp: opp.name, oppId: opp.id, level: opp.level, result: whiteWon ? 'win' : blackWon ? 'loss' : 'draw', moves: G.keys.length - 1, hints: G.hints, undos: G.undos, warns: G.warns });
      if (whiteWon) {
        d.wins[opp.id] = (d.wins[opp.id] || 0) + 1;
        oppSay(opp.say.lose, 'happy');
        glater(() => { Sound.play('win'); confetti(140); }, 300);
        html = `<div class="trophy">🏆</div><h2>Schaakmat! Jij wint!</h2>
          <div class="modal-avatar">${Avatars.html(opp, 'laugh')}</div>
          <p class="quote">"${$('#oppSay').textContent}"</p>
          <p>Al ${d.wins[opp.id]} keer gewonnen van ${opp.name}!</p>
          ${firstWin && nextOpp ? `<p class="world-unlock">Probeer nu ${nextOpp.name} eens!</p>` : ''}`;
      } else if (blackWon) {
        oppSay(opp.say.win, 'laugh');
        glater(() => Sound.play('lose'), 300);
        html = `<h2>Schaakmat... ${opp.name} wint</h2>
          <div class="modal-avatar">${Avatars.html(opp, 'wink')}</div>
          <p class="quote">"${$('#oppSay').textContent}"</p>
          <p>Niet erg! Volgende keer beter.</p>`;
      } else {
        oppSay(opp.say.draw, 'happy');
        html = `<div class="trophy">🤝</div><h2>Gelijkspel!</h2><p>${DRAW_TEXT[st]}</p>`;
      }
    }
    Store.save();
    glater(() => {
      const m = modal(`${html}
        <div class="modal-buttons">
          ${firstWin && nextOpp ? `<button class="btn orange" id="mNextOpp">Speel tegen ${nextOpp.name} ▶</button>` : ''}
          ${G.history.length >= 6 ? '<button class="btn yellow" id="mReview">🔍 Terugkijken met Pim</button>' : ''}
          <button class="btn green" id="mAgain">Nog een potje</button>
          ${blackWon && !together ? '<button class="btn blue" id="mUndo">↩️ Zet terug</button>' : ''}
          ${firstWin && nextOpp ? '' : `<button class="btn orange" id="mOther">${together ? 'Met iemand anders' : 'Andere tegenstander'}</button>`}
          <button class="btn grey" id="mLook">Bord bekijken</button>
        </div>`, 'celebrate');
      $('#mAgain', m).onclick = newGame;
      if ($('#mReview', m)) $('#mReview', m).onclick = () => go(Review, { history: G.history.slice(), opp, together, oi });
      if ($('#mNextOpp', m)) $('#mNextOpp', m).onclick = () => go(Game, oi + 1);
      if ($('#mUndo', m)) $('#mUndo', m).onclick = undo;
      if ($('#mOther', m)) $('#mOther', m).onclick = () => go(together ? TogetherSetup : ChooseOpponent);
      $('#mLook', m).onclick = closeModal;
      awardBadges(900);
    }, 1100);
  }

  $('#back').onclick = () => {
    const back = together ? TogetherSetup : ChooseOpponent;
    if (G.over || !G.snaps.length) return go(back);
    ask('Wil je stoppen met dit potje?', () => go(back));
  };
  $('#undo').onclick = undo;
  $('#hint').onclick = showHint;
  $('#restart').onclick = () => ask('Wil je opnieuw beginnen?', newGame);
  screenCleanup = () => { clearTimeout(bubbleTimer); clearTimeout(bannerTimer); };
  window.__game = () => G; // handig bij het testen

  newGame();
}
