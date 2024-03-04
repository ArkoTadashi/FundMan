<script>
    import { onMount } from "svelte";
    // library that creates chart objects in page
    import Chart from "chart.js";
  
    export let showMarket;
    
    let yearButtonColor = 'bg-red-500';
    let monthlyButtonColor = 'bg-indigo-500';
    let config;
    function updateChart() {
      if (!config) return;
    var canvas = document.getElementById("line-chart");
    var ctx = canvas.getContext("2d");
    
    // Check if there's an existing Chart instance
    if (window.myLine) {
        window.myLine.destroy(); // Destroy the existing Chart instance
    }

    window.myLine = new Chart(ctx, config); // Create a new Chart instance
    }

    function switchToMarket(){
        showMarket();
    }

    
  
    let coinName;
    let yearlyLabels = [
            "March '23",
            "April '23",
            "May '23",
            "June '23",
            "July '23",
            "August '23",
            "September '23",
            "October '23",
            "November '23",
            "December '23",
            "January '24",
            "February '24"
          ]

    let monthlyLabels = [
      "03 February",
      "04 February",
      "05 February",
      "06 February",
      "07 February",
      "08 February",
      "09 February",
      "10 February",
      "11 February",
      "12 February",
      "13 February",
      "14 February",
      "15 February",
      "16 February",
      "17 February",
      "18 February",
      "19 February",
      "20 February",
      "21 February",
      "22 February",
      "23 February",
      "24 February",
      "25 February",
      "26 February",
      "27 February",
      "28 February",
      "29 February",
      "01 March",
      "02 March",
      "03 March",
      "04 March"
    ]
    // init chart
    let labels = yearlyLabels;
    let monthlyData, yearlyData;
    let usd = yearlyData;

    function showYearly(){
      config.data.labels = yearlyLabels;
      config.data.datasets[0].data = yearlyData;
      yearButtonColor = 'bg-red-500';
      monthlyButtonColor = 'bg-indigo-500';
      updateChart();
    }

    function showMonthly(){
      config.data.labels = monthlyLabels;
      config.data.datasets[0].data = monthlyData;
      yearButtonColor = 'bg-indigo-500';
      monthlyButtonColor = 'bg-red-500';
      updateChart();
    }
    onMount(async () => {
  
      
      coinName = sessionStorage.getItem("showCoin");
      const response = await fetch(`http://localhost:9000/market/${coinName}/yearly`);
      const jsonData = await response.json();
      yearlyData = jsonData.yearlyPrice;

      const response2 = await fetch(`http://localhost:9000/market/${coinName}/monthly`);
      const jsondata2 = await response2.json();
      monthlyData = jsondata2.monthlyPrice;

      usd = yearlyData;
  
      config = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: coinName,
              backgroundColor: "#4c51bf",
              borderColor: "#4c51bf",
              data: usd,
              fill: false
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "Sales Charts",
            fontColor: "white",
          },
          legend: {
            labels: {
              fontColor: "white",
            },
            align: "end",
            position: "bottom",
          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Month",
                  fontColor: "white",
                },
                gridLines: {
                  display: false,
                  borderDash: [2],
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.3)",
                  zeroLineColor: "rgba(0, 0, 0, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Value",
                  fontColor: "white",
                },
                gridLines: {
                  borderDash: [3],
                  borderDashOffset: [3],
                  drawBorder: false,
                  color: "rgba(255, 255, 255, 0.15)",
                  zeroLineColor: "rgba(33, 37, 41, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
          },
        },
      };
      updateChart();
      // var ctx = document.getElementById("line-chart").getContext("2d");
      // window.myLine = new Chart(ctx, config);
    });
  
    
  </script>
  
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
            <div class="flex flex-wrap">
                <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                    Price History
                </h6>
                <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <button
                    class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    on:click={switchToMarket}
                  >
                  close
                </button>
                </div>
            </div>
          <h2 class="text-white text-xl font-semibold">
            {coinName}
          </h2>
          
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <!-- Chart -->
      <div class="relative h-350-px">
        <canvas id="line-chart"></canvas>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-center">
        <button
            class="{yearButtonColor} text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            on:click={showYearly}
          >
          yearly
        </button>
        </div>
      <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-center">
      <button
          class="{monthlyButtonColor} text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          on:click={showMonthly}
        >
        monthly
      </button>
      </div>
  </div>
  </div>
  