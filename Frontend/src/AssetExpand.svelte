<script>

    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';
    import PieChart from './PieChart.svelte';

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

    let name = '';
    let coins = [
        
    ];

    let hardCoins = [
        { name: 'Bitcoin', usd: 5 },
        { name: 'Ethereum', usd: 8 },
        { name: 'Litecoin', usd: 3 }
    ];

    let userID = sessionStorage.getItem('userID');
    let assetGroupIndex = sessionStorage.getItem('assetGroupIndex');

    
    async function fetchCoinData(address, decimal) {
        try {
            const wallet = sessionStorage.getItem('walletAddress');
            const bal = await ethereum.request({
                method: 'eth_call',
                params: [{
                    to: address,
                    data: "0x70a08231" + "000000000000000000000000" + wallet.substring(2),
                },
                'latest']
            });

            const value = parseInt(bal, 16) / (10 ** decimal);
            return value;
        } catch (error) {
            console.error("Error fetching coin data:", error);
            return 0;
        }
    }



    onMount(async () => {
        try {
            const response = await fetch(`http://localhost:9000/holding/${userID}/group/${assetGroupIndex}`);
            const jsonData = await response.json();
            let data = jsonData;
            name = data.groupName;

            coins = await Promise.all(data.tokens.map(async (coin) => {
                const response = await fetch(`http://localhost:9000/token/${coin}`);
                const jsonData = await response.json();
                let dat = jsonData;

                let tokenAddress = dat.address;
                let decimal = dat.decimal;
                let logo = dat.logo;

                let holdingValue = await fetchCoinData(tokenAddress, decimal);

                let currentPrice=await fetch(`http://localhost:9000/market/${coin}`)
                currentPrice = await currentPrice.json();
                console.log(currentPrice.currentPrice);


                return {
                    name : dat.name,
                    code : coin.toUpperCase(),
                    amount : parseFloat(holdingValue).toFixed(7),
                    usd : parseFloat((holdingValue*currentPrice.currentPrice).toFixed(7)),
                    change : 0.5,
                    logo: logo
                };
            }));
        } catch (error) {
            console.error("Error fetching token data:", error);
        }

    });

    
</script>

<div class="gradient" style="min-height: 100vh;">

    <Navbar/>
    <h1 style="font-family: 'Inter', sans-serif; text-align: left; margin-left: 2%;">{name}</h1>
    <div class="container">
        <div class="card-container">
            {#each coins as coin }
              <div class="card" style="background-image: url({coin.logo}); background-size: 30%; background-position: bottom right; background-repeat: no-repeat;">
                <div class="card_text_container">
                    <h2>{coin.name} - {coin.code}</h2>
                    <p style="text-align: right;"><span style="text-align: right;" class="{coin.change >= 0 ? 'positive' : 'negative'}">{coin.change}%</span></p>
                </div>
                <p style="font-size: larger; font-weight:500">{coin.amount} {coin.code} </p>
                <p>{coin.usd} USD</p>
              </div>
            {/each}
        </div>
        <div class="chart-container">
            {#if coins.length > 0}
            <PieChart {coins} />
            {:else}
            <p>Loading...</p>
            {/if}
        </div>
    </div>

</div>
    
<style>

    .gradient {
	background: linear-gradient(to bottom, #7fedec, #f0f0f0);
    }

    .container{
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .chart-container {
        width: 40%;
        align-self: right;
        align-items: center;
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

    .card_text_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    }

    h2 {
        margin: 0; /* Remove default margin */
    }
</style>