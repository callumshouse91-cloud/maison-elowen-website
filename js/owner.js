initPage(async site => {
  const list = getBookings().slice().reverse();
  const box = document.getElementById("list");
  box.innerHTML = list.length
    ? '<table class="bookings"><thead><tr><th>Received</th><th>Name</th><th>Email</th><th>Phone</th><th>Date wanted</th><th>Size</th><th>Budget</th><th>Message</th></tr></thead><tbody>' +
      list.map(b => "<tr><td>" + esc(new Date(b.received).toLocaleString("en-GB")) + "</td><td>" + esc(b.name) + "</td><td>" + esc(b.email) + "</td><td>" + esc(b.phone) +
        "</td><td>" + esc(b.date) + "</td><td>" + esc(b.size) + "</td><td>" + esc(b.budget) + "</td><td>" + esc(b.message) + "</td></tr>").join("") + "</tbody></table>"
    : "<p>No bookings yet on this browser.</p>";
  document.getElementById("insights").addEventListener("click", () => {
    const payload = {
      task: "summarise_bookings",
      count: list.length,
      bookings: list.map(({ received, date, size, budget, message }) => ({ received, date, size, budget, message })),
      note: "Names, emails and phone numbers are left out."
    };
    const a = document.getElementById("ai");
    a.innerHTML = '<div class="ai-wall" role="alert">AI not configured. No summary can be made yet, and nothing has been sent anywhere.</div><h2>What would be sent</h2><pre>' +
      esc(JSON.stringify(payload, null, 2)) + "</pre>";
    a.classList.remove("hidden");
  });
});
