export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  res.status(200).json({
    reply: "FUTURE AI: Message received. How can I assist you further?"
  });
}
