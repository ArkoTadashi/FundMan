<script>
    import { onMount } from "svelte";
    // import { fetchChartData } from "./CardAIChart.svelte"
    import { writable } from 'svelte/store';


    // library that creates chart objects in page
    import Chart from "chart.js";
  

    let selectedToken = {name: "Polygon", code: "MATIC", currentPrice: 0, predictedPrice: 0, logo: "https://assets.coingecko.com/coins/images/4713/large/polygon.png?1698233745"};
    sessionStorage.setItem("selectedToken", JSON.stringify(selectedToken));
    
    let tokenList = [];
    let inputValue = "";
    let dates = [];
    let currentPriceData = [];
    let predictedPriceData = [];

    async function fetchTokenData() {
        try {
            let response = await fetch(`http://localhost:9000/market/price/matic`);
            let marketData = await response.json();
            let currentPrice = marketData.currentPrice;

            response = await fetch(`http://localhost:9000/ai/matic`);
            let aiData = await response.json();
            let predictedPrice = aiData.predicted[aiData.predicted.length - 1];

            return {
                name: "Polygon",
                code: "MATIC",
                currentPrice: currentPrice,
                predictedPrice: predictedPrice,
                logo: "https://assets.coingecko.com/coins/images/4713/large/polygon.png?1698233745"
            };
        } catch (error) {
            console.error("Error fetching token data:", error);
            throw error; // Propagate the error
        }
    }

    async function initializeSelectedToken() {
        try {
            selectedToken = await fetchTokenData();
            console.log(selectedToken); // Check the fetched token data
        } catch (error) {
            console.error("Error initializing selected token:", error);
        }
    }

    onMount(async () => {
        await initializeSelectedToken();
        await fetchChartData();

        let response = await fetch('http://localhost:9000/token'); //token name logo
        let jsonData = await response.json();
        let data = jsonData;

        tokenList = await Promise.all(data.map(async (obj) => {
            let response = await fetch(`http://localhost:9000/market/price/${obj.token}`);
            let jsonData = await response.json();
            let dat = jsonData;
            let currentPrice = dat.currentPrice;
            let logo = obj.logo;

            response = await fetch(`http://localhost:9000/ai/${obj.token}`);
            jsonData = await response.json();
            dat = jsonData;
            let predictedPrice = dat.predicted[dat.predicted.length-1];

            return {
                name: obj.name,
                code: obj.token.toUpperCase(),
                currentPrice: currentPrice,
                predictedPrice: predictedPrice,
                logo: logo
            };
        }));
    });

    let filteredItems = [];

    function filterItems(query) {
        if (query === '') {
            filteredItems = [];
        } else {
            filteredItems = tokenList.filter(item => item.code.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        }
    }

    function handleInput(event) {
        const query = event.target.value;
        filterItems(query);
    }

    function clearFilteredItems() {
        filteredItems = [];
    }


    async function handleItemClick(item) {
        selectedToken = item;
        await fetchChartData();
        sessionStorage.setItem("selectedToken", JSON.stringify(selectedToken));
    }

    function clearInput() {
        inputValue = "";
    }


    let config;


    

    function updateChart() {
        if (!config) return;
        var ctx = document.getElementById("line-chart").getContext("2d");
        window.myLine = new Chart(ctx, config);
    }


    async function fetchChartData() {
        dates = [];
        currentPriceData = [];
        predictedPriceData = [];
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
            })
            .finally(() => {
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
                    })
                    .finally(() => {
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
                    });
            });

        
            
        
    }





</script>
  


<div class="flex flex-wrap">
<div
    class="relative min-w-0 w-full lg:w-4/12 px-4 break-words bg-white mb-6 shadow-lg rounded"
>
    <div class="rounded-t mb-0 mr-4 px-4 py-3 bg-transparent">
        <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
            <br>
            <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            AI Price Prediction
            </h6>
            <form
            class="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3"
            >
            <div class="relative flex w-full flex-wrap items-stretch"
            >
                <span
                class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"
                >
                <i class="fas fa-search"></i>
                </span>
                <input
                    type="text"
                    placeholder="Search Token"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                    on:input={handleInput}
                    bind:value={inputValue}
                />
                {#if filteredItems.length > 0}
                    <ul class="absolute z-10 mt-12 ml-10 ml-10 px-40 py-2 bg-white border border-gray-300 rounded shadow">
                        {#each filteredItems as item}
                            <li class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left flex items-center hover:bg-gray-500"
                                on:click={() => {handleItemClick(item); clearFilteredItems(); clearInput();}}
                            >
                                <img
                                    src="{item.logo}"
                                    class="ml-3 h-10 w-10 bg-white rounded-full border"
                                    alt="..."
                                />
                                <span
                                    class="ml-3 mr-3 font-bold {'btext-blueGray-600'}"
                                >
                                    {item.code}
                                </span>  
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
            </form>
            <br><br>
            <h2 class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left flex items-center">
            <img
                src="{selectedToken.logo}"
                class="ml-3 h-10 w-10 bg-white rounded-full border"
                alt="..."
            />
            <span
                class="ml-3 font-bold {'btext-blueGray-600'}"
            >
                {selectedToken.code}
            </span> 
            </h2>
        </div>
        </div>
    </div>
    <div class="p-4 flex-auto">
        <div class="relative h-350-px">
        <table class="items-center w-full bg-transparent border-collapse">
            <thead>
            </thead>
            <tbody>
                <tr>
                    <th
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left flex items-center"
                    >
                    <span
                        class="ml-3 font-bold {'btext-blueGray-600'}"
                    >
                        {"Current Price"}
                    </span>
                    </th>
                    <td
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4"
                    >
                        {selectedToken.currentPrice}
                    </td>
                </tr>
                <tr>
                    <th
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left flex items-center"
                    >
                    <span
                        class="ml-3 font-bold {'btext-blueGray-600'}"
                    >
                        {"Expected Price"}
                    </span>
                    </th>
                    <td
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4"
                    >
                        {selectedToken.predictedPrice}
                    </td>
                </tr>
                <tr>
                    <th
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left flex items-center"
                    >
                    <span
                        class="ml-3 font-bold {'btext-blueGray-600'}"
                    >
                        {"Expected Price Change"}
                    </span>
                    </th>
                    <td
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4"
                    >
                        {(selectedToken.predictedPrice-selectedToken.currentPrice).toFixed(5)}
                    </td>
                </tr>
            </tbody>    
        </table>
        </div>
    </div>
</div>

<div
    class="relative flex flex-col w-full lg:w-8/12 px-4 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
>
    <div class="rounded-t ml-4 mb-0 px-4 py-3 bg-transparent">
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
</div>