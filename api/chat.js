export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ reply: "Method not allowed" });
    return;
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: message,
          options: { wait_for_model: true }
        })
      }
    );

    const data = await response.json();

    let reply = "Sorry, I couldn't understand that!";

    // Hugging Face may return an array of objects
    if (Array.isArray(data)) {
      if (data[0]?.generated_text) {
        reply = data[0].generated_text;
      } else if (data[0]?.error) {
        reply = `AI Error: ${data[0].error}`;
      }
    } else if (data.generated_text) {
      reply = data.generated_text;
    } else if (data.error) {
      reply = `AI Error: ${data.error}`;
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
}
