<script>
    import Navbar from "./Navbar.svelte";
    let isLoggedIn = false;

    let email = '';
    let username = '';
    let password = '';
    let confirmPassword = '';
    let termsAccepted = false;
    let errorMessage = '';
  
    function handleSignup() {
      // Validation logic
      if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
        errorMessage = 'Please fill in all fields.';
      } else if (password !== confirmPassword) {
        errorMessage = 'Passwords do not match.';
      } else if (!termsAccepted) {
        errorMessage = 'Please accept the terms of service.';
      } else {
        // Successful signup logic goes here
        errorMessage = ''; // Clear any previous error message
        console.log('Signup successful!');
      }
    }
  </script>

<div class="gradient" style="height: 100vh;">
    <Navbar isLoggedIn={isLoggedIn} userID=0 />
    <div class="container">
        <div class="image-wrapper">
            <img src="images/heroart.png" alt="Your Image"/>
        </div>
        <div class="text-container">
            <h2>Signup</h2>
            <form on:submit|preventDefault={handleSignup}>
              <label for="email">Email:</label>
              <input type="email" id="email" bind:value={email} />
          
              <label for="username">Username:</label>
              <input type="text" id="username" bind:value={username} />
          
              <label for="password">Password:</label>
              <input type="password" id="password" bind:value={password} />
          
              <label for="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" bind:value={confirmPassword} />
          
              <label>
                <input type="checkbox" bind:checked={termsAccepted} />
                Accept Terms of Service
              </label>
          
              <div class="error-message">{errorMessage}</div>
          
              <button type="submit">Signup</button>
            </form>
          </div>
    </div>
    
</div>

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
        width: 30%;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
  </style>