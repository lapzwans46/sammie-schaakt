# Sammie Schaakt! ♞

Een persoonlijke schaakleraar voor Sam (7 jaar). Met lessen van makkelijk naar moeilijk,
en oefenpotjes tegen de familie: eerst Opa en Oma.

## Starten

Dubbelklik op **`index.html`**. De app opent in de browser (Edge/Chrome).
Er is geen internet nodig en er gaat niks naar internet:

- geen externe lettertypes, plaatjes of scripts (een beveiligingsregel in `index.html` blokkeert dat ook)
- voortgang (sterren, bekers) wordt alleen in de browser op dit apparaat bewaard

Tip: druk op **F11** voor volledig scherm.

## Wat zit erin

**32 lessen in 6 werelden.** Alles is meteen open; een groen "Nu!"-label wijst de volgende les aan:

| Wereld | Lessen |
|---|---|
| 1. De stukken | het bord, toren, loper, koningin, koning, paard, pion |
| 2. De regels | slaan, wat is een stuk waard, schaak, schaakmat, rokeren, klaar voor een potje |
| 3. Slim spelen | losse stukken, red je stuk, de vork, mat-trucjes, een goed begin (met het herdersmatje), schaakmeester-toets |
| 4. Twee zetten vooruit | schaak en pak!, vork en dan pakken, mat in twee (het trappetje), toets |
| 5. Drie zetten vooruit | het grote trappetje, koningsjacht, slim pakken in drie, toets |
| 6. Nog slimmer | koning en toren (mat geven met alleen koning + toren), wat wil zwart? (dreiging stoppen), de penning, aftrekschaak, pion naar de overkant (regel van het vierkant) |

**Vooruit denken (wereld 4 en 5):** Sam doet een zet, zwart zet vanzelf terug, en dan is Sam weer aan de beurt.
Pim telt mee ("Zet 1 van 3") en vertelt na elke zet van zwart wat er nu moet. Elke les begint met een filmpje
waarin Pim de hele reeks voordoet en bij elke zet uitlegt wat er gebeurt (met 🔁 Nog eens).
Een verkeerde zet? Dan laat zwart meteen zien hoe hij ontsnapt, en probeert Sam díe zet opnieuw (niet de hele opdracht).
Een andere weg die ook werkt, met hooguit één zet extra (bijvoorbeeld bij het trappetje eerst de andere toren)? Die telt gewoon als goed: Pim zegt "Dat kan ook!", Sam krijgt een zet extra en zwart verdedigt zich vanaf dan zelf zo goed mogelijk.
Elke opdracht heeft in **elk scenario** maar één oplossing: ook als zwart iets anders zou terugzetten,
heeft wit op elk moment precies één goede zet. Bij een paar trappetjes staat daarom een zwarte pion op het bord;
die zorgt ervoor dat er geen tweede manier is om mat te geven.
Bijna elke reeks begint met schaak: dan MOET zwart eerst zijn koning redden, en dat maakt vooruit denken te doen.

Opdrachtsoorten: sterren pakken, stukken slaan, quizjes en echte stellingen (schaak geven, mat geven,
rokeren, los stuk pakken, stuk redden, vork maken). Alle teksten zijn kort en simpel: Sam kan net een beetje lezen. Vastgelopen? Met de knop 💡 Hint wijst Pim de goede zet aan.

**Spelen: de familieladder.** Alles is meteen open: Sam mag tegen iedereen spelen.
Een groen "Probeer mij!"-label wijst de eerstvolgende tegenstander aan die hij nog niet verslagen heeft.

| # | Wie | Niveau | Sterren | Hoe speelt die? |
|---|---|---|---|---|
| 1 | Opa | 1 | ½ | speelt bijna altijd zomaar wat |
| 2 | Oma | 2 | 1 | speelt heel vaak zomaar wat |
| 3 | Pietje | 3 | 1½ | speelt vaak zomaar wat |
| 4 | Cato | 4 | 2 | pakt soms een stuk |
| 5 | Lout | 5 | 2½ | pakt vaker een stuk |
| 6 | Sophie | 6 | 2½ | let een beetje op |
| 7 | Rick | 7 | 3 | ziet soms schaakmat |
| 8 | Simone | 8 | 3½ | let goed op |
| 9 | Paul | 9 | 4 | let heel goed op |
| 10 | Mama | 10 | 4½ | maakt weinig foutjes |
| 11 | Papa | 11 | 5 | de sterkste |

