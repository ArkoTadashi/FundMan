<script>
	import Router from 'svelte-spa-router';
	import AssetExpand from './AssetExpand.svelte';
	import Holding from './Holding.svelte';
	import Landing from './Landing.svelte';
	import Login from './Login.svelte';
	import Market from './Market.svelte';
<<<<<<< HEAD
	import SignUp from './SignUp.svelte';
=======
	let pages = [
		{ name: 'Market', link: 'https://www.google.com', id: 1}, 
		{ name: 'Academy', link: 'https://www.google.com', id: 2}, 
		{ name: 'Forum', link: 'https://www.google.com', id: 3}, 
		{ name: 'News', link: 'https://www.google.com', id: 4}, 
		{ name: 'Pricing', link: 'https://www.google.com', id: 5}
	];
  let emailOrMobile = "";

    function handleInputChange(event) {
        emailOrMobile = event.target.value;
    }

    function handleRegisterClick() {
      
    }


>>>>>>> 1789b874db8e217bcf998b756578680f02d22399
</script>

<Router routes={{
	'/': Landing,
	'/Holding': Holding,
    '/AssetExpand': AssetExpand,
    '/Market': Market,
	'/Login': Login,
	'/SignUp': SignUp
}} />