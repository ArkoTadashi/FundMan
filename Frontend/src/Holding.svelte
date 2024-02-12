<script>
    import { push } from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';
    import LineChart from './LineChart.svelte';
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

    let pastMonthData = [
        { dataPoint: 'January 13', usd: 1847.0679792102258 },
        { dataPoint: 'January 14', usd: 1836.9849017833858 },
        { dataPoint: 'January 15', usd: 2110.195286171563 },
        { dataPoint: 'January 16', usd: 2028.563776162226 },
        { dataPoint: 'January 17', usd: 2127.177056243196 },
        { dataPoint: 'January 18', usd: 1874.1142401196775 },
        { dataPoint: 'January 19', usd: 2047.482765354035 },
        { dataPoint: 'January 20', usd: 1958.2527260443774 },
        { dataPoint: 'January 21', usd: 2142.4589805308777 },
        { dataPoint: 'January 22', usd: 2114.845757109414 },
        { dataPoint: 'January 23', usd: 1976.1092417793216 },
        { dataPoint: 'January 24', usd: 1908.2877947451057 },
        { dataPoint: 'January 25', usd: 2073.895866827699 },
        { dataPoint: 'January 26', usd: 1845.042574750371 },
        { dataPoint: 'January 27', usd: 2063.7504643168443 },
        { dataPoint: 'January 28', usd: 2181.3702047803485 },
        { dataPoint: 'January 29', usd: 2047.2358207880917 },
        { dataPoint: 'January 30', usd: 2188.0008049934694 },
        { dataPoint: 'January 31', usd: 2109.4210306153897 },
        { dataPoint: 'February 1', usd: 1894.049259681843 },
        { dataPoint: 'February 2', usd: 1964.2635113647145 },
        { dataPoint: 'February 3', usd: 2067.6308641249073 },
        { dataPoint: 'February 4', usd: 2093.4645131491387 },
        { dataPoint: 'February 5', usd: 1948.7637966944507 },
        { dataPoint: 'February 6', usd: 2063.592545358562 },
        { dataPoint: 'February 7', usd: 2003.264121236334 },
        { dataPoint: 'February 8', usd: 1887.640492751563 },
        { dataPoint: 'February 9', usd: 2010.2500581192456 },
        { dataPoint: 'February 10', usd: 1835.7002015786556 },
        { dataPoint: 'February 11', usd: 1854.4728655294765 },
        { dataPoint: 'February 12', usd: 1846.343302930233 }
     ];
    let pastYearData = [
        { dataPoint: 'January 23', usd: 1700.967928152589 },
        { dataPoint: 'February 23', usd: 2361.272206870396 },
        { dataPoint: 'March 23', usd: 1708.067513052469 },
        { dataPoint: 'April 23', usd: 2129.711167174916 },
        { dataPoint: 'May 23', usd: 2139.131016637231 },
        { dataPoint: 'June 23', usd: 2301.579874949757 },
        { dataPoint: 'July 23', usd: 1597.2840934082376 },
        { dataPoint: 'August 23', usd: 1563.8760378487346 },
        { dataPoint: 'September 23', usd: 1761.7362492082746 },
        { dataPoint: 'October 23', usd: 2083.217028618584 },
        { dataPoint: 'November 23', usd: 2391.590376081759 },
        { dataPoint: 'December 23', usd: 1541.321214618991 },
        { dataPoint: 'January 24', usd: 1853.515301079743 }
    ]


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
    <div class="container">
        <div class="card-container">
            {#each assets as asset, index}
                <div class="card" key={index} on:click={() => expandAsset(index)} on:keypress={() => expandAsset(index)}>
                    <h2>{asset.name}</h2>
                    <!-- <p>${asset.total} (<span class="{asset.change >= 0 ? 'positive' : 'negative'}">{asset.change}</span>)</p> -->
                </div>
            {/each}
        </div>
        <div class="chart-container">
            <LineChart {pastYearData} {pastMonthData}/>
        </div>
    </div>
</div>

<style>
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