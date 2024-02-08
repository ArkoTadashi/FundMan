<script>
    let username = '';
    let password = '';
    let errorMessage = '';
  
    function handleLogin() {
      // You can add authentication logic here
      // For simplicity, let's just check if username and password are not empty
      if (username.trim() === '' || password.trim() === '') {
        errorMessage = 'Please enter both username and password.';
      } else {
        // Successful login logic goes here
        errorMessage = ''; // Clear any previous error message
        console.log('Login successful!');
      }
    }
</script>

<main class="gradient" style="height: 100vh;">
    <div>
        <h2>Login</h2>
        <form on:submit|preventDefault={handleLogin}>
          <label for="username">Username:</label>
          <input type="text" id="username" bind:value={username} />
      
          <label for="password">Password:</label>
          <input type="password" id="password" bind:value={password} />
      
          <div class="error-message">{errorMessage}</div>
      
          <button type="submit">Login</button>
        </form>
      </div>
</main>

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

    form {
    max-width: 300px;
    margin: 0 auto;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
  }

  .error-message {
    color: red;
    margin-bottom: 10px;
  }
</style>