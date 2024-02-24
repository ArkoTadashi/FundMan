<script>
    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';

    let requests=[]
    let clientInfo={username:"none"}
    let panelId=sessionStorage.getItem('panelID')

    function getRemainingTime(s,e){
      // end-curr--fix
      let days=0
      let hours=0
      let minutes=0
      let seconds=0

      let curr=parseInt(Date.now()/1000)
      let resultInSeconds=e-curr
      if(resultInSeconds>0){
        days = Math.floor(resultInSeconds / (60*60*24));
        let remainingSeconds = resultInSeconds % (60*60*24);
        hours = Math.floor(remainingSeconds / 3600);
        minutes = Math.floor((remainingSeconds % 3600) / 60);
        seconds = remainingSeconds % 60;
        seconds=seconds.toFixed(2)
      }

      let time={
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
      } 
      return time
    }

    function getStatus(t){
        if (t.days>0 || t.hours>0 ||t.minutes>0 || t.seconds>0)
            return "On going"
        else
            return "Finished"
    }

    function getTime(t){
        return new Date((t)*1000).toLocaleString()
    }

    onMount(async () => {
        const response = await fetch(`http://localhost:9000/management/${panelId}`);
        const jsonData = await response.json();
        let data = jsonData;

        requests = await Promise.all(data.funds.map(async fund => ({
            user: await getclientInfo(fund.userID),
            userID: fund.userID,
            total: fund.total,
            starting: getTime(fund.starting),
            ending: getTime(fund.ending),
            time:getRemainingTime(fund.starting,fund.ending),
            status:getStatus(getRemainingTime(fund.starting,fund.ending))
        })));
    });

    function sendMoney(id) {
      // money send korte hobe
      requests = requests.map(request =>
        request.userID === id ? { ...request, status: 'Sent' } : request
      );
    }

    async function getclientInfo(id){
        //fetch from db
        let info = await fetch(`http://localhost:9000/user/${id}`);
        info = await info.json()
        info={...info,name:info.name.toUpperCase()}
        // console.log("name---------",info)
        return info
    }

    function setClient(user){
      clientInfo=user
    }

  </script>


<div class="top-container">
    <div class="container">
        <h1>Requests Details</h1>
        {#each requests as request,index}
          <div class="request" key={index} on:mouseenter={()=>{
            setClient(request.user)
            }}>
            <div class="info">
                <p><strong>Client:</strong> {request.user.username}</p>
                <p><strong>Amount:</strong> {request.total}</p>
                <p><strong>Starting Time:</strong>  {request.starting}</p>
                <p><strong>Ending Time:</strong>  {request.ending}</p>
                <p><strong>Remaining Time:</strong>  {request.time.days} days, {request.time.hours}:{request.time.minutes}:{request.time.seconds}</p>
                <p><strong>Status:</strong>  {request.status}</p>
            </div>
            
            <div class="status">
                {#if request.status === 'Finished'}
                    <button class="send" on:click={() => sendMoney(request.userID)}>Send</button>
                {:else if request.status==='On going' }
                    <button class="bsend" >Send</button>
                {:else if request.status === 'Sent'}
                  <p class="message send">Money has been sent to client.</p>
                {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="container2">
        {#if clientInfo.username!="none"}
            <div class="card">
                <h3>Client: {clientInfo.username}</h3>
                <hr>
                <img class="img" src={'./pic/person.png'} alt={clientInfo.username} />
                <h3>{clientInfo.name}</h3>
                <p>Email: {clientInfo.email}</p>
            </div>
        {/if}
        </div>
        
</div>

  
  
  <style>
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
  
    button.send {
      background-color: #00b799;
      color: white;
    }
  
    button.send:hover{
      border: 2px solid #192019;
      background-color: #00d1ae;
      color: white;
    }

    button.bsend {
      background-color: #2c482c;
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
  
    .send {
      color: #4CAF50;
    }
  
    .bsend {
      color: #377038;
    }
  
    .rejected {
      color: #f44336;
    }
  </style>
  