<script>
  import { onMount } from 'svelte';

  const team1 = "/assets/img/team-1-800x800.jpg";
  async function getWalletAddress() {
      try {
          if (typeof window.ethereum !== 'undefined') {
              const accs = await ethereum.request({ method: 'eth_requestAccounts' });
              return accs[0];
          }
      } catch (error) {
          console.error("Error fetching wallet address:", error);
          return ''; // Return empty string in case of error
      }
  }

  async function checkTransaction(txhash) {
      let checkTransactionLoop = () => {
          return ethereum.request({method: 'eth_getTransactionReceipt', params:[txhash]}).then(r => {
          if (r != null) {
              console.log(r.status);
              return r;
          }
          else {
              return checkTransactionLoop();
          }
          });
      }

      return checkTransactionLoop();

  }
  let amount = 0;
    let returnPolicy
    let description
    let submitStatus=""
    
    let userID=sessionStorage.getItem('userID')
    let userName=sessionStorage.getItem('userName')

    let data=[]
    let requests=[]

    async function getRequest(){
      const response = await fetch(`http://localhost:9000/fundraiserequest/${userID}`);
        const jsonData = await response.json();
        data = jsonData;

        console.log(data)
        requests = data.map(request => ({
            userName:request.userName,
            userID:request.userID,
            requestID:request.requestID,
            amount:request.amount,
            returnPolicy:request.returnPolicy,
            description:request.description,
            status:request.status
            }));
    }

    onMount(async () => {
       await getRequest();
    });

    function goToNext(username,id){
        sessionStorage.setItem('requestsMemberUsername', username);
        sessionStorage.setItem('requestsID', id);
        // push('/FundManageRequest')
    }

    async function submitRequest() {
      const response = await fetch('http://localhost:9000/fundraiserequest/count');
      let count = await response.json();
      let data = {
                  "userName": userName,
                  "userID": userID,
                  "requestID": parseInt(count.count)+1,
                  "amount": amount,
                  "returnPolicy": returnPolicy,
                  "description": description,
                  "status": "pending",
                  "currentAmount": 0,
                  "payee": [
                    
                  ]
                }
      console.log(data)
       
      await fetch(`http://localhost:9000/fundraiserequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        submitStatus="success"
        console.log(data); // Handle response from backend
      })
      .catch(error => {
        submitStatus="fail"
        console.error('Error:', error);
      });

      getRequest()
      console.log("submit")
    }
  
    
    // <div class="card" key={index} on:click={() => {goToNext(requestsMember.username,requestsMember.id)}} on:keypress={() => {goToNext(requestsMember.username,requestsMember.id)}}>
  
  </script>



<div class="grid grid-cols-2 gap-4">
<!-- <div
class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {'bg-white'}"
> -->
  <!-- <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3
          class="font-semibold text-lg {'text-blueGray-700'}"
          >
          Fund Raise
          </h3>
      </div>
      </div>
  </div> -->
  <!-- <div class="block w-full overflow-x-auto">
      <table class="items-center w-full bg-transparent border-collapse">
      <thead>
          <tr>
          <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {'bg-blueGray-50 text-blueGray-500 border-blueGray-100'}"
          >
              Fund Raiser
          </th>
          <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {'bg-blueGray-50 text-blueGray-500 border-blueGray-100'}"
          >
              Target Amount
          </th>
          <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {'bg-blueGray-50 text-blueGray-500 border-blueGray-100'}"
          >
              Return Policy
          </th>
          <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {'bg-blueGray-50 text-blueGray-500 border-blueGray-100'}"
          >
              Payee Count
          </th>
          </tr>
      </thead>
      <tbody>
          {#each requests as request, index}
          <tr 
              on:click={() => {goDetail(request.id, request.userID)}}
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
                  {request.userName.toUpperCase()}
              </span>
              </th>
              <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
              >
                  {request.amount.toLocaleString()}
              </td>
              <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
              >
 
              {request.returnPolicy}
              </td>
              <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
              >
                  {request.payeeCount}
              </td>
          </tr>
          {/each}
      </tbody>
      </table>
  </div> -->
  <!-- </div> -->


<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
>
      <div class="rounded-t ml-4 mb-0 px-4 py-3 bg-transparent">
          <div class="flex flex-wrap items-center">
          <div class="relative w-full max-w-full flex-grow flex-1">
              
              <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                  Fund Manage Request
              </h6>
       
          </div>
          </div>
      </div>
      <div class="p-4 flex-auto">
          <div class="relative h-450-px">
              <div>
                  <span
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
                  >
                  <img
                      src="{team1}"
                      class="h-12 w-12 bg-white rounded-full border"
                      alt="..."
                      />
                      <!-- {"  " + username.toUpperCase()} -->
                  </span>
                  <!-- <span
                      class="uppercase text-blueGray-100 mb-1 text-xs font-semibold"
                  >
                      {clientInfo.name.toUpperCase()}
                      <p>Email: {clientInfo.email}</p>
                      <br>
                      <hr>
                      <br>
                      <p><strong>Target Amount:</strong> {requestDetail.amount}</p>
                      <p><strong>Return Policy:</strong> {requestDetail.returnPolicy}</p>
                      <p><strong>currentAmount:</strong> {requestDetail.currentAmount}</p>
                      <p><strong>Discription:</strong> {requestDetail.description}</p>
                     
                  </span> -->

              </div>
              <div class="grid grid-col-2">
                  <br>
                  <div class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                     Amount
                  </div>
                  <div>
                      <input type="number" id="amount" min=0 bind:value={amount} required />
                  </div>
              </div>
              
              <div class="grid grid-col-2">
                <br>
                <div class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                  Return Policy:
                </div>
                <div>
                    <input type="text" id="rp" bind:value={returnPolicy} required />
                </div>
            </div>

            <div class="grid grid-col-2">
              <br>
              <div class="uppercase  text-blueGray-100 mb-1 text-xs font-semibold">
                Description:
              </div>
              <div>
                <textarea bind:value={description} required></textarea>
              </div>
          </div>



              <div  class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                  <button
                      class="bg-red-400 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="button"
                      on:click={submitRequest}
                  >
                      Submit
                  </button>
              </div>

              <div class="grid grid-col-2">
                <br>
                <div class="uppercase  mb-1 text-xs font-semibold">
                  {#if submitStatus==="success"}
                  <p class="accepted text-blueGray-100">Submission successful</p>
                  {:else if submitStatus==="fail"}
                  <p class="rejected text-red-400">Submission failed</p>
                  {/if}
                </div>
                
            </div>
              
          </div>
      </div>
</div>

</div>


<div
class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded bg-red-800 text-white"
>
<div class="rounded-t mb-0 px-4 py-3 border-0">
  <div class="flex flex-wrap items-center">
    <div class="relative w-full px-4 max-w-full flex-grow flex-1">
      <h3 class="font-semibold text-base text-white">
        All Requests
      </h3>
    </div>
    <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
    </div>
  </div>
</div>
<div class="block w-full overflow-x-auto">

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
          Total Amount
        </th>
        <th
          class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
        >
          Return Policy
        </th>
        
      </tr>
    </thead>
    <tbody>
      {#each requests as request, index}
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
           
          {request.requestID}
           
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            ${request.amount.toLocaleString(undefined, { maximumFractionDigits: 20 })}
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            {request.returnPolicy}
          </td>
          
        </tr>
      {/each}
    </tbody>
  </table>
</div>
</div>