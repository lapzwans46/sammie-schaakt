/* =========================================================
   Sammie Schaakt! - DE LESSEN (van makkelijk naar moeilijk)

   Soorten stapjes:
   talk     Pim vertelt iets. Optioneel een bordje erbij:
            pieces: { d4: 'wR' }  of  fen: '...'
            showMoves: 'd4'  -> laat zien waar dat stuk heen mag
            mark: ['e4', ...] -> vakjes oplichten
   quiz     Vraag met knoppen. options: [{ label, piece?, ok: true }]
   stars    Pak alle sterren met je stuk(ken).
   capture  Sla alle zwarte stukken. (Zwart doet niks terug.)
   goal     Een echte stelling, doe de goede zet.
            goal: 'check'     geef schaak
                  'mate'      geef schaakmat
                  'castle'    rokeer
                  'escape'    red je koning
                  'enpassant' sla en passant
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

const LESSONS = [
  {
    world: 1, id: 'bord', title: 'Het schaakbord', icon: 'wK',
    steps: [
      { type: 'talk', text: 'Hoi Sam! Ik ben Pim het Paard. Ik ga jou leren schaken!', pieces: { e4: 'wN' } },
      { type: 'talk', text: 'Dit is het schaakbord. Het heeft lichte en donkere vakjes. Net als een dambord!', pieces: {} },
      { type: 'talk', text: 'Er zijn twee spelers: wit en zwart. Jij bent wit. Jouw stukken staan onderaan.', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
      { type: 'talk', text: 'Om de beurt doe je één zet. Wit mag altijd beginnen!', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
      { type: 'quiz', text: 'Wie mag er beginnen?', options: [{ label: 'Wit', piece: 'wP', ok: true }, { label: 'Zwart', piece: 'bP' }] },
      { type: 'quiz', text: 'Hoeveel vakjes heeft een schaakbord? Het zijn er heel veel!', options: [{ label: '10' }, { label: '64', ok: true }, { label: '5' }] },
    ],
  },
  {
    world: 1, id: 'toren', title: 'De toren', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Dit is de toren. Hij lijkt op een kasteel!', pieces: { d4: 'wR' } },
      { type: 'talk', text: 'De toren gaat recht. Vooruit, achteruit of opzij. Zo ver als hij wil!', pieces: { d4: 'wR' }, showMoves: 'd4' },
      { type: 'stars', text: 'Pak de ster! Tik op de toren en dan op de ster.', pieces: { a1: 'wR' }, stars: ['a6'] },
      { type: 'stars', text: 'Nu twee sterren. Pak ze allebei!', pieces: { a1: 'wR' }, stars: ['a6', 'f6'] },
      { type: 'stars', text: 'Drie sterren! Welke pak je eerst?', pieces: { d4: 'wR' }, stars: ['d8', 'h8', 'h1'] },
      { type: 'talk', text: 'Let op: een toren kan niet over andere stukken springen.', pieces: { c2: 'wR', c5: 'wP' }, showMoves: 'c2' },
      { type: 'stars', text: 'De pion staat in de weg. Loop er omheen!', pieces: { c2: 'wR', c5: 'wP' }, stars: ['c7'] },
    ],
  },
  {
    world: 1, id: 'loper', title: 'De loper', icon: 'wB',
    steps: [
      { type: 'talk', text: 'Dit is de loper. Hij heeft een puntmuts op.', pieces: { d4: 'wB' } },
      { type: 'talk', text: 'De loper gaat schuin. Zo ver als hij wil!', pieces: { d4: 'wB' }, showMoves: 'd4' },
      { type: 'stars', text: 'Pak de ster met de loper.', pieces: { c1: 'wB' }, stars: ['f4'] },
      { type: 'stars', text: 'Pak beide sterren!', pieces: { c1: 'wB' }, stars: ['f4', 'd6'] },
      { type: 'talk', text: 'Zie je het? Een loper blijft altijd op dezelfde kleur vakjes.', pieces: { f1: 'wB' }, showMoves: 'f1' },
      { type: 'stars', text: 'Pak alle sterren!', pieces: { f1: 'wB' }, stars: ['b5', 'e8', 'h5'] },
    ],
  },
  {
    world: 1, id: 'koningin', title: 'De koningin', icon: 'wQ',
    steps: [
      { type: 'talk', text: 'Dit is de koningin. Zij heeft een kroon met parels.', pieces: { d4: 'wQ' } },
      { type: 'talk', text: 'De koningin is super sterk! Ze gaat recht én schuin. Net als een toren en een loper samen.', pieces: { d4: 'wQ' }, showMoves: 'd4' },
      { type: 'stars', text: 'Pak de sterren met de koningin.', pieces: { d1: 'wQ' }, stars: ['d7', 'h3'] },
      { type: 'stars', text: 'Pak alle hoeken!', pieces: { a1: 'wQ' }, stars: ['h8', 'h1', 'a8'] },
      { type: 'stars', text: 'Een lastige! Pak alle sterren.', pieces: { e1: 'wQ', e4: 'wP', c3: 'wP' }, stars: ['a5', 'e8', 'h4'] },
    ],
  },
  {
    world: 1, id: 'koning', title: 'De koning', icon: 'wK',
    steps: [
      { type: 'talk', text: 'Dit is de koning. Hij is het allerbelangrijkste stuk!', pieces: { d4: 'wK' } },
      { type: 'talk', text: 'De koning is een beetje lui. Hij zet maar één stapje. Wel naar alle kanten.', pieces: { d4: 'wK' }, showMoves: 'd4' },
      { type: 'stars', text: 'Breng de koning naar de ster. Stapje voor stapje!', pieces: { e1: 'wK' }, stars: ['e3'] },
      { type: 'stars', text: 'Pak alle sterren met de koning.', pieces: { d4: 'wK' }, stars: ['c5', 'e5', 'f3'] },
    ],
  },
  {
    world: 1, id: 'paard', title: 'Het paard', icon: 'wN',
    steps: [
      { type: 'talk', text: 'En dit ben ik: het paard! Ik spring heel bijzonder.', pieces: { d4: 'wN' } },
      { type: 'talk', text: 'Ik spring als een L. Twee vakjes rechtdoor, en dan één opzij.', pieces: { d4: 'wN' }, showMoves: 'd4' },
      { type: 'stars', text: 'Spring naar de ster!', pieces: { b1: 'wN' }, stars: ['c3'] },
      { type: 'stars', text: 'Spring van ster naar ster.', pieces: { b1: 'wN' }, stars: ['c3', 'd5', 'f6'] },
      { type: 'talk', text: 'Mijn supertruc: ik mag over andere stukken heen springen!', pieces: { g1: 'wN', f2: 'wP', g2: 'wP', h2: 'wP' }, showMoves: 'g1' },
      { type: 'stars', text: 'Spring over de pionnen en pak de sterren.', pieces: { g1: 'wN', f2: 'wP', g2: 'wP', h2: 'wP' }, stars: ['f3', 'e5'] },
      { type: 'stars', text: 'Een moeilijke! Pak alle sterren.', pieces: { a1: 'wN' }, stars: ['b3', 'd2', 'c4'] },
    ],
  },
  {
    world: 1, id: 'pion', title: 'De pion', icon: 'wP',
    steps: [
      { type: 'talk', text: 'Dit is de pion. Er zijn er heel veel van. Ze zijn klein maar dapper!', pieces: { e2: 'wP' } },
      { type: 'talk', text: 'Een pion gaat één stapje vooruit. Nooit achteruit!', pieces: { e3: 'wP' }, showMoves: 'e3' },
      { type: 'talk', text: 'Maar bij de allereerste zet mag een pion ook twee stapjes doen.', pieces: { e2: 'wP' }, showMoves: 'e2' },
      { type: 'stars', text: 'Pak de ster in één zet!', pieces: { e2: 'wP' }, stars: ['e4'] },
      { type: 'stars', text: 'Loop naar de ster.', pieces: { d2: 'wP' }, stars: ['d6'] },
      { type: 'talk', text: 'Een pion slaat schuin! Eén stapje schuin vooruit.', pieces: { e4: 'wP', d5: 'bP', f5: 'bN' }, showMoves: 'e4' },
      { type: 'capture', text: 'Sla de zwarte pion!', pieces: { e4: 'wP', d5: 'bP' } },
      { type: 'talk', text: 'Komt de pion helemaal aan de overkant? Dan wordt hij een koningin! Toverij!', pieces: { b7: 'wP' }, mark: ['b8'] },
      { type: 'stars', text: 'Breng de pion naar de overkant!', pieces: { b5: 'wP' }, stars: ['b8'] },
    ],
  },
  {
    world: 2, id: 'slaan', title: 'Slaan', icon: 'bP',
    steps: [
      { type: 'talk', text: 'Je kunt stukken van de ander slaan. Je zet jouw stuk op hun vakje. Hap, weg is het!', pieces: { a1: 'wR', a5: 'bP' }, showMoves: 'a1' },
      { type: 'capture', text: 'Sla alle zwarte stukken met de toren.', pieces: { a1: 'wR', a5: 'bP', e5: 'bN' } },
      { type: 'capture', text: 'Sla ze allemaal met de loper.', pieces: { c1: 'wB', f4: 'bP', h6: 'bP', f8: 'bR' } },
      { type: 'capture', text: 'Nu met het paard. Hop hop hop!', pieces: { b1: 'wN', c3: 'bP', e4: 'bB', g5: 'bR' } },
      { type: 'capture', text: 'De koningin heeft honger!', pieces: { d1: 'wQ', d6: 'bN', a3: 'bP', g3: 'bB', g8: 'bR' } },
    ],
  },
  {
    world: 2, id: 'waarde', title: 'Wat is een stuk waard?', icon: 'wQ',
    steps: [
      { type: 'talk', text: 'Niet alle stukken zijn even sterk. Een pion is 1 punt waard.', pieces: { d4: 'wP' } },
      { type: 'talk', text: 'Een paard en een loper zijn allebei 3 punten.', pieces: { c4: 'wN', e4: 'wB' } },
      { type: 'talk', text: 'Een toren is 5 punten. En de koningin? Wel 9 punten!', pieces: { c4: 'wR', e4: 'wQ' } },
      { type: 'talk', text: 'De koning kun je niet ruilen. Die is onbetaalbaar!', pieces: { d4: 'wK' } },
      { type: 'quiz', text: 'Welk stuk is het meeste waard?', options: [{ label: 'Pion', piece: 'wP' }, { label: 'Koningin', piece: 'wQ', ok: true }, { label: 'Paard', piece: 'wN' }] },
      { type: 'quiz', text: 'Wat is meer waard?', options: [{ label: 'Toren', piece: 'wR', ok: true }, { label: 'Loper', piece: 'wB' }] },
      { type: 'talk', text: 'Tip: geef je sterke stukken niet zomaar weg. Pas goed op ze!', pieces: { d4: 'wQ' } },
    ],
  },
  {
    world: 2, id: 'schaak', title: 'Schaak!', icon: 'bK',
    steps: [
      { type: 'talk', text: 'Als je de koning aanvalt, heet dat: SCHAAK!', fen: '4k3/8/8/8/8/8/8/K3R3 b - - 0 1', mark: ['e8'] },
      { type: 'talk', text: 'Staat jouw koning schaak? Dan moet je hem meteen redden!', fen: '4k3/8/8/8/8/8/8/K3R3 b - - 0 1' },
      { type: 'goal', goal: 'check', text: 'Zet de zwarte koning schaak met je toren!', fen: '4k3/8/8/8/8/8/7R/K7 w - - 0 1' },
      { type: 'goal', goal: 'check', text: 'Zet de koning schaak met je loper!', fen: '4k3/8/8/8/8/8/8/K4B2 w - - 0 1' },
      { type: 'goal', goal: 'escape', text: 'Help! Jouw koning staat schaak. Zet hem op een veilig vakje.', fen: 'k3r3/8/8/8/8/8/8/4K3 w - - 0 1' },
      { type: 'goal', goal: 'escape', text: 'Weer schaak! Je kunt ook het stuk slaan dat schaak geeft.', fen: 'k7/8/8/8/8/8/3q4/R3K3 w - - 0 1' },
    ],
  },
  {
    world: 2, id: 'mat', title: 'Schaakmat', icon: 'wK',
    steps: [
      { type: 'talk', text: 'Staat de koning schaak en kan hij nergens meer heen? Dan is het SCHAAKMAT. Je hebt gewonnen!', fen: '3R2k1/5ppp/8/8/8/8/8/6K1 b - - 0 1', mark: ['g8'] },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat in één zet!', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat met de koningin!', fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Twee torens werken samen. Geef schaakmat!', fen: 'k7/8/8/8/8/8/1R6/6RK w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Een lastige! Geef schaakmat.', fen: '3k4/8/3K4/8/8/8/8/7R w - - 0 1' },
    ],
  },
  {
    world: 2, id: 'rokeren', title: 'Rokeren', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Nu een geheime truc: rokeren! De koning en de toren wisselen samen van plek.', fen: '4k3/8/8/8/8/8/8/4K2R w K - 0 1' },
      { type: 'talk', text: 'De koning doet twee stapjes naar de toren. De toren springt over hem heen. Zo staat de koning veilig!', fen: '4k3/8/8/8/8/8/8/5RK1 b - - 0 1' },
      { type: 'goal', goal: 'castle', text: 'Probeer het! Tik op de koning en zet hem twee stapjes naar rechts.', fen: '4k3/8/8/8/8/8/8/4K2R w K - 0 1' },
      { type: 'talk', text: 'Rokeren mag alleen als de koning en de toren nog niet bewogen hebben. En er mag niks tussen staan.', fen: '4k3/8/8/8/8/8/8/4K2R w K - 0 1' },
    ],
  },
  {
    world: 2, id: 'enpassant', title: 'En passant', icon: 'bP',
    steps: [
      { type: 'talk', text: 'Nog een geheime pionnen-truc! Hij heet en passant. Dat is Frans en betekent: in het voorbijgaan.', fen: '4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1', mark: ['d7', 'e5'] },
      { type: 'talk', text: 'De zwarte pion zet twee stapjes en loopt langs jouw pion. Stiekem!', fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1', mark: ['d5'] },
      { type: 'talk', text: 'Nu mag jouw pion hem toch slaan! Je gaat schuin naar het lege vakje erachter.', fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1', showMoves: 'e5' },
      { type: 'goal', goal: 'enpassant', text: 'Sla de zwarte pion en passant!', fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1' },
      { type: 'goal', goal: 'enpassant', text: 'Nog een keer! Sla de pion en passant.', fen: '4k3/8/8/5Pp1/8/8/8/4K3 w - g6 0 1' },
      { type: 'quiz', text: 'Wanneer mag je en passant slaan?', options: [{ label: 'Meteen na de twee stapjes', ok: true }, { label: 'Wanneer je maar wilt' }] },
    ],
  },
  {
    world: 2, id: 'tips', title: 'Klaar voor een potje!', icon: 'bQ',
    steps: [
      { type: 'talk', text: 'Je weet nu alles om te schaken! Hier zijn nog drie gouden tips.', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
      { type: 'talk', text: 'Tip 1: Zet je pionnen en paarden naar het midden van het bord.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', mark: ['d4', 'e4', 'd5', 'e5'] },
      { type: 'talk', text: 'Tip 2: Kijk voor elke zet: kan de ander mijn stuk slaan?', fen: 'rnbqkbnr/ppp1pppp/8/3p4/4Q3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3', mark: ['e4'] },
      { type: 'talk', text: 'Tip 3: Kijk ook wat de ander van plan is. En pas goed op je koning!', fen: 'rnbqkbnr/pppp1ppp/8/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3', mark: ['f7'] },
      { type: 'quiz', text: 'Wat doe je voor elke zet?', options: [{ label: 'Goed kijken!', ok: true }, { label: 'Snel snel snel!' }] },
      { type: 'talk', text: 'Hoera! Je kent alle regels. Speel een potje tegen Opa, of ga door naar wereld 3!', pieces: { d4: 'wN', e4: 'wK' } },
    ],
  },
  /* ---------------- WERELD 3: SLIM SPELEN ---------------- */
  {
    world: 3, id: 'los', title: 'Losse stukken', icon: 'bN',
    steps: [
      { type: 'talk', text: 'Welkom in wereld 3! Hier leer je slim spelen. Eerst: losse stukken.', pieces: { d4: 'wN', e4: 'wK' } },
      { type: 'talk', text: 'Een stuk dat door niemand beschermd wordt, heet een los stuk. Dat kun je gratis pakken!', fen: '4k3/8/8/8/1b6/8/8/1R2K3 w - - 0 1', mark: ['b4'] },
      { type: 'talk', text: 'Maar pas op! Wordt het stuk beschermd? Dan slaat de ander jouw stuk meteen terug.', fen: '4k3/8/2p5/3p4/8/8/8/3QK3 w - - 0 1', mark: ['d5', 'c6'] },
      { type: 'goal', goal: 'hanging', text: 'Je kunt twee stukken slaan. Pak het losse stuk!', fen: '6k1/2p2ppp/3n4/8/8/8/8/b2R2K1 w - - 0 1' },
      { type: 'goal', goal: 'hanging', text: 'Welk stuk staat los? Pak het met je paard!', fen: '4k3/8/p7/1n6/4b3/2N5/8/4K3 w - - 0 1' },
      { type: 'goal', goal: 'hanging', text: 'De koningin heeft honger. Maar welk stuk is gratis?', fen: '6k1/5p1p/6p1/7b/n7/8/8/3Q2K1 w - - 0 1' },
    ],
  },
  {
    world: 3, id: 'redden', title: 'Red je stuk!', icon: 'wR',
    steps: [
      { type: 'talk', text: 'Wordt jouw stuk aangevallen? Dan moet je het redden!', fen: '6k1/8/8/3p4/4R3/8/8/6K1 w - - 0 1', mark: ['e4', 'd5'] },
      { type: 'talk', text: 'Je kunt wegvluchten naar een veilig vakje. Of je zet er een beschermer naast.', fen: '6k1/8/8/3p4/4R3/8/8/6K1 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'De pion valt je toren aan. Zet de toren op een veilig vakje!', fen: '6k1/8/8/3p4/4R3/8/8/6K1 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'Het paard valt je koningin aan! Breng haar in veiligheid.', fen: '6k1/8/8/5n2/3Q4/8/8/6K1 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'De toren valt je paard aan. Vlucht weg, of bescherm het met je pion!', fen: '2r3k1/8/8/8/2N5/8/1P6/6K1 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'Het paard valt twee stukken aan! Met één slimme zet red je ze allebei.', fen: '6k1/8/8/8/1n6/8/R1B5/6K1 w - - 0 1' },
    ],
  },
  {
    world: 3, id: 'vork', title: 'De vork', icon: 'wN',
    steps: [
      { type: 'talk', text: 'Nu een supertruc: de vork! Eén stuk valt twee stukken tegelijk aan.', fen: 'r3k3/2N5/8/8/8/8/8/4K3 b - - 0 1', showMoves: 'c7' },
      { type: 'talk', text: 'Zwart kan maar één stuk redden. Het andere stuk kun jij dan pakken. Jammie!', fen: 'r3k3/2N5/8/8/8/8/8/4K3 b - - 0 1', mark: ['a8', 'e8'] },
      { type: 'goal', goal: 'fork', text: 'Spring met het paard zo dat je de koning en de toren aanvalt!', fen: 'r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1' },
      { type: 'goal', goal: 'fork', text: 'Maak een vork op de koningin en de toren!', fen: '3q1rk1/8/8/6N1/8/8/8/4K3 w - - 0 1' },
      { type: 'talk', text: 'Ook een pion kan een vork maken! Hij slaat naar links en naar rechts.', fen: '4k3/8/2n1b3/3P4/4P3/8/8/4K3 b - - 0 1', showMoves: 'd5' },
      { type: 'goal', goal: 'fork', text: 'Maak een pionnenvork!', fen: '4k3/8/2n1b3/8/3PP3/8/8/4K3 w - - 0 1' },
      { type: 'goal', goal: 'fork', text: 'De koningin kan ook vorken. Geef schaak en val tegelijk het paard aan!', fen: '4k3/8/8/n7/8/8/8/3QK3 w - - 0 1' },
    ],
  },
  {
    world: 3, id: 'matpatronen', title: 'Mat-trucjes', icon: 'bK',
    steps: [
      { type: 'talk', text: 'Staat de koning achter zijn eigen pionnen? Dan zit hij opgesloten. Dat heet: mat achter de paaltjes!', fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1', mark: ['f7', 'g7', 'h7'] },
      { type: 'goal', goal: 'mate', text: 'Geef mat achter de paaltjes!', fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Nog een keer, maar nu met de toren van dichtbij.', fen: '6k1/4Rppp/8/8/8/8/5PPP/6K1 w - - 0 1' },
      { type: 'talk', text: 'De kus van de koningin: zij staat vlak voor de koning, en haar eigen koning beschermt haar.', fen: '4k3/4Q3/4K3/8/8/8/8/8 b - - 0 1', mark: ['e7'] },
      { type: 'goal', goal: 'mate', text: 'Geef schaakmat met de koningin!', fen: '4k3/Q7/4K3/8/8/8/8/8 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'De koning zit in de hoek. Geef schaakmat!', fen: '7k/8/6K1/8/8/8/8/Q7 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Koningin en loper werken samen. Geef mat!', fen: '6k1/5p1p/6pQ/8/8/8/1B6/6K1 w - - 0 1' },
    ],
  },
  {
    world: 3, id: 'opening', title: 'Een goed begin', icon: 'wP',
    steps: [
      { type: 'talk', text: 'Hoe begin je een potje goed? Het midden van het bord is het belangrijkste!', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', mark: ['d4', 'e4', 'd5', 'e5'] },
      { type: 'goal', goal: 'to', piece: 'P', squares: ['e4', 'd4'], text: 'Zet een pion twee stapjes naar het midden!', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
      { type: 'talk', text: 'Haal daarna je paarden en lopers eruit. Dan kunnen ze meedoen!', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2' },
      { type: 'goal', goal: 'to', piece: 'N', squares: ['f3', 'c3'], text: 'Haal een paard eruit, richting het midden.', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2' },
      { type: 'goal', goal: 'castle', text: 'Alles staat klaar. Breng je koning in veiligheid: rokeer!', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5' },
      { type: 'talk', text: 'Pas op voor het herdersmatje! Zo kun je heel snel verliezen. Kijk naar het pionnetje op f7.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', mark: ['f7', 'h5', 'c4'] },
      { type: 'goal', goal: 'mate', text: 'Probeer het zelf: geef het herdersmatje!', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4' },
      { type: 'quiz', text: 'Wat is een goede eerste zet?', options: [{ label: 'Pion naar het midden', piece: 'wP', ok: true }, { label: 'Koning naar voren', piece: 'wK' }, { label: 'Toren eruit', piece: 'wR' }] },
    ],
  },
  {
    world: 3, id: 'toets', title: 'Schaakmeester-toets', icon: 'wQ',
    steps: [
      { type: 'talk', text: 'De laatste les! Laat zien wat je allemaal kunt. Succes, Sam!', pieces: { d4: 'wN', e4: 'wQ' } },
      { type: 'goal', goal: 'hanging', text: 'Opdracht 1: pak het losse stuk.', fen: '4k3/8/8/3r4/8/8/3R4/4K3 w - - 0 1' },
      { type: 'goal', goal: 'fork', text: 'Opdracht 2: maak een vork met je paard.', fen: '4r1k1/8/8/7N/8/8/8/K7 w - - 0 1' },
      { type: 'goal', goal: 'safe', text: 'Opdracht 3: je loper wordt aangevallen. Red hem!', fen: '6k1/8/8/8/2p5/1B6/8/6K1 w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Opdracht 4: geef schaakmat!', fen: 'k7/1p6/1K6/8/8/8/8/7R w - - 0 1' },
      { type: 'goal', goal: 'mate', text: 'Laatste opdracht: geef schaakmat met de koningin!', fen: '6k1/5ppp/8/8/8/8/8/4Q1K1 w - - 0 1' },
      { type: 'talk', text: 'Wauw! Je bent nu een echte schaakmeester! Laat maar zien wat je kunt tegen de familie.', pieces: { c4: 'wK', d4: 'wQ', e4: 'wN' } },
    ],
  },
];
