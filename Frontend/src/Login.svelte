<script>

	let pages = [
		{ name: 'Market', link: 'https://www.google.com', id: 1}, 
		{ name: 'Academy', link: 'https://www.google.com', id: 2}, 
		{ name: 'Forum', link: 'https://www.google.com', id: 3}, 
		{ name: 'News', link: 'https://www.google.com', id: 4}, 
		{ name: 'Pricing', link: 'https://www.google.com', id: 5}
	];


	


  let username = "";
  let password = "";

    function handleLoginClick() {
        
    }




</script>

<body class="gradient" style="height: 800px; background-size: cover;">
<main>
	<div class="navbar" height="500px" style="gradient">
		<div class="nav-buttons">
		  <img src="path/to/your/logo.png" alt="Logo" class="logo" />
		  <div class="vertical-line"></div>
		  {#each pages as page (page)}
			<a href={page.link} class="nav-button">{page.name}</a>
		  {/each}
		</div>
	  
		<div>
		  <a href="#" class="login-button">Login</a>
		  <a href="#" class="signup-button">Sign Up</a>
		</div>
	</div>

	<div class="container">
    <div class="image-wrapper">
        <img src="images/heroart.png" alt="Your Image" />
    </div>
    <div class="text-container">
        <div class="input-container">
          <input type="text" placeholder="Username" bind:value={username} />
        </div>
        <div>
          <input type="password" bind:value={password} on:input={validatePassword} placeholder="Enter your password">
        </div>
    </div>
    <div class="register-button">
      <button class="register-btn" on:click={handleLoginClick}>Register</button>
    </div>
    
</div>
</main>
</body>
<body class="solid" style="height: 500px;"></body>


<style>
	main {
		border: 0px;
		text-align: center;
		padding: 1em;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: transparent;
    color: white;
  }

  .logo {
    margin-right: 10px;
  }

  .vertical-line {
    height: 30px;
    border-left: 1px solid black;
    margin: 0 10px;
  }

  .nav-buttons {
    display: flex;
    align-items: center;
  }

  .nav-button {
    margin-right: 10px;
    color: black;
    text-decoration: none;
    font-family: 'Inter', sans-serif;
  }

  .login-button,
  .signup-button {
    padding: 8px 12px;
    border: 2px solid black;
    background-color: transparent;
    color: black;
    text-decoration: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }

  .signup-button {
    background-color: #7fedec; 
    border-color: #7fedec; 
    margin-left: 10px;
  }

  .gradient {
	background: linear-gradient(to right, #7fedec, #f0f0f0);
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
        padding-right: 20px; /* Adjust as needed */
    }

    .image-wrapper {
        width: 750px; /* Adjust size as needed */
        height: 750px; /* Adjust size as needed */
        overflow: hidden;
        border-radius: 50%;
        margin-left: 20vw; /* Adjust as needed */
    }

    .image-wrapper img {
        width: 100%;
        height: auto;
        border-radius: 50%;
    }

    .text-container {
        text-align: center;
        margin-left: 10%;
    }

    .title {
        color: black;
        margin-bottom: 5px;
        font-size: xx-large;
    }

    .input-container {
        display: flex;
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
    }
</style>