/* =========================================================
   Sammie Schaakt! - DE LESSEN (van makkelijk naar moeilijk)
   Sam is 7 en leest nog niet zo goed: korte, simpele zinnetjes!

   Soorten stapjes:
   talk     Pim vertelt iets. Optioneel een bordje erbij:
            pieces: { d4: 'wR' }  of  fen: '...'
            showMoves: 'd4'  -> laat zien waar dat stuk heen mag
            mark: ['e4', ...] -> vakjes oplichten
            demo: ['e1-g1', ...] -> filmpje: de stukken bewegen vanzelf (met knop 'Nog eens')
            markAfter: [...] -> vakjes die oplichten als het filmpje klaar is
            demoSay: [...] -> wat Pim zegt bij elke zet van het filmpje
            demoWin: 'mate' of 'Q'/'R' -> het filmpje is een vooruit-denk-reeks;
                     de puzzelcontrole kijkt dan of het filmpje klopt
   quiz     Vraag met knoppen. options: [{ label, piece?, ok: true }]
            Met pieces/fen erbij staat er een bordje naast de vraag.
   stars    Pak alle sterren met je stuk(ken).
            Staan er ook witte pionnen bij een ander stuk? Dan zijn dat obstakels.
   capture  Sla alle zwarte stukken. (Zwart doet niks terug.)
   goal     Een echte stelling, doe de goede zet.
            goal: 'check'     geef schaak
                  'mate'      geef schaakmat
                  'castle'    rokeer
                  'escape'    red je koning
                  'hanging'   pak een los (onbeschermd) stuk
                  'safe'      zorg dat geen enkel stuk van jou zomaar te pakken is
                  'fork'      val twee stukken tegelijk aan (vork)
                  'stopmate'  zwart dreigt schaakmat in één zet: stop het
                  'to'        zet een bepaald stuk (piece: 'P') naar een van squares: [...]
                  'plan'      VOORUIT DENKEN: 2 of 3 zetten achter elkaar.
                              win: 'mate' (geef schaakmat), 'promo' (promoveer veilig) of 'Q'/'R' (pak dat zwarte stuk)
                              line: ['wit', 'zwart', 'wit', ...] de oplossing; zwart zet vanzelf
                              say: wat Pim zegt na elke zet van zwart
   world: in welke wereld de les hoort (zie WORLDS)
   ========================================================= */
const WORLDS = [
  { nr: 1, title: 'De stukken', color: '#4a9df8' },
  { nr: 2, title: 'De regels', color: '#ff8c42' },
  { nr: 3, title: 'Slim spelen', color: '#9b5de5' },
  { nr: 4, title: 'Twee zetten vooruit', color: '#14b8a6' },
  { nr: 5, title: 'Drie zetten vooruit', color: '#ef476f' },
  { nr: 6, title: 'Nog slimmer', color: '#e76f51' },
];

