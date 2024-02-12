<script>
    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';

    let requests=[]
    let client=''
    let clientInfo={}
    let userId=sessionStorage.getItem('userID')

    async function getManager(id) {
        // let info = await fetch(`http://localhost:9000/panel/${id}`);
        // info = await info.json();
        // console.log(info[0])
        return id;
    }

    function getRemainingTime(s,e){
        return (e-s)/(60*60*24)
    }

    function getStatus(s,e){
        if ((e-s)>0)
            return "On going"
        else
            return "Finished"
    }

    function getTime(t){
        return new Date((t)*1000).toLocaleString()
    }

    onMount(async () => {
        const response = await fetch(`http://localhost:9000/umanagement/${userId}`);
        const jsonData = await response.json();
        let data = jsonData;

        requests = await Promise.all(data.funds.map(async fund => ({
            panelId: await getManager(fund.panelID),
            total: fund.total,
            starting: getTime(fund.starting),
            ending: getTime(fund.ending),
            time:getRemainingTime(fund.starting,fund.ending),
            status:getStatus(fund.starting,fund.ending)
        })));
    });

    
    // function setClient(id){
    //     client=id
    // }

    // async function getClientInfo(id){
    //     //fetch from db
    //     let info = await fetch(`http://localhost:9000/panel/${id}`);
    //     info = await info.json()
    //     console.log("name",id,info[0].name)
    //     return info[0]
    // }

    // $: clientInfo=getClientInfo(client)

  </script>

<div class="gradient">
<Navbar />
<div class="top-container">
    <div class="container">
        <h1>Requests Details</h1>
        {#each requests as request,index}
          <div class="request" key={index} on:mouseenter={()=>{
            setClient(request.panelId)
            }}>
            <div class="info">
                <p><strong>Manager:</strong> {request.panelId}</p>
                <p><strong>Amount:</strong> {request.total}</p>
                <p><strong>Starting Time:</strong>  {request.starting}</p>
                <p><strong>Ending Time:</strong>  {request.ending}</p>
                <p><strong>Remaining Time:</strong>  {request.time} days</p>
                <p><strong>Status:</strong>  {request.status}</p>
            </div>
            
            <!-- <div class="status">
                {#if !request.status}
                  <button class="accept" on:click={() => acceptRequest(request.id)}>Accept</button>
                  <button class="reject" on:click={() => rejectRequest(request.id)}>Reject</button>
                {:else if request.status === 'accepted'}
                  <p class="message accepted">This request has been accepted.</p>
                {:else if request.status === 'rejected'}
                  <p class="message rejected">This request has been rejected.</p>
                {/if}
            </div> -->
          </div>
        {/each}
      </div>

      <!-- <div class="container2">
        {#if clientInfo}
            <div class="card">
                <h3>Manager</h3>
                <hr>
                <h3>{clientInfo.name}</h3>
                <img class="img" src={'./pic/person.png'} alt={clientInfo.name} />
                <p>{clientInfo.pnl}</p>
            </div>
        {/if}
        </div> -->
        
</div>
</div>

  
  
  <style>
    .gradient {
	    background: linear-gradient(to bottom, #7fedec, #f0f0f0);
    }

     .card {
      margin: 10px 2px 2px 2px;
      padding: 20px;
      border: 1px solid #cfcfcf;
      border-radius: 3px;
      background-color: #cff0f3;
    }
    .card img {
      width: 30%;
      height: 30%;
      border-radius: 2px;
    }

    .top-container{
        display: flex;
    }
    .container {
      width: 70%;
      margin: 2px auto;
      padding: 20px;
      /* border: 1px solid #ecebeb; */
      /* border-radius: 3px; */
      /* background-color: #fafafa; */
    }

    .container2 {
      width: 30%;
      margin: 55px auto;
      padding: 20px;
      /* border: 1px solid #ecebeb; */
      border-radius: 3px;
    }

    .request {
      display: flex;
      max-width: 100%;
      margin: 2px 2px 2px 2px;
      padding: 20px;
      border: 1px solid #cfcfcf;
      border-radius: 3px;
      background-color: #ddf4f6;
    }

    .request:hover {
      display: flex;
      max-width: 100%;
      margin: 2px 2px 2px 2px;
      padding: 20px;
      border: 2px solid #b9b9b9;
      border-radius: 3px;
      background-color: #c6ecf0;
    }

    .info{
        width: 90%;
        /* margin: auto; */
        margin-bottom: 5px;
    }
    .status{
        align-items: center;
        margin: auto;
        width: 20%;
    }
  
    h1 {
      font-size: 24px;
      margin-bottom: 15px;
    }
  
    p {
      margin-bottom: 10px;
    }
  
    button {
      padding: 10px 20px;
      margin-right: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    button.accept {
      background-color: #4CAF50;
      color: white;
    }
  
    button.reject {
      background-color: #f44336;
      color: white;
    }
  
    .message {
      margin-top: 20px;
      font-weight: bold;
    }
  
    .accepted {
      color: #4CAF50;
    }
  
    .rejected {
      color: #f44336;
    }
  </style>
  