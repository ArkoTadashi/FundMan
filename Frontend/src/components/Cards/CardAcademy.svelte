<script>
    // core components
  
    export let statSubtitle = "Sub Academy";
    export let statTitle = "Academy";
    // can be any of the text color utilities
    // from tailwindcss
    // export let statPercentColor = "text-emerald-500";
    export let statDescripsion = "";
    export let statIconName = "far fa-chart-bar";
    // can be any of the background color utilities
    // from tailwindcss
    export let statIconColor = "bg-indigo-500";
    export let statlogo ="";
    let statContent=""

   
  </script>

  <div
    class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
>
    <div class="flex-auto p-4">
      <div class="flex flex-wrap">
        <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
          <h5 class="text-blueGray-400 uppercase font-bold text-xs">
            {statSubtitle}
          </h5>
          <span class="font-semibold text-xl text-blueGray-700">
            {statTitle}
          </span>
        </div>
        <div class="relative w-auto pl-4 flex-initial">
          <div
            class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full {statIconColor}"
          >
            <i class="{statIconName}"></i>
          </div>
        </div>
      </div>
      <p class="text-sm text-blueGray-400 mt-4">
        <!-- <span class="mr-2 {statPercentColor}">
          <i
          class="{statArrow === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}"
          ></i>
          {statPercent}%
        </span> -->
        
        
        
        <!-- <span class="whitespace-nowrap">{statContent}</span> -->
      </p>
      
      
    </div>
    <!--btn-->
    <!-- <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
      <button
        class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        on:click={showContent}
      >
        Expand
      </button>
      
    </div> -->
  </div>

  <!-- <div
  class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 class="font-semibold text-base text-blueGray-700">
          {statContent}
        </h3>
      </div>
      
    </div>
  </div>
  </div> -->

  
