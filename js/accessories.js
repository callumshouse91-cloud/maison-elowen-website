initPage(async site => {
  document.getElementById("acc").innerHTML = site.accessories.map(a =>
    '<article class="card sq"><img src="' + esc(a.image) + '" alt="' + esc(a.alt) + '"><h3>' + esc(a.name) + "</h3><p>" + esc(a.one_line) + "</p></article>").join("");
});
