/* =========================================================
   Sammie Schaakt! - DE FAMILIE
   Hier staan de speler en de tegenstanders.
   De ladder loopt van makkelijk naar moeilijk (op niveau): versla iemand en de volgende komt vrij.
   Tip: uiterlijk, naam en niveau kun je ook in de app aanpassen (⚙️ > Tegenstanders),
   en daar kun je ook zelf nieuwe tegenstanders maken.

   look:   hoe het poppetje eruit ziet
           hairStyle: 'bald' | 'bun' | 'long' | 'spiky' | 'short' | 'curly'
                      | 'ponytail' | 'pigtails' | 'bob'
           hair, skin, shirt: kleuren
           extra's (true/false): glasses, mustache, beard, freckles, bow,
                                 earrings, necklace, collar
   level:  1 (heel makkelijk) t/m 11 (sterk), zie ai.js
   ========================================================= */
const FAMILY = {
  player: {
    id: 'sammie',
    name: 'Sam',
    look: { skin: '#f7d3b5', hair: '#8a5a2b', hairStyle: 'spiky', shirt: '#ff7a45' },
  },

  // Pim het paard is de juf/meester van de lessen
  teacher: { id: 'pim', name: 'Pim het Paard' },

  opponents: [
    {
      id: 'opa', name: 'Opa', level: 1,
      intro: 'Opa speelt heel rustig.',
      look: { skin: '#f7d3b5', hair: '#4a2f1b', hairStyle: 'spiky', shirt: '#3f8f5a', glasses: true, glassesColor: '#6b4f2a', collar: true },
      say: {
        start: ['Hoi Sam! Zullen we een potje schaken?', 'Gezellig, een potje met jou!'],
        think: ['Hmm, even denken...', 'Wat zal ik eens doen?', 'Eens kijken...'],
        lostPiece: ['Oei! Die had ik nodig!', 'Oh nee, mijn stuk!', 'Dat had ik niet gezien!'],
        tookPiece: ['Hap! Die is van mij.', 'Hihi, die pak ik!'],
        gaveCheck: ['Schaak! Pas op je koning!'],
        gotCheck: ['Oh jee, mijn koning staat schaak!', 'Oei, schaak!'],
        win: ['Ik won! Jij speelde goed.'],
        lose: ['Jij wint! Goed zo, kanjer!', 'Wauw, jij bent slim!'],
        draw: ['Gelijkspel!'],
      },
    },
    {
      id: 'oma', name: 'Oma', level: 2,
      intro: 'Oma let goed op je stukken.',
      look: { skin: '#f7d3b5', hair: '#f2c94c', hairStyle: 'bob', shirt: '#9b5de5', glasses: true, glassesColor: '#c2477a', earrings: true },
      say: {
        start: ['Dag lieverd! Zin in een potje schaak?', 'Kom maar op, Sam!'],
        think: ['Even nadenken hoor...', 'Hmm, slim zijn nu...', 'Wat is hier slim?'],
        lostPiece: ['Ai! Goed gezien, hoor!', 'Oh, dat was slim van jou!'],
        tookPiece: ['Die neem ik mee!', 'Oeps, die stond niet veilig!'],
        gaveCheck: ['Schaak! Waar gaat je koning heen?'],
        gotCheck: ['Oh, mijn koning staat schaak!', 'Schaak? Ojee!'],
        win: ['Ik won! Nog een keer?'],
        lose: ['Jij wint! Ik ben trots!', 'Knap hoor! Jij kunt echt schaken!'],
        draw: ['Gelijkspel! Dat was spannend.'],
      },
    },
    {
      id: 'pietje', name: 'Pietje', level: 3,
      intro: 'Pietje speelt snel en vrolijk.',
      look: { skin: '#f8d8bd', hair: '#e2793a', hairStyle: 'curly', shirt: '#2ec4b6', freckles: true },
      say: {
        start: ['Hoi Sam! Ik ga winnen hoor!', 'Yes, schaken! Kom op!'],
        think: ['Ehhh...', 'Wacht even...', 'Hmmm!'],
        lostPiece: ['Hé! Haha, goed zo!', 'Oeps! Die was ik vergeten.'],
        tookPiece: ['Yes! Gepakt!', 'Hap hap!'],
        gaveCheck: ['Schaak! Haha!'],
        gotCheck: ['Wat? Schaak? Oei!'],
        win: ['Joepie, ik won! Nog een keer?'],
        lose: ['Jij wint! Nog een keer!'],
        draw: ['Gelijkspel! Niemand wint, haha.'],
      },
    },
    {
      id: 'cato', name: 'Cato', level: 4,
      intro: 'Cato denkt een beetje na.',
      look: { skin: '#f7d3b5', hair: '#f2c94c', hairStyle: 'pigtails', shirt: '#ffcf33', freckles: true, bowColor: '#ffd34d' },
      say: {
        start: ['Hoi Sam! Zin in een potje?', 'Gaan we schaken? Leuk!'],
        think: ['Even goed kijken...', 'Hmm, wat doe ik?'],
        lostPiece: ['Oh nee! Slim van jou!', 'Aiii, mijn stuk!'],
        tookPiece: ['Hihi, die is voor mij!', 'Die stond los!'],
        gaveCheck: ['Schaak! Red je koning maar!'],
        gotCheck: ['Oei, mijn koning!'],
        win: ['Ik won! Goed geprobeerd, Sam!'],
        lose: ['Jij wint! Wauw!'],
        draw: ['Gelijkspel!'],
      },
    },
    {
      id: 'lout', name: 'Lout', level: 5,
      intro: 'Lout valt graag aan.',
      look: { skin: '#f3cba8', hair: '#f2c94c', hairStyle: 'curly', shirt: '#e63946' },
      say: {
        start: ['Hé Sam! Klaar voor de strijd?', 'Kom maar, ik ben er klaar voor!'],
        think: ['Aanvallen... of toch niet?', 'Ik bedenk een plan...'],
        lostPiece: ['Huh?! Die had je goed gezien.', 'Oei, die ben ik kwijt.'],
        tookPiece: ['Aanvallen! Gepakt!', 'Die neem ik!'],
        gaveCheck: ['Schaak! Ik val aan!'],
        gotCheck: ['Wauw, schaak! Spannend!'],
        win: ['Ik won! Volgende keer jij?'],
        lose: ['Jij wint! Sterk!'],
        draw: ['Gelijkspel! Wat een strijd.'],
      },
    },
    {
      id: 'sophie', name: 'Sophie', level: 6,
      intro: 'Sophie speelt slim.',
      look: { skin: '#f9dcc4', hair: '#f2c94c', hairStyle: 'ponytail', shirt: '#ff70a6', bowColor: '#ff5d8f', earrings: true },
      say: {
        start: ['Hoi Sam! Ik heb er zin in!', 'Zullen we een mooi potje spelen?'],
        think: ['Even rustig nadenken...', 'Wat is de beste zet?'],
        lostPiece: ['Oh, knap gevonden!', 'Die had ik moeten beschermen!'],
        tookPiece: ['Dank je wel voor dit stuk!', 'Die pak ik even!'],
        gaveCheck: ['Schaak! Waar gaat je koning heen?'],
        gotCheck: ['Oh! Schaak. Even redden...'],
        win: ['Ik won! Je wordt steeds beter.'],
        lose: ['Jij wint! Super gedaan!'],
        draw: ['Gelijkspel! Netjes gespeeld.'],
      },
    },
    {
      id: 'rick', name: 'Rick', level: 7,
      intro: 'Rick denkt goed na.',
      look: { skin: '#eec39e', hair: '#c9a15a', hairStyle: 'spiky', shirt: '#9b5de5' },
      say: {
        start: ['Hoi Sam! Laat maar zien!', 'Een potje? Kom maar op!'],
        think: ['Even rekenen...', 'Even rekenen...'],
        lostPiece: ['Goed gezien! Die heb je verdiend.', 'Hmm, slimme zet.'],
        tookPiece: ['Die stond niet goed beschermd!', 'Bedankt!'],
        gaveCheck: ['Schaak!'],
        gotCheck: ['Schaak? Goed bezig!'],
        win: ['Ik won! Maar het was lastig.'],
        lose: ['Jij wint! Petje af, Sam!'],
        draw: ['Gelijkspel! Netjes verdedigd.'],
      },
    },
    {
      id: 'simone', name: 'Simone', level: 8,
      intro: 'Simone ziet bijna alles.',
      look: { skin: '#f6d0b1', hair: '#c9a15a', hairStyle: 'bob', shirt: '#ef476f', earrings: true, collar: true },
      say: {
        start: ['Dag Sam! Zullen we eens kijken hoe goed je bent?', 'Hoi! Ik heb er zin in.'],
        think: ['Interessant...', 'Even goed kijken...'],
        lostPiece: ['Oh! Heel goed gezien.', 'Knap, die had ik gemist.'],
        tookPiece: ['Die mag ik hebben, denk ik.', 'Let op je stukken!'],
        gaveCheck: ['Schaak! Wat doe je nu?'],
        gotCheck: ['Oei, schaak! Slim.'],
        win: ['Ik won! Jij speelt al goed.'],
        lose: ['Jij wint! Wauw!'],
        draw: ['Gelijkspel! Goed gespeeld.'],
      },
    },
    {
      id: 'paul', name: 'Paul', level: 9,
      intro: 'Paul is sterk.',
      look: { skin: '#f2c9a5', hair: '#8a5a2b', hairStyle: 'short', shirt: '#4361ee', mustache: true, mustacheColor: '#8a5a2b', collar: true },
      say: {
        start: ['Hoi Sam! Ik ga het je niet makkelijk maken.', 'Zin in een stevig potje?'],
        think: ['Hmm, lastig...', 'Even diep nadenken...'],
        lostPiece: ['Wauw, mooie zet!', 'Die zag ik niet aankomen!'],
        tookPiece: ['Die pak ik.', 'Oeps, die stond los.'],
        gaveCheck: ['Schaak!'],
        gotCheck: ['Schaak? Je durft!'],
        win: ['Ik won! Jij bent sterk geworden.'],
        lose: ['Jij wint?! Wauw, Sam!'],
        draw: ['Gelijkspel tegen mij! Heel knap.'],
      },
    },
    {
      id: 'mama', name: 'Mama', level: 10,
      intro: 'Mama is een kampioen.',
      look: { skin: '#f7d3b5', hair: '#f2c94c', hairStyle: 'long', shirt: '#264653', earrings: true },
      say: {
        start: ['Hoi lieverd! Zin in een potje met mij?', 'Kom maar op, schat!'],
        think: ['Even goed nadenken...', 'Hmm, wat zou slim zijn?'],
        lostPiece: ['Goed zo! Die heb je mooi gepakt.', 'Wauw, slim gezien!'],
        tookPiece: ['Die neem ik mee, schat.', 'Let goed op je stukken!'],
        gaveCheck: ['Schaak! Wat doe je nu?'],
        gotCheck: ['Oh! Schaak. Knap hoor!'],
        win: ['Ik won! Jij speelde super.'],
        lose: ['Jij wint! Ik ben trots!'],
        draw: ['Gelijkspel! Spannend!'],
      },
    },
    {
      id: 'papa', name: 'Papa', level: 11,
      intro: 'De sterkste van allemaal.',
      look: { skin: '#f0c7a2', hair: '#e2793a', hairStyle: 'short', shirt: '#3f8f5a' },
      say: {
        start: ['Hé kampioen! Kom maar op!', 'Zin in een potje, maatje?'],
        think: ['Hmm, even denken...', 'Wat ga ik nu doen...'],
        lostPiece: ['Hé! Goed gezien, kampioen!', 'Oei, die had ik nodig!'],
        tookPiece: ['Die pak ik, maatje.', 'Pas op je stukken!'],
        gaveCheck: ['Schaak! Wat ga je doen?'],
        gotCheck: ['Wauw, schaak! Sterk!'],
        win: ['Ik won! Jij wordt echt goed.'],
        lose: ['Jij wint! Jij bent de kampioen!'],
        draw: ['Gelijkspel tegen papa! Heel knap.'],
      },
    },
  ],
};
