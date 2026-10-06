const BOOKINGS_KEY = "elowen_bookings";

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(path + " " + res.status);
  return res.json();
}

function showLoadError(err) {
  const main = document.querySelector("main") || document.body;
  main.insertAdjacentHTML("afterbegin",
    '<div class="notice" role="alert"><strong>The shop data could not be loaded.</strong> ' +
    "Browsers often block data files when a page is opened straight from a folder. " +
    "Double-click <code>Open site.bat</code> in the site folder instead, or put the folder on a web host. " +
    "<small>(" + esc(err.message) + ")</small></div>");
}

function formatPrice(d, note) {
  const f = n => "£" + Number(n).toLocaleString("en-GB");
  const range = f(d.price_from) + "–" + f(d.price_to);
  return d.price_is_placeholder ? range + ' <span class="ph" title="' + esc(note) + '">placeholder</span>' : range;
}

function dressCard(d, note) {
  return '<article class="card"><div class="frame"><img src="' + esc(d.image) + '" alt="' + esc(d.name + ", " + d.silhouette + " " + d.fabric + " bridal gown") + '" loading="lazy"></div>' +
    "<h3>" + esc(d.name) + "</h3>" +
    '<p class="meta">' + esc(d.silhouette) + " · " + esc(d.fabric) + "</p>" +
    "<p>" + esc(d.detail) + "</p>" +
    '<p class="price">' + formatPrice(d, note) + "</p></article>";
}

function renderChrome(site) {
  const pages = [["index.html", "Home"], ["collection.html", "Collection"], ["accessories.html", "Accessories"],
    ["fitting.html", "How a fitting works"], ["find.html", "Find my dress"], ["book.html", "Book an appointment"]];
  const here = location.pathname.split("/").pop() || "index.html";
  const nav = pages.map(([h, t]) => '<a href="' + h + '"' + (h === here ? ' aria-current="page"' : "") + (h === "book.html" ? ' class="navbook"' : "") + ">" + t + "</a>").join("");
  document.body.insertAdjacentHTML("afterbegin",
    '<header class="site-header"><a class="logo" href="index.html"><img src="' + esc(site.logo.image) + '" alt="' + esc(site.logo.alt) + '"></a><nav>' + nav + "</nav></header>");
  const hours = site.hours.map(h => "<tr><td>" + esc(h.day) + "</td><td>" + esc(h.time) + "</td></tr>").join("");
  document.body.insertAdjacentHTML("beforeend",
    '<footer class="site-footer"><div><h2>Opening hours</h2><table>' + hours + "</table></div>" +
    "<div><h2>Find us</h2><p>" + site.address.map(esc).join("<br>") + "</p><p>Phone: " + esc(site.phone) + "<br>Email: " + esc(site.email) + "</p>" +
    '<p><a href="book.html">Book an appointment</a> · <a href="owner.html">Owner view</a></p></div>' +
    '<div><h2>Map</h2><div class="map" role="img" aria-label="Map placeholder">Map to be added (TBC)</div></div></footer>');
}

function getBookings() {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || []; } catch (e) { return []; }
}

async function initPage(run) {
  try {
    const site = await loadJSON("data/site.json");
    renderChrome(site);
    await run(site);
  } catch (err) {
    showLoadError(err);
  }
}
