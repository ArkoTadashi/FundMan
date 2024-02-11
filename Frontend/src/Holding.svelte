<script>
    import { push } from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';
    let isLoggedIn=false, userID=0, userName='';

    userID = sessionStorage.getItem('userID');
    isLoggedIn = sessionStorage.getItem('isLoggedIn');
    userName = sessionStorage.getItem('userName');

    console.log(userID);

    let data = [];
    let assets = [];

    async function getWalletAddress() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const accs = await ethereum.request({ method: 'eth_requestAccounts' });
                return accs[0];
            }
        } catch (error) {
            console.error("Error fetching wallet address:", error);
            return ''; // Return empty string in case of error
        }
    }
    
    onMount(async () => {
        const response = await fetch(`http://localhost:9000/holding/${userID}`);
        const jsonData = await response.json();
        data = jsonData;

        let walletAddress = await getWalletAddress();
        sessionStorage.setItem('walletAddress', walletAddress);

        assets = data.assets.map(asset => ({
            name: asset.groupName,
            // total: 1000,
            // change: 20,
            tokens: asset.tokens
        }));


        
    });

    // let data = [];
    // let name = '';
    // let coins = [];
    // let walletAddress = "";
    // let contractAddress = "";

    // async function getCoinsData(data) {
    //     const coinsPromises = data.map(async (element) => ({
    //         name: element.token,
    //         code: element.token,
    //         amount: await fetchCoinData(element.address, element.decimal),
    //         usd: 10000,
    //         change: 20,
    //     }));

    //     // Wait for all promises to resolve
    //     const coins = await Promise.all(coinsPromises);
    //     return coins;
    // }

    // async function fetchCoinData(address, decimal) {
    //     try {
    //         const wallet = await getWalletAddress();
    //         const balance = await ethereum.request({
    //             method: 'eth_getBalance',
    //             params: [wallet, 'latest'],
    //         });

    //         const bal = await ethereum.request({
    //             method: 'eth_call',
    //             params: [{
    //                 to: address,
    //                 data: "0x70a08231" + "000000000000000000000000" + wallet.substring(2),
    //             },
    //             'latest']
    //         });

    //         const value = parseInt(bal, 16) / (10 ** decimal);
    //         return value;
    //     } catch (error) {
    //         console.error("Error fetching coin data:", error);
    //         return 0; // Return default value in case of error
    //     }
    // }

    // async function getWalletAddress() {
    //     try {
    //         if (typeof window.ethereum !== 'undefined') {
    //             const accs = await ethereum.request({ method: 'eth_requestAccounts' });
    //             return accs[0];
    //         }
    //     } catch (error) {
    //         console.error("Error fetching wallet address:", error);
    //         return ''; // Return empty string in case of error
    //     }
    // }

    // onMount(async () => {
    //     try {
    //         const response = await fetch('http://localhost:9000/token');
    //         const jsonData = await response.json();
    //         data = jsonData;

    //         coins = await getCoinsData(data);
    //     } catch (error) {
    //         console.error("Error fetching token data:", error);
    //     }
    // });

    function expandAsset(index){
        sessionStorage.setItem('assetGroupIndex', index);
        push('/AssetExpand');
    }
    
</script>


<div class="gradient" style="min-height: 100vh;">
    <Navbar />

        <h1 style="font-family: 'Inter', sans-serif; text-align: left; margin-left: 2%">My Assets</h1>
        <div class="card-container">
            {#each assets as asset, index}
                <div class="card" key={index} on:click={() => expandAsset(index)} on:keypress={() => expandAsset(index)}>
                    <h2>{asset.name}</h2>
                    <!-- <p>${asset.total} (<span class="{asset.change >= 0 ? 'positive' : 'negative'}">{asset.change}</span>)</p> -->
                </div>
            {/each}

          </div>

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