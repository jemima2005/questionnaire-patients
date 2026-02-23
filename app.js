const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwouzX3QqyGj-AT9TbqvBTebd3CfXf57sehRpCFSuEEz3-GeKRIm-ExbLHRBO3UmPSgJA/exec";

const form = document.getElementById("survey");
const statusEl = document.getElementById("status");
const btn = document.getElementById("submitBtn");

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "#ffb4b4" : "#b9ffd0";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("");
  btn.disabled = true;

  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: res.ok };
    }

    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Envoi échoué");
    }

    form.reset();
    setStatus("Merci ! Réponse enregistrée ✅");
  } catch (err) {
    console.error(err);
    setStatus("Erreur : impossible d’envoyer. Vérifie le lien ou réessaie.", true);
  } finally {
    btn.disabled = false;
  }
});
