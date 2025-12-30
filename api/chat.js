<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FutureAI Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: Arial; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg,#7b2ff7,#f107a3); color:#fff; }
    canvas { background:#fff; border-radius:15px; margin-top:20px; max-width:90%; }
    input, button { padding:10px; margin:5px; border-radius:8px; border:none; font-size:16px; }
    button { background-color:#f107a3; color:#fff; cursor:pointer; }
    #status { margin-top:10px; font-weight:bold; }
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
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'GPT-5 Response', data: [], backgroundColor:'rgba(241,7,163,0.5)', borderColor:'rgba(123,47,247,1)', borderWidth:2, tension:0.3 }] },
      options: { responsive:true, scales:{ y:{ beginAtZero:true } } }
    });

    async function updateChart(prompt) {
      const status = document.getElementById('status');
      status.innerText = 'FUTURE AI is processing...';

      try {
        const res = await fetch('http://localhost:3000/api/gpt5', { // <- Your backend endpoint
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ prompt })
        });

        if(!res.ok) throw new Error('API request failed');

        const data = await res.json();
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.values;
        chart.update();

        status.innerText = 'FUTURE AI completed!';
      } catch(err) {
        console.error(err);
        status.innerText = 'Error: ' + err.message;
      }
    }

    document.getElementById('generateBtn').addEventListener('click', ()=>{
      const prompt = document.getElementById('promptInput').value;
      if(prompt) updateChart(prompt);
    });
  </script>
</body>
</html>
