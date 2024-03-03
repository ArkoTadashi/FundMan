<!-- this page is from user side, user can make request to raise fund, it will go to admin approval
 work ongouing -->

  

 <script>
    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';
    import { push } from 'svelte-spa-router';
  import { bubble } from 'svelte/internal';
  
    let amount = 0;
    let returnPolicy
    let description
    let submitStatus=""
    
    let userID=sessionStorage.getItem('userID')
    let userName=sessionStorage.getItem('userName')

    let data=[]
    let requests=[]
    let payments=[]

    async function getRequest(){
      let response = await fetch(`http://localhost:9000/fundraiserequest/${userID}`);
        let jsonData = await response.json();
        data = jsonData;

        console.log(data)
        requests = data.map(request => ({   //only on going requests
            id:request._id,
            userName:request.userName,
            userID:request.userID,
            requestID:request.requestID,
            amount:request.amount,
            returnPolicy:request.returnPolicy,
            description:request.description,
            status:request.status,
            currentAmount:request.currentAmount,
            payeeCount:request.payee.length,
            payee:request.payee
            }));

        response = await fetch(`http://localhost:9000/fundraisepayee/${userID}`);
        jsonData = await response.json();
        payments = jsonData.payments
        console.log(payments);
            
    }

    onMount(async () => {
       await getRequest();
    });

async function updateStatusForAllPayees(json) {
    try {
        for (const payee of json.payee) {
            const data = { "status": "money returned" };
            const response = await fetch(`http://localhost:9000/fundraisepayee/updatestatus/${payee.payeeID}/${json.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            });

            if (!response.ok) {
            throw new Error('Failed to update status for payee ' + payee.payeeID);
            }
        }
        console.log('Status updated for all payees successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}


    async function returnMoney(request){
        let data={
            "status":"money returned"
        }
        let response = await fetch(`http://localhost:9000/fundraiserequest/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      response=await response.json()
      console.log(response)

      updateStatusForAllPayees(request)
    }

    
    // <div class="card" key={index} on:click={() => {goToNext(requestsMember.username,requestsMember.id)}} on:keypress={() => {goToNext(requestsMember.username,requestsMember.id)}}>
  
  </script>
  
  <Navbar />
  <div class="page">
    <div class="top">
      <div class="container">
        <h1>My Fund Raise Requests Details</h1>
        <div class="request-details">
          {#each requests as request, index}
          <div class="request" key={request.id}>
            <div class="info">
              <p><strong>Request No:</strong> {request.requestID}</p>
              <p><strong>Target Amount:</strong> {request.amount}</p>
              <p><strong>Return Policy:</strong> {request.returnPolicy}</p>
              <p class="message other"><strong>Status:</strong> {request.status}</p>
              <p><strong>current Amount:</strong> {request.currentAmount}</p>
                <p><strong>Payee Count:</strong> {request.payeeCount}</p>
                {#each request.payee as rp}
                    <p>Payee: {rp.payeeID} Amount {rp.amount}</p>
                {/each}

                {#if parseFloat(request.amount)===parseFloat(request.currentAmount) && request.status==="accepted"}
                <button on:click={()=>{
                    returnMoney(request)
                }}>Return Money</button>
                {/if}
            </div>
          </div>
          {/each}
        </div>
      </div>

      <div class="container2">
        <!--my payment-->
        <h1>My Donation Details</h1>
        <div class="request-details">
        {#each payments as pay, index}
            <div class="request" key={index}>
              <div class="info">
                <p><strong>Request No:</strong> {pay.requestID}</p>
                <p><strong>Paid Amount:</strong> {pay.amount}</p>
                <p><strong>Status:</strong> {pay.status}</p>
              </div>
            </div>
          {/each}
          <!-- <p>{payments[0].requestID}</p> -->
          
        </div>
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