<script>
	import Router from 'svelte-spa-router';
	import Holding from './Holding.svelte';
	import Landing from './Landing.svelte';
</script>

<Router routes={{
	'/': Landing,
	'/Holding': Holding
}} />