const LESSON_START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const LESSONS = [
  {
    world: 1, id: 'bord', title: 'Het schaakbord', icon: 'wK',
    steps: [
      { type: 'talk', text: 'Hoi Sam! Ik ben Pim het Paard. Ik leer jou schaken!', pieces: { e4: 'wN' } },
      { type: 'talk', text: 'Dit is het bord. Het heeft lichte en donkere vakjes.', pieces: {} },
      { type: 'talk', text: 'Jij bent wit. Jouw stukken staan onderaan.', fen: LESSON_START },
      { type: 'talk', text: 'Je zet om de beurt. Wit begint altijd!', fen: LESSON_START },
      { type: 'quiz', text: 'Wie begint er?', options: [{ label: 'Wit', piece: 'wP', ok: true }, { label: 'Zwart', piece: 'bP' }] },
      { type: 'quiz', text: 'Hoeveel vakjes heeft het bord?', options: [{ label: '10' }, { label: '64', ok: true }, { label: '5' }] },
    ],
  },
  {
    world: 1, id: 'toren', title: 'De toren', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Dit is de toren. Net een kasteel!', pieces: { d4: 'wR' } },
      { type: 'talk', text: 'De toren gaat recht. Zo ver als hij wil!', pieces: { d4: 'wR' }, showMoves: 'd4' },
      { type: 'stars', text: 'Pak de ster! Tik op de toren. Tik dan op de ster.', pieces: { a1: 'wR' }, stars: ['a6'] },
      { type: 'stars', text: 'Pak de twee sterren!', pieces: { a1: 'wR' }, stars: ['a6', 'f6'] },
      { type: 'stars', text: 'Pak de drie sterren!', pieces: { d4: 'wR' }, stars: ['d8', 'h8', 'h1'] },
      { type: 'talk', text: 'De toren kan niet springen. De pion staat in de weg.', pieces: { c2: 'wR', c5: 'wP' }, showMoves: 'c2' },
      { type: 'stars', text: 'Loop om de pion heen!', pieces: { c2: 'wR', c5: 'wP' }, stars: ['c7'] },
    ],
  },
  {
    world: 1, id: 'loper', title: 'De loper', icon: 'wB',
    steps: [
      { type: 'talk', text: 'Dit is de loper. Hij heeft een puntmuts.', pieces: { d4: 'wB' } },
      { type: 'talk', text: 'De loper gaat schuin. Zo ver als hij wil!', pieces: { d4: 'wB' }, showMoves: 'd4' },
      { type: 'stars', text: 'Pak de ster!', pieces: { c1: 'wB' }, stars: ['f4'] },
      { type: 'stars', text: 'Pak de twee sterren!', pieces: { c1: 'wB' }, stars: ['f4', 'd6'] },
      { type: 'talk', text: 'Kijk! De loper blijft op dezelfde kleur.', pieces: { f1: 'wB' }, showMoves: 'f1' },
      { type: 'stars', text: 'Pak alle sterren!', pieces: { f1: 'wB' }, stars: ['b5', 'e8', 'h5'] },
    ],
  },
  {
    world: 1, id: 'koningin', title: 'De koningin', icon: 'wQ',
    steps: [
      { type: 'talk', text: 'Dit is de koningin. Ze heeft een kroon.', pieces: { d4: 'wQ' } },
      { type: 'talk', text: 'Zij is super sterk! Ze gaat recht én schuin.', pieces: { d4: 'wQ' }, showMoves: 'd4' },
      { type: 'stars', text: 'Pak de sterren!', pieces: { d1: 'wQ' }, stars: ['d7', 'h3'] },
      { type: 'stars', text: 'Pak de sterren in de hoeken!', pieces: { a1: 'wQ' }, stars: ['h8', 'h1', 'a8'] },
      { type: 'stars', text: 'De pionnen staan in de weg. Pak alle sterren!', pieces: { e1: 'wQ', e4: 'wP', c3: 'wP' }, stars: ['a5', 'e8', 'h4'] },
    ],
  },
  {
    world: 1, id: 'koning', title: 'De koning', icon: 'wK',
    steps: [
      { type: 'talk', text: 'Dit is de koning. Hij is het belangrijkst!', pieces: { d4: 'wK' } },
      { type: 'talk', text: 'De koning zet maar één stapje. Wel alle kanten op.', pieces: { d4: 'wK' }, showMoves: 'd4' },
      { type: 'stars', text: 'Loop naar de ster. Stapje voor stapje!', pieces: { e1: 'wK' }, stars: ['e3'] },
      { type: 'stars', text: 'Pak alle sterren!', pieces: { d4: 'wK' }, stars: ['c5', 'e5', 'f3'] },
    ],
  },
  {
    world: 1, id: 'paard', title: 'Het paard', icon: 'wN',
    steps: [
      { type: 'talk', text: 'En dit ben ik: het paard!', pieces: { d4: 'wN' } },
      { type: 'talk', text: 'Ik spring als een L. Twee rechtdoor, één opzij.', pieces: { d4: 'wN' }, showMoves: 'd4' },
      { type: 'stars', text: 'Spring naar de ster!', pieces: { b1: 'wN' }, stars: ['c3'] },
      { type: 'stars', text: 'Spring van ster naar ster!', pieces: { b1: 'wN' }, stars: ['c3', 'd5', 'f6'] },
      { type: 'talk', text: 'Ik kan over stukken heen springen!', pieces: { g1: 'wN', f2: 'wP', g2: 'wP', h2: 'wP' }, showMoves: 'g1' },
      { type: 'stars', text: 'Spring over de pionnen!', pieces: { g1: 'wN', f2: 'wP', g2: 'wP', h2: 'wP' }, stars: ['f3', 'e5'] },
      { type: 'stars', text: 'Pak alle sterren!', pieces: { a1: 'wN' }, stars: ['b3', 'd2', 'c4'] },
    ],
  },
  {
    world: 1, id: 'pion', title: 'De pion', icon: 'wP',
    steps: [
      { type: 'talk', text: 'Dit is de pion. Klein, maar dapper!', pieces: { e2: 'wP' } },
      { type: 'talk', text: 'De pion zet één stapje vooruit. Nooit terug!', pieces: { e3: 'wP' }, showMoves: 'e3' },
      { type: 'talk', text: 'De eerste keer mag hij twee stapjes.', pieces: { e2: 'wP' }, showMoves: 'e2' },
      { type: 'stars', text: 'Pak de ster in één keer!', pieces: { e2: 'wP' }, stars: ['e4'] },
      { type: 'stars', text: 'Loop naar de ster!', pieces: { d2: 'wP' }, stars: ['d6'] },
      { type: 'talk', text: 'De pion slaat schuin. Eén stapje schuin vooruit.', pieces: { e4: 'wP', d5: 'bP', f5: 'bN' }, showMoves: 'e4' },
      { type: 'capture', text: 'Sla de zwarte pion!', pieces: { e4: 'wP', d5: 'bP' } },
      { type: 'talk', text: 'Komt de pion aan de overkant? Dan verandert hij! Kijk maar.', pieces: { b7: 'wP' }, mark: ['b8'], demo: ['b7-b8'], markAfter: ['b8'] },
      { type: 'talk', text: 'Dat heet PROMOVEREN. Jij kiest: koningin, toren, loper of paard.', pieces: { a4: 'wQ', c4: 'wR', e4: 'wB', g4: 'wN' } },
      { type: 'talk', text: 'Kies bijna altijd de koningin. Zij is het sterkst!', pieces: { d4: 'wQ' } },
      { type: 'stars', text: 'Breng de pion naar de overkant!', pieces: { b5: 'wP' }, stars: ['b8'] },
    ],
  },
  {
    world: 2, id: 'slaan', title: 'Slaan', icon: 'bP',
    steps: [
      { type: 'talk', text: 'Je kunt stukken SLAAN. Zet jouw stuk op hun vakje. Hap, weg!', pieces: { a1: 'wR', a5: 'bP' }, showMoves: 'a1', demo: ['a1-a5'] },
      { type: 'capture', text: 'Sla alles met de toren!', pieces: { a1: 'wR', a5: 'bP', e5: 'bN' } },
      { type: 'capture', text: 'Sla alles met de loper!', pieces: { c1: 'wB', f4: 'bP', h6: 'bP', f8: 'bR' } },
      { type: 'capture', text: 'Sla alles met het paard!', pieces: { b1: 'wN', c3: 'bP', e4: 'bB', g5: 'bR' } },
      { type: 'capture', text: 'De koningin heeft honger. Sla alles!', pieces: { d1: 'wQ', d6: 'bN', a3: 'bP', g3: 'bB', g8: 'bR' } },
    ],
  },
  {
    world: 2, id: 'waarde', title: 'Wat is een stuk waard?', icon: 'wQ',
    steps: [
      { type: 'talk', text: 'Niet elk stuk is even sterk. Een pion is 1 punt.', pieces: { d4: 'wP' } },
      { type: 'talk', text: 'Een paard is 3 punten. Een loper ook.', pieces: { c4: 'wN', e4: 'wB' } },
      { type: 'talk', text: 'Een toren is 5 punten. De koningin wel 9!', pieces: { c4: 'wR', e4: 'wQ' } },
      { type: 'talk', text: 'De koning is het belangrijkst. Pas goed op hem!', pieces: { d4: 'wK' } },
      { type: 'quiz', text: 'Welke is het sterkst?', options: [{ label: 'Pion', piece: 'wP' }, { label: 'Koningin', piece: 'wQ', ok: true }, { label: 'Paard', piece: 'wN' }] },
      { type: 'quiz', text: 'Welke is sterker?', options: [{ label: 'Toren', piece: 'wR', ok: true }, { label: 'Loper', piece: 'wB' }] },
      { type: 'talk', text: 'Geef je sterke stukken niet zomaar weg!', pieces: { d4: 'wQ' } },
    ],
  },
  {
    world: 2, id: 'schaak', title: 'Schaak!', icon: 'bK',
    steps: [
      { type: 'talk', text: 'Kijk! De toren gaat de zwarte koning aanvallen.', fen: '4k3/8/8/8/8/8/8/K6R w - - 0 1', demo: ['h1-e1'], markAfter: ['e8'] },
      { type: 'talk', text: 'Dat heet SCHAAK! De koning is in gevaar. Zie je de lijn?', fen: '4k3/8/8/8/8/8/8/K3R3 b - - 0 1', showMoves: 'e1' },
      { type: 'talk', text: 'Staat jouw koning schaak? Dan moet je hem meteen redden.', fen: '4k3/8/8/8/8/8/8/K3R3 b - - 0 1', mark: ['e8'] },
      { type: 'talk', text: 'Dat kan op drie manieren. Eén: loop weg met je koning.', fen: 'r6k/8/8/8/8/8/1P6/K7 w - - 0 1', demo: ['a1-b1'] },
      { type: 'talk', text: 'Twee: zet een stuk ertussen. Dan is de lijn dicht.', fen: '4r1k1/8/8/8/R7/8/8/4K3 w - - 0 1', demo: ['a4-e4'], markAfter: ['e4'] },
      { type: 'talk', text: 'Drie: sla het stuk dat schaak geeft!', fen: '6k1/8/8/8/8/8/3q4/3RK3 w - - 0 1', demo: ['d1-d2'] },
      { type: 'goal', goal: 'check', text: 'Val de koning aan met je toren!', fen: '4k3/8/8/8/8/8/8/4K2R w - - 0 1' },
      { type: 'goal', goal: 'check', text: 'Val de koning aan met je loper!', fen: '4k3/8/8/8/8/8/8/K4B2 w - - 0 1' },
      { type: 'goal', goal: 'escape', text: 'Help! Jouw koning staat schaak. Loop weg!', fen: 'r6k/8/8/8/8/8/1P6/K7 w - - 0 1' },
      { type: 'goal', goal: 'escape', text: 'Weer schaak! Weglopen kan niet. Sla het stuk!', fen: 'k7/8/8/8/2b5/8/3q4/1R2K3 w - - 0 1' },
    ],
  },
  {
    world: 2, id: 'mat', title: 'Schaakmat', icon: 'wK',
    steps: [
      { type: 'talk', text: 'Kijk goed! De toren geeft schaak.', fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1', demo: ['d1-d8'], markAfter: ['g8'] },
      { type: 'talk', text: 'Kan de koning weg? Nee! Zijn eigen pionnen staan in de weg.', fen: '3R2k1/5ppp/8/8/8/8/8/6K1 b - - 0 1', mark: ['f7', 'g7', 'h7'] },
      { type: 'talk', text: 'Schaak, en de koning kan niet ontsnappen? Dat heet SCHAAKMAT!', fen: '3R2k1/5ppp/8/8/8/8/8/6K1 b - - 0 1', mark: ['g8'] },
      { type: 'talk', text: 'Schaakmat is het einde van het spel. Jij hebt gewonnen!', fen: '3R2k1/5ppp/8/8/8/8/8/6K1 b - - 0 1' },
      { type: 'quiz', text: 'Is dit schaakmat? Kijk naar het vakje h7.', fen: '3R2k1/5pp1/8/8/8/8/8/6K1 b - - 0 1', options: [{ label: 'Ja' }, { label: 'Nee', ok: true }] },
      { type: 'quiz', text: 'En dit? Is dit schaakmat?', fen: 'k7/1Q6/1K6/8/8/8/8/8 b - - 0 1', options: [{ label: 'Ja', ok: true }, { label: 'Nee' }] },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat met je toren!', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: 'k7/8/1K6/8/8/8/7Q/8 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Twee torens helpen elkaar. Geef schaakmat!', fen: 'k7/8/8/8/8/8/1R6/6RK w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat!', fen: '3k4/8/3K4/8/8/8/8/7R w - - 0 1' },
    ],
  },
  {
    world: 2, id: 'rokeren', title: 'Rokeren', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Nu leer je een speciale zet. Hij heet ROKEREN.', fen: '4k3/8/8/8/8/8/5PPP/4K2R w K - 0 1', mark: ['e1', 'h1'] },
      { type: 'talk', text: 'Je zet dan twee stukken tegelijk: de koning én de toren!', fen: '4k3/8/8/8/8/8/5PPP/4K2R w K - 0 1', mark: ['e1', 'h1'] },
      { type: 'talk', text: 'Kijk goed. Ik doe het voor!', fen: '4k3/8/8/8/8/8/5PPP/4K2R w K - 0 1', demo: ['e1-g1'], markAfter: ['f1', 'g1'] },
      { type: 'talk', text: 'De koning zet twee stapjes opzij. De toren springt over hem heen.', fen: '4k3/8/8/8/8/8/5PPP/5RK1 b - - 0 1', mark: ['f1', 'g1'] },
      { type: 'talk', text: 'Waarom? Nu zit je koning veilig in de hoek, achter zijn pionnen.', fen: '4k3/8/8/8/8/8/5PPP/5RK1 b - - 0 1', mark: ['f2', 'g2', 'h2'] },
      { type: 'goal', goal: 'castle', text: 'Nu jij! Tik op de koning. Zet hem twee stapjes naar de toren.', fen: '4k3/8/8/8/8/8/5PPP/4K2R w K - 0 1' },
      { type: 'talk', text: 'Het kan ook naar de andere kant. Kijk maar!', fen: '4k3/8/8/8/8/8/PPP5/R3K3 w Q - 0 1', demo: ['e1-c1'], markAfter: ['c1', 'd1'] },
      { type: 'talk', text: 'Ook hier: de koning zet twee stapjes. De toren springt over hem heen.', fen: '4k3/8/8/8/8/8/PPP5/2KR4 b - - 0 1', mark: ['c1', 'd1'] },
      { type: 'goal', goal: 'castle', text: 'Rokeer naar deze kant!', fen: '4k3/8/8/8/8/8/PPP5/R3K3 w Q - 0 1' },
      { type: 'talk', text: 'Let op! Rokeren mag niet altijd. Er mag niks tussen staan.', fen: '4k3/8/8/8/8/8/5PPP/4KB1R w K - 0 1', mark: ['f1'] },
      { type: 'talk', text: 'De koning en de toren mogen nog niet gezet hebben.', fen: '4k3/8/8/8/8/8/5PPP/4K2R w K - 0 1', mark: ['e1', 'h1'] },
      { type: 'talk', text: 'En je koning mag niet schaak staan.', fen: '4r1k1/8/8/8/8/8/5PPP/4K2R w K - 0 1', mark: ['e8'] },
      { type: 'quiz', text: 'Mag wit hier rokeren?', fen: '4k3/8/8/8/8/8/5PPP/4KB1R w K - 0 1', options: [{ label: 'Ja' }, { label: 'Nee', ok: true }] },
    ],
  },
  {
    world: 2, id: 'tips', title: 'Klaar voor een potje!', icon: 'bQ',
    steps: [
      { type: 'talk', text: 'Je kent nu de regels! Hier zijn drie tips.', fen: LESSON_START },
      { type: 'talk', text: 'Tip 1: Zet je stukken in het midden.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', mark: ['d4', 'e4', 'd5', 'e5'] },
      { type: 'talk', text: 'Tip 2: Kijk goed. Kan zwart mijn stuk pakken?', fen: 'rnbqkbnr/ppp1pppp/8/3p4/4Q3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3', mark: ['e4'] },
      { type: 'talk', text: 'Tip 3: Pas goed op je koning!', fen: 'rnbqkbnr/pppp1ppp/8/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3', mark: ['f7'] },
      { type: 'quiz', text: 'Wat doe je voor elke zet?', options: [{ label: 'Goed kijken!', ok: true }, { label: 'Heel snel!' }] },
      { type: 'talk', text: 'Hoera! Speel maar een potje tegen Opa!', pieces: { d4: 'wN', e4: 'wK' } },
    ],
  },
  /* ---------------- WERELD 3: SLIM SPELEN ---------------- */
  {
    world: 3, id: 'los', title: 'Losse stukken', icon: 'bN',
    steps: [
      { type: 'talk', text: 'Welkom in wereld 3! Hier leer je slim spelen.', pieces: { d4: 'wN', e4: 'wK' } },
      { type: 'talk', text: 'Beschermt niemand dit stuk? Dan noem je het LOS.', fen: '4k3/8/8/8/1b6/8/8/1R2K3 w - - 0 1', mark: ['b4'] },
      { type: 'talk', text: 'Een los stuk pak je gratis. Zwart kan niks terugpakken!', fen: '4k3/8/8/8/1b6/8/8/1R2K3 w - - 0 1', demo: ['b1-b4'] },
      { type: 'talk', text: 'Deze pion wordt BESCHERMD door een andere pion.', fen: '4k3/8/2p5/3p4/8/8/8/3QK3 w - - 0 1', mark: ['d5', 'c6'] },
      { type: 'talk', text: 'Pak je hem toch? Kijk wat er dan gebeurt!', fen: '4k3/8/2p5/3p4/8/8/8/3QK3 w - - 0 1', demo: ['d1-d5', 'c6-d5'], markAfter: ['d5'] },
      { type: 'talk', text: 'Oei! Jouw koningin is weg. Voor maar één pionnetje.', fen: '4k3/8/8/3p4/8/8/8/4K3 w - - 0 1', mark: ['d5'] },
      { type: 'goal', goal: 'hanging', text: 'Pak het stuk dat niemand beschermt!', fen: '6k1/2p2ppp/3n4/8/8/8/8/b2R2K1 w - - 0 1' },
      { type: 'goal', goal: 'hanging', text: 'Pak het losse stuk met je paard!', fen: '4k3/8/p7/1n6/4b3/2N5/8/4K3 w - - 0 1' },
      { type: 'goal', goal: 'hanging', text: 'Welk stuk is gratis? Pak het!', fen: '6k1/5p1p/6p1/7b/n7/8/8/3Q2K1 w - - 0 1' },
    ],
  },
  {
    world: 3, id: 'redden', title: 'Red je stuk!', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Wordt jouw stuk aangevallen? Red het dan!', fen: '4k3/8/8/8/8/n7/Pb6/R3K3 w - - 0 1', mark: ['a1', 'b2'] },
      { type: 'talk', text: 'Loop weg naar een veilig vakje. Of zet er een helper naast.', fen: '4k3/8/8/8/8/n7/Pb6/R3K3 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'Zet de toren op een veilig vakje!', fen: '4k3/8/8/8/8/n7/Pb6/R3K3 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'Red je koningin!', fen: '6k1/8/8/8/8/1P6/Pp6/Q1b3K1 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'Red je paard!', fen: '6k1/8/8/8/8/n7/1b6/N5K1 w - - 0 1' },
      { type: 'talk', text: 'Twee stukken in gevaar? Pak dan de aanvaller!', fen: '8/5pk1/8/8/8/1p6/R1B5/6K1 w - - 0 1', mark: ['b3', 'a2', 'c2'] },
      { type: 'goal', goal: 'safe', text: 'Red je toren én je loper. Met één zet!', fen: '8/5pk1/8/8/8/1p6/R1B5/6K1 w - - 0 1' },
    ],
  },
  {
    world: 3, id: 'vork', title: 'De vork', icon: 'wN',
    steps: [
      { type: 'talk', text: 'Een supertruc: de VORK! Kijk wat het paard doet.', fen: 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', demo: ['d5-c7'], markAfter: ['a8', 'e8'] },
      { type: 'talk', text: 'Het paard valt twee stukken tegelijk aan. Net een vork met twee punten!', fen: 'r3k3/2N5/8/8/8/8/8/4K3 b - - 0 1', showMoves: 'c7' },
      { type: 'talk', text: 'Zwart kan er maar één redden. De andere pak jij!', fen: 'r3k3/2N5/8/8/8/8/8/4K3 b - - 0 1', mark: ['a8', 'e8'] },
      { type: 'goal', goal: 'fork', text: 'Val met je paard de koning én de toren aan!', fen: 'r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1' },
      { type: 'goal', goal: 'fork', text: 'Val de koningin én de toren aan!', fen: '3q1rk1/8/8/6N1/8/8/8/4K3 w - - 0 1' },
      { type: 'talk', text: 'Een pion kan dat ook. Hij slaat naar links én rechts.', fen: '4k3/8/2n1b3/3P4/4P3/8/8/4K3 b - - 0 1', showMoves: 'd5' },
      { type: 'goal', goal: 'fork', text: 'Val twee stukken aan met een pion!', fen: '4k3/8/2n1b3/8/3PP3/8/8/4K3 w - - 0 1' },
      { type: 'goal', goal: 'fork', text: 'Geef schaak en val ook het paard aan!', fen: '4k3/8/8/8/1n6/8/8/3QK3 w - - 0 1' },
    ],
  },
  {
    world: 3, id: 'matpatronen', title: 'Mat-trucjes', icon: 'bK',
    steps: [
      { type: 'talk', text: 'Kijk: de koning zit vast achter zijn pionnen!', fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1', mark: ['f7', 'g7', 'h7'] },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat met je toren!', fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Nog een keer! Geef schaakmat.', fen: '6k1/4Rppp/8/8/8/8/5PPP/6K1 w - - 0 1' },
      { type: 'talk', text: 'Nog een truc. Kijk waar de koningin heen gaat!', fen: '4k3/8/4K3/8/7Q/8/8/8 w - - 0 1', demo: ['h4-e7'], markAfter: ['e7'] },
      { type: 'talk', text: 'De koningin staat vlak voor de koning. Haar eigen koning beschermt haar.', fen: '4k3/4Q3/4K3/8/8/8/8/8 b - - 0 1', mark: ['e7', 'e6'] },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: '4k3/p7/4K3/8/8/Q7/8/8 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'De koning zit in de hoek. Geef schaakmat!', fen: '7k/8/6K1/8/8/8/Q7/8 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Koningin en loper helpen elkaar. Geef schaakmat!', fen: '6k1/5p1p/6pQ/8/8/8/1B6/6K1 w - - 0 1' },
    ],
  },
  {
    world: 3, id: 'opening', title: 'Een goed begin', icon: 'wP',
    steps: [
      { type: 'talk', text: 'Hoe begin je goed? Het midden is het belangrijkst!', fen: LESSON_START, mark: ['d4', 'e4', 'd5', 'e5'] },
      { type: 'goal', goal: 'to', piece: 'P', squares: ['e4', 'd4'], text: 'Zet een pion twee stapjes naar het midden!', fen: LESSON_START },
      { type: 'talk', text: 'Haal dan je paarden en lopers eruit.', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2' },
      { type: 'goal', goal: 'to', piece: 'N', squares: ['f3', 'c3'], text: 'Zet een paard naar het midden!', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2' },
      { type: 'goal', goal: 'castle', text: 'Zet je koning veilig. Rokeer!', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5' },
      { type: 'talk', text: 'Pas op voor deze snelle truc! Kijk naar de pion op f7.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', mark: ['f7', 'h5', 'c4'] },
      { type: 'talk', text: 'De koningin slaat op f7. De loper helpt haar. Schaakmat!', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', demo: ['h5-f7'], markAfter: ['c4', 'f7'] },
      { type: 'goal', goal: 'mate', text: 'Doe het zelf! Geef schaakmat.', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4' },
      { type: 'quiz', text: 'Wat is een goede eerste zet?', options: [{ label: 'Pion naar het midden', piece: 'wP', ok: true }, { label: 'Koning naar voren', piece: 'wK' }, { label: 'Toren eruit', piece: 'wR' }] },
    ],
  },
  {
    world: 3, id: 'toets', title: 'Schaakmeester-toets', icon: 'wQ',
    steps: [
      { type: 'talk', text: 'De laatste les van wereld 3! Laat zien wat je kunt. Succes, Sam!', pieces: { d4: 'wN', e4: 'wQ' } },
      { type: 'goal', goal: 'hanging', text: 'Opdracht 1: pak het losse stuk!', fen: '4k3/8/8/3r4/8/8/3R4/4K3 w - - 0 1' },
      { type: 'goal', goal: 'fork', text: 'Opdracht 2: val twee stukken aan met je paard!', fen: '4r1k1/8/8/7N/8/8/8/K7 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'Opdracht 3: red je loper!', fen: '6k1/8/8/8/4p3/2P5/5n2/K6B w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Opdracht 4: geef schaakmat!', fen: 'k7/1p6/1K6/8/8/8/8/7R w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Laatste! Geef schaakmat met je koningin!', fen: '6k1/5ppp/8/8/8/8/8/4Q1K1 w - - 0 1' },
      { type: 'talk', text: 'Wauw! Jij bent nu een echte schaakmeester!', pieces: { c4: 'wK', d4: 'wQ', e4: 'wN' } },
    ],
  },
  /* ---------------- WERELD 4: TWEE ZETTEN VOORUIT ----------------
     Elke opdracht: wit zet, zwart zet vanzelf terug, wit zet nog een keer.
     Steeds begint het met SCHAAK: dan MOET zwart eerst zijn koning redden.
     Elke opdracht heeft precies één goede weg (zie tools/puzzelcontrole.html). */
  {
    world: 4, id: 'spies', title: 'Schaak en pak!', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Welkom in wereld 4! Hier leer je VOORUIT denken.', pieces: { d4: 'wN' } },
      { type: 'talk', text: 'Tot nu toe deed je één goede zet. Nu doe je er twee achter elkaar!', pieces: { d4: 'wN' } },
      { type: 'talk', text: 'Denk zo: ik zet dit. Wat doet zwart dan? En wat zet ik daarna?', pieces: { d4: 'wN' } },
      { type: 'talk', text: 'Kijk naar het filmpje. Let op de koning én de koningin!', fen: '4q3/8/8/4k3/8/8/8/R5K1 w - - 0 1',
        demo: ['a1-e1', 'e5-d6', 'e1-e8'], demoWin: 'Q', markAfter: ['e8'],
        demoSay: ['Zet 1: de toren geeft schaak!', 'Zwart MOET zijn koning redden. Hij loopt weg.', 'Zet 2: hap! De toren pakt de koningin.'] },
      { type: 'talk', text: 'De koningin stond achter de koning. Zwart kon haar niet meer redden!', fen: '4q3/8/8/4k3/8/8/8/4R1K1 b - - 0 1', mark: ['e5', 'e8'] },
      { type: 'quiz', text: 'Schaak! Wat MOET zwart nu doen?', fen: '4q3/8/8/4k3/8/8/8/4R1K1 b - - 0 1',
        options: [{ label: 'Zijn koning redden', piece: 'bK', ok: true }, { label: 'Zijn koningin redden', piece: 'bQ' }] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Nu jij! Geef schaak met je toren. Pak dan de koningin.',
        fen: '4k1q1/1R6/8/8/8/8/8/2K5 w - - 0 1', line: ['b7-b8', 'e8-d7', 'b8-g8'], say: ['De koning loopt weg. Pak nu de koningin!'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Geef schaak. Wat staat er achter de koning?',
        fen: '8/2R5/8/7k/7q/8/8/K7 w - - 0 1', line: ['c7-h7', 'h5-g6', 'h7-h4'], say: ['De koning is weg. Pak nu de koningin!'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Nog een keer! Schaak, en dan pakken.',
        fen: '6R1/8/8/7k/8/8/1K6/7q w - - 0 1', line: ['g8-h8', 'h5-g6', 'h8-h1'], say: ['Goed zo! Pak nu de koningin!'] },
      { type: 'talk', text: 'De loper kan het ook. Hij doet het schuin!', pieces: { d4: 'wB' }, showMoves: 'd4' },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Geef schaak met je loper. Pak dan de koningin!',
        fen: '6q1/8/4k3/8/8/8/2B5/K7 w - - 0 1', line: ['c2-b3', 'e6-d7', 'b3-g8'], say: ['De koning loopt weg. Pak nu de koningin!'] },
    ],
  },
  {
    world: 4, id: 'vork2', title: 'Vork, en dan pakken', icon: 'wN',
    steps: [
      { type: 'talk', text: 'Weet je nog, de VORK? Nu pak je ook echt een stuk!', pieces: { d4: 'wN' }, showMoves: 'd4' },
      { type: 'talk', text: 'Kijk naar het filmpje!', fen: '8/k7/8/q3N3/8/8/2K5/8 w - - 0 1',
        demo: ['e5-c6', 'a7-a8', 'c6-a5'], demoWin: 'Q', markAfter: ['a5'],
        demoSay: ['Zet 1: het paard springt. Schaak! En de koningin wordt ook aangevallen.', 'Zwart moet eerst zijn koning redden.', 'Zet 2: nu pakt het paard de koningin!'] },
      { type: 'talk', text: 'Schaak is de truc! Dan MOET zwart eerst zijn koning redden.', fen: '8/k7/2N5/q7/8/8/2K5/8 b - - 0 1', showMoves: 'c6' },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Zoek de vork met schaak. Pak dan de koningin!',
        fen: '4k3/1N6/8/5q2/8/8/8/4K3 w - - 0 1', line: ['b7-d6', 'e8-d8', 'd6-f5'], say: ['Zwart redt zijn koning. Pak nu de koningin!'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Nog een vork! Waar springt het paard heen?',
        fen: '6q1/8/8/7k/6N1/8/8/2K5 w - - 0 1', line: ['g4-f6', 'h5-g6', 'f6-g8'], say: ['Hap hap! Pak nu de koningin!'] },
      { type: 'talk', text: 'De koningin kan ook een vork maken. Ze gaat recht én schuin!', pieces: { d4: 'wQ' }, showMoves: 'd4' },
      { type: 'goal', goal: 'plan', win: 'R', text: 'Geef schaak met je koningin. Pak dan de toren!',
        fen: '6k1/2r5/8/8/3Q4/8/3K4/8 w - - 0 1', line: ['d4-d8', 'g8-f7', 'd8-c7'], say: ['Mooi! Pak nu de toren!'] },
      { type: 'goal', goal: 'plan', win: 'R', text: 'Nog een keer! Schaak, en val ook de toren aan.',
        fen: '5k2/8/1K6/8/3r4/8/8/7Q w - - 0 1', line: ['h1-h8', 'f8-e7', 'h8-d4'], say: ['Goed! Pak nu de toren!'] },
    ],
  },
  {
    world: 4, id: 'mat2', title: 'Mat in twee', icon: 'bK',
    steps: [
      { type: 'talk', text: 'Soms lukt schaakmat niet in één zet. Dan heb je twee zetten nodig.', fen: '8/5k2/R7/1R6/8/8/8/2K5 w - - 0 1' },
      { type: 'talk', text: 'Kijk hoe twee torens samenwerken!', fen: '8/5k2/R7/1R6/8/8/8/2K5 w - - 0 1',
        demo: ['b5-b7', 'f7-e8', 'a6-a8'], demoWin: 'mate', markAfter: ['e8'],
        demoSay: ['Zet 1: de toren geeft schaak. Nu is deze rij dicht.', 'De koning moet naar de achterste rij.', 'Zet 2: de andere toren geeft schaakmat!'] },
      { type: 'talk', text: 'Dat heet het TRAPPETJE. De ene toren houdt een rij dicht. De andere geeft schaak.', fen: '8/1R3k2/R7/8/8/8/8/2K5 b - - 0 1', mark: ['a6', 'b7'] },
      { type: 'quiz', text: 'Waarom kan de koning niet naar voren?', fen: '8/1R3k2/R7/8/8/8/8/2K5 b - - 0 1',
        options: [{ label: 'De toren houdt die rij dicht', piece: 'wR', ok: true }, { label: 'De koning is moe', piece: 'bK' }] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Maak het trappetje! Geef schaak. Geef dan schaakmat.',
        fen: '8/2k5/7R/8/8/K7/8/6R1 w - - 0 1', line: ['g1-g7', 'c7-b8', 'h6-h8'], say: ['De koning moet naar achteren. Geef nu schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Nog een trappetje! Welke toren gaat eerst?',
        fen: '4R3/1k6/7R/8/8/8/6K1/8 w - - 0 1', line: ['e8-e7', 'b7-a8', 'h6-h8'], say: ['Goed! Geef nu schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Duw de koning in de hoek. Geef dan schaakmat!',
        fen: '6k1/8/8/5R2/8/8/2K4R/8 w - - 0 1', line: ['h2-g2', 'g8-h8', 'f5-h5'], say: ['De koning zit in de hoek. Geef nu schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Nog een keer naar de hoek. Twee zetten!',
        fen: '8/1k6/8/3K4/8/2R5/8/5R2 w - - 0 1', line: ['f1-b1', 'b7-a8', 'c3-a3'], say: ['De koning zit vast. Geef nu schaakmat!'] },
    ],
  },
  {
    world: 4, id: 'toets2', title: 'Toets: twee zetten', icon: 'wQ',
    steps: [
      { type: 'talk', text: 'Laat zien wat je kunt! Elke opdracht heeft twee zetten. Denk goed vooruit!', pieces: { d4: 'wN', e4: 'wQ' } },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Opdracht 1: pak de koningin!',
        fen: '3kq3/8/8/8/8/8/1R6/1K6 w - - 0 1', line: ['b2-b8', 'd8-c7', 'b8-e8'], say: ['Goed! En nu?'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Opdracht 2: pak de koningin met je paard!',
        fen: '3N4/8/4K3/k7/3q4/8/8/8 w - - 0 1', line: ['d8-c6', 'a5-a6', 'c6-d4'], say: ['Goed! En nu?'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Opdracht 3: geef schaakmat in twee zetten!',
        fen: '8/3k4/R7/8/8/7R/8/1K6 w - - 0 1', line: ['h3-h7', 'd7-c8', 'a6-a8'], say: ['Goed! En nu?'] },
      { type: 'goal', goal: 'plan', win: 'R', text: 'Opdracht 4: pak de toren met je loper!',
        fen: '8/8/1r6/6B1/4K3/8/8/6k1 w - - 0 1', line: ['g5-e3', 'g1-g2', 'e3-b6'], say: ['Goed! En nu?'] },
      { type: 'goal', goal: 'plan', win: 'R', text: 'Laatste! Pak de toren met je koningin.',
        fen: '7Q/8/k2K4/8/8/8/r7/8 w - - 0 1', line: ['h8-a8', 'a6-b6', 'a8-a2'], say: ['Goed! En nu?'] },
      { type: 'talk', text: 'Super! Jij kunt twee zetten vooruit denken!', pieces: { c4: 'wK', d4: 'wQ', e4: 'wN' } },
    ],
  },
  /* ---------------- WERELD 5: DRIE ZETTEN VOORUIT ---------------- */
  {
    world: 5, id: 'trap3', title: 'Het grote trappetje', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Welkom in wereld 5! Nu denk je DRIE zetten vooruit.', pieces: { d4: 'wN' } },
      { type: 'talk', text: 'Dat is best moeilijk. Maar met een slim plan lukt het!', pieces: { d4: 'wN', e4: 'wR' } },
      { type: 'talk', text: 'Kijk: het trappetje, maar nu langer!', fen: 'K4k2/3p4/8/8/8/8/4R3/R7 w - - 0 1',
        demo: ['a1-f1', 'f8-g8', 'e2-g2', 'g8-h8', 'f1-h1'], demoWin: 'mate', markAfter: ['h8'],
        demoSay: ['Zet 1: schaak! De koning moet opzij.', 'Hij loopt naar g8.', 'Zet 2: weer schaak, met de andere toren!', 'De koning vlucht de hoek in.', 'Zet 3: schaakmat!'] },
      { type: 'talk', text: 'Zie je het? De torens geven om de beurt schaak. De koning wordt steeds verder geduwd.', fen: 'K6k/3p4/8/8/8/8/6R1/7R b - - 0 1', mark: ['g2', 'h1'] },
      { type: 'quiz', text: 'Wat doen de torens bij het trappetje?',
        options: [{ label: 'Om de beurt schaak geven', piece: 'wR', ok: true }, { label: 'Zomaar ergens staan', piece: 'wP' }] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Geef drie keer schaak. De laatste is schaakmat!',
        fen: '2k5/6p1/8/8/4R3/8/K2R4/8 w - - 0 1', line: ['e4-c4', 'c8-b8', 'd2-b2', 'b8-a8', 'c4-a4'],
        say: ['Goed! Nu de andere toren!', 'Nog één zet. Geef schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Nog een groot trappetje! Begin met schaak.',
        fen: '5k2/1p6/8/8/6R1/1p2R3/8/7K w - - 0 1', line: ['g4-f4', 'f8-g8', 'e3-g3', 'g8-h8', 'f4-h4'],
        say: ['Goed! Nu de andere toren!', 'Nog één zet. Geef schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Duw de koning naar de hoek. Drie zetten!',
        fen: '8/2k5/8/4p3/7p/1R6/K7/3R4 w - - 0 1', line: ['b3-c3', 'c7-b8', 'd1-b1', 'b8-a8', 'c3-a3'],
        say: ['Goed! Nu de andere toren!', 'Nog één zet. Geef schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'De laatste van deze les. Jij kunt het!',
        fen: '5k2/8/K7/8/8/p5R1/8/4R3 w - - 0 1', line: ['g3-f3', 'f8-g8', 'e1-g1', 'g8-h8', 'f3-h3'],
        say: ['Goed! Nu de andere toren!', 'Nog één zet. Geef schaakmat!'] },
    ],
  },
  {
    world: 5, id: 'jacht', title: 'Koningsjacht', icon: 'bK',
    steps: [
      { type: 'talk', text: 'De koningin en de toren gaan samen op jacht!', pieces: { c4: 'wQ', e4: 'wR' } },
      { type: 'talk', text: 'Kijk goed. Ze helpen elkaar!', fen: '3R4/4k3/8/1p6/8/8/7Q/4K3 w - - 0 1',
        demo: ['h2-d6', 'e7-f7', 'd8-d7', 'f7-e8', 'd6-e7'], demoWin: 'mate', markAfter: ['e8'],
        demoSay: ['Zet 1: de koningin geeft schaak.', 'De koning stapt opzij.', 'Zet 2: de toren geeft schaak. De koningin beschermt hem!', 'De koning moet terug.', 'Zet 3: schaakmat!'] },
      { type: 'talk', text: 'Slim: zwart kan de toren niet pakken. De koningin past op hem!', fen: '8/3R1k2/3Q4/1p6/8/8/8/4K3 b - - 0 1', mark: ['d6', 'd7'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Doe het filmpje na! Drie zetten.',
        fen: '2R5/3k4/p7/8/8/5Q2/8/5K2 w - - 0 1', line: ['f3-c6', 'd7-e7', 'c8-c7', 'e7-d8', 'c6-d7'],
        say: ['Goed! Nu de toren, met hulp van de koningin!', 'Nog één zet. Geef schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Ga op jacht! Begin met de koningin.',
        fen: '2k5/8/3R4/8/5Q2/5p2/8/K7 w - - 0 1', line: ['f4-f8', 'c8-b7', 'f8-e7', 'b7-a8', 'd6-d8'],
        say: ['Goed! Nog een keer schaak met de koningin!', 'Nu mag de toren. Geef schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Nog een jacht! Drie keer schaak.',
        fen: '5R2/4k3/8/8/8/5Q1p/1K6/8 w - - 0 1', line: ['f3-f6', 'e7-d7', 'f8-f7', 'd7-c8', 'f6-h8'],
        say: ['Goed! Nu de toren, met hulp van de koningin!', 'Nog één zet. Geef schaakmat!'] },
      { type: 'talk', text: 'De loper kan de koningin ook helpen!', pieces: { c4: 'wQ', e4: 'wB' } },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Koningin en loper op jacht. Drie zetten!',
        fen: 'k7/8/6B1/8/6Q1/7K/8/8 w - - 0 1', line: ['g4-c8', 'a8-a7', 'c8-c7', 'a7-a8', 'g6-e4'],
        say: ['Goed! Nog een keer schaak!', 'Nu mag de loper. Geef schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Nog een jacht met de loper!',
        fen: '6k1/1B1K4/8/8/8/8/8/1Q6 w - - 0 1', line: ['b1-g6', 'g8-f8', 'g6-h6', 'f8-g8', 'b7-d5'],
        say: ['Goed! Nog een keer schaak!', 'Nu mag de loper. Geef schaakmat!'] },
    ],
  },
  {
    world: 5, id: 'slim3', title: 'Slim pakken in drie', icon: 'bQ',
    steps: [
      { type: 'talk', text: 'Je kunt ook in drie zetten een stuk winnen. Schaak, schaak... en hap!', pieces: { c4: 'wR', e4: 'wN' } },
      { type: 'talk', text: 'Kijk naar het filmpje!', fen: '5q2/k7/3N4/K7/2R5/8/8/8 w - - 0 1',
        demo: ['c4-c7', 'a7-a8', 'c7-c8', 'a8-a7', 'c8-f8'], demoWin: 'Q', markAfter: ['f8'],
        demoSay: ['Zet 1: schaak met de toren.', 'De koning gaat naar de hoek.', 'Zet 2: weer schaak! Het paard beschermt de toren.', 'De koning moet terug.', 'Zet 3: hap! De koningin is van jou.'] },
      { type: 'talk', text: 'Elke keer schaak. Zo krijgt zwart nooit tijd om zijn koningin te redden!', fen: '2R2q2/k7/3N4/K7/8/8/8/8 b - - 0 1', mark: ['c8', 'f8'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Schaak, schaak... en pak de koningin!',
        fen: '4k3/6q1/8/2K3N1/R7/8/8/8 w - - 0 1', line: ['a4-a8', 'e8-d7', 'a8-a7', 'd7-c8', 'a7-g7'],
        say: ['Goed! Nog een keer schaak!', 'Nu kan het. Pak de koningin!'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Eerst de toren, dan een vork met het paard!',
        fen: '5N2/8/7k/6q1/8/R7/K7/8 w - - 0 1', line: ['a3-h3', 'h6-g7', 'f8-e6', 'g7-g8', 'e6-g5'],
        say: ['Goed! Nu een vork met het paard!', 'Nu kan het. Pak de koningin!'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Eerst het paard, dan de toren. Pak de koningin!',
        fen: '2k2q2/8/2K5/1N6/8/8/8/4R3 w - - 0 1', line: ['b5-d6', 'c8-b8', 'e1-e8', 'b8-a7', 'e8-f8'],
        say: ['Goed! Nu de toren!', 'Nu kan het. Pak de koningin!'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Nu met je koningin. Schaak, schaak... en pak!',
        fen: '1k6/6q1/2K5/8/8/3B4/8/4Q3 w - - 0 1', line: ['e1-e8', 'b8-a7', 'e8-d7', 'a7-a8', 'd7-g7'],
        say: ['Goed! Nog een keer schaak!', 'Nu kan het. Pak de koningin!'] },
    ],
  },
  {
    world: 5, id: 'toets3', title: 'Toets: drie zetten', icon: 'wK',
    steps: [
      { type: 'talk', text: 'De grote toets! Elke opdracht heeft drie zetten. Neem rustig de tijd.', pieces: { c4: 'wK', d4: 'wQ', e4: 'wR' } },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Opdracht 1: geef schaakmat in drie zetten!',
        fen: '1K3k2/3p4/8/8/8/8/4R3/2R5 w - - 0 1', line: ['c1-f1', 'f8-g8', 'e2-g2', 'g8-h8', 'f1-h1'], say: ['Goed! En nu?', 'Nog één zet!'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Opdracht 2: pak de koningin met je paard!',
        fen: '3k4/R5K1/7N/8/4q3/8/8/8 w - - 0 1', line: ['h6-f7', 'd8-c8', 'f7-d6', 'c8-b8', 'd6-e4'], say: ['Goed! En nu?', 'Nog één zet!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Opdracht 3: koningin en toren. Geef schaakmat!',
        fen: '8/2k2p2/6R1/8/8/8/4K1Q1/8 w - - 0 1', line: ['g2-c6', 'c7-b8', 'g6-g8', 'b8-a7', 'g8-a8'], say: ['Goed! En nu?', 'Nog één zet!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Opdracht 4: koningin en loper. Geef schaakmat!',
        fen: '1k6/8/8/4K3/1B6/8/5Q2/8 w - - 0 1', line: ['f2-b6', 'b8-a8', 'b6-a6', 'a8-b8', 'b4-d6'], say: ['Goed! En nu?', 'Nog één zet!'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Laatste! Pak de koningin met je paard.',
        fen: 'k1K5/8/N7/8/3q4/8/8/7R w - - 0 1', line: ['a6-c7', 'a8-a7', 'c7-b5', 'a7-a8', 'b5-d4'], say: ['Goed! En nu?', 'Nog één zet!'] },
      { type: 'talk', text: 'Wauw! Jij denkt drie zetten vooruit. Jij bent een echte denker!', pieces: { c4: 'wK', d4: 'wQ', e4: 'wN' } },
    ],
  },
  /* ---------------- WERELD 6: NOG SLIMMER ---------------- */
  {
    world: 6, id: 'koningtoren', title: 'Koning en toren', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Welkom in wereld 6! Wist je dat je met alleen een koning en een toren al schaakmat kunt geven?', pieces: { d4: 'wK', e4: 'wR' } },
      { type: 'talk', text: 'Kijk. De koningen staan recht tegenover elkaar.', fen: '4k3/8/4K3/2R5/8/8/8/8 w - - 0 1',
        demo: ['c5-c8'], demoWin: 'mate', markAfter: ['e8'],
        demoSay: ['De toren geeft schaak op de achterste rij. Schaakmat!'] },
      { type: 'talk', text: 'Jouw koning houdt de vakjes ervoor dicht. De toren doet de rest.', fen: '2R1k3/8/4K3/8/8/8/8/8 b - - 0 1', mark: ['d7', 'e7', 'f7'] },
      { type: 'quiz', text: 'Waar moet jouw koning staan?', fen: '2R1k3/8/4K3/8/8/8/8/8 b - - 0 1',
        options: [{ label: 'Tegenover de andere koning', piece: 'wK', ok: true }, { label: 'Ver weg in de hoek', piece: 'wR' }] },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat met je toren!', fen: '5k2/8/5K2/8/8/R7/8/8 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Nog een keer! Waar moet de toren heen?', fen: 'k1K5/8/8/8/3R4/8/8/8 w - - 0 1' },
      { type: 'talk', text: 'Soms moet eerst je koning dichterbij. Dat is een stille zet: géén schaak.', fen: '7k/8/8/6K1/8/8/2R5/8 w - - 0 1', mark: ['g5', 'h8'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Zet eerst je koning goed. Geef dan schaakmat!',
        fen: '7k/8/8/6K1/8/8/2R5/8 w - - 0 1', line: ['g5-g6', 'h8-g8', 'c2-c8'], say: ['Goed! Nu de toren!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Nog een keer: eerst de koning, dan de toren.',
        fen: '3k4/8/8/5K2/8/2R5/8/8 w - - 0 1', line: ['f5-e6', 'd8-e8', 'c3-c8'], say: ['Goed! Nu de toren!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'Moeilijk! Schaakmat in 3 zetten.',
        fen: 'k7/2R5/8/8/3K4/8/8/8 w - - 0 1', line: ['d4-c5', 'a8-b8', 'c5-b6', 'b8-a8', 'c7-c8'], say: ['Goed! Nog een stapje dichterbij!', 'Nu de toren. Schaakmat!'] },
      { type: 'goal', goal: 'plan', win: 'mate', text: 'De laatste! Schaakmat in 3 zetten.',
        fen: '6k1/3R4/8/6K1/8/8/8/8 w - - 0 1', line: ['g5-f6', 'g8-h8', 'f6-g6', 'h8-g8', 'd7-d8'], say: ['Goed! Nog een stapje dichterbij!', 'Nu de toren. Schaakmat!'] },
    ],
  },
  {
    world: 6, id: 'dreiging', title: 'Wat wil zwart?', icon: 'bR',
    steps: [
      { type: 'talk', text: 'Een slimme schaker kijkt ook naar de ander. Wat wil zwart doen?', pieces: { d4: 'wN', e5: 'bR' } },
      { type: 'talk', text: 'Kijk wat er gebeurt als je niet oplet!', fen: '8/2R5/7r/2P2p2/6p1/7P/8/5k1K b - - 0 1',
        demo: ['h6-h3'], markAfter: ['h1'], demoSay: ['De zwarte toren pakt de pion. Schaakmat!'] },
      { type: 'talk', text: 'Dat noem je een DREIGING. Zwart wil iets doen. Jij moet het op tijd zien!', fen: '8/2R5/7r/2P2p2/6p1/7P/8/5k1K w - - 0 1', mark: ['h6', 'h3'] },
      { type: 'quiz', text: 'Wit is aan zet. Wat wil zwart doen?', fen: '8/2R5/7r/2P2p2/6p1/7P/8/5k1K w - - 0 1',
        options: [{ label: 'Schaakmat geven', piece: 'bR', ok: true }, { label: 'Niks', piece: 'bP' }] },
      { type: 'goal', goal: 'stopmate', text: 'Zwart dreigt schaakmat. Stop het! Er is maar één goede zet.', fen: '8/2R5/7r/2P2p2/6p1/7P/8/5k1K w - - 0 1' },
      { type: 'talk', text: 'Je kunt een stuk ertussen zetten. Of je koning een veilig plekje geven.', pieces: { d4: 'wK', e4: 'wR' } },
      { type: 'goal', goal: 'stopmate', text: 'Weer een dreiging! Kijk goed naar de zwarte toren.', fen: '8/8/3Rp3/8/3P1p2/3rP2k/8/7K w - - 0 1' },
      { type: 'goal', goal: 'stopmate', text: 'Nu dreigt de zwarte koningin. Stop het!', fen: '8/6qp/5N2/5P2/7p/8/7B/5k1K w - - 0 1' },
      { type: 'goal', goal: 'stopmate', text: 'De laatste. Wat wil de koningin? Stop het!', fen: '1q6/2p5/K1p5/3N4/8/1P3B2/8/4k3 w - - 0 1' },
      { type: 'quiz', text: 'Wat vraag je jezelf af voor elke zet?', options: [{ label: 'Wat wil de ander?', ok: true }, { label: 'Wat eet ik vanavond?' }] },
    ],
  },
  {
    world: 6, id: 'penning', title: 'De penning', icon: 'wB',
    steps: [
      { type: 'talk', text: 'Een nieuwe truc: de PENNING. Je zet een stuk vast!', pieces: { d4: 'wB' } },
      { type: 'talk', text: 'Kijk naar het filmpje!', fen: '8/k7/1q6/8/P4p2/2BK4/8/8 w - - 0 1',
        demo: ['c3-d4', 'a7-a8', 'd4-b6'], demoWin: 'Q', markAfter: ['b6'],
        demoSay: ['Zet 1: de loper valt de koningin aan. Achter haar staat de koning!', 'De koningin mag niet weg: dan staat haar koning schaak.', 'Zet 2: hap! De koningin is van jou.'] },
      { type: 'talk', text: 'De koningin zit vast, net als een prikker op een prikbord. Dat heet een penning.', fen: '8/k7/1q6/8/P2B1p2/3K4/8/8 b - - 0 1', mark: ['d4', 'b6', 'a7'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Zet de koningin vast met je loper. Pak haar dan!',
        fen: '2k5/3q4/p7/6K1/8/8/6P1/1B6 w - - 0 1', line: ['b1-f5', 'c8-b8', 'f5-d7'], say: ['Ze zit vast! Pak nu de koningin.'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Nog een penning met de loper!',
        fen: '7k/8/5q2/2P2p2/1B6/1K6/8/8 w - - 0 1', line: ['b4-c3', 'h8-g8', 'c3-f6'], say: ['Ze zit vast! Pak nu de koningin.'] },
      { type: 'talk', text: 'Een toren kan ook pennen. Hij doet het recht.', pieces: { d4: 'wR' }, showMoves: 'd4' },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Zet de koningin vast met je toren. Pak haar dan!',
        fen: '4K3/8/8/k2q4/p6P/8/8/6R1 w - - 0 1', line: ['g1-g5', 'a5-a6', 'g5-d5'], say: ['Ze zit vast! Pak nu de koningin.'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'De laatste penning. Zoek de goede lijn!',
        fen: '7k/8/3p4/8/7q/4P3/1R6/6K1 w - - 0 1', line: ['b2-h2', 'h8-g8', 'h2-h4'], say: ['Ze zit vast! Pak nu de koningin.'] },
    ],
  },
  {
    world: 6, id: 'aftrek', title: 'Aftrekschaak', icon: 'wN',
    steps: [
      { type: 'talk', text: 'Nog een supertruc: het AFTREKSCHAAK. Twee stukken werken samen.', pieces: { c4: 'wR', e4: 'wN' } },
      { type: 'talk', text: 'Kijk goed naar de toren en het paard!', fen: '2K5/8/8/pq6/2R1N2k/8/8/8 w - - 0 1',
        demo: ['e4-d6', 'h4-g5', 'd6-b5'], demoWin: 'Q', markAfter: ['b5'],
        demoSay: ['Zet 1: het paard springt weg. Nu geeft de toren schaak! En het paard valt de koningin aan.', 'Zwart moet eerst zijn koning redden.', 'Zet 2: het paard pakt de koningin!'] },
      { type: 'talk', text: 'Het paard ging opzij. Daardoor kon de toren ineens schaak geven!', fen: '2K5/8/3N4/pq6/2R4k/8/8/8 b - - 0 1', mark: ['c4', 'h4', 'b5'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Spring met het paard opzij. Dan geeft de toren schaak!',
        fen: '3k4/8/2KN4/2p5/8/2q5/3R4/8 w - - 0 1', line: ['d6-e4', 'd8-c8', 'e4-c3'], say: ['Aftrekschaak! Pak nu de koningin.'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Nog een aftrekschaak met toren en paard!',
        fen: '2K5/8/p7/7R/7N/4q2k/8/8 w - - 0 1', line: ['h4-f5', 'h3-g4', 'f5-e3'], say: ['Aftrekschaak! Pak nu de koningin.'] },
      { type: 'talk', text: 'Een loper en een paard kunnen het ook samen!', pieces: { c4: 'wB', e4: 'wN' } },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'Laat de loper schaak geven. Welk paard springt weg?',
        fen: '3k4/4N2K/1q3B2/1p6/8/8/8/8 w - - 0 1', line: ['e7-d5', 'd8-c8', 'd5-b6'], say: ['Aftrekschaak! Pak nu de koningin.'] },
      { type: 'goal', goal: 'plan', win: 'Q', text: 'De laatste! Paard weg, loper schaak, koningin pakken.',
        fen: '4k3/3N4/2B3q1/3p4/8/8/1K6/8 w - - 0 1', line: ['d7-e5', 'e8-d8', 'e5-g6'], say: ['Aftrekschaak! Pak nu de koningin.'] },
    ],
  },
  {
    world: 6, id: 'pionrace', title: 'Pion naar de overkant', icon: 'wP',
    steps: [
      { type: 'talk', text: 'Een pion aan de overkant wordt een koningin. Kan zwart hem nog tegenhouden?', pieces: { d4: 'wP', e4: 'wQ' } },
      { type: 'talk', text: 'Er is een slimme regel: het VIERKANT. Kijk naar de pion en zijn vierkant.', fen: '8/8/8/P2k4/8/8/8/7K b - - 0 1',
        mark: ['a5', 'b5', 'c5', 'd5', 'a6', 'b6', 'c6', 'd6', 'a7', 'b7', 'c7', 'd7', 'a8', 'b8', 'c8', 'd8'] },
      { type: 'talk', text: 'Staat de zwarte koning in het vierkant? Dan haalt hij de pion in. Erbuiten? Dan niet!', fen: '8/8/8/P4k2/8/8/8/7K b - - 0 1',
        mark: ['a5', 'b5', 'c5', 'd5', 'a6', 'b6', 'c6', 'd6', 'a7', 'b7', 'c7', 'd7', 'a8', 'b8', 'c8', 'd8'] },
      { type: 'quiz', text: 'Zwart is aan zet. Haalt de koning de pion in?', fen: '8/8/8/P2k4/8/8/8/7K b - - 0 1',
        options: [{ label: 'Ja', ok: true }, { label: 'Nee' }] },
      { type: 'quiz', text: 'En nu? Zwart is aan zet. Haalt de koning de pion in?', fen: '8/8/8/P4k2/8/8/8/7K b - - 0 1',
        options: [{ label: 'Ja' }, { label: 'Nee', ok: true }] },
      { type: 'goal', goal: 'plan', win: 'promo', text: 'Breng je pion naar de overkant! Je hebt 3 zetten.',
        fen: '8/7k/8/P7/2p5/5K2/8/8 w - - 0 1', line: ['a5-a6', 'h7-g8', 'a6-a7', 'g8-f8', 'a7-a8'], say: ['Goed! Verder!', 'Nu wordt hij een koningin!'] },
      { type: 'goal', goal: 'plan', win: 'promo', text: 'Weer een race! Wie is er het eerst?',
        fen: '8/8/8/3P2K1/p7/k7/8/8 w - - 0 1', line: ['d5-d6', 'a3-b4', 'd6-d7', 'b4-a5', 'd7-d8'], say: ['Goed! Verder!', 'Nu wordt hij een koningin!'] },
      { type: 'goal', goal: 'plan', win: 'promo', text: 'De laatste race. Ren, pion, ren!',
        fen: '8/8/8/6P1/3p4/5K2/8/5k2 w - - 0 1', line: ['g5-g6', 'f1-e1', 'g6-g7', 'e1-d2', 'g7-g8'], say: ['Goed! Verder!', 'Nu wordt hij een koningin!'] },
      { type: 'talk', text: 'Wauw! Jij bent nu echt slim. Ga maar eens kijken of je de familie verslaat!', pieces: { c4: 'wK', d4: 'wQ', e4: 'wN' } },
    ],
  },
];
