initPage(async site => {
  const fill = (id, arr, first) => document.getElementById(id).innerHTML =
    '<option value="">' + first + "</option>" + arr.map(v => '<option>' + esc(v) + "</option>").join("");
  fill("size", site.sizes, "Choose a size");
  fill("budget", site.budgets, "Choose a range");
  document.getElementById("date").min = new Date().toISOString().slice(0, 10);
  document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const b = { id: Date.now(), received: new Date().toISOString() };
    ["name", "email", "phone", "date", "size", "budget", "message"].forEach(k => b[k] = f.elements[k].value.trim());
    const all = getBookings(); all.push(b);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
    const c = document.getElementById("confirm");
    c.innerHTML = "<strong>Thank you, " + esc(b.name) + ".</strong> We have your request for " + esc(b.date) +
      ". The shop will confirm a time by email or phone. Saved in this browser only.";
    c.classList.remove("hidden"); c.focus();
    f.reset();
  });
});
