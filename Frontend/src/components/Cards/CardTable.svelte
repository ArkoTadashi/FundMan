<script>
  // core components
  import TableDropdown from "components/Dropdowns/TableDropdown.svelte";

  const bootstrap = "../assets/img/bootstrap.jpg";
  const angular = "../assets/img/angular.jpg";
  const sketch = "../assets/img/sketch.jpg";
  const react = "../assets/img/react.jpg";
  const vue = "../assets/img/react.jpg";

  const team1 = "../assets/img/team-1-800x800.jpg";
  const team2 = "../assets/img/team-2-800x800.jpg";
  const team3 = "../assets/img/team-3-800x800.jpg";
  const team4 = "../assets/img/team-4-470x470.png";

  import { onMount } from 'svelte';
  // import { push } from 'svelte-spa-router';

  let data = [];
  let coins = [];

  onMount(async () => {
    const response = await fetch('http://localhost:9000/market');
    const jsonData = await response.json();
    data = jsonData;

    coins = await Promise.all(data.map(async (obj) => {
      const response = await fetch(`http://localhost:9000/token/${obj.token}`);
      const jsonData = await response.json();
      let dat = jsonData;
      let logo = dat.logo;

      return {
        name: obj.token,
        code: obj.token,
        price: obj.currentPrice,
        change24h: obj.change24h,
        inCirc : obj.circulatingSupply.toLocaleString(),
        volume: obj.volume.toLocaleString(),
        logo: logo
      };
    }));

    // coins = data.map(obj => ({
    //     name: obj.token,
    //     code: obj.token,
    //     price: obj.currentPrice,
    //     change24h: obj.change24h,
    //     inCirc : obj.circulatingSupply,
    //     volume: obj.volume,
    // }));
  });

  function getMarketCap(price, inCirc){
    const marketCap = price*inCirc;
    return marketCap.toLocaleString();
  }

  function showCoinInfo(coinName){
    // sessionStorage.setItem('expandCoin', coinName);
    // push('/CoinInfo');
  }

  // can be one of light or dark
  export let color = "light";
</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color === 'light' ? 'bg-white' : 'bg-red-800 text-white'}"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3
          class="font-semibold text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
        >
          Market Prices
        </h3>
      </div>
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
    <!-- Projects table -->
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Coin
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Price
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            24h%
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Circulating Supply
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            24h Volume        
          </th>
        </tr>
      </thead>
      <tbody>
        {#each coins as coin, index}
          <tr>
            <th
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
              <img
                src="{coin.logo}"
                class="h-12 w-12 bg-white rounded-full border"
                alt="..."
              />
              <span
                class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
              >
                {coin.name.toUpperCase()}
              </span>
            </th>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              ${coin.price.toLocaleString()}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <span class="mr-2 {coin.change24h > 0? 'text-emerald-500' : 'text-red-500'}">
                <i
                  class="{coin.change24h > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}"
                ></i>
                {coin.change24h.toFixed(2)}%
              </span>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {coin.inCirc}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              ${coin.volume}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
