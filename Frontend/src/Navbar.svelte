<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";

    let pages = [
		{ name: 'Market', link: "/#/Market", id: 1}, 
		{ name: 'Academy', link: 'https://www.google.com', id: 2}, 
		{ name: 'News', link: 'https://www.google.com', id: 3}, 
		{ name: 'Pricing', link: 'https://www.google.com', id: 4},
    { name: 'Fund Manage', link: '/#/Fundmanage', id: 5},
    { name: 'Management Overview', link: '/#/Umanagementoverview', id: 6}
	];

    let isLoggedIn=false, userName;   


    function logout(){
        sessionStorage.setItem('isLoggedIn', JSON.stringify(false));
        sessionStorage.setItem('userID', 0);
        sessionStorage.setItem('userName', '');
        push('/Login');
    }

    onMount(
        ()=> {
            isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn'));
            userName = sessionStorage.getItem('userName');
            console.log(isLoggedIn);
        }
    );


</script>

<div class="navbar">
    <div class="nav-buttons" style="margin-left: 2%; margin-top: 15px;">
      <a href="/#">
        <img src="path/to/your/logo.png" alt="Logo" class="logo" />
      </a>
      <div class="vertical-line"></div>
      {#each pages as page (page)}
        <a href={page.link} class="nav-button">{page.name}</a>
      {/each}
    </div>
    {#if isLoggedIn}
        <div style="margin-right: 2%;">
            user {userName} logged in
            <button class="login-button" on:click={logout}>Logout</button>
        </div>
    {:else}
        <div style="margin-right: 2%; margin-top: 15px;">
        <a href="/#/Login" class="login-button">Login</a>
        <a href="/#/SignUp" class="signup-button">Sign Up</a>
        </div>
    {/if}
</div>

<style>
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

</style>