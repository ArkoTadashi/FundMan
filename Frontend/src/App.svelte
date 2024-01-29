<script>
	import Router from 'svelte-spa-router';
	import AssetExpand from './AssetExpand.svelte';
	import Holding from './Holding.svelte';
	import Landing from './Landing.svelte';
	import Market from './Market.svelte';
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


</script>

<Router routes={{
	'/': Landing,
	'/Holding': Holding,
    '/AssetExpand': AssetExpand,
    '/Market': Market
}} />