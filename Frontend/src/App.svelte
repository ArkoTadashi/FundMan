<script>
	import Router from 'svelte-spa-router';
	import AssetExpand from './User/AssetExpand.svelte';
	import Assign from './Assign.svelte';
	import CoinInfo from './User/CoinInfo.svelte';
	import FundManage from './User/FundManage.svelte';
	import FundManageRequest from './User/FundManageRequest.svelte';
	import FundRaiseUser from './User/FundRaiseUser.svelte';
	import Holding from './User/Holding.svelte';
	import Landing from './User/Landing.svelte';
	import Login from './User/Login.svelte';
	import Management from './Panel/Management.svelte';
	import Market from './User/Market.svelte';
	import PanelLogin from './Panel/PanelLogin.svelte';
	import Request from './Request.svelte';
	import SignUp from './User/SignUp.svelte';
	import UManagementOverview from './User/UManagementOverview.svelte';
    import FundRaiseRequest from './User/FundRaiseRequest.svelte';
    import AdminFundRaiseRequest from './Admin/FundRaiseRequest.svelte';
    import FundRaiseOverview from './User/FundRaiseOverview.svelte';
    
  let emailOrMobile = "";

    function handleInputChange(event) {
        emailOrMobile = event.target.value;
    }

    function handleRegisterClick() {
      
    }


</script>

<Router routes={{
	'/': Landing,
	'/User/Holding': Holding,
    '/AssetExpand': AssetExpand,
    '/Market': Market,
    '/Fundmanage': FundManage,
    '/Assign': Assign,
    '/Request': Request,
    '/Login': Login,
    '/SignUp': SignUp,
    '/FundManageRequest': FundManageRequest,
    '/PanelLogin': PanelLogin,
    '/UManagementOverview': UManagementOverview,
    '/Management': Management,
    '/FundRaiseUser':FundRaiseUser,
    '/CoinInfo': CoinInfo,
    '/FundRaiseRequest':FundRaiseRequest,
    '/Admin/FundRaiseRequest':AdminFundRaiseRequest,
    '/FundRaiseOverview':FundRaiseOverview
}} />