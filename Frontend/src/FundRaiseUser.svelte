<script>
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Navbar from './Navbar.svelte';

    let data = [];
    let panel = [];
    
    onMount(async () => {
        const response = await fetch('http://localhost:9000/panel');
        const jsonData = await response.json();
        data = jsonData;

        console.log(data)
        panel = data.map(panelMember => ({
            id:panelMember._id.toString(),
            username: panelMember.username,
            name: panelMember.name,
            rating: panelMember.rating,
            pnl: panelMember.pnl,
            manageCount:panelMember.manageCount
        }));
    });

    let money=0
    let pMember=''
    function giveMoney(m,n){
        money=m
        pMember=n
    }
    
</script>

<body class="gradient" style="height: 100vh;">
    <main>
        <Navbar />
        <h1 style="font-family: 'Inter', sans-serif; text-align: left">Fund Raise</h1>
        <div class="card-container">
            {#each panel as panelMember, index}
                <div class="card" key={index}>
                    <img class="img" src='./pic/person.png' alt={panelMember.name} />
                    <h2>{panelMember.name.toUpperCase()}</h2>
                    <h4>Rating: {panelMember.rating}</h4>
                    <h4>PnL: {panelMember.pnl}</h4>
                    <h4>Target Amount $100</h4>
                    <br>
                    <button on:click={() => {giveMoney(100,panelMember.name)}} on:keypress={() => {giveMoney(100,panelMember.name)}} class="btn"> Give </button>
                </div>
            {/each}

            {#if money>0}
            <div>
                <h3>${money} is given to ${pMember}</h3>
            </div>
            {/if}
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