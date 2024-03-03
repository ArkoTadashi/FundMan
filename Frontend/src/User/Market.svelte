<script>

    import { onMount } from 'svelte';
    import Navbar from './Navbar.svelte';
    import { push } from 'svelte-spa-router';
    import Sidebar from './Sidebar.svelte';

    let data = [];
    let coins = [];

    onMount(async () => {
        const response = await fetch('http://localhost:9000/market');
        const jsonData = await response.json();
        data = jsonData;

        coins = data.map(obj => ({
            name: obj.token,
            code: obj.token,
            price: obj.currentPrice,
            change24h: 200,
            change7d : 30,
            inCirc : obj.circulatingSupply,
            volume: 93184,
        }));
        console.log(coins[0]);
    });

    function getMarketCap(price, inCirc){
        const marketCap = price*inCirc;
        return marketCap.toLocaleString();
    }

    function showCoinInfo(coinName){
        sessionStorage.setItem('expandCoin', coinName);
        push('/CoinInfo');
    }
</script>

<div class="gradient" style="min-height: 100vh;">
    <Navbar/>
    <h1 style="font-family: 'Inter', sans-serif; text-align: left; margin-left: 2%;">Market</h1>
    <div class="card-container">
        <!-- <Sidebar/> -->
        <div>
            <table>
                <thead>
                  <tr>
                    <th>Coin Name</th>
                    <th>Price</th>
                    <th>24%</th>
                    <th>7d%</th>
                    <th>Circulating Supply</th>
                    <th>Volume</th>
                    <th>Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                    {#each coins as coin, index}
                    <tr on:click={showCoinInfo(coin.name)}>
                        <td>{coin.name}</td>
                        <td>${coin.price.toLocaleString()}</td>
                        <td><span style="text-align: right;" class="{coin.change24h >= 0 ? 'positive' : 'negative'}">{coin.change24h}%</span></td>
                        <td><span style="text-align: right;" class="{coin.change7d >= 0 ? 'positive' : 'negative'}">{coin.change7d}%</span></td>
                        <td>{coin.inCirc.toLocaleString()} {coin.code}</td>
                        <td>${coin.volume.toLocaleString()}</td>
                        <td>${getMarketCap(coin.price, coin.inCirc)}</td>
                    </tr>
                {/each}
                
                </tbody>
              </table>
              </div>
          </div>
</div>

<style>

    .gradient {
	background: linear-gradient(to bottom, #7fedec, #f0f0f0);
    }
    
    table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }

    .positive {
        color: green;
    }

    .negative {
        color: red;
    }

    tbody tr:hover{
        cursor: pointer;
        background-color: white;
        border: 2px solid black;
    }
</style>