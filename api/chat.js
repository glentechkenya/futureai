// api/chart.js

import Chart from 'chart.js/auto';

// Select the canvas in your HTML
const ctx = document.getElementById('futureAIChart').getContext('2d');

// Initialize Chart.js chart
const chart = new Chart(ctx, {
  type: 'bar', // You can change to 'line', 'pie', etc.
  data: {
    labels: [],       // Will be updated dynamically
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

// Function to fetch GPT-5 response from your deployed API
export async function updateChart(prompt) {
  try {
    const res = await fetch('/api/gpt5', { // Your backend endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    // Expecting { labels: [...], values: [...] }
    chart.data.labels = data.labels || [];
    chart.data.datasets[0].data = data.values || [];

    chart.update();
  } catch (err) {
    console.error('Error fetching GPT-5 response:', err);
  }
}

// Optional: Auto-update chart every X seconds with latest GPT-5 data
export function autoUpdateChart(prompt, interval = 5000) {
  updateChart(prompt);
  return setInterval(() => updateChart(prompt), interval);
}
