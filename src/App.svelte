<script>
	let pages = [
		{ name: 'Market', link: 'https://www.google.com', id: 1}, 
		{ name: 'Academy', link: 'https://www.google.com', id: 2}, 
		{ name: 'Forum', link: 'https://www.google.com', id: 3}, 
		{ name: 'News', link: 'https://www.google.com', id: 4}, 
		{ name: 'Pricing', link: 'https://www.google.com', id: 5}
	];
	let sections = [
    { type: 'gradient', size: 1000 },
    { type: 'solid', size: 500 },
    { type: 'gradient', size: 1000 },
    // Add more sections as needed
  ];
  let currentSection = 0;

  const nextSection = () => {
    currentSection = (currentSection + 1) % sections.length;
  };
</script>

<body style="height: 500px; background: linear-gradient(to right, #7fedec, white); border: 0px">
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
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>
</body>
<body style="height: 500px; background: #f0f0f0"></body>
<style>
	main {
		border: 0px;
		text-align: center;
		padding: 1em;
		max-width: 240px;
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
	background: linear-gradient(to right, #7fedec, white);
  }

  .solid {
    background: #f0f0f0;
  }
</style>