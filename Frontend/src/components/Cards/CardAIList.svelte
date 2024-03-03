<script>
    import { onMount } from "svelte";
    // import { fetchChartData } from "components/Cards/CardAIChart.svelte"
    import { writable } from 'svelte/store';


    // library that creates chart objects in page
    import Chart from "chart.js";
  

    let selectedToken = {name: "Polygon", code: "MATIC", currentPrice: "1.04", predictedPrice: "1.06", logo: "https://assets.coingecko.com/coins/images/4713/large/polygon.png?1698233745"};
    sessionStorage.setItem("selectedToken", JSON.stringify(selectedToken));
    
    let tokenList = [];
    let inputValue = "";

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
        let response = await fetch('http://localhost:9000/token'); //token name logo
        let jsonData = await response.json();
        let data = jsonData;

        initializeSelectedToken();

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


    function handleItemClick(item) {
        selectedToken = item;
        // fetchChartData();
        sessionStorage.setItem("selectedToken", JSON.stringify(selectedToken));
    }

    function clearInput() {
        inputValue = "";
    }

</script>
  
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
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
  