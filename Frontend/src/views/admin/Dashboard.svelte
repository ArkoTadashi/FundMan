<script>
  // core components

  import { onMount } from 'svelte';
  import CardLineChart from "components/Cards/CardLineChart.svelte";
  import CardBarChart from "components/Cards/CardBarChart.svelte";
  import CardPageVisits from "components/Cards/CardPageVisits.svelte";
  import CardSocialTraffic from "components/Cards/CardSocialTraffic.svelte";
  import PieChart from '../../components/Cards/PieChart.svelte';
  import CardStats from "components/Cards/CardStats.svelte";
  import AdminNavbar from "components/Navbars/AdminNavbar.svelte";
  import HoldingCard from '../../components/Cards/HoldingCard.svelte';
  export let location;

  let isLoggedIn=false;


  let coins = [];
  onMount (async () => {

    sessionStorage.setItem('currentPage','dashboard');

    isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn'));
    if(!isLoggedIn){
      window.location.href="http://localhost:5000/auth/login"
    }
    
    coins = await JSON.parse(sessionStorage.getItem("coins"));

  })



</script>



<div>
  <div class="flex flex-wrap">
    <div class="w-full justify-center mb-12 xl:mb-0 px-4 -m-24">
      <HoldingCard />
    </div>
  </div>
  <div class="flex flex-wrap">
    <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
      <CardLineChart />
    </div>
    <div class="w-full xl:w-4/12 px-4">
      <CardBarChart />
    </div>
  </div>
  <div class="flex flex-wrap mt-4">
    <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
      <CardPageVisits />
    </div>
    <div class="w-full xl:w-4/12 px-4">
      {#if coins.length > 0}
            <PieChart {coins} />
            {:else}
            <p>Loading...</p>
            {/if}
    </div>
  </div>
</div>
