<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GPT-5 Chart</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #7b2ff7, #f107a3);
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    canvas {
      background: #fff;
      border-radius: 15px;
      max-width: 90%;
      margin-top: 20px;
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
  </style>
</head>
<body>
  <h1>GPT-5 Chart</h1>
  <input type="text" id="prompt" placeholder="Enter prompt..." />
  <button onclick="fetchGPTData()">Generate & Update Chart</button>
  <canvas id="gptChart" width="400" height="200"></canvas>

  <script>
    const ctx = document.getElementById('gptChart').getContext('2d');
    const chartData = {
      labels: [],
      datasets: [{
        label: 'GPT-5 Numeric Output',
        data: [],
        backgroundColor: 'rgba(241, 7, 163, 0.6)',
        borderColor: 'rgba(123, 47, 247, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    };

    const gptChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    async function fetchGPTData() {
      const prompt = document.getElementById('prompt').value;
      if (!prompt) return alert('Please enter a prompt!');

      try {
        const response = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
          },
          body: JSON.stringify({
            model: "gpt-5-mini",
            input: prompt
          })
        });

        const data = await response.json();
        // Assuming GPT-5 returns numeric value in `output[0].content[0].text`
        let value = parseFloat(data.output?.[0]?.content?.[0]?.text) || Math.random()*100;

        // Add data to chart
        chartData.labels.push(new Date().toLocaleTimeString());
        chartData.datasets[0].data.push(value);

        // Keep only last 10 points
        if(chartData.labels.length > 10){
          chartData.labels.shift();
          chartData.datasets[0].data.shift();
        }

        gptChart.update();
      } catch (err) {
        console.error(err);
        alert('Error fetching GPT-5 data');
      }
    }
  </script>
</body>
</html>
