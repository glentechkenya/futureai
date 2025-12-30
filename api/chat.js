<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Future AI Chart</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #6a0dad, #ff6600);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    margin: 0;
    padding: 20px;
  }
  canvas {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 10px;
    max-width: 100%;
  }
  button {
    margin-top: 20px;
    padding: 10px 20px;
    border: none;
    background: #ff6600;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
  }
  input {
    padding: 10px;
    border-radius: 10px;
    border: none;
    margin-top: 20px;
    width: 80%;
    max-width: 400px;
  }
</style>
</head>
<body>

<h1>Future AI Response Chart</h1>
<input type="text" id="userPrompt" placeholder="Ask Future AI something..." />
<button onclick="sendPrompt()">Send</button>
<canvas id="aiChart" width="400" height="200"></canvas>

<script>
const ctx = document.getElementById('aiChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'AI Response Length',
            data: [],
            borderColor: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { labels: { color: 'white' } }
        },
        scales: {
            x: { ticks: { color: 'white' } },
            y: { ticks: { color: 'white' } }
        }
    }
});

async function sendPrompt() {
    const prompt = document.getElementById('userPrompt').value;
    if(!prompt) return alert("Please type something!");

    // Call your OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // Replace with your key
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }]
        })
    });
    const data = await response.json();
    const aiText = data.choices[0].message.content;

    // Add data to chart
    chart.data.labels.push(prompt);
    chart.data.datasets[0].data.push(aiText.length);
    chart.update();

    document.getElementById('userPrompt').value = '';
}
</script>

</body>
</html>
