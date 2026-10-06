const AI_SETTINGS_KEY = "ai_settings";
const AI_PROVIDERS = {
  anthropic: { label: "Anthropic", endpoint: "https://api.anthropic.com/v1/messages", model: "claude-sonnet-4-6", hint: "" },
  azure: { label: "Azure OpenAI", endpoint: "", model: "gpt-4o", hint: "Use the full deployment URL from Azure, including ?api-version=. The model is set by the deployment in that URL." }
};
const NOT_CONFIGURED = "AI not configured. Open Settings and add an approved endpoint and key.";
const OFF_PAGE_REPLY = "That's one for the team — please book an appointment.";

function getAISettings() {
  try {
    const s = JSON.parse(localStorage.getItem(AI_SETTINGS_KEY));
    return s && s.provider && s.endpoint && s.apiKey ? s : null;
  } catch (e) { return null; }
}
function saveAISettings(s) { localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(s)); }
function clearAISettings() { localStorage.removeItem(AI_SETTINGS_KEY); }

function plainError(status, detail) {
  if (status === 401 || status === 403) return "The endpoint refused the key. Check the API key and that it is allowed to use this model.";
  if (status === 404) return "The endpoint or model was not found. Check the Endpoint and Model in Settings.";
  if (status === 429) return "The service is busy or the usage limit has been reached. Try again in a minute.";
  if (status >= 500) return "The AI service had a problem on its side. Try again shortly.";
  return "The AI service returned an error (" + status + ")" + (detail ? ": " + detail : ".");
}

async function callModel(s, system, user) {
  if (!/^https:\/\//i.test(s.endpoint) && !/^http:\/\/(localhost|127\.0\.0\.1)/i.test(s.endpoint)) {
    throw new Error("The endpoint must start with https://.");
  }
  let headers, body;
  if (s.provider === "anthropic") {
    headers = {
      "content-type": "application/json",
      "x-api-key": s.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    };
    body = { model: s.model, max_tokens: 400, system, messages: [{ role: "user", content: user }] };
  } else {
    headers = { "content-type": "application/json", "api-key": s.apiKey };
    body = { messages: [{ role: "system", content: system }, { role: "user", content: user }] };
    if (s.model) body.model = s.model;
  }
  let res;
  try {
    res = await fetch(s.endpoint, { method: "POST", headers, body: JSON.stringify(body) });
  } catch (e) {
    throw new Error("Could not reach the endpoint. Check the address, your connection, and that the service allows calls from a web page.");
  }
  let data = null;
  try { data = await res.json(); } catch (e) { /* not JSON */ }
  if (!res.ok) {
    const detail = data && (data.error && (data.error.message || data.error)) ;
    throw new Error(plainError(res.status, typeof detail === "string" ? detail : ""));
  }
  const text = s.provider === "anthropic"
    ? data && data.content && data.content[0] && data.content[0].text
    : data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!text) throw new Error("The service replied, but with no answer. Check the Model and Endpoint in Settings.");
  return text.trim();
}

async function testAIConnection(s) {
  await callModel(s, "Reply with one word.", "Say: Connected");
  return "Connected";
}

async function askStylist(question, pageContent) {
  const s = getAISettings();
  if (!s) return { ok: false, text: NOT_CONFIGURED, notConfigured: true };
  const system =
    "You are the stylist for Maison Elowen, a small bridal boutique. Answer the visitor's question in two to four short sentences, in a warm, plain, unhurried tone. " +
    "No exclamation marks and no words like stunning, dream or perfect. " +
    "Use ONLY the page content provided. Do not invent dresses, prices, designers, hours or facts. Prices marked as placeholders are not real, so do not quote them as firm. " +
    "If the page content does not contain the answer, reply exactly: " + OFF_PAGE_REPLY;
  try {
    const text = await callModel(s, system, "PAGE CONTENT:\n" + pageContent + "\n\nQUESTION:\n" + question);
    return { ok: true, text };
  } catch (e) {
    return { ok: false, text: e.message };
  }
}
