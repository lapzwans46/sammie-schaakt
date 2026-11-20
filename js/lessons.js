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
                  'to'        zet een bepaald stuk (piece: 'P') naar een van squares: [...]
   world: in welke wereld de les hoort (zie WORLDS)
   ========================================================= */
const WORLDS = [
  { nr: 1, title: 'De stukken', color: '#4a9df8' },
  { nr: 2, title: 'De regels', color: '#ff8c42' },
  { nr: 3, title: 'Slim spelen', color: '#9b5de5' },
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
      { type: 'talk', text: 'De laatste les! Laat zien wat je kunt. Succes, Sam!', pieces: { d4: 'wN', e4: 'wQ' } },
      { type: 'goal', goal: 'hanging', text: 'Opdracht 1: pak het losse stuk!', fen: '4k3/8/8/3r4/8/8/3R4/4K3 w - - 0 1' },
      { type: 'goal', goal: 'fork', text: 'Opdracht 2: val twee stukken aan met je paard!', fen: '4r1k1/8/8/7N/8/8/8/K7 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'Opdracht 3: red je loper!', fen: '6k1/8/8/8/4p3/2P5/5n2/K6B w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Opdracht 4: geef schaakmat!', fen: 'k7/1p6/1K6/8/8/8/8/7R w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Laatste! Geef schaakmat met je koningin!', fen: '6k1/5ppp/8/8/8/8/8/4Q1K1 w - - 0 1' },
      { type: 'talk', text: 'Wauw! Jij bent nu een echte schaakmeester!', pieces: { c4: 'wK', d4: 'wQ', e4: 'wN' } },
    ],
  },
];
