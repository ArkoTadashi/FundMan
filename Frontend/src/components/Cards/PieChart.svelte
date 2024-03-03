<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import { Pie } from 'svelte-chartjs';
  
    export let coins = []; // Assume coins is passed as a prop
  
    let chart;
  
    onMount(() => {
      const ctx = document.getElementById('pie-chart');
      
      coins = coins.filter(coin => coin.amount > 0);
      const labels = coins.map(coin => coin.name);
      const data = coins.map(coin => coin.usd);
      const backgroundColors = generateRandomColors(coins.length, 10910887);
  
      chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const dataset = context.dataset || {};
                const total = dataset.data.reduce((acc, curr) => acc + curr, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${percentage}%`;
              }
            }
          }
        }
        }
      });
    });
  
    function generateRandomColors(count, seed) {
      const colors = [];
      const random = seededRandom(seed);
      for (let i = 0; i < count; i++) {
        colors.push(`rgb(${random() * 256}, ${random() * 256}, ${random() * 256})`);
      }
      return colors;
    }
  
    function seededRandom(seed) {
      let state = seed;
      return function random() {
        // Robert Jenkins' 32 bit integer hash function
        state = ((state + 0x7ed55d16) + (state << 12))  & 0xffffffff;
        state = ((state ^ 0xc761c23c) ^ (state >>> 19)) & 0xffffffff;
        state = ((state + 0x165667b1) + (state << 5))   & 0xffffffff;
        state = ((state + 0xd3a2646c) ^ (state << 9))   & 0xffffffff;
        state = ((state + 0xfd7046c5) + (state << 3))   & 0xffffffff;
        state = ((state ^ 0xb55a4f09) ^ (state >>> 16)) & 0xffffffff;
        return (state & 0xfffffff) / 0x10000000;
      }
    }
  </script>
  
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded" style="padding: 10px">
    <canvas id="pie-chart"></canvas>
  </div>