De ladder is bewust heel mild: het sterkste niveau (11) is even sterk als het vroegere niveau 6.
Te makkelijk geworden? Dan kan alles strenger worden afgesteld in `js/ai.js` (bij `LEVELS`).
Tijdens het spelen: 💡 Tip, ↩️ Terug (zet terugnemen), 🔄 Opnieuw, en de **pas-op-hulp**
die waarschuwt als Sam zomaar een stuk weggeeft ("Weet je het zeker?").

**Puzzels:** rondjes van 5 puzzels. Sam kiest eerst hoe moeilijk (de laatste keuze wordt onthouden):

| Niveau | Wat | Aantal |
|---|---|---|
| ⭐ Makkelijk | schaak geven, mat in één, los stuk pakken, stuk redden | 40 |
| ⭐⭐ Moeilijker | vork maken, dreiging stoppen, koning en toren, pion naar de overkant, twee zetten vooruit | 52 |
| ⭐⭐⭐ Superdenker | drie zetten vooruit, penning, aftrekschaak, mat in twee met een *stille* eerste zet | 44 |

**Puzzelkaart:** bij Puzzels > 🖨️ Puzzelkaart: zes puzzels van het gekozen niveau op één A4 (staand),
met naam, datum, een vakje "Gelukt?" en onderaan de antwoorden. Om aan tafel op een echt bord na te zetten.
Met 🔀 komen er andere puzzels op.

Een deel komt uit `js/puzzles.js`, de rest automatisch uit de lessen. Geen moeilijke termen.

**Prijzenkast:** 30 prijzen: eerste les, elke wereld (ook wereld 4, 5 en 6), een rondje op Moeilijker en op Superdenker, eerste winst, 10 keer winst, puzzels, puzzel van de dag, pionnenrace, bord opzetten, samen spelen,
een sticker per verslagen familielid en "Kampioen van de familie".

**Spelletjes:**
- *Pionnenrace*: alleen pionnen, wie het eerst aan de overkant is wint. Tegen Pim, op "Makkelijk" of "Moeilijker".
- *Bord opzetten*: alle stukken op de goede beginplek zetten, eerst wit, dan zwart. Bij een fout geeft Pim een tip.

**Terugkijken met Pim:** na een potje (vanaf 6 zetten) laat Pim één ding zien dat goed ging, en hooguit
twee momenten om van te leren (een los stuk, een gemiste kans of een gemist schaakmat). Met "Wat was beter?" laat hij de betere zet zien.

**Diploma's:** per afgeronde wereld een feestelijk diploma (vlaggetjes, lint, medaille), plus een Meesterdiploma als wereld 1 t/m 3 af zijn.
Met naam, poppetje en datum. Printen gaat altijd op één A4, liggend: ook als de printer toch staand print
(dan draait het diploma vanzelf een kwartslag) en ook als de printer eigen randen aanhoudt (dan schaalt het mee).

**Kleuren:** met 🎨 linksboven kiest Sam zelf de kleuren van het bord (7 stuks) en van de stukken (5 stuks).
Alles is meteen te kiezen; er hoeft niks verdiend te worden.

**Puzzel van de dag:** elke dag een nieuwe, makkelijke puzzel (schaak geven, los stuk pakken, stuk redden of mat in één). Er is bewust géén dagenreeks: een dag overslaan is niet erg. Met 💡 Hint wijst Pim de oplossing aan, dus het lukt altijd.

**Samen spelen:** twee mensen op één tablet. Sam speelt wit (onderaan), de ander zwart (bovenaan).
Kies een familielid, een ander kind of "Gast".

**Spelers:** meerdere kinderen kunnen spelen, ieder met een eigen poppetje, voortgang en prijzen.
Wisselen: tik op het poppetje op het startscherm. Een nieuwe speler toevoegen kan via "Wie speelt er?" of ⚙️ > Spelers.

**Instellingen** (⚙️ rechtsboven):
- 📊 *Overzicht*: wat gaat goed en wat is lastig (per vaardigheid "in één keer goed"), lastigste lessen,
  hoe vaak de pas-op-hulp waarschuwde, de laatste potjes en tips om samen te oefenen.
- 👪 *Tegenstanders*: poppetje, naam en niveau aanpassen, of zelf een nieuwe tegenstander maken.
- 👤 *Spelers*: kinderen toevoegen, aanpassen of weghalen.
- Geluid en pas-op-hulp (per kind), voortgang wissen.
- *Reservekopie*: voortgang van alle spelers bewaren als bestandje en later terugzetten (ook op een nieuw apparaat).
  De app vraagt het apparaat ook om de opslag als blijvend te markeren.

## Tegenstanders aanpassen of zelf maken

Dat gaat **in de app**: ⚙️ > Tegenstanders.
- **Aanpassen**: tik op iemand en kies het kapsel, de haar-, huid- en shirtkleur, extra's
  (bril, baard, sproetjes, strikje...), de naam en het **niveau** (1 t/m 11).
- **Nieuwe tegenstander**: tik op "+ Nieuwe tegenstander", maak het poppetje, geef een naam
  en kies hoe goed die speelt. Weghalen kan ook weer.
- De ladder staat altijd op volgorde van niveau. Een nieuwe tegenstander komt dus vanzelf op de goede plek.
  Wie al een keer gespeeld is, blijft open.

Wat je in de app aanpast, gaat vóór wat in `js/family.js` staat. Wil je eigen zinnetjes
voor een familielid, pas dan `js/family.js` aan (bij `say`). Zelfgemaakte tegenstanders krijgen vaste vrolijke zinnetjes.

## Op de iPad

De app is een website die je op het beginscherm van de iPad zet:
1. Zet de map online (zie hieronder) en open het adres in **Safari** op de iPad.
2. Tik op het deel-icoon (vierkantje met pijltje) > **Zet op beginscherm**.
3. Open de app voortaan via het icoon "Schaak". Hij opent schermvullend en werkt na de
   eerste keer ook **zonder internet** (`sw.js` bewaart alle bestanden op de iPad).

De voortgang wordt alleen op de iPad bewaard. Gebruik altijd het icoon, niet de Safari-tab:
dat zijn voor de iPad twee aparte opslagplekken.

**Een update?** Zet in `sw.js` het nummer bij `VERSIE` één hoger (bijvoorbeeld `sammie-v2`)
en zet de nieuwe bestanden online. De iPad haalt de nieuwe versie op als de app met internet wordt geopend.

## Bestanden

```
index.html        startpagina
css/style.css     vormgeving
js/chess.js       schaakregels (getest met de standaard 'perft'-tellingen)
js/ai.js          computer-tegenstander (niveaus 1-11) en tactiek-hulp
js/family.js      speler, Pim en de familie  <- hier familie toevoegen
js/lessons.js     alle lessen en werelden    <- hier lessen aanpassen/toevoegen
js/puzzles.js     extra puzzels
js/avatars.js     tekent de cartoon-poppetjes
js/pieces.js      tekent de schaakstukken met oogjes
js/sound.js       geluidjes
js/board.js       het bord op het scherm
js/app.js         schermen, lessen, puzzels, potjes, opslag
js/editor.js      poppetjesmaker (met niveaukiezer)
js/parents.js     voor ouders: instellingen, overzicht, tegenstanders, spelers
js/extras.js      kleuren, spelletjes, terugkijken met Pim, diploma's
js/main.js        start de app
sw.js             offline werken op de iPad
manifest.json     app-gegevens voor het beginscherm
img/icon-*.png    app-icoontjes
robots.txt        niet opnemen in zoekmachines
tools/puzzelcontrole.html  controleert alle lessen en puzzels (open in de browser)
```

## Puzzels controleren

Open `tools/puzzelcontrole.html` in de browser na elke nieuwe of veranderde les of puzzel.
Die controleert met de regels van de app zelf dat:

- elke stelling geldig is (zwart staat bijvoorbeeld niet al schaak);
- elke opdracht **precies één** goede zet heeft (alleen de uitleg-opdrachten 'zet een stuk naar het midden' mogen er meer hebben);
- bij de vooruit-denk-opdrachten (2 of 3 zetten) er bij **elke** zet precies één goede zet is, ook in alle andere scenario's
  (als zwart iets anders terugzet), zwart op geen enkele manier kan ontsnappen,
  en dat de filmpjes kloppen;
- alle sterren- en sla-opdrachten te doen zijn.

Bovenaan staat een groen vinkje of een rode lijst met wat er niet klopt.

## Bewuste keuzes

- **Niet verslavend:** geen loot-boxen, geen dagenreeksen die "kapot" gaan, geen beloningen die je
  moet kopen of toevallig krijgt. Prijzen verdien je alleen door iets te leren of te doen.
- **Niet ontmoedigend:** alles is meteen open, de tegenstanders zijn mild afgesteld en Pim helpt
  altijd als je op 💡 Hint drukt.
