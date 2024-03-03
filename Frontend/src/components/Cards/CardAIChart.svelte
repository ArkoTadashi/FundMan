<script>
    import { onMount, onDestroy } from "svelte";
    // library that creates chart objects in page
    import Chart from "chart.js";
  
  
    let config;

    let selectedToken = JSON.parse(sessionStorage.getItem('selectedToken'));

    let dates = [];
    let currentPriceData = [];
    let predictedPriceData = [];

    function updateChart() {
      if (!config) return;
      var ctx = document.getElementById("line-chart").getContext("2d");
      window.myLine = new Chart(ctx, config);
    }

    
    export async function fetchChartData() {
        const response = await fetch(`http://localhost:9000/ai/${selectedToken.code.toLowerCase()}`); //token name logo
        const jsonData = await response.json();
        let data = jsonData;


        const predictedPromises = data.predicted.map(async (obj) => {
            return obj.toFixed(5);
        });
        Promise.all(predictedPromises)
            .then((predictedPrices) => {
                for (let i = predictedPrices.length-251; i < predictedPrices.length; i += 5) {
                    predictedPriceData.push(predictedPrices[i]);
                }
            })
            .catch((error) => {
                console.error(error);
            });

        const currentPromises = data.actual.map(async (obj) => {
            return obj.close;
        });
        Promise.all(currentPromises)
            .then((currentPrices) => {
                for (let i = currentPrices.length-251; i < currentPrices.length; i += 5) {
                    currentPriceData.push(currentPrices[i]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
            
        const datePromises = data.actual.map(async (obj) => {
            const date = new Date(obj.time*1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            return formattedDate;
        });
        Promise.all(datePromises)
            .then((date) => {
                for (let i = date.length-251; i < date.length; i += 5) {
                    dates.push(date[i]);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                config = {
                    type: "line",
                    data: {
                    labels: dates,
                    datasets: [
                        {
                            label: "Actual Price",
                            backgroundColor: "#ed64a6",
                            borderColor: "#ed64a6",
                            data: currentPriceData,
                            fill: false,
                            barThickness: 8
                        },
                        {
                            label: "Predicted Price",
                            fill: false,
                            backgroundColor: "#4c51bf",
                            borderColor: "#4c51bf",
                            data: predictedPriceData,
                            barThickness: 8
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
            });
    }
    

    // function handleStorageChange(event) {
    //     console.log(event.key)
    //     if (event.key === 'selectedToken') {
    //         selectedToken = JSON.parse(event.newValue);
    //         console.log(selectedToken);
    //         fetchChartData();
    //     }
    // }

    // function handleVariableChange(event) {
    //     // Handle the event dispatched by ComponentA
    //     console.log('Variable changed:', event.detail.newValue);
    //     // Call your function here based on the variable change
    //     // functionName();
    // }


    onMount(async () => {
        // window.addEventListener('variableChanged', handleVariableChange);
        // window.addEventListener('storage', (event) => {
        //     console.log('Storage event:', event);
        // });
        fetchChartData();
        
    });


    
  
    
  </script>
  
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
            Overview
          </h6>
          <h2 class="text-white text-xl font-semibold">
            Chart
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
  </div>
  