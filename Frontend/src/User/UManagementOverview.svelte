<script>
    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';

    let requests=[]
    let managerInfo={username:"none"}
    let userId=sessionStorage.getItem('userID')

    function getRemainingTime(s, y) {
        let curr = Math.floor(Date.now() / 1000);
        let resultInSeconds = s + (y * 365 * 24 * 60 * 60);
        let remainingSeconds = resultInSeconds - curr;

        if (remainingSeconds < 0) {
            remainingSeconds = 0;
        }

        let years = Math.floor(remainingSeconds / (365 * 24 * 60 * 60));
        remainingSeconds %= (365 * 24 * 60 * 60);
        let days = Math.floor(remainingSeconds / (60 * 60 * 24));
        remainingSeconds %= (60 * 60 * 24);
        let hours = Math.floor(remainingSeconds / 3600);
        let minutes = Math.floor((remainingSeconds % 3600) / 60);
        let seconds = remainingSeconds % 60;
        seconds = seconds.toFixed(2);

        let time = {
            "years": years,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
        return time;
    }

    function getStatus(t) {
        if (t.years > 0 || t.days > 0 || t.hours > 0 || t.minutes > 0 || t.seconds > 0)
            return "On going";
        else
            return "Finished";
    }

    function getTime(t){
        return new Date((t)*1000).toLocaleString()
    }

    onMount(async () => {
        try {
            const response = await fetch(`http://localhost:9000/umanagement/${userId}`);
            const jsonData = await response.json();
            let data = jsonData;

            requests = await Promise.all(data.funds.map(async fund => ({
                panel: await getManagerInfo(fund.panelID),
                panelId: fund.panelID,
                total: fund.total,
                starting: getTime(fund.starting),
                ending: getTime(fund.ending),
                time: getRemainingTime(fund.starting, fund.year),
                status: getStatus(getRemainingTime(fund.starting, fund.year)),
                year: fund.year
            })));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    

    async function getManagerInfo(id) {
        try {
            let info = await fetch(`http://localhost:9000/panel/id/${id}`);
            info = await info.json();
            info = { ...info, name: info.name.toUpperCase() };
            return info;
        } catch (error) {
            console.error("Error fetching manager info:", error);
            return { username: "none" }; // or handle the error accordingly
        }
    }

    function setManager(p){
      managerInfo=p
    }

    let activeButton="card"

  </script>

<div class="gradient">
<Navbar />

<div style="display: flex; justify-content: center;">
  <button class="dataButton" style="{activeButton === 'card' ? 'background-color: white;' : ''}" on:click={()=>{activeButton="card"}}>Card</button>
  <button class="dataButton" style="{activeButton === 'tabular' ? 'background-color: white;' : ''}" on:click={()=>{activeButton="tabular"}}>Tabular</button>
</div>

<div class="top-container">
  <div class="container">
    <h1>Requests Details</h1>
    {#if activeButton==="card"}
        {#each requests as request ,index}
            <div class="request" on:mouseenter={()=>{
                setManager(request.panel)
            }}>
                <div class="info">
                    <p><strong>Manager:</strong> {request.panel.name}</p>
                    <p><strong>Amount:</strong> {request.total}</p>
                    <p><strong>Starting Time:</strong>  {request.starting}</p>
                    <p><strong>Ending Time:</strong>  {request.ending}</p>
                    <p><strong>Remaining Time:</strong> {#if request.time.years > 0} {request.time.years} years,{/if} {request.time.days} days, {request.time.hours}:{request.time.minutes}:{request.time.seconds}</p>
                    <p><strong>Status:</strong>  {request.status}</p>
                </div>
            </div>
        {/each}
        {:else if activeButton==="tabular"}
        <table>
            <thead>
                <tr>
                    <th>Manager</th>
                    <th>Amount</th>
                    <th>Year</th>
                    <th>Starting Time</th>
                    <th>Ending Time</th>
                    <th>Remaining Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {#each requests as request,index}
                    <tr on:mouseenter={()=>{
                        setManager(request.panel)
                    }}>
                        <td>{request.panel.name}</td>
                        <td>{request.total}</td>
                        <td>{request.year}</td>
                        <td>{request.starting}</td>
                        <td>{request.ending}</td>
                        <td>{request.time.years} years, {request.time.days} days, {request.time.hours}:{request.time.minutes}:{request.time.seconds}</td>
                        <td>{request.status}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
      {/if}
    </div>
    
<div class="container2">
  {#if managerInfo.username !== "none"}
      <div class="card">
          <h3>Panel Member: {managerInfo.username}</h3>
          <hr>
          <img class="img" src="./pic/person.png" alt={managerInfo.name} />
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
      height: auto;
      min-height: 1080px;
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
      /* border: 1px solid #ecebeb;
      border-radius: 3px;
      background-color: #fafafa; */
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

    .dataButton{
        background-color: transparent;
        border: 2px solid black;
        border-radius: 2px;
        transition-duration: 0.2s;
        cursor: pointer;
        margin: 5px;
        width: 12%;
    }

    .dataButton:hover{
        background-color: white;
        color: black;
    }

    table {
    width: 100%;
    display: block;
    border-collapse: collapse;
    margin-top: 20px;
    }

    th, td, tr {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    

    th {
        background-color: #f2f2f2;
    }

    tbody tr:hover{
        cursor: pointer;
        background-color: rgb(222, 249, 255);
        border: 2px solid black;
    }
  </style>
  