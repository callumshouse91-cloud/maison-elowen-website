(function () {
  const $ = id => document.getElementById(id);
  const val = id => $(id).value.trim();

  function status(msg, bad) {
    const el = $("ai-status");
    el.textContent = msg;
    el.className = bad ? "notice" : "confirm";
  }
  function fillForm() {
    const s = JSON.parse(localStorage.getItem(AI_SETTINGS_KEY) || "null") || {};
    $("ai-provider").value = s.provider || "anthropic";
    $("ai-endpoint").value = s.endpoint !== undefined ? s.endpoint : AI_PROVIDERS.anthropic.endpoint;
    $("ai-model").value = s.model !== undefined ? s.model : AI_PROVIDERS.anthropic.model;
    $("ai-key").value = s.apiKey || "";
    $("ai-key").type = "password";
    $("ai-toggle").textContent = "Show";
    $("ai-hint").textContent = AI_PROVIDERS[$("ai-provider").value].hint;
    $("ai-status").textContent = ""; $("ai-status").className = "";
  }
  function current() {
    return { provider: val("ai-provider"), endpoint: val("ai-endpoint"), model: val("ai-model"), apiKey: $("ai-key").value.trim() };
  }

  document.addEventListener("click", async e => {
    const t = e.target;
    if (t.id === "open-settings") { e.preventDefault(); fillForm(); $("settings-dialog").showModal(); }
    else if (t.id === "ai-close") $("settings-dialog").close();
    else if (t.id === "ai-toggle") {
      const k = $("ai-key"); const show = k.type === "password";
      k.type = show ? "text" : "password"; t.textContent = show ? "Hide" : "Show";
    } else if (t.id === "ai-save") {
      const s = current();
      if (!s.endpoint || !s.apiKey) return status("Add an endpoint and an API key before saving.", true);
      saveAISettings(s); status("Saved in this browser only.");
    } else if (t.id === "ai-clear") {
      clearAISettings(); fillForm(); status("Settings cleared.");
    } else if (t.id === "ai-test") {
      const s = current();
      if (!s.endpoint || !s.apiKey) return status("Add an endpoint and an API key first.", true);
      t.disabled = true; status("Testing…");
      try { status(await testAIConnection(s)); } catch (err) { status(err.message, true); }
      t.disabled = false;
    }
  });
  document.addEventListener("change", e => {
    if (e.target.id !== "ai-provider") return;
    const p = AI_PROVIDERS[e.target.value];
    $("ai-endpoint").value = p.endpoint; $("ai-model").value = p.model; $("ai-hint").textContent = p.hint;
  });
})();
