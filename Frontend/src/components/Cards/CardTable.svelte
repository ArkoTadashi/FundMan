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

  export let shrinkTable;

  function showCoinHistory(coin){
    sessionStorage.setItem("showCoin", coin.name);
    shrinkTable();
  }

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
          <!-- <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            7d%
          </th> -->
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
          <tr on:click={showCoinHistory(coin)} style="cursor: pointer;transition: background-color 0.3s;">
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
            <!-- <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <span class="mr-2 {coin.change7d > 0? 'text-emerald-500' : 'text-red-500'}">
                <i
                  class="{coin.change7d > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}"
                ></i>
                {coin.change7d}%
              </span>
            </td> -->
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
        <!-- <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
            <img
              src="{bootstrap}"
              class="h-12 w-12 bg-white rounded-full border"
              alt="..."
            />
            <span
              class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              Argon Design System
            </span>
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            $2,500 USD
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <i class="fas fa-circle text-orange-500 mr-2"></i> pending
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex">
              <img
                src="{team1}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
              />
              <img
                src="{team2}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team3}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team4}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">60%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-red-200"
                >
                  <div
                    style="width: 60%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
          >
            <TableDropdown />
          </td>
        </tr>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
            <img
              src="{angular}"
              class="h-12 w-12 bg-white rounded-full border"
              alt="..."
            />
            <span
              class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              Angular Now UI Kit PRO
            </span>
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            $1,800 USD
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <i class="fas fa-circle text-emerald-500 mr-2"></i>
            completed
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex">
              <img
                src="{team1}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
              />
              <img
                src="{team2}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team3}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team4}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">100%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-emerald-200"
                >
                  <div
                    style="width: 100%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
          >
            <TableDropdown />
          </td>
        </tr>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
            <img
              src="{sketch}"
              class="h-12 w-12 bg-white rounded-full border"
              alt="..."
            />
            <span
              class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              Black Dashboard Sketch
            </span>
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            $3,150 USD
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <i class="fas fa-circle text-red-500 mr-2"></i> delayed
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex">
              <img
                src="{team1}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
              />
              <img
                src="{team2}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team3}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team4}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">73%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-red-200"
                >
                  <div
                    style="width: 73%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
          >
            <TableDropdown />
          </td>
        </tr>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
            <img
              src="{react}"
              class="h-12 w-12 bg-white rounded-full border"
              alt="..."
            />
            <span
              class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              React Material Dashboard
            </span>
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            $4,400 USD
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <i class="fas fa-circle text-teal-500 mr-2"></i> on schedule
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex">
              <img
                src="{team1}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
              />
              <img
                src="{team2}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team3}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team4}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">90%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-teal-200"
                >
                  <div
                    style="width: 90%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
          >
            <TableDropdown />
          </td>
        </tr>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
            <img
              src="{vue}"
              class="h-12 w-12 bg-white rounded-full border"
              alt="..."
            />
            <span
              class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              React Material Dashboard
            </span>
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            $2,200 USD
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <i class="fas fa-circle text-emerald-500 mr-2"></i>
            completed
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex">
              <img
                src="{team1}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
              />
              <img
                src="{team2}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team3}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
              <img
                src="{team4}"
                alt="..."
                class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
              />
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">100%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-emerald-200"
                >
                  <div
                    style="width: 100%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
          >
            <TableDropdown />
          </td>
        </tr> -->
      </tbody>
    </table>
  </div>
</div>
