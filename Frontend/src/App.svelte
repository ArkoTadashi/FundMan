<script>
	import Router from 'svelte-spa-router';
	import AssetExpand from './AssetExpand.svelte';
	import Holding from './Holding.svelte';
	import Landing from './Landing.svelte';
	import Market from './Market.svelte';
</script>

<Router routes={{
	'/': Landing,
	'/Holding': Holding,
    '/AssetExpand': AssetExpand,
    '/Market': Market
}} />