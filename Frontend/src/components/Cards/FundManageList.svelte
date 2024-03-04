<script>
    import { onMount } from 'svelte';

    const team1 = "/assets/img/team-1-800x800.jpg";

    let data = [];
    let panels = [];

    let selectedPanel;

    let amount = 0;
    let selectedPercentage="5%"
    let selectedTime='Short term holding'
    let preview=false
    let panelMemberUsername=sessionStorage.getItem('panelMemberUsername')
    let panelID
    let userID=sessionStorage.getItem('userID')

    let panelMember;

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

    async function submitForm() {
        // Process the form submission here
        console.log('Amount:', amount);
        console.log('Percentage:', selectedPercentage);
        console.log('Panel Member Name:', panelMember.name);

        let addTime = (selectedPercentage==="5%"? 30*24*60*60 : 30*24*60*60*6);
        let percentage = (selectedPercentage==="5%"? 5 : 10);
        //pmem

        let walletAddress = await getWalletAddress();
        sessionStorage.setItem('walletAddress', walletAddress);

        let transactionParam = {
            to: panelMember.wallet,
            from: walletAddress,
            value: '0x' + (amount*1.01*(10**18)).toString(16)
        };



        ethereum.request({method: 'eth_sendTransaction', params:[transactionParam]}).then(txhash => {
            checkTransaction(txhash).then(async (r) => {
            if (r.status == "0x1") {
                let data = {
                "userID": userID,
                "total":amount,
                "starting": parseInt(Date.now()/1000),
                "ending": parseInt(Date.now()/1000+addTime),
                "wallet": walletAddress,
                "percentage": percentage
                }
                console.log("----data",data)

                

                let response = await fetch(`http://localhost:9000/management/${panelID}`, {
                    method: 'PATCH',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                console.log(response.status)

                //user
                data = {
                    "panelID": panelID,
                    "total":amount,
                    "starting": parseInt(Date.now()/1000),
                    "ending": parseInt(Date.now()/1000+addTime),
                    "wallet": walletAddress,
                    "percentage": percentage
                    }

                response = await fetch(`http://localhost:9000/umanagement/${userID}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                console.log(response.status)

                //go back
                sessionStorage.setItem('panelMemberUsername', '');
                sessionStorage.setItem('panelID', 0);

                response = await fetch(`http://localhost:9000/umanagement/${userID}`);
                jsonData = await response.json();
                data = jsonData;

                requests = await Promise.all(data.funds.map(async fund => ({  
                    panel: await getManagerInfo(fund.panelID),
                    panelId: fund.panelID,
                    total: fund.total,
                    percentage: fund.percentage,
                    starting: getTime(fund.starting),
                    ending: getTime(fund.ending),
                    time: getRemainingTime(fund.starting, fund.ending),
                    status: getStatus(fund.ending)
                })));
            }
            else {
                alert("Transaction Failed");
            }
            });
        })
    }
    
    


    async function handleInput(item) {
        selectedPanel = item;
        let response = await fetch(`http://localhost:9000/panel/${selectedPanel.username}`);
        panelMember = await response.json();
        panelID = selectedPanel.id;
    }


    let requests=[]

    function getRemainingTime(s,e){
        // end-curr--fix
        let curr=parseInt(Date.now()/1000)
        let resultInSeconds=e-curr
        let days = Math.floor(resultInSeconds / (60*60*24));
        let remainingSeconds = resultInSeconds % (60*60*24);
        let hours = Math.floor(remainingSeconds / 3600);
        let minutes = Math.floor((remainingSeconds % 3600) / 60);
        let seconds = remainingSeconds % 60;
        seconds=seconds.toFixed(2)

        return `${days} Days ${hours} Hours ${minutes} Minutes`;
    }

    function getStatus(e){ //upd
        let curr=parseInt(Date.now()/1000)
        let resultInSeconds=e-curr
        if (resultInSeconds > 0)
            return "On going"
        else
            return "Finished"
    }

    function getTime(t){
        return new Date((t)*1000).toLocaleString()
    }

    async function getManagerInfo(id){
        //fetch from db
        let info = await fetch(`http://localhost:9000/panel/id/${id}`);
        info = await info.json()
        info={...info,name:info.name.toUpperCase()}
        // console.log("name---------",info)
        return info
    }

    onMount(async () => {
        let response = await fetch('http://localhost:9000/panel');
        let jsonData = await response.json();
        data = jsonData;

        console.log(data)
        panels = data.map(panelMember => ({
            id:panelMember._id.toString(),
            username: panelMember.username,
            name: panelMember.name,
            rating: panelMember.rating,
            pnl: panelMember.pnl,
            manageCount:panelMember.manageCount
        }));


        response = await fetch(`http://localhost:9000/umanagement/${userID}`);
        jsonData = await response.json();
        data = jsonData;

        requests = await Promise.all(data.funds.map(async fund => ({  
            panel: await getManagerInfo(fund.panelID),
            panelId: fund.panelID,
            total: fund.total,
            percentage: fund.percentage,
            starting: getTime(fund.starting),
            ending: getTime(fund.ending),
            time: getRemainingTime(fund.starting, fund.ending),
            status: getStatus(fund.ending)
        })));

        
    });




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
                on:click={() => handleInput(panel)} style="cursor: pointer;"
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
                
                <h2 class="text-white text-xl font-semibold">
                    Staking Details
                </h2>
                
            </div>
            </div>
        </div>
        <div class="p-4 flex-auto">
            <div class="relative h-350-px items-center content-center">
                <div
                    
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 flex justify-items-center justify-center"
                    >
                    
                    <img
                        src="{team1}"
                        class="h-12 w-12 bg-white rounded-full border self-center"
                        alt="..."
                    />
                    
                    
                </div>
                <div
                        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-1 flex justify-items-center justify-center uppercase text-blueGray-100 mb-1 text-xs font-semibold self-center"
                    >
                        {"  " + selectedPanel.name.toUpperCase()}
                    </div>
                <div class="grid grid-col-2 border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 flex justify-items-center justify-center">
                    <br>
                    <div class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                        Amount
                    </div>
                    <div>
                        <input type="number" id="amount" min=0 bind:value={amount} />
                    </div>
                </div>
                <div  class="uppercase text-blueGray-100 mb-1 text-xs font-semibold border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 flex justify-items-center justify-center">
                    <p> Percentage </p>
                    
                
                </div>
                <div class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 flex justify-items-center justify-center">
                    <label class="uppercase text-blueGray-100 mb-1 text-xs font-semibold border-t-0 px-6" for="percentage1"><input type="radio" id="percentage1" name="percentage" value="5%" bind:group={selectedPercentage} /> 5% APR for 1 Month </label>
                    <label class="uppercase text-blueGray-100 mb-1 text-xs font-semibold border-t-0 px-6" for="percentage2"><input type="radio" id="percentage2" name="percentage" value="10%" bind:group={selectedPercentage} />  10% APR for 6 Months </label>
                </div>

                <div  class="uppercase text-blueGray-100 mb-1 text-xs font-semibold border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 flex justify-items-center justify-center">
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
</div>


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
        <!-- <button
          class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
        >
          See all
        </button> -->
      </div>
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
    <!-- Projects table -->
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
</div>