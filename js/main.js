/* Sammie Schaakt! - starten */
applySettings();
// prijzen die niet meer bestaan (zoals de oude dagenreeks) opruimen
{
  const valid = new Set(getBadges().map((b) => b.id));
  Store.data.badges = Store.data.badges.filter((id) => valid.has(id));
}
// Eerste aanraking zet het geluid aan (browsers willen dat)
document.addEventListener('pointerdown', () => Sound.unlock(), { once: true });
go(Home);

// Vraag het apparaat om de opslag 'blijvend' te maken, zodat de voortgang
// niet wordt opgeruimd als het apparaat bijna vol zit.
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persisted()
    .then((ok) => (ok ? true : navigator.storage.persist()))
    .catch(() => { /* niet ondersteund: geen probleem */ });
}

// Offline werken (alleen als de app via een website draait, niet als los bestand)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* geen probleem: dan alleen online */ });
}
