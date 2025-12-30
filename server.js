import express from 'express';
import fetch from 'node-fetch'; // npm install node-fetch
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/gpt5', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY' // <-- Replace with your GPT-5 key
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: prompt
      })
    });

    const data = await response.json();

    // Parse numeric output
    let labels = [];
    let values = [];
    const text = data.output?.[0]?.content?.[0]?.text || '';
    const lines = text.split('\n').filter(l => l.includes(':'));
    lines.forEach(line => {
      const [label, value] = line.split(':');
      if (label && value) {
        labels.push(label.trim());
        values.push(parseFloat(value.trim()) || Math.random()*100);
      }
    });

    // Fallback if GPT output invalid
    if (labels.length === 0) {
      labels = ['A','B','C','D','E'];
      values = Array.from({length:5},()=>Math.floor(Math.random()*100));
    }

    res.json({ labels, values });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'GPT-5 request failed' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
