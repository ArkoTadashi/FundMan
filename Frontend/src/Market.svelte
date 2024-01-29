<script>
    let coins = [
        {name: "Bitcoin", code: "BTC", price: 34283.53, change24h: 39.23, change7d: -15.21, inCirc: 19528893, volume: 17038253019,  id:1},
    ]

    function getMarketCap(price, inCirc){
        const marketCap = price*inCirc;
        return marketCap.toLocaleString();
    }
</script>

<body class="gradient" style="height: 100vh;">
    <main>
        <h1 style="font-family: 'Inter', sans-serif; text-align: left">Market</h1>
        <table>
            <thead>
              <tr>
                <th>#</th>
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
              {#each coins as coin (coin.id)}
                <tr>
                    <td>{coin.id}</td>
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
</style>