<!-- this page is from user side, user can make request to raise fund, it will go to admin approval
 work ongouing -->

  

  <script>
    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';
    import { push } from 'svelte-spa-router';
  
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
  
  <Navbar />
  <div class="page">
    <div class="top">
      <div class="container">
        <h1>Requests Details</h1>
        <div class="request-details">
          {#each requests as request, index}
          <div class="request" key={request.id}>
            <div class="info">
              <p><strong>Request No:</strong> {request.requestID}</p>
              <p><strong>Target Amount:</strong> {request.amount}</p>
              <p><strong>Return Policy:</strong> {request.returnPolicy}</p>
              {#if request.status === 'accepted'}
              <p class="message accepted">This request has been accepted.</p>
              {:else if request.status === 'rejected'}
              <p class="message rejected">This request has been rejected.</p>
              {:else}
              <p class="message other"><strong>Status:</strong> {request.status}</p>
              {/if}
            </div>
          </div>
          {/each}
        </div>
      </div>

      <div class="container2">
        <form on:submit|preventDefault={submitRequest}>
          <label ><h3><strong>Make New Request</strong></h3></label>
          <label>
            Amount:
            <input type="number" min=0 bind:value={amount} required />
          </label>
          <label>
            Return Policy:
            <input type="text" bind:value={returnPolicy} required />
          </label>
          <label>
            Description:
            <textarea bind:value={description} required></textarea>
          </label>
          <button type="submit">Submit Request</button>
          {#if submitStatus==="success"}
          <p class="accepted">Submission successful</p>
          {:else if submitStatus==="fail"}
          <p class="rejected">Submission failed</p>
          {/if}
        </form>
      </div>
    </div>
  </div>
  
  <style>
    .card-container {
    display: flex;
    flex-wrap: wrap;
    width: 60%;
    }

    .card {
        border: 2px solid black;
        border-radius: 10px;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
        background-color: #f0f0f0;
        padding: 16px;
        margin: 20px;
        width: 100%;
        max-width: 300px;
        cursor: pointer; /* Add a pointer cursor for indicating clickability */
        transition: transform 0.1s ease-in-out; /* Add a smooth transition effect */
    }

    .card:hover {
    transform: scale(1.05); /* Add a scaling effect on hover */
    }

    .card img {
      width: 30%;
      height: 30%;
      border-radius: 2px;
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
  
    .top{
        display: flex;
    }
  
    .assign{
      align-content: center;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 10px;
      margin-top: 2px;
      margin-left: auto;
      margin-right: auto;
      max-width: 45%;
      background-color: antiquewhite;
    }
  
    .details{
      align-content: center;
      height: auto;
      max-width: 45%;
      margin-left: auto;
      margin-right: auto;
    }
    .requests-details{
        background-color: rgb(212, 238, 248);
    }
    .button{
        display: flex;
        margin-top: 10px;
    }
  
    #p{
        margin-left: auto;
        margin-right: auto;
    }
  
    #s{
        margin-left: auto;
        margin-right: auto;
    }
  
    .preview{
        display: inline;
        margin: auto;
        margin-top: 5px;
    }
    .submit-info{
        display: flex;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin-top: 2px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px;
        width: 95%;
        background-color: rgb(255, 252, 249);
    }

    
    /* Basic form styling */
    form {
      margin: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
  
    label {
      display: block;
      margin-bottom: 10px;
    }
  
    input[type="number"],
    input[type="text"],
    textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }
  
    button[type="submit"] {
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    button[type="submit"]:hover {
      background-color: #0056b3;
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
    .other{
      color:#0056b3;
    }
  </style>