<script>
  // core components
  import { onMount } from "svelte";
  import CardStats from "components/Cards/CardStats.svelte";

  async function fetchCoinData(address, decimal) {
    try {
      const wallet = sessionStorage.getItem('walletAddress');
      const bal = await ethereum.request({
        method: 'eth_call',
        params: [{
          to: address,
          data: "0x70a08231" + "000000000000000000000000" + wallet.substring(2),
        },
        'latest']
      });

      const value = parseInt(bal, 16) / (10 ** decimal);
      return value;
    } catch (error) {
      console.error("Error fetching coin data:", error);
      return 0;
    }
  }


  let totalAssetValue = 0;
  let coins = []

  onMount(async () => {
    try {
      let response = await fetch('http://localhost:9000/market');
      let jsonData = await response.json();
      let data = jsonData;

      coins = await Promise.all(data.map(async (obj) => {
          const response = await fetch(`http://localhost:9000/token/${obj.token}`);
          const jsonData = await response.json();
          let dat = jsonData;

          let tokenAddress = dat.address;
          let decimal = dat.decimal;
          let logo = dat.logo;

          let holdingValue = await fetchCoinData(tokenAddress, decimal);

          let marketcoin=await fetch(`http://localhost:9000/market/${obj.token}`)
          marketcoin = await marketcoin.json();
          //console.log(marketcoin.currentPrice);

          totalAssetValue += holdingValue*marketcoin.currentPrice;


          return {
              name : dat.name,
              code : obj.token.toUpperCase(),
              price : marketcoin.currentPrice,
              amount : parseFloat(holdingValue.toFixed(7)),
              usd : parseFloat((holdingValue*marketcoin.currentPrice).toFixed(7)),
              change24h : marketcoin.change24h,
              logo: logo
          };
      }));

      let userID = await sessionStorage.getItem("userID");

      let valueUpdate = {value: totalAssetValue.toFixed(2)};

      response = await fetch(`http://localhost:9000/holding/${userID}/asset`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(valueUpdate)
      });

      sessionStorage.setItem("coins", JSON.stringify(coins));

      response = await fetch(`http://localhost:9000/holding/${userID}`);
      jsonData = await response.json();
      let assets = jsonData.assets;

      sessionStorage.setItem("assets", JSON.stringify(assets));


      coins = coins.filter(coin => coin.amount > 0);

      

    } catch (error) {
        console.error("Error fetching token data:", error);
    }

    

  });

</script>

<!-- Header -->
<div class="relative bg-red-500 md:pt-32 pb-32 pt-12">
  <div class="px-4 md:px-10 mx-auto w-full">
    <div>
      <!-- Card stats -->
      <div class="flex flex-wrap">
        <!-- <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="Total Asset"
            statTitle={totalAssetValue.toLocaleString()}
            statArrow="up"
            statPercent="3.48"
            statPercentColor="text-emerald-500"
            statDescripiron="Since last month"
            statIconName="far fa-chart-bar"
            statIconColor="bg-red-500"
          />
        </div>
        <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="CHANGE SINCE YESTERDAY"
            statTitle={coins.length}
            statArrow="down"
            statPercent="3.48"
            statPercentColor="text-red-500"
            statDescripiron="Since last week"
            statIconName="fas fa-chart-pie"
            statIconColor="bg-orange-500"
          />
        </div>
        <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="TOTAL TOKENS"
            statTitle={coins.length}
            statArrow="down"
            statPercent="1.10"
            statPercentColor="text-orange-500"
            statDescripiron="Since yesterday"
            statIconName="fas fa-users"
            statIconColor="bg-pink-500"
          />
        </div>
        <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="PERFORMANCE"
            statTitle="49,65%"
            statArrow="up"
            statPercent="12"
            statPercentColor="text-emerald-500"
            statDescripiron="Since last month"
            statIconName="fas fa-percent"
            statIconColor="bg-emerald-500"
          />
        </div> -->
        
      </div>
    </div>
  </div>
</div>
