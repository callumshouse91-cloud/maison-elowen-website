(function () {
  const form = document.getElementById("stylist-form");
  if (!form) return;
  const out = document.getElementById("stylist-answer");

  async function pageContent() {
    const [site, dresses] = await Promise.all([loadJSON("data/site.json"), loadJSON("data/dresses.json")]);
    const lines = dresses.map(d => "- " + d.name + ": " + d.silhouette + ", " + d.fabric + ". " + d.detail + ". Price range " +
      d.price_from + " to " + d.price_to + " pounds" + (d.price_is_placeholder ? " (placeholder, not confirmed)" : "") + ".");
    return "Maison Elowen: " + site.tagline + "\nThe collection (eight gowns, all available to try on by appointment):\n" + lines.join("\n") +
      "\nAppointments can be booked on the Book an appointment page.";
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const q = document.getElementById("stylist-q").value.trim();
    if (!q) return;
    const btn = form.querySelector("button");
    out.className = "confirm"; out.textContent = "Thinking…";
    btn.disabled = true;
    try {
      const r = await askStylist(q, await pageContent());
      out.className = r.ok ? "confirm" : "notice";
      out.textContent = r.text;
    } catch (err) {
      out.className = "notice";
      out.textContent = "Something went wrong reading the shop data: " + err.message;
    }
    btn.disabled = false;
  });
})();
