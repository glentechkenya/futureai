<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FutureAI Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #7b2ff7, #f107a3);
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      min-height: 100vh;
    }
    canvas {
      background: #fff;
      border-radius: 15px;
      margin-top: 20px;
      max-width: 90%;
    }
    input, button {
      padding: 10px;
      margin: 5px;
      border-radius: 8px;
      border: none;
      font-size: 16px;
    }
    button {
      background-color: #f107a3;
      color: #fff;
      cursor: pointer;
    }
    #status {
      margin-top: 10px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>FutureAI Dashboard</h1>

  <input type="text" id="promptInput" placeholder="Enter prompt" />
  <button id="generateBtn">Generate Chart</button>
  <div id="status">Waiting for input...</div>
  <canvas id="futureAIChart" width="400" height="200"></canvas>

  <script>
    const ctx = document.getElementById('futureAIChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar', // Change to 'line', 'pie', etc.
      data: {
        labels: [],
        datasets: [{
          label: 'GPT-5 Response',
          data: [],
          backgroundColor: 'rgba(241, 7, 163, 0.5)',
          borderColor: 'rgba(123, 47, 247, 1)',
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    async function updateChart(prompt) {
      const status = document.getElementById('status');
      status.innerText = 'FUTURE AI is processing...';

      try {
        const res = await fetch('https://api.openai.com/v1/responses', { // GPT-5 endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY' // <-- Replace with your key
          },
          body: JSON.stringify({
            model: 'gpt-5-mini',
            input: prompt
          })
        });

        if (!res.ok) throw new Error('API request failed');

        const data = await res.json();

        // Try to parse numeric output from GPT-5
        // Fallback: random values if parsing fails
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

        // If no valid output, generate dummy data
        if (labels.length === 0) {
          labels = ['A','B','C','D','E'];
          values = Array.from({length:5},()=>Math.floor(Math.random()*100));
        }

        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();

        status.innerText = 'FUTURE AI completed!';
      } catch(err) {
        console.error(err);
        status.innerText = 'Error: ' + err.message;
      }
    }

    document.getElementById('generateBtn').addEventListener('click', () => {
      const prompt = document.getElementById('promptInput').value;
      if (prompt) updateChart(prompt);
    });
  </script>
</body>
</html>
