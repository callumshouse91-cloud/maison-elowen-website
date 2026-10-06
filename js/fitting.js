initPage(async site => {
  document.getElementById("about").innerHTML = '<img src="' + esc(site.about.image) + '" alt="' + esc(site.about.alt) + '" style="max-width:480px;width:100%;height:auto">';
  document.getElementById("steps").innerHTML = site.steps.map(s =>
    "<li><h2>" + esc(s.title) + '</h2><p class="timing">' + esc(s.timing) + "</p><p>" + esc(s.text) + "</p></li>").join("");
});
