<script>
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Navbar from './Navbar.svelte';

    let data = [];
    let requests = [];
    
    onMount(async () => {
        let requestID=sessionStorage.getItem('fundraiserequestId')
        const response = await fetch(`http://localhost:9000/fundraiserequest/donar/${requestID}`);
        const jsonData = await response.json();
        data = jsonData;

        //may be map lage na
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
    });

    let money=0
    let pMember=''
    // function goDetail(id){
    //     // sessionStorage
    //     // push(/fundraiseruserdetails);
    // }
    
</script>

<body class="gradient" style="height: 100vh;">
    <main>
        <Navbar />
        <h1 style="font-family: 'Inter', sans-serif; text-align: left">Fund Raise</h1>
        <div class="card-container">
            {#each requests as request, index}
                <div class="card" key={index} on:click={()=>{ goDetail(request.requestID) }} on:keypress={() => goDetail(index)}>
                    <p><strong>Fund raiser:</strong> {request.userName}</p>
                    <p><strong>Target Amount:</strong> {request.amount}</p>
                    <p><strong>Return Policy:</strong> {request.returnPolicy}</p>  
                      <!-- <p>count lagbe<p/> -->
                    </div>
            {/each}
          </div>
    </main>
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

    .card-container {
    display: flex;
    flex-wrap: wrap;
    width: 60%;
    height: auto;
    }

    .card {
        border: 2px solid black;
        border-radius: 10px;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
        background-color: #f0f0f0;
        padding: 16px;
        margin: 20px;
        width: 100%;
        height: 100%;
        max-width: 300px;
        max-height: 500px;
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
</style>