<!-- this page is from user side, 
use can view own req and own donation -->

  

<script>
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
  import { bubble } from 'svelte/internal';

  
  const team1 = "/assets/img/team-1-800x800.jpg";

  
    let amount = 0;
    let returnPolicy
    let description
    let submitStatus=""
    let detailRequest="none"
    
    let userID=sessionStorage.getItem('userID')
    let userName=sessionStorage.getItem('userName')

    let data=[]
    let requests=[]
    let payments=[]

    async function getRequest(){
      let response = await fetch(`http://localhost:9000/fundraiserequest/${userID}`);
        let jsonData = await response.json();
        data = jsonData;

        console.log(data)
        requests = data.map(request => ({   //only on going requests
            id:request._id,
            userName:request.userName,
            userID:request.userID,
            requestID:request.requestID,
            amount:request.amount,
            returnPolicy:request.returnPolicy,
            description:request.description,
            status:request.status,
            currentAmount:request.currentAmount,
            payeeCount:request.payee.length,
            payee:request.payee
            }));

        response = await fetch(`http://localhost:9000/fundraisepayee/${userID}`);
        jsonData = await response.json();
        payments = jsonData.payments
        console.log(payments);
            
    }

    onMount(async () => {
       await getRequest();
    });

async function updateStatusForAllPayees(json) {
    try {
        for (const payee of json.payee) {
            const data = { "status": "money returned" };
            const response = await fetch(`http://localhost:9000/fundraisepayee/updatestatus/${payee.payeeID}/${json.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            });

            if (!response.ok) {
            throw new Error('Failed to update status for payee ' + payee.payeeID);
            }
        }
        console.log('Status updated for all payees successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}


    async function returnMoney(request){
        let data={
            "status":"money returned"
        }
        let response = await fetch(`http://localhost:9000/fundraiserequest/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      response=await response.json()
      console.log(response)

      updateStatusForAllPayees(request)
    }

    async function showDetails(request){
        detailRequest=request
    }

    
    // <div class="card" key={index} on:click={() => {goToNext(requestsMember.username,requestsMember.id)}} on:keypress={() => {goToNext(requestsMember.username,requestsMember.id)}}>
  
  </script>
  

<!-- 
<div class="grid grid-cols-2 gap-4">
<div
class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {'bg-white'}"
>
    <div class="rounded-t mb-0 px-4 py-3 border-0">
        <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3
            class="font-semibold text-lg {'text-blueGray-700'}"
            >
            Fund Management
            </h3>
        </div>
        </div>
    </div>
    <div class="block w-full overflow-x-auto">
        <table class="items-center w-full bg-transparent border-collapse">
        <thead>
            <tr>
            <th
                class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {'bg-blueGray-50 text-blueGray-500 border-blueGray-100'}"
            >
                Panel Member
            </th>
            <th
                class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {'bg-blueGray-50 text-blueGray-500 border-blueGray-100'}"
            >
                Rating
            </th>
            <th
                class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {'bg-blueGray-50 text-blueGray-500 border-blueGray-100'}"
            >
                Total PnL
            </th>
            <th
                class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {'bg-blueGray-50 text-blueGray-500 border-blueGray-100'}"
            >
                Total Managed
            </th>
            </tr>
        </thead>
        <tbody>
            {#each panels as panel, index}
            <tr 
                on:click={() => handleInput(panel)}
            >
                <th
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
                >
                <img
                    src="{team1}"
                    class="h-12 w-12 bg-white rounded-full border"
                    alt="..."
                />
                <span
                    class="ml-3 font-bold {'btext-blueGray-600'}"
                >
                    {panel.name.toUpperCase()}
                </span>
                </th>
                <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                    {panel.rating.toLocaleString()}
                </td>
                <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                <span class="mr-2 {panel.pnl > 0? 'text-emerald-500' : 'text-red-500'}">
                    <i
                    class="{panel.pnl > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}"
                    ></i>
                    {panel.pnl.toFixed(2)}%
                </span>
                </td>
                <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                    {panel.manageCount}
                </td>
            </tr>
            {/each}
        </tbody>
        </table>
    </div>
    </div>

    {#if selectedPanel != null}
<div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
>
        <div class="rounded-t ml-4 mb-0 px-4 py-3 bg-transparent">
            <div class="flex flex-wrap items-center">
            <div class="relative w-full max-w-full flex-grow flex-1">
                
                <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                    Overview
                </h6>
                <h2 class="text-white text-xl font-semibold">
                    Staking Details
                </h2>
                
            </div>
            </div>
        </div>
        <div class="p-4 flex-auto">
            <div class="relative h-350-px">
                <div>
                    <span
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
                    >
                    <img
                        src="{team1}"
                        class="h-12 w-12 bg-white rounded-full border"
                        alt="..."
                    />
                    <span
                        class="uppercase text-blueGray-100 mb-1 text-xs font-semibold"
                    >
                        {"  " + selectedPanel.name.toUpperCase()}
                    </span>
                    </span>
                </div>
                <div class="grid grid-col-2">
                    <br>
                    <div class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                        Amount
                    </div>
                    <div>
                        <input type="number" id="amount" min=0 bind:value={amount} />
                    </div>
                </div>
                <div  class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                    <p> Percentage </p>
                    <label for="percentage1"><input type="radio" id="percentage1" name="percentage" value="5%" bind:group={selectedPercentage} /> 5% APR for 1 Month </label>
                    <label for="percentage2"><input type="radio" id="percentage2" name="percentage" value="10%" bind:group={selectedPercentage} />  10% APR for 6 Months </label>
                
                </div>

                <div  class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                    <button
                        class="bg-red-400 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="button"
                        on:click={submitForm}
                    >
                        Confirm
                    </button>
                </div>
                
            </div>
        </div>
</div>
{/if}
</div> -->


<!-- <div class="grid grid-cols-2 gap-4"> -->
<div
  class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded bg-red-800 text-white"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 class="font-semibold text-base text-white">
            Requests Details
        </h3>
      </div>
      <!-- <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
        <button
          class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
        >
          See all
        </button>
      </div> -->
    </div>
  </div>

  <div class="block w-full x-overflow-auto">
    <!-- Projects table -->
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Request No
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Target Amount
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            current Amount 
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Payee Count
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Status
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Return Money
          </th>
        </tr>
      </thead>
      <tbody>
        {#each requests as request, index}
          <tr on:click={()=>{
            showDetails(request)
          }}>
            <th
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
              <!-- <img
                src="{team1}"
                class="h-12 w-12 bg-white rounded-full border"
                alt="..."
              /> -->
              <span
                class="ml-3 font-bold {'btext-blueGray-600'}"
              >
                {request.requestID}
              </span>
            </th>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              ${request.amount.toLocaleString(undefined, { maximumFractionDigits: 10 })}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            ${request.currentAmount.toLocaleString(undefined, { maximumFractionDigits: 10 })}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {request.payeeCount}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {request.status}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            {#if parseFloat(request.amount)===parseFloat(request.currentAmount) && request.status==="accepted"}
            <button
          class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"  on:click={()=>{
            returnMoney(request)
        }}>
          
          Return Money
        </button>
            {/if}
            </td>
           
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  
<!--detail-->
{#if detailRequest!="none"}
<div
class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
>
<div class="rounded-t mb-0 px-4 py-3 border-0">
  <div class="flex flex-wrap items-center">
    <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 class="font-semibold text-base text-blueGray-700">
        {detailRequest.requestID}
        <br><hr>
        <br>
        <h2><strong> Return Policy:</strong> {detailRequest.returnPolicy}</h2>
        <br>
        <h2><strong>Description:</strong></h2>
        {detailRequest.description}
        <br><br><br>
        <hr>
        <!--graph-->    
    </h3>
    </div>
    
  </div>
</div>
</div>
  
{/if}
<!-- </div> -->

</div>

<br><br>
<div
  class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded bg-red-800 text-white"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 class="font-semibold text-base text-white">
            Donation Details
        </h3>
      </div>
      <!-- <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
        <button
          class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
        >
          See all
        </button>
      </div> -->
    </div>
  </div>

  <div class="block w-full x-overflow-auto">
    <!-- Projects table -->
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Request No
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Paid Amount
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Status 
          </th>
          </tr>
      </thead>
      <tbody>
        {#each payments as pay, index}
          <tr>
            <th
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
              <!-- <img
                src="{team1}"
                class="h-12 w-12 bg-white rounded-full border"
                alt="..."
              /> -->
              <span
                class="ml-3 font-bold {'btext-blueGray-600'}"
              >
                {pay.requestID}
              </span>
            </th>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              ${pay.amount.toLocaleString(undefined, { maximumFractionDigits: 10 })}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {pay.status}
            </td>           
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  </div>