export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Not allowed" });
  }

  const { message } = req.body;

  res.status(200).json({
    reply: "💜 FUTURE AI says: I understand you. Ask me anything."
  });
}
