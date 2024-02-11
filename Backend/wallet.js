let MetaMaskSDK= require('@metamask/sdk')

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Example Node.js Dapp",
    url: window.location.href,
  }
  // Other options
});

const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

ethereum.request({ method: 'eth_requestAccounts', params: [] });