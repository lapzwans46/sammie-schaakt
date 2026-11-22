/* =========================================================
   Sammie Schaakt! - PUZZELS, in drie niveaus
   level 1  ⭐       Makkelijk: schaak geven, mat in één, los stuk pakken, stuk redden
   level 2  ⭐⭐     Moeilijker: vork, en opdrachten van twee zetten (die beginnen met schaak)
   level 3  ⭐⭐⭐   Superdenker: drie zetten, en twee zetten die met een STILLE zet beginnen
   Elke puzzel heeft precies één oplossing, ook als zwart iets anders terugzet
   (controleer met tools/puzzelcontrole.html).
   Uit de lessen komen er automatisch nog meer bij (zie puzzlePool in app.js).
   Vooruit-denk-puzzels: goal 'plan', win 'mate'/'Q'/'R', line = de oplossing (zwart zet vanzelf).
   ========================================================= */
const PUZZLES = [
  /* ---------------- NIVEAU 1: MAKKELIJK ---------------- */
  // schaak geven
  { level: 1, goal: 'check', text: 'Val de zwarte koning aan met je toren!', fen: '4k3/8/8/8/8/8/8/R3K3 w - - 0 1' },
  { level: 1, goal: 'check', text: 'Val de zwarte koning aan met je koningin!', fen: 'k7/1p6/p7/8/8/8/8/3QK3 w - - 0 1' },
  { level: 1, goal: 'check', text: 'Val de zwarte koning aan met je paard!', fen: '6k1/8/8/8/4N3/8/8/4K3 w - - 0 1' },
  { level: 1, goal: 'check', text: 'Val de zwarte koning aan met je loper!', fen: '4k3/8/8/8/8/8/8/4KB2 w - - 0 1' },
  // schaakmat in één zet
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je toren!', fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je toren!', fen: '7k/8/6K1/8/8/8/8/R7 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je toren!', fen: '1k6/ppp5/8/8/8/8/8/4R1K1 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: 'k7/8/2K5/8/8/8/1Q6/8 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: 'k7/8/1K6/8/8/8/8/2Q5 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je toren!', fen: 'k7/p2p4/K7/8/7p/8/8/6R1 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je toren!', fen: 'k1K5/7p/8/5p2/1R4p1/8/8/8 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je toren!', fen: '7k/5Kp1/2p5/8/pR6/8/8/8 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: '1k6/2p5/K7/1p6/6n1/8/P3Q3/8 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: '5k2/8/4K3/8/1p1Q1p2/8/5P2/6n1 w - - 0 1' },
  { level: 1, goal: 'mate', text: 'Geef schaakmat met je koningin!', fen: 'k7/p1Q5/6p1/1n6/1K6/7P/8/8 w - - 0 1' },
  // een stuk pakken dat niemand beschermt
  { level: 1, goal: 'hanging', text: 'Pak de zwarte koningin!', fen: '4k3/8/8/1q6/8/8/8/1R2K3 w - - 0 1' },
  { level: 1, goal: 'hanging', text: 'Pak het zwarte paard met je loper!', fen: '4k3/8/5n2/8/3B4/8/8/4K3 w - - 0 1' },
  { level: 1, goal: 'hanging', text: 'Pak de zwarte toren met je koningin!', fen: '4k3/1r6/8/8/8/8/8/4K2Q w - - 0 1' },
  { level: 1, goal: 'hanging', text: 'Welk stuk is los? Pak het!', fen: '2k5/4b3/K3n2R/5pp1/8/1P6/6B1/8 w - - 0 1' },
  { level: 1, goal: 'hanging', text: 'Welk stuk is los? Pak het!', fen: '8/p1p1b3/8/4R3/7k/PK5n/B7/8 w - - 0 1' },
  { level: 1, goal: 'hanging', text: 'Welk stuk is los? Pak het!', fen: '2K2k2/7R/1p2n3/bB6/p5P1/8/8/8 w - - 0 1' },
  { level: 1, goal: 'hanging', text: 'Welk stuk is los? Pak het!', fen: '8/k2p1B2/8/2p4R/2n5/1P1b4/8/3K4 w - - 0 1' },
  // stuk in veiligheid brengen
  { level: 1, goal: 'safe', text: 'Red je toren!', fen: '4k3/8/8/8/8/4n3/Pp6/R3K3 w - - 0 1' },
  { level: 1, goal: 'safe', text: 'Zwart valt aan! Zorg dat niks van jou te pakken is.', fen: '2K5/2B5/2p3N1/1p6/2P1n2r/8/8/3k4 w - - 0 1' },
  { level: 1, goal: 'safe', text: 'Zwart valt aan! Zorg dat niks van jou te pakken is.', fen: '5N2/1K6/6R1/1p6/8/4n3/2b2P2/4k3 w - - 0 1' },
  { level: 1, goal: 'safe', text: 'Zwart valt aan! Zorg dat niks van jou te pakken is.', fen: 'k4N2/3R4/2n5/P7/p7/8/4bK2/8 w - - 0 1' },
  { level: 1, goal: 'safe', text: 'Zwart valt aan! Zorg dat niks van jou te pakken is.', fen: 'k7/N5R1/8/8/3p2K1/2P2n2/8/5b2 w - - 0 1' },

  /* ---------------- NIVEAU 2: MOEILIJKER ---------------- */
  // vork: val twee stukken tegelijk aan
  { level: 2, goal: 'fork', text: 'Maak een vork met je paard!', fen: '1NK5/8/8/4p3/1q1r4/1P6/P5Pk/8 w - - 0 1' },
  { level: 2, goal: 'fork', text: 'Maak een vork met je paard!', fen: '8/8/2r5/3K4/2p5/1N6/k1q2P2/8 w - - 0 1' },
  { level: 2, goal: 'fork', text: 'Maak een vork met je paard!', fen: '8/k6q/4K3/r1p5/3N4/5P2/8/8 w - - 0 1' },
  { level: 2, goal: 'fork', text: 'Maak een vork met je paard!', fen: '8/8/8/p3q2k/5r2/4P1K1/1N6/8 w - - 0 1' },
  { level: 2, goal: 'fork', text: 'Maak een vork met je koningin!', fen: '8/r6k/8/pPp5/6K1/2n5/1Q6/8 w - - 0 1' },
  { level: 2, goal: 'fork', text: 'Maak een vork met je koningin!', fen: '4k3/2p3Q1/3r4/8/1P3pK1/8/3n4/8 w - - 0 1' },
  // twee zetten: pak de koningin
  { level: 2, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 2 zetten.', fen: '3K3k/3p4/7N/4q3/8/1P6/P7/8 w - - 0 1', line: ['h6-f7', 'h8-g8', 'f7-e5'], say: ['Goed! En nu?'] },
  { level: 2, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 2 zetten.', fen: '2K5/8/5p2/4N3/1q6/8/7P/2k5 w - - 0 1', line: ['e5-d3', 'c1-c2', 'd3-b4'], say: ['Goed! En nu?'] },
  { level: 2, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 2 zetten.', fen: '4k3/7N/4p3/3P4/6q1/8/3K4/8 w - - 0 1', line: ['h7-f6', 'e8-d8', 'f6-g4'], say: ['Goed! En nu?'] },
  { level: 2, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 2 zetten.', fen: '4K3/2R5/5p2/7k/8/8/8/1B5q w - - 0 1', line: ['c7-h7', 'h5-g5', 'h7-h1'], say: ['Goed! En nu?'] },
  { level: 2, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 2 zetten.', fen: '2B5/1K6/1p6/6R1/8/8/8/q2k4 w - - 0 1', line: ['g5-g1', 'd1-c2', 'g1-a1'], say: ['Goed! En nu?'] },
  // twee zetten: pak de toren
  { level: 2, goal: 'plan', win: 'R', text: 'Pak de toren! Je hebt 2 zetten.', fen: '8/K7/p7/1p6/2Q5/8/7k/4r3 w - - 0 1', line: ['c4-h4', 'h2-g2', 'h4-e1'], say: ['Goed! En nu?'] },
  { level: 2, goal: 'plan', win: 'R', text: 'Pak de toren! Je hebt 2 zetten.', fen: '5Q2/k2p1p2/8/8/3r4/8/5K2/8 w - - 0 1', line: ['f8-c5', 'a7-a8', 'c5-d4'], say: ['Goed! En nu?'] },
  { level: 2, goal: 'plan', win: 'R', text: 'Pak de toren! Je hebt 2 zetten.', fen: '4r3/6pk/8/8/2p3Q1/8/8/1K6 w - - 0 1', line: ['g4-h5', 'h7-g8', 'h5-e8'], say: ['Goed! En nu?'] },
  // twee zetten: schaakmat (het trappetje)
  { level: 2, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 2 zetten!', fen: '1R6/6k1/pR6/5K2/6p1/8/8/8 w - - 0 1', line: ['b6-b7', 'g7-h6', 'b8-h8'], say: ['Goed! Nu schaakmat!'] },
  { level: 2, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 2 zetten!', fen: '8/7k/R7/8/p2p4/7K/2R5/8 w - - 0 1', line: ['c2-c7', 'h7-g8', 'a6-a8'], say: ['Goed! Nu schaakmat!'] },
  { level: 2, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 2 zetten!', fen: '8/k5p1/5R2/3R3p/8/8/7K/8 w - - 0 1', line: ['d5-d7', 'a7-a8', 'f6-f8'], say: ['Goed! Nu schaakmat!'] },
  { level: 2, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 2 zetten!', fen: '1k6/8/8/p1R3K1/3p4/8/8/6R1 w - - 0 1', line: ['g1-b1', 'b8-a8', 'c5-a5'], say: ['Goed! Nu schaakmat!'] },

  /* ---------------- NIVEAU 3: SUPERDENKER ---------------- */
  // drie zetten: schaakmat
  { level: 3, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 3 zetten!', fen: '4k3/6p1/5R2/8/7K/Q7/8/8 w - - 0 1', line: ['a3-f8', 'e8-d7', 'f8-g7', 'd7-c8', 'f6-f8'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 3 zetten!', fen: '5k2/4p3/8/3R4/Q7/8/2K5/8 w - - 0 1', line: ['d5-f5', 'f8-g8', 'a4-g4', 'g8-h8', 'f5-h5'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 3 zetten!', fen: '7k/5p2/8/1QR5/4K3/8/8/8 w - - 0 1', line: ['c5-h5', 'h8-g8', 'b5-g5', 'g8-f8', 'h5-h8'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 3 zetten!', fen: '2k5/8/8/8/4p3/3R4/6Q1/7K w - - 0 1', line: ['g2-c2', 'c8-b8', 'd3-b3', 'b8-a8', 'c2-a2'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 3 zetten!', fen: 'B6k/6p1/8/8/1Q6/8/1K6/8 w - - 0 1', line: ['b4-h4', 'h8-g8', 'a8-d5', 'g8-f8', 'h4-d8'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 3 zetten!', fen: '8/k5p1/8/7K/8/8/6B1/4Q3 w - - 0 1', line: ['e1-a5', 'a7-b8', 'a5-b6', 'b8-c8', 'g2-h3'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Geef schaakmat in 3 zetten!', fen: '8/6pk/2B5/1Q6/8/8/K7/8 w - - 0 1', line: ['b5-h5', 'h7-g8', 'c6-d5', 'g8-f8', 'h5-f7'], say: ['Goed! En nu?', 'Nog één zet!'] },
  // drie zetten: pak de koningin
  { level: 3, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 3 zetten.', fen: '8/8/2p2K2/1R6/8/N6k/8/6q1 w - - 0 1', line: ['b5-h5', 'h3-g4', 'h5-g5', 'g4-f4', 'g5-g1'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 3 zetten.', fen: '8/1p6/8/2R5/3N2K1/k7/8/1q6 w - - 0 1', line: ['c5-a5', 'a3-b4', 'a5-b5', 'b4-a4', 'b5-b1'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 3 zetten.', fen: '6k1/2p4q/3R4/6K1/8/8/8/N7 w - - 0 1', line: ['d6-d8', 'g8-f7', 'd8-d7', 'f7-e8', 'd7-h7'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 3 zetten.', fen: '2q5/3p1R2/2N5/8/k7/8/K7/8 w - - 0 1', line: ['f7-f4', 'a4-b5', 'c6-a7', 'b5-a6', 'a7-c8'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 3 zetten.', fen: '5K2/q7/8/7k/p7/8/2B3Q1/8 w - - 0 1', line: ['g2-g6', 'h5-h4', 'g6-h7', 'a7-h7', 'c2-h7'], say: ['Goed! En nu?', 'Nog één zet!'] },
  { level: 3, goal: 'plan', win: 'Q', text: 'Pak de koningin! Je hebt 3 zetten.', fen: 'B1k2q2/8/8/8/K4p2/8/6Q1/8 w - - 0 1', line: ['g2-b7', 'c8-d8', 'b7-b8', 'd8-d7', 'b8-f8'], say: ['Goed! En nu?', 'Nog één zet!'] },
  // twee zetten, maar de eerste zet is GEEN schaak (een stille zet)
  { level: 3, goal: 'plan', win: 'mate', text: 'Mat in 2! Tip: de eerste zet is géén schaak.', fen: 'k7/7p/8/1pK5/8/6Q1/8/8 w - - 0 1', line: ['c5-b6', 'h7-h6', 'g3-g8'], say: ['Slim! Nu schaakmat!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Mat in 2! Tip: de eerste zet is géén schaak.', fen: '7k/4p3/8/6K1/5p2/8/3Q4/8 w - - 0 1', line: ['g5-g6', 'h8-g8', 'd2-d8'], say: ['Slim! Nu schaakmat!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Mat in 2! Tip: de eerste zet is géén schaak.', fen: '4K1k1/7p/1Q6/8/3p4/8/8/8 w - - 0 1', line: ['b6-h6', 'g8-h8', 'h6-f8'], say: ['Slim! Nu schaakmat!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Mat in 2! Tip: de eerste zet is géén schaak.', fen: '5k2/3K4/8/1R6/3p4/1R6/8/8 w - - 0 1', line: ['b3-g3', 'f8-f7', 'b5-f5'], say: ['Slim! Nu schaakmat!'] },
  { level: 3, goal: 'plan', win: 'mate', text: 'Mat in 2! Tip: de eerste zet is géén schaak.', fen: '7k/8/3R4/K1p5/1R6/8/8/8 w - - 0 1', line: ['b4-b7', 'h8-g8', 'd6-d8'], say: ['Slim! Nu schaakmat!'] },
];
