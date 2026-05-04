export default async function handler(req, res) {
  const { question } = req.body;

  try {
    let g = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }]
        })
      }
    );

    let gData = await g.json();

    if (g.ok && gData?.candidates?.length) {
      return res.json({
        answer: gData.candidates[0].content.parts[0].text
      });
    }
  } catch (e) {}

  try {
    let o = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: question }]
      })
    });

    let oData = await o.json();

    if (o.ok && oData?.choices?.length) {
      return res.json({
        answer: oData.choices[0].message.content
      });
    }
  } catch (e) {}

  return res.json({
    answer: "❌ Limits are full, come next day"
  });
}
