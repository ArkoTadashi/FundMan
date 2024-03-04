<script>
    // core components
  
    import { onMount } from 'svelte';
    import FundRaiseList from "components/Cards/FundRaiseList.svelte";
    export let location;

    
  
  
  
  
  
    onMount (async () => {
      
      
  
    })
  
  </script>
    
    
    
  <div>
    <div class="flex flex-wrap">
      <div class="w-full px-4">
        <FundRaiseList />
      </div>
      <!-- <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <CardAIChart />
      </div> -->
    </div>
    <!-- <div class="flex flex-wrap mt-4">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
      <CardPageVisits />
      </div>
      <div class="w-full xl:w-4/12 px-4">
      <CardSocialTraffic />
      </div>
    </div> -->
  </div>
  