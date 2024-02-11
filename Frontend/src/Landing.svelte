<script>
    import Navbar from "./Navbar.svelte";
    let isLoggedIn = false;

	let pages = [
    { name: 'Holding', link: '/#/Holding', id: 1},
		{ name: 'Market', link: "/#/Market", id: 2}, 
		{ name: 'Academy', link: 'https://www.google.com', id: 3}, 
		{ name: 'Forum', link: 'https://www.google.com', id: 4}, 
		{ name: 'News', link: 'https://www.google.com', id: 5}, 
		{ name: 'Pricing', link: 'https://www.google.com', id: 6},
		{ name: 'Fund Manage', link: '/#/Fundmanage', id: 7},
		{ name: 'Request', link: '/#/Request', id: 8},
	];
	
  let emailOrMobile = "";

    function handleInputChange(event) {
        emailOrMobile = event.target.value;
    }

    function handleRegisterClick() {
        // Handle registration logic here
        console.log("Register clicked with:", emailOrMobile);
    }
</script>


<div class="gradient" style="height: 800px; width: 100%; border:0px">

	<Navbar/>
	<div class="container">
    <div class="image-wrapper">
        <img src="images/heroart.png" alt="Your Image"/>
    </div>
    <div class="text-container" style="width: 30%; Height: auto;">
        <div class="title">Your Personal</div>
        <div class="title">Crypto Tracking Platform</div>
        <div class="input-container">
            <input type="text" placeholder="Email/Mobile" bind:value={emailOrMobile} />
            <button class="register-btn" on:click={handleRegisterClick}>Register</button>
        </div>
    </div>
  </div>

</div>
<body class="solid" style="height: 500px;"></body>
<style>
	main {
		border: 0px;
		text-align: center;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	

  .gradient {
	  background: linear-gradient(to right, #7fedec, #f0f0f0);
    margin: 0px;
    padding: 0px;
  }

  .solid {
    background: #f0f0f0;
  }

  .container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;
        align-items: center;
        height: 100vh; /* Adjust as needed */
        padding-right: 0px; /* Adjust as needed */
    }

    .image-wrapper {
        position: absolute;
        top: 75px;
        right: 0;
        width: 40%; /* Adjust size as needed */
        height: auto; /* Adjust size as needed */
        overflow: hidden;
        border-radius: 50%;
        margin-left: 0vw; /* Adjust as needed */
    }

    .image-wrapper img {
        width: 100%;
        height: auto;
        border-radius: 50%;
    }

    .text-container {
        position: absolute;
        left: 10%;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .title {
        color: black;
        margin-bottom: 5px;
        font-size: xx-large;
    }

    .input-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .register-btn {
        background-color: cyan;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
    }

    input[type="text"] {
        padding: 8px;
        margin-right: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>