<script>
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Navbar from './Navbar.svelte';

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

    async function payMoney(rid,curr,paidMoney,payeeID){
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

<body class="gradient" style="height: 100vh;">
    <Navbar />
    <h1 style="font-family: 'Inter', sans-serif; text-align: left">Fund Raise</h1>
    <div class="top-container">
        <div class="card-container">
            {#each requests as request, index}
                <div class="card" key={index}>
                    <div class="f">
                        <img class="img" src={'./pic/person.png'} alt={request.username} />
                        <p><strong>Fund raiser:</strong> {request.userName}</p>
                    </div>
                    <div class="vertical-line"></div>

                    <div class="m">
                        <p><strong>Target Amount:</strong> {request.amount}</p>
                        <p><strong>Return Policy:</strong> {request.returnPolicy}</p>  
                        <p><strong>Payee Count:</strong> {request.payeeCount}</p>  
                    </div>
                    <div class="vertical-line"></div>

                    <div class="l">
                        <button on:click={()=>{ goDetail(request.id, request.userID) }} on:keypress={() => goDetail(request.id, request.userID)}>Details</button>
                    </div>
                    </div>
            {/each}
        </div>


        <div class="container2">
            {#if clientInfo.username!="none"}
                <div class="info">
                    <h3>Client: {clientInfo.username}</h3>
                    <hr>
                    <img class="img" src={'./pic/person.png'} alt={clientInfo.username} />
                    <h3>{clientInfo.name}</h3>
                    <p>Email: {clientInfo.email}</p>
                    <hr>
                    <hr>

                    <p><strong>Target Amount:</strong> {requestDetail.amount}</p>
                    <p><strong>Return Policy:</strong> {requestDetail.returnPolicy}</p>
                    <p><strong>Discription:</strong> {requestDetail.description}</p><br>
                    <p><strong>currentAmount:</strong> {requestDetail.currentAmount}</p>
                    
                    <div class="box">
                        <div class="box box-a"></div>
                    </div>
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" min=0 max={requestDetail.amount-requestDetail.currentAmount} bind:value={paidMoney} />
                    <button class="btn" on:click={()=>{payMoney(requestDetail._id,requestDetail.currentAmount,paidMoney,userID)}}>Pay</button>
                </div>   
                {/if}  
        </div>
        
    
    </div>
</body>



<style>
    main {
		border: 0px;
		text-align: center;
		padding: 1em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

    .gradient {
	background: linear-gradient(to bottom, #7fedec, #f0f0f0);
    }

    /* .top-container{
        display: flex;
        justify-items: center;
    } */

    .card-container {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
    height: auto;
    }

    .card {
        display: inline-flex;
        justify-items: center;
        align-items: center;
        border: 2px solid black;
        border-radius: 10px;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
        background-color: #f0f0f0;
        padding: 16px;
        margin: 20px;
        width: 100%;
        height: 100%;
        max-width: 500px;
        max-height: 300px;
        cursor: pointer; /* Add a pointer cursor for indicating clickability */
        transition: transform 0.1s ease-in-out; /* Add a smooth transition effect */
    }
    .f{
        width: auto;
        min-width: 20%;
        max-width: 30%;
    }

    .m{
        width: auto;
        min-width: 30%;
        max-width: 40%;
    }

    .l{
        margin: 0 auto;
        width: auto;
        min-width: 20%;
        max-width: 30%;
    }
    .vertical-line {
        margin-right: 10px;
        margin-left: 10px;
        width: 1px; /* Adjust width as needed */
        height: 100px; /* Adjust height as needed */
        background-color: black; /* Adjust color as needed */
}


    .card:hover {
    transform: scale(1.05); /* Add a scaling effect on hover */
    }

    .card img {
      width: 30%;
      height: 30%;
      border-radius: 2px;
    }

    .info{
        width: 90%;
        /* margin: auto; */
        margin-bottom: 5px;
    }

    .info img {
      width: 30%;
      height: 30%;
      border-radius: 2px;
    }

    .positive {
        color: green;
    }

    .btn:hover{
        background-color: rgb(252, 218, 177);
        transform: scale(1.01);
    }

    .btn{
        background-color: blanchedalmond;
    }

    .negative {
        color: red;
    }

    .box {
        width: 300px;
        height: 20px; /* Adjust height as needed */
        background-color: #f0f0f0; /* Adjust background color as needed */
        border: 2px solid #000; /* Adjust border width and color as needed */
        border-radius: 2px; /* Adjust border radius for rounded corners */
        position: absolute;
    }

    .box-a{
        width: 25%;
        width: 300px;
        height: 20px; /* Adjust height as needed */
        background-color: #f0f0f0; /* Adjust background color as needed */
        border: 2px solid #000; /* Adjust border width and color as needed */
        border-radius: 2px; /* Adjust border radius for rounded corners */
        position: absolute;
        background-color: aquamarine;
    }

</style>