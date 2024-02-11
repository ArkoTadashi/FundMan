<script>
	import Router from 'svelte-spa-router';
	import AssetExpand from './AssetExpand.svelte';
	import Assign from './Assign.svelte';
	import FundManage from './FundManage.svelte';
	import FundManageRequest from './FundManageRequest.svelte';
	import Holding from './Holding.svelte';
	import Landing from './Landing.svelte';
	import Login from './Login.svelte';
	import Market from './Market.svelte';
	import Request from './Request.svelte';
	import SignUp from './SignUp.svelte';
	import UManagementOverview from './UManagementOverview.svelte';
    import Management from './Management.svelte';

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
    '/Market': Market,
    '/Fundmanage': FundManage,
    '/Assign': Assign,
    '/Request': Request,
    '/Login': Login,
    '/SignUp': SignUp,
    '/FundManageRequest': FundManageRequest,
    '/UManagementOverview': UManagementOverview,
    '/Management': Management
}} />