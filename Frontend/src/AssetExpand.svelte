<script>

    import { onMount } from 'svelte';

    let data = [];
    let name = '';
    let coins = [];
    let walletAddress = "";
    let contractAddress = "";

    async function getCoinsData(data) {
        const coinsPromises = data.map(async (element) => ({
            name: element.token,
            code: element.token,
            amount: await fetchCoinData(element.address, element.decimal),
            usd: 10000,
            change: 20,
        }));

        // Wait for all promises to resolve
        const coins = await Promise.all(coinsPromises);
        return coins;
    }

    async function fetchCoinData(address, decimal) {
        try {
            const wallet = await getWalletAddress();
            const balance = await ethereum.request({
                method: 'eth_getBalance',
                params: [wallet, 'latest'],
            });

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
            return 0; // Return default value in case of error
        }
    }

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
        try {
            const response = await fetch('http://localhost:9000/token');
            const jsonData = await response.json();
            data = jsonData;

            coins = await getCoinsData(data);
        } catch (error) {
            console.error("Error fetching token data:", error);
        }
    });

    // let name = 'HODL';
    // let coins = [
    //     {name: "Bitcoin", code: "BTC", amount: 0.8531, usd: 29471.02,change:0.41, id: 1},
    //     {name: "Ethereum", code: "ETH", amount: 3.28353, usd: 5965.91,change:-1.21, id: 2},
    // ];
</script>

<body class="gradient" style="height: 100vh;">
    <main>
        <h1 style="font-family: 'Inter', sans-serif; text-align: left">{name}</h1>
        <div class="card-container">
            {#each coins as coin }
              <div class="card">
                <div class="card_text_container">
                    <h2>{coin.name} - {coin.code}</h2>
                    <p style="text-align: right;"><span style="text-align: right;" class="{coin.change >= 0 ? 'positive' : 'negative'}">{coin.change}%</span></p>
                </div>
                <p style="font-size: larger; font-weight:500">{coin.amount} {coin.code} </p>
                <p>{coin.usd} USD</p>
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