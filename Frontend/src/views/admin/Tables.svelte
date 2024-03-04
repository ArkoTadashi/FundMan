<script>
  // core components
  import CardTable from "components/Cards/CardTable.svelte";
  import CardLineChartMarket from "../../components/Cards/CardLineChartMarket.svelte";
  import { onMount } from "svelte";
  export let location;

  let tableWidth="w-full";
  let showChart=false;

  function shrinkTable(){
    //tableWidth="w-3\/5";
    showChart=true;
    console.log("showchart set to true")
  }

  function showMarket(){
    showChart=false;
  }

  onMount (() => {
    
    sessionStorage.setItem('currentPage','Market');

  })

  let pastMonthData = [
        { dataPoint: 'January 13', usd: 1847.0679792102258 },
        { dataPoint: 'January 14', usd: 1836.9849017833858 },
        { dataPoint: 'January 15', usd: 2110.195286171563 },
        { dataPoint: 'January 16', usd: 2028.563776162226 },
        { dataPoint: 'January 17', usd: 2127.177056243196 },
        { dataPoint: 'January 18', usd: 1874.1142401196775 },
        { dataPoint: 'January 19', usd: 2047.482765354035 },
        { dataPoint: 'January 20', usd: 1958.2527260443774 },
        { dataPoint: 'January 21', usd: 2142.4589805308777 },
        { dataPoint: 'January 22', usd: 2114.845757109414 },
        { dataPoint: 'January 23', usd: 1976.1092417793216 },
        { dataPoint: 'January 24', usd: 1908.2877947451057 },
        { dataPoint: 'January 25', usd: 2073.895866827699 },
        { dataPoint: 'January 26', usd: 1845.042574750371 },
        { dataPoint: 'January 27', usd: 2063.7504643168443 },
        { dataPoint: 'January 28', usd: 2181.3702047803485 },
        { dataPoint: 'January 29', usd: 2047.2358207880917 },
        { dataPoint: 'January 30', usd: 2188.0008049934694 },
        { dataPoint: 'January 31', usd: 2109.4210306153897 },
        { dataPoint: 'February 1', usd: 1894.049259681843 },
        { dataPoint: 'February 2', usd: 1964.2635113647145 },
        { dataPoint: 'February 3', usd: 2067.6308641249073 },
        { dataPoint: 'February 4', usd: 2093.4645131491387 },
        { dataPoint: 'February 5', usd: 1948.7637966944507 },
        { dataPoint: 'February 6', usd: 2063.592545358562 },
        { dataPoint: 'February 7', usd: 2003.264121236334 },
        { dataPoint: 'February 8', usd: 1887.640492751563 },
        { dataPoint: 'February 9', usd: 2010.2500581192456 },
        { dataPoint: 'February 10', usd: 1835.7002015786556 },
        { dataPoint: 'February 11', usd: 1854.4728655294765 },
        { dataPoint: 'February 12', usd: 1846.343302930233 }
     ];
    let pastYearData = [
        { dataPoint: 'January 23', usd: 1700.967928152589 },
        { dataPoint: 'February 23', usd: 2361.272206870396 },
        { dataPoint: 'March 23', usd: 1708.067513052469 },
        { dataPoint: 'April 23', usd: 2129.711167174916 },
        { dataPoint: 'May 23', usd: 2139.131016637231 },
        { dataPoint: 'June 23', usd: 2301.579874949757 },
        { dataPoint: 'July 23', usd: 1597.2840934082376 },
        { dataPoint: 'August 23', usd: 1563.8760378487346 },
        { dataPoint: 'September 23', usd: 1761.7362492082746 },
        { dataPoint: 'October 23', usd: 2083.217028618584 },
        { dataPoint: 'November 23', usd: 2391.590376081759 },
        { dataPoint: 'December 23', usd: 1541.321214618991 },
        { dataPoint: 'January 24', usd: 1853.515301079743 }
    ]
</script>
<div>
<div class="flex flex-wrap mt-4">
  {#if showChart}
  <div class="w-full mb-12 xl:mb-0 px-4 items-start">
    <CardLineChartMarket {showMarket}/>
  </div>
  {:else}
  <div class="w-full mb-12 px-4" style="transition: width 0.5s;">
    <CardTable {shrinkTable}/>
  </div>
  {/if}
  <!-- <div class="w-full mb-12 px-4">
    <CardTable color="dark" />
  </div> -->
</div>
</div>
