<script>
    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';

    let requests=[]
    let managerInfo={username:"none"}
    let userId=sessionStorage.getItem('userID')

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

      let time={
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
      } 
      return time
    }

    function getStatus(t){ //upd
        if (t.days>0 || t.hours>0 ||t.minutes>0 || t.seconds>0)
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
          panel: await getManagerInfo(fund.panelID),
          panelId: fund.panelID,
          total: fund.total,
          starting: getTime(fund.starting),
          ending: getTime(fund.ending),
          time:getRemainingTime(fund.starting,fund.ending),
          status:getStatus(getRemainingTime(fund.starting,fund.ending))
        })));
    });

    

    async function getManagerInfo(id){
        //fetch from db
        let info = await fetch(`http://localhost:9000/panel/id/${id}`);
        info = await info.json()
        info={...info,name:info.name.toUpperCase()}
        // console.log("name---------",info)
        return info
    }

    function setManager(p){
      managerInfo=p
    }


  </script>

<div class="gradient">
<Navbar />
<div class="top-container">
    <div class="container">
        <h1>Requests Details</h1>
        {#each requests as request,index}
          <div class="request" key={index} on:mouseenter={()=>{
            setManager(request.panel)
            }}>
            <div class="info">
                <p><strong>Manager:</strong> {request.panel.name}</p>
                <p><strong>Amount:</strong> {request.total}</p>
                <p><strong>Starting Time:</strong>  {request.starting}</p>
                <p><strong>Ending Time:</strong>  {request.ending}</p>
                <p><strong>Remaining Time:</strong>  {request.time.days} days, {request.time.hours}:{request.time.minutes}:{request.time.seconds}</p>
                <p><strong>Status:</strong>  {request.status}</p>
            </div>
          </div>
        {/each}
      </div>

      <div class="container2">
        {#if managerInfo.username!="none"}
            <div class="card">
                <h3>Panel Member: {managerInfo.username}</h3>
                <hr>
                <img class="img" src={'./pic/person.png'} alt={managerInfo.name} />
                <h3>{managerInfo.name}</h3>
                <p>Rating: {managerInfo.rating}</p>
                <p>Manage Count: {managerInfo.manageCount}</p>
            </div>
        {/if}
        </div>
        
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
  