import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/futureai", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    const data = await openaiRes.json();

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: "FutureAI failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("FutureAI running on port", PORT));
