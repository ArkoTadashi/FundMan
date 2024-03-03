<script>
  import { onMount } from "svelte";

    let clientInfo={username:"none"}
    let data=[]
    let requests=[]

    async function getRequest(){
      const response = await fetch(`http://localhost:9000/fundraiserequest`);
        const jsonData = await response.json();
        data = jsonData;

        console.log(data)
        requests = await Promise.all(data.map(async request => ({
            id:request._id,
            userName:request.userName,
            userID:request.userID,
            requestID:request.requestID,
            amount:request.amount,
            returnPolicy:request.returnPolicy,
            description:request.description,
            status:request.status
            })));
    }

    onMount(async () => {
       await getRequest();
    });

    async function cngRequest(id,data){
      let response = await fetch(`http://localhost:9000/fundraiserequest/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      response=await response.json()
      console.log(response)
      return response
    }

    async function acceptRequest(id) {
      //send to db
      let data = {
              "status":"accepted"
            }
      let response= await cngRequest(id,data)
      
      if(response.success=="patched"){
        requests = requests.map(request =>
          request.id === id ? { ...request, status: 'accepted' } : request
        );
      }
    }
  
    async function rejectRequest(id) {
      //send db
      data = {
              "status":"rejected"
            }
      let response= await cngRequest(id,data)

      if(response.success=="patched"){
        requests = requests.map(request =>
          request.id === id ? { ...request, status: 'rejected' } : request
        );
      }
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

  </script>

<div class="top-container">
    <div class="container">
        <h1>Requests Details</h1>
        {#each requests as request}
          <div class="request" key={request.id} on:mouseenter={()=>{
            setClient(request.userID)
            }}>
            <div class="info">
                <p><strong>Client:</strong> {request.userName}</p>
                <p><strong>Request No:</strong> {request.requestID}</p>
                <p><strong>Target Amount:</strong> {request.amount}</p>
                <p><strong>Return Policy:</strong> {request.returnPolicy}</p>
            </div>
            
            <div class="status">
                {#if request.status==="pending"}
                  <button class="accept" on:click={() => acceptRequest(request.id)}>Accept</button>
                  <button class="reject" on:click={() => rejectRequest(request.id)}>Reject</button>
                {:else if request.status === 'accepted'}
                  <p class="message accepted">This request has been accepted.</p>
                {:else if request.status === 'rejected'}
                  <p class="message rejected">This request has been rejected.</p>
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
  