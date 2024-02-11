<script>
    let requests = [
      { id: 1, uid:1, from: "John Doe", token:"Bitcoin", amount: 120, percent:"5%", status: null },
      { id: 2, uid:2, from: "Alice Smith", token:"Etherium", amount: 20, percent:"15%", status: null },
      { id: 3, uid:3, from: "Bob Johnson", token:"Sol", amount: 12, percent:"10%", status: null }
    ];
  
    let token=''
    let tokenInfo={}
    let client=''
    let clientInfo={}
    function acceptRequest(id) {
      requests = requests.map(request =>
        request.id === id ? { ...request, status: 'accepted' } : request
      );
    }
  
    function rejectRequest(id) {
      requests = requests.map(request =>
        request.id === id ? { ...request, status: 'rejected' } : request
      );
    }

    function setToken(t){
        token=t
    }

    function getTokenInfo(tname){
        //fetch from db
        let info = {
            'Bitcoin':{name:'Bitcoin',price:230},
            'Etherium':{name:'Etherium',price:222},
            'Sol':{name:'Sol',price:21}
        }
        return info[tname]
    }

    function setClient(id){
        client=id
    }

    function getClientInfo(id){
        //fetch from db
        const info = {
        1: { id:"1", name: 'John Doe', picture: './pic/person.png', info: 'John Doe is a fictional character.' },
        2: { id:"3", name: 'Alice Smith', picture: './pic/person.png', info: 'Alice Johnson is a fictional character.' },
        3: { id:"4", name: 'Bob Jhonson', picture: './pic/person.png', info: 'Bob Brown is a fictional character.' }
        };
        return info[id]
    }

    $: clientInfo=getClientInfo(client)
    $: tokenInfo=getTokenInfo(token)

  </script>

<div class="top-container">
    <div class="container">
        <h1>Requests Details</h1>
        {#each requests as request}
          <div class="request" key={request.id} on:mouseenter={()=>{
            setClient(request.uid)
            setToken(request.token)
            }}>
            <div class="info">
                <p><strong>Client:</strong> {request.from}</p>
                <p><strong>Token:</strong> {request.token}</p>
                <p><strong>Amount:</strong> {request.amount}</p>
                <p><strong>Percentage:</strong> Less than {request.percent}</p>
            </div>
            
            <div class="status">
                {#if !request.status}
                  <button class="accept" on:click={() => acceptRequest(request.id)}>Accept</button>
                  <button class="reject" on:click={() => rejectRequest(request.id)}>Reject</button>
                {:else if request.status === 'accepted'}
                  <p class="message accepted">This request has been accepted.</p>
                {:else if request.status === 'rejected'}
                  <p class="message rejected">This request has been rejected.</p>
                {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="container2">
        {#if clientInfo}
            <div class="card">
                <h3>Client</h3>
                <hr>
                <h3>{clientInfo.name}</h3>
                <img class="img" src={clientInfo.picture} alt={clientInfo.name} />
                <p>{clientInfo.info}</p>
            </div>
        {/if}

        {#if tokenInfo}
            <div class="card">
                <h3>Token</h3>
                <hr>
                <h3>{tokenInfo.name}</h3>
                <p>{tokenInfo.price}</p>
            </div>
        {/if}
        </div>
        
</div>

  
  
  <style>
     .card {
      margin: 10px 2px 2px 2px;
      padding: 20px;
      border: 1px solid #cfcfcf;
      border-radius: 3px;
      background-color: #cff0f3;
    }
    .card img {
      width: 30%;
      height: 30%;
      border-radius: 2px;
    }

    .top-container{
        display: flex;
    }
    .container {
      width: 70%;
      margin: 2px auto;
      padding: 20px;
      /* border: 1px solid #ecebeb; */
      /* border-radius: 3px; */
      /* background-color: #fafafa; */
    }

    .container2 {
      width: 30%;
      margin: 55px auto;
      padding: 20px;
      /* border: 1px solid #ecebeb; */
      border-radius: 3px;
    }

    .request {
      display: flex;
      max-width: 100%;
      margin: 2px 2px 2px 2px;
      padding: 20px;
      border: 1px solid #cfcfcf;
      border-radius: 3px;
      background-color: #ddf4f6;
    }

    .request:hover {
      display: flex;
      max-width: 100%;
      margin: 2px 2px 2px 2px;
      padding: 20px;
      border: 2px solid #b9b9b9;
      border-radius: 3px;
      background-color: #c6ecf0;
    }

    .info{
        width: 90%;
        /* margin: auto; */
        margin-bottom: 5px;
    }
    .status{
        align-items: center;
        margin: auto;
        width: 20%;
    }
  
    h1 {
      font-size: 24px;
      margin-bottom: 15px;
    }
  
    p {
      margin-bottom: 10px;
    }
  
    button {
      padding: 10px 20px;
      margin-right: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    button.accept {
      background-color: #4CAF50;
      color: white;
    }
  
    button.reject {
      background-color: #f44336;
      color: white;
    }
  
    .message {
      margin-top: 20px;
      font-weight: bold;
    }
  
    .accepted {
      color: #4CAF50;
    }
  
    .rejected {
      color: #f44336;
    }
  </style>
  