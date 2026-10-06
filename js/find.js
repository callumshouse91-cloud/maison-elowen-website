initPage(async site => {
  const dresses = await loadJSON("data/dresses.json");
  document.getElementById("occasion").innerHTML = '<option value="">Choose</option>' + site.occasions.map(v => "<option>" + esc(v) + "</option>").join("");
  document.getElementById("budget").innerHTML = '<option value="">Choose</option>' + site.budgets.map(v => "<option>" + esc(v) + "</option>").join("");
  document.getElementById("styles").innerHTML = site.style_words.map(v =>
    '<label class="chip"><input type="checkbox" name="style" value="' + esc(v) + '"><span>' + esc(v) + "</span></label>").join("");
  document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    const payload = {
      task: "suggest_three_dresses",
      answers: {
        occasion: e.target.occasion.value,
        style_words: [...e.target.querySelectorAll("input[name=style]:checked")].map(i => i.value),
        budget: e.target.budget.value
      },
      candidates: dresses.map(({ id, name, silhouette, fabric, detail, price_from, price_to }) => ({ id, name, silhouette, fabric, detail, price_from, price_to })),
      rules: ["Only recommend dresses in candidates", "Say 'I am not sure' if nothing fits"]
    };
    const r = document.getElementById("result");
    r.innerHTML = '<div class="ai-wall" role="alert">AI not configured. No suggestions can be made yet, and nothing has been sent anywhere.</div>' +
      "<h2>What would be sent</h2><pre>" + esc(JSON.stringify(payload, null, 2)) + "</pre>" +
      '<p>In the meantime, <a href="collection.html">browse the collection</a> or <a href="book.html">book an appointment</a>.</p>';
    r.classList.remove("hidden");
  });
});
