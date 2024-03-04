<script>
    // core components
    import AcademyCard from "components/Cards/CardAcademy.svelte";
    import { onMount } from "svelte";
  
        // import Car from "components/Cards/CardSocialTraffic.svelte";
  
  
    let totalAssetValue = 0;
    let resources = []
    let content="none"
    let topic=""
    let subtopic=""
    let creator=""
    let time=""
    let weblink=""
  
    onMount(async () => {
      try {
        let response = await fetch('http://localhost:9000/academy');
        let jsonData = await response.json();
        let data = jsonData;
  
        console.log(data)
        resources = await Promise.all(data.map(async (obj) => {
            let topic=obj.topic
            topic=topic.toUpperCase()
            let subtopic=obj.subtopic
            subtopic=subtopic.toUpperCase()
            let content=obj.content
            let logo=obj.logo 
            let creator=obj.creator
            const timestamp = parseInt(obj.time); 
            const date = new Date(timestamp * 1000); 
            const dateString = date.toDateString()
            const weblink = obj.weblink;

            console.log(weblink)

            return {
                topic:topic,
                subtopic:subtopic,
                content:content,                
                logo: logo,
                creator: creator,
                time:dateString,
                weblink:weblink
            };
        }));
  
      //   let userID = await sessionStorage.getItem("userID");
  
      //   let valueUpdate = {value: totalAssetValue.toFixed(2)};
  
      //   response = await fetch(`http://localhost:9000/holding/${userID}/asset`, {
      //     method: 'PATCH',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify(valueUpdate)
      //   });
          
  
      } catch (error) {
          console.error("Error fetching academy data:", error);
      }  
      
  
    });

    function showContent(resourse){
      topic=resourse.topic
      subtopic=resourse.subtopic
      content=resourse.content
      creator=resourse.creator
      time=resourse.time
      weblink=resourse.weblink
      console.log("in btn")
    }
  
  </script>
 
 
 
<!-- Header -->
<div class="grid grid-cols-2 gap-4">
<div class="relative bg-red-200 md:pt-32 pb-32 pt-12">
  <div class="px-4 md:px-10 mx-auto w-full">
    <div>
      <!-- Card stats -->
      <div class="flex flex-wrap">
        {#each resources as resource}
        <div class="w-full lg:w-12/12 xl:w-12/12 px-4" on:click={()=>{
          showContent(resource)}}>
          <div class="flex flex-col h-full">
          <AcademyCard 
            statSubtitle={resource.subtopic}
            statTitle={resource.topic}
            statlogo={resource.logo}         
          />          
          </div>
          <br>
          </div>
        {/each}
        <!-- <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
           
          />
          <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <button
              class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              See all
            </button>
         
          </div>
        </div> -->
        <!-- <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="NEW"
            statTitle="2,356"
            statArrow="down"
            statPercent="3.48"
            statPercentColor="text-red-500"
            statDescripiron="Since last week"
            statIconName="fas fa-chart-pie"
            statIconColor="bg-orange-500"
          />
        </div> -->
        <!-- <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="SALES"
            statTitle="924"
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

<!-- <div
  class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
> -->
  <!-- <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 class="font-semibold text-base text-blueGray-700"> -->
           <!-- <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="NEW"
            statTitle="2,356"
            statArrow="down"
            statPercent="3.48"
            statPercentColor="text-red-500"
            statDescripiron="Since last week"
            statIconName="fas fa-chart-pie"
            statIconColor="bg-orange-500"
          />
        </div> -->
        <!-- </h3>
      </div>
      
    </div>
  </div> -->
  <!-- <div class="block w-full overflow-x-auto"> -->
    <!-- Projects table -->
    <!-- <table class="items-center w-full bg-transparent border-collapse">
      <thead class="thead-light">
        <tr>
          <th
            class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Referral
          </th>
          <th
            class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Visitors
          </th>
          <th
            class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"
          ></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
          >
            Facebook
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            1,480
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
        </tr>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
          >
            Facebook
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            5,480
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">70%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-emerald-200"
                >
                  <div
                    style="width: 70%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
          >
            Google
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            4,807
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">80%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-purple-200"
                >
                  <div
                    style="width: 80%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
          >
            Instagram
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            3,678
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">75%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-lightBlue-200"
                >
                  <div
                    style="width: 75%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-lightBlue-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
          >
            twitter
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            2,645
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            <div class="flex items-center">
              <span class="mr-2">30%</span>
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-2 text-xs flex rounded bg-orange-200"
                >
                  <div
                    style="width: 30%;"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                  ></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table> -->
  <!-- </div> -->
<!-- </div> -->


{#if content!="none"}
<div
class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
>
<div class="rounded-t mb-0 px-4 py-3 border-0">
  <div class="flex flex-wrap items-center">
    <div class="relative w-full px-4 max-w-full flex-grow flex-1">
      <h1><strong>{topic}</strong></h1>
      <h3>{subtopic}</h3>
      <br>
      <h4>
        {creator} <br> {time}
      </h4>
      <h3 class="font-semibold text-base text-blueGray-700">
        <br><hr>
        <br>
        {content}
        <br><br><br>
        <hr>
        <h3>Further Reading: <a href=${weblink}>{weblink}</a></h3>
      </h3>
    </div>
    
  </div>
</div>
</div>
  
{/if}
  </div>
  
