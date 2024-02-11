<script>

    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';
    let isLoggedIn=false, userID=0;

    userID = sessionStorage.getItem('userID');
    isLoggedIn = sessionStorage.getItem('isLoggedIn');

    console.log(userID);

    let data = [];
    let assets = [];
    
    onMount(async () => {
        const response = await fetch('http://localhost:9000/holding/1');
        const jsonData = await response.json();
        data = jsonData;

        assets = data.assets.map(asset => ({
            name: asset.groupName,
            total: 1000,
            change: 20
        }));
    });

    function expandAsset(){
        console.log('card pressed');
    }
    
</script>


<div class="gradient" style="height: 100vh;">
    <Navbar isLoggedIn={isLoggedIn} userID={userID}/>
    <main>
        <h1 style="font-family: 'Inter', sans-serif; text-align: left">My Assets</h1>
        <div class="card-container">
            {#each assets as asset, index}
                <div class="card" key={index} on:click={expandAsset} on:keypress={expandAsset}>
                    <h2>{asset.name}</h2>
                    <p>${asset.total} (<span class="{asset.change >= 0 ? 'positive' : 'negative'}">{asset.change}</span>)</p>
                </div>
            {/each}

          </div>
    </main>
</div>

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

    .positive {
        color: green;
    }

    .negative {
        color: red;
    }
</style>