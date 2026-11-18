/* =========================================================
   Sammie Schaakt! - PUZZELS
   Bewust makkelijk: schaak geven, schaakmat in één zet, een los stuk pakken
   en een stuk in veiligheid brengen. Simpele woorden, geen moeilijke termen.
   Uit de lessen 'Schaak!', 'Schaakmat', 'Losse stukken' en 'Red je stuk!'
   komen er automatisch nog wat bij (zie puzzlePool in app.js).
   ========================================================= */
const PUZZLES = [
  // schaak geven (er zijn veel goede zetten)
  { goal: 'check', text: 'Val de zwarte koning aan met je toren!', fen: '4k3/8/8/8/8/8/8/R3K3 w - - 0 1' },
  { goal: 'check', text: 'Val de zwarte koning aan met je koningin!', fen: '4k3/8/8/8/8/8/8/3QK3 w - - 0 1' },
  { goal: 'check', text: 'Val de zwarte koning aan met je paard!', fen: '4k3/8/8/8/4N3/8/8/4K3 w - - 0 1' },
  { goal: 'check', text: 'Val de zwarte koning aan met je loper!', fen: '4k3/8/8/8/8/8/8/4KB2 w - - 0 1' },
  // schaakmat in één zet
  { goal: 'mate', text: 'Geef schaakmat met je toren!', fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1' },
  { goal: 'mate', text: 'Geef schaakmat met je toren!', fen: '7k/8/6K1/8/8/8/8/R7 w - - 0 1' },
  { goal: 'mate', text: 'De koning zit achter zijn pionnen. Geef schaakmat met je toren!', fen: '1k6/ppp5/8/8/8/8/8/4R1K1 w - - 0 1' },
  { goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: 'k7/2Q5/1K6/8/8/8/8/8 w - - 0 1' },
  { goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: 'k7/8/1K6/8/8/8/8/2Q5 w - - 0 1' },
  // een stuk pakken dat niemand beschermt
  { goal: 'hanging', text: 'Pak de zwarte koningin! Niemand beschermt haar.', fen: '4k3/8/8/1q6/8/8/8/1R2K3 w - - 0 1' },
  { goal: 'hanging', text: 'Pak het zwarte paard met je loper!', fen: '4k3/8/5n2/8/3B4/8/8/4K3 w - - 0 1' },
  { goal: 'hanging', text: 'Pak de zwarte toren met je koningin!', fen: '4k3/1r6/8/8/8/8/8/4K2Q w - - 0 1' },
  // stuk in veiligheid brengen
  { goal: 'safe', text: 'De pion valt je koningin aan! Zet haar op een veilig vakje.', fen: '4k3/8/8/8/2p5/1Q6/8/4K3 w - - 0 1' },
  { goal: 'safe', text: 'De pion valt je paard aan! Zet het op een veilig vakje.', fen: '6k1/8/8/8/4p3/3N4/8/6K1 w - - 0 1' },
];
