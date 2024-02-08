<script>
	import Router from 'svelte-spa-router';
	import AssetExpand from './AssetExpand.svelte';
	import Holding from './Holding.svelte';
	import Landing from './Landing.svelte';
	import Login from './Login.svelte';
	import Market from './Market.svelte';
	import SignUp from './SignUp.svelte';
</script>

<Router routes={{
	'/': Landing,
	'/Holding': Holding,
    '/AssetExpand': AssetExpand,
    '/Market': Market,
	'/Login': Login,
	'/SignUp': SignUp
}} />