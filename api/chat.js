export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message } = req.body;

  res.status(200).json({
    reply: "💜 FUTURE AI (Glentech): I hear you. Let's chat."
  });
}
