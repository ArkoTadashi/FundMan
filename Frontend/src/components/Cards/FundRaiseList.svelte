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

    async function submitForm(rid,curr,paidMoney,payeeID,malikWallet) {
        // Process the form submission here
        
        //pmem
        console.log(malikWallet)

        let walletAddress = await getWalletAddress();
        sessionStorage.setItem('walletAddress', walletAddress);

        

        let transactionParam = {
            to: malikWallet,
            from: walletAddress,
            value: '0x' + (amount*1.01*(10**18)).toString(16)
        };



        ethereum.request({method: 'eth_sendTransaction', params:[transactionParam]}).then(txhash => {
            checkTransaction(txhash).then(async (r) => {
            if (r.status == "0x1") {

                

                payMoney(rid,curr,paidMoney,payeeID);
            }
            else {
                alert("Transaction Failed");
            }
            });
        })
    }
    
    


    let data = [];
    let requests = [];
    let clientInfo={username:"none"}
    let paidMoney=0
    let requestDetail={}
    let userID=sessionStorage.getItem("userID")

    onMount(async () => {
        const response = await fetch(`http://localhost:9000/fundraiserequestdonar/${userID}`);
        const jsonData = await response.json();
        data = jsonData;

        console.log(data)
        requests = await Promise.all(data.map(async request => ({
            id:request._id,
            userName:request.userName,
            userID:request.userID,
            requestID:request.requestID,
            amount:request.amount,
            wallet:request.wallet,
            returnPolicy:request.returnPolicy,
            description:request.description,
            currentAmount:request.currentAmount,
            status:request.status,
            payeeCount:request.payee.length,
            payee:request.payee
            })));
    });


    async function goDetail(id,uid){
        const response = await fetch(`http://localhost:9000/fundraiserequest/donar/${id}`);
        const jsonData = await response.json();
        requestDetail = jsonData;
        console.log(requestDetail);
        setClient(uid)
        // push('/fundraiseruserdetails');
    }

    async function setClient(id){
      clientInfo=await getClientInfo(id)
    }

    async function getClientInfo(id){
      try {
            let info = await fetch(`http://localhost:9000/user/${id}`);
            info = await info.json();
            info = { ...info, name: info.name.toUpperCase() };
            return info;
        } catch (error) {
            console.error("Error fetching manager info:", error);
            return { username: "none" }; // or handle the error accordingly
        }
    }

    async function payMoney(rid,curr,paidMoney,payeeID) {


        curr = parseFloat(curr);
        paidMoney = parseFloat(paidMoney);
        let newamount=curr+paidMoney
        console.log("newamount ",newamount)
        let data = {"currentAmount": newamount ,
        "payeeID": payeeID,
        "amount":paidMoney
        }

        let response = await fetch(`http://localhost:9000/fundraiserequest/donar/${rid}/pay`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      response=await response.json()
      console.log(response)

      if(response.success=="patched"){
      response = await fetch(`http://localhost:9000/fundraiserequest/donar/${rid}/payee`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      response=await response.json()
      console.log(response)
    }

      if(response.success=="patched"){
        data = {
            "requestID": rid,
            "amount":paidMoney,
            "status":"accepted"
        }
        response = await fetch(`http://localhost:9000/fundraisepayee/${payeeID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      response=await response.json()
      console.log(response)
      }
     
      if(response.success=="patched"){
        requests = requests.map(request =>
          request.id === rid ? { ...request, currentAmount: newamount } : request
        );
      }
    }
  
</script>
  


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
            Fund Raise
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
                <!-- <span class="mr-2 {panel.pnl > 0? 'text-emerald-500' : 'text-red-500'}">
                    <i
                    class="{panel.pnl > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}"
                    ></i>
                    {panel.pnl.toFixed(2)}%
                </span> -->
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
    </div>
    </div>

    {#if  clientInfo.username!="none"}
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
                    Details Info
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
                        {"  " + clientInfo.username.toUpperCase()}
                    </span>
                    <span
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
                       
                        <!-- <hr> -->
                    </span>

                </div>
                <div class="grid grid-col-2">
                    <br>
                    <div class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                       Pay Amount
                    </div>
                    <div>
                        <input type="number" id="amount" min=0 bind:value={paidMoney} />
                    </div>
                </div>
                
                <div  class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                    <button
                        class="bg-red-400 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="button"
                        on:click={submitForm(requestDetail._id,requestDetail.currentAmount,paidMoney,userID,requestDetail.wallet)}
                    >
                        Confirm
                    </button>
                </div>
                
            </div>
        </div>
</div>
{/if}
</div>

<!-- 
<div
  class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded bg-red-800 text-white"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 class="font-semibold text-base text-white">
          Managed Funds
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
            Panel Name
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Total Amount
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            APY
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Starting
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Ending
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Time Remaining
          </th>
          <th
            class="px-6 bg-red-700 text-red-200 border-red-600 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {#each requests as request, index}
          <tr>
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
                {request.panel.name}
              </span>
            </th>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              ${request.total.toLocaleString(undefined, { maximumFractionDigits: 20 })}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {request.percentage}%
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {request.starting}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {request.ending}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {request.time}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {request.status}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div> -->