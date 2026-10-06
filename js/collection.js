initPage(async site => {
  const dresses = await loadJSON("data/dresses.json");
  const groups = [["silhouette", "Silhouette"], ["fabric", "Fabric"]];
  const sel = { silhouette: new Set(), fabric: new Set() };
  const box = document.getElementById("filters");
  box.innerHTML = groups.map(([k, label]) => {
    const vals = [...new Set(dresses.map(d => d[k]))].sort();
    return "<fieldset><legend>" + label + "</legend>" + vals.map(v =>
      '<label class="chip"><input type="checkbox" data-k="' + k + '" value="' + esc(v) + '"><span>' + esc(v) + "</span></label>").join("") + "</fieldset>";
  }).join("");
  function draw() {
    const list = dresses.filter(d => groups.every(([k]) => !sel[k].size || sel[k].has(d[k])));
    document.getElementById("dresses").innerHTML = list.map(d => dressCard(d, site.price_note)).join("");
    document.getElementById("count").textContent = "Showing " + list.length + " of " + dresses.length + " gowns.";
  }
  box.addEventListener("change", e => {
    const s = sel[e.target.dataset.k];
    e.target.checked ? s.add(e.target.value) : s.delete(e.target.value);
    draw();
  });
  draw();
});
