<script>
  import Navbar from "./Navbar.svelte";
  let isLoggedIn = false;

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

<div class="gradient" style="height: 100%; width:100%">
  <Navbar isLoggedIn={isLoggedIn}/>
  <div  class="container">
    <div class="image-wrapper">
      <img src="images/heroart.png" alt="Your Image"/>
    </div>
    <div class="text-container">
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
  </div>
  
</div>

<style>

  .gradient {
    background: linear-gradient(to bottom, #7fedec, #f0f0f0);
    margin: 0px;
    padding: 0px;
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