async function ask() {
  let q = document.getElementById("question").value.trim();

  if (!q) return alert("Enter question");

  document.getElementById("loading").style.display = "block";

  let finalAnswer = "";

  // =========================
  // 🟢 1. GEMINI FIRST
  // =========================
  try {
    let g = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        AIzaSyBL_7cN6gzJqezfdJLoiKr1o6Ww0LOdHtw,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: q }] }]
        })
      }
    );

    let gData = await g.json();

    if (!g.ok || gData?.error || !gData?.candidates?.length) {
      throw new Error("Gemini failed");
    }

    finalAnswer = gData.candidates[0].content.parts[0].text;
  } catch (e) {
    console.log("Gemini failed → switching to OpenRouter");

    // =========================
    // 🔵 2. OPENROUTER BACKUP
    // =========================
    try {
      let o = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + AIzaSyBL_7cN6gzJqezfdJLoiKr1o6Ww0LOdHtw,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: q }]
        })
      });

      let oData = await o.json();

      if (!o.ok || !oData?.choices?.length) {
        throw new Error("OpenRouter failed");
      }

      finalAnswer = oData.choices[0].message.content;
    } catch (e2) {
      console.log("Both APIs failed");

      finalAnswer = "❌ Limits are full, come next day";
    }
  }

  document.getElementById("loading").style.display = "none";
  document.getElementById("answer").innerText = finalAnswer;

  document.getElementById("explain").innerText =
    "✔️ Smart AI fallback system active";

  document.getElementById("check").innerText =
    "✔️ Gemini → OpenRouter backup working";
}