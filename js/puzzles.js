/* =========================================================
   Sammie Schaakt! - PUZZELS
   Extra puzzels voor de puzzelmodus. Werkt net als 'goal' in lessons.js.
   Alle puzzels zijn meteen te spelen. De goal-opdrachten uit de lessen doen ook mee
   (PUZZLE_UNLOCK zegt welke soorten daarvoor geschikt zijn).
   ========================================================= */
const PUZZLE_UNLOCK = { check: 'schaak', mate: 'mat', hanging: 'los', safe: 'redden', fork: 'vork', enpassant: 'enpassant' };

const PUZZLES = [
  // schaakmat in één
  { goal: 'mate', text: 'Geef schaakmat met de toren!', fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1' },
  { goal: 'mate', text: 'Geef schaakmat!', fen: '7k/8/6K1/8/8/8/8/R7 w - - 0 1' },
  { goal: 'mate', text: 'Mat achter de paaltjes!', fen: '1k6/ppp5/8/8/8/8/8/4R1K1 w - - 0 1' },
  { goal: 'mate', text: 'De koningin geeft mat. Waar?', fen: 'k7/2Q5/1K6/8/8/8/8/8 w - - 0 1' },
  { goal: 'mate', text: 'Het paard geeft mat! De koning zit helemaal vast.', fen: '6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1' },
  { goal: 'mate', text: 'Toren en koning werken samen. Geef mat!', fen: '3k4/3P4/3K4/8/8/8/8/R7 w - - 0 1' },
  { goal: 'mate', text: 'Geef schaakmat met de koningin!', fen: 'k7/8/1K6/8/8/8/8/2Q5 w - - 0 1' },
  // losse stukken
  { goal: 'hanging', text: 'Er staat iets heel lekkers los. Pak het!', fen: '4k3/8/8/1q6/8/8/8/1R2K3 w - - 0 1' },
  { goal: 'hanging', text: 'Pak het losse stuk met je loper.', fen: '4k3/8/5n2/8/3B4/8/8/4K3 w - - 0 1' },
  { goal: 'hanging', text: 'Twee stukken kun je slaan. Welk stuk is gratis?', fen: '4k3/8/p7/1b1n4/8/2N5/8/4K3 w - - 0 1' },
  // vorken
  { goal: 'fork', text: 'Maak een vork met het paard!', fen: '1k1r4/8/8/4N3/8/8/8/4K3 w - - 0 1' },
  { goal: 'fork', text: 'Val de koning en de koningin tegelijk aan!', fen: '4k3/8/q7/3N4/8/8/8/4K3 w - - 0 1' },
  { goal: 'fork', text: 'Een pion kan ook vorken!', fen: '4k3/8/8/2r1n3/8/3P4/8/4K3 w - - 0 1' },
  // stuk redden
  { goal: 'safe', text: 'Je koningin wordt aangevallen! Red haar.', fen: '4k3/8/8/8/2p5/1Q6/8/4K3 w - - 0 1' },
  { goal: 'safe', text: 'De pion valt je paard aan. Breng het in veiligheid!', fen: '6k1/8/8/8/4p3/3N4/8/6K1 w - - 0 1' },
];
