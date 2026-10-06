initPage(async site => {
  const dresses = await loadJSON("data/dresses.json");
  const hero = document.getElementById("hero");
  hero.src = site.hero.image; hero.alt = site.hero.alt;
  document.getElementById("tagline").textContent = site.tagline;
  document.getElementById("featured").innerHTML = dresses.filter(d => d.featured).map(d => dressCard(d, site.price_note)).join("");
});
