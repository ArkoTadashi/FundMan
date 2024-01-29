<script>
    let assets = [
        {name: "HODL", total: 1500.62, change: -20.45, id: 1},
        {name: "DEX", total: 2342.54, change: 150.47, id: 2},
        {name: "DEX2", total: 242.54, change: 50.47, id: 3},
        {name: "DEX2", total: 242.54, change: 50.47, id: 4}
    ];
</script>

<body class="gradient" style="height: 100vh;">
    <main>
        <h1 style="font-family: 'Inter', sans-serif; text-align: left">My Assets</h1>
        <div class="card-container">
            {#each assets as asset (asset.id)}
              <div class="card">
                <h2>{asset.name}</h2>
                <p>${asset.total} (<span class="{asset.change >= 0 ? 'positive' : 'negative'}">{asset.change}</span>)</p>
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
</style>