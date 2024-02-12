<script>
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js';
  
    // Sample data arrays
    export let pastMonthData = [];
    export let pastYearData = [];
  
    let canvas;
    let chart;
    let currentData = pastMonthData; // Default to past month data
    let chartColor = 'rgb(75, 192, 192)'; // Default color
  
    onMount(() => {
      const ctx = canvas.getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: generateLabels(pastMonthData.length), // Assuming generateLabels generates appropriate labels
          datasets: [{
            label: 'USD',
            data: currentData,
            fill: false,
            borderColor: chartColor,
            tension: 0.3
          }]
        },
        options: {
          scales: {
            x: {
                grid: {
                display: false
                }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false
              }
            }
          }
        }
      });
      currentData = pastMonthData;
      updateChart();
    });
  
    function generateLabels(length) {
      // Generate appropriate labels based on the length of the data array
      return Array.from({ length }, (_, i) => `${i + 1}`);
    }

    let activeButton = 'month';
  
    function pastMonth() {
      currentData = pastMonthData;
      activeButton = 'month';
      updateChart();
    }

    function pastYear(){
        currentData = pastYearData;
        activeButton = 'year';
        updateChart();
    }
  
    function updateChart() {
      chart.data.labels = currentData.map(entry => entry.dataPoint)
      chart.data.datasets[0].data = currentData.map(entry => entry.usd);
      chart.data.datasets[0].borderColor = calculateChartColor();
      chart.update();
    }
  
    function calculateChartColor() {
      const firstValue = currentData[0].usd;
      const lastValue = currentData[currentData.length - 1].usd;
      let charColor = lastValue > firstValue ? 'green' : 'red';
      console.log(firstValue + ' ' + lastValue);
      return charColor;
    }
  </script>
  
  
  <div style="display: flex; justify-content: center;">
    <button class="dataButton" style="{activeButton === 'month' ? 'background-color: white;' : ''}" on:click={pastMonth}>30d</button>
    <button class="dataButton" style="{activeButton === 'year' ? 'background-color: white;' : ''}" on:click={pastYear}>12m</button>
  </div>
  <canvas bind:this={canvas}></canvas>

  <style>
    .dataButton{
        background-color: transparent;
        border: 2px solid black;
        transition-duration: 0.2s;
        cursor: pointer;
        margin: 5px;
        width: 12%;
    }

    .dataButton:hover{
        background-color: white;
        color: black;
    }
  </style>