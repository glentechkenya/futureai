export async function updateChart(prompt) {
  const status = document.getElementById('status');
  if(status) status.innerText = 'FUTURE AI is processing...';

  try {
    const res = await fetch('/api/gpt5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) throw new Error('API request failed');

    const data = await res.json();

    if(!data.labels || !data.values) throw new Error('Invalid API response');

    chart.data.labels = data.labels;
    chart.data.datasets[0].data = data.values;
    chart.update();

    if(status) status.innerText = 'FUTURE AI completed!';
  } catch(err) {
    console.error(err);
    if(status) status.innerText = 'Error: ' + err.message;
  }
}
