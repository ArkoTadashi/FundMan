<script>
    import { onMount } from 'svelte';
    import Navbar from './User/Navbar.svelte';

    let requests=[]
    let managerInfo={username:"none"}
    let userId=sessionStorage.getItem('userID')

    function getRemainingTime(s,y){
      // end-curr--fix
      let curr=parseInt(Date.now()/1000)
      let resultInSeconds=s+(y*365*24*60*60)
      resultInSeconds=resultInSeconds-curr
      let years = Math.floor(resultInSeconds/(365*24*60*60))
      let remainingSeconds = resultInSeconds % (365*24*60*60);
      let days = Math.floor(remainingSeconds / (60*60*24));
      remainingSeconds = remainingSeconds % (60*60*24);
      let hours = Math.floor(remainingSeconds / 3600);
      let minutes = Math.floor((remainingSeconds % 3600) / 60);
      let seconds = remainingSeconds % 60;
      seconds=seconds.toFixed(2)

      let time={
        "years":years,
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
      } 
      console.log(time)
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
          time:getRemainingTime(fund.starting,fund.year),
          status:getStatus(getRemainingTime(fund.starting,fund.year)),
          year: fund.year
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

    <!--online-->

    <div class="container">
        <h1>Request details</h1>
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
                <tr class="request" key={index} on:mouseenter={()=>{
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
      </div>

    
</div>
</div>
  
  
  <style>
    .gradient {
	background: linear-gradient(to bottom, #7fedec, #f0f0f0);
    }
    
    table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }

    tbody tr:hover{
        cursor: pointer;
        background-color: white;
        border: 2px solid black;
    }
  </style>
  