<script>
    let amount = 0;
    let selectedPercentage="5%"
    let panelMemberId = '';
    let selectedToken=''
    let selectedTime='Short term holding'
    let tokenInfo={}
    let selectedInfo = {};
    let preview=false
    
    //fetch from db: all name
    const panel = [{ id:"1", name: 'John'}, { id:"2", name: 'Jane'},{id:"3", name: 'Alice'},{ id:"4", name: 'Bob'}];
    const tokens =['Bitcoin','Etherium','Sol']
    // fetch from db single member
    const info = {
        1: { id:"1", name: 'John', picture: './pic/person.png', info: 'John Doe is a fictional character.' },
        2: { id:"2", name: 'Jane', picture: './pic/person.png', info: 'Jane Smith is a fictional character.' },
        3: { id:"3", name: 'Alice', picture: './pic/person.png', info: 'Alice Johnson is a fictional character.' },
        4: { id:"4", name: 'Bob', picture: './pic/person.png', info: 'Bob Brown is a fictional character.' }
      };
    
    // Function to get information about the selected name
    function getInfo(id) {     
      
      return info[id];
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

    
    $: selectedInfo = getInfo(panelMemberId);

    $: tokenInfo=getTokenInfo(selectedToken);

    function submitForm() {
      // Process the form submission here
      console.log('Token:', selectedToken);
      console.log('Amount:', amount);
      console.log('Percentage:', selectedPercentage);
      console.log('Time:', selectedTime);
      console.log('Panel Member Name:', selectedInfo.name);
    }

    function prevw(){
        preview=!preview
    }
  </script>
  
  <div class="page">
  <div class="top">
    <div class="assign">
        <h3>Assign token to Expert panel member</h3>
    
        <label for="tokenSelect">Token:</label>
        <select id="tokenSelect" bind:value={selectedToken}>
          {#each tokens as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
    
        <label for="amount">Amount(Money):</label>
        <input type="number" id="amount" min=0 bind:value={amount} />
        
        <label>Percentage:</label>
    <div>
      <label for="percentage1"><input type="radio" id="percentage1" name="percentage" value="5%" bind:group={selectedPercentage} /> Less than 5%</label>
      <label for="percentage2"><input type="radio" id="percentage2" name="percentage" value="10%" bind:group={selectedPercentage} /> Less than 10%</label>
      <label for="percentage3"><input type="radio" id="percentage3" name="percentage" value="15%" bind:group={selectedPercentage} /> Less than 15%</label>
    </div>
    
    <label>Time:</label>
    <div>
      <label for="t1"><input type="radio" id="t1" name="time" value="Long term holding" bind:group={selectedTime} /> Long term holding</label>
      <label for="t2"><input type="radio" id="t2" name="time" value="Short term holding" bind:group={selectedTime} /> Short term holding</label>
      </div>
    
        
        <label for="nameSelect">Panel member:</label>
        <select id="nameSelect" bind:value={panelMemberId}>
          {#each panel as p}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
        
        
     </div>

      <div class="details">
        <div class="token-details">
            {#if tokenInfo}
              <div class="card">
                <h3>{tokenInfo.name}</h3>
                <p>{tokenInfo.price}</p>
              </div>
            {/if}
          </div>
    
          <div class="panel-details">
            {#if selectedInfo}
              <div class="card">
                <h3>{selectedInfo.name}</h3>
                <img src={selectedInfo.picture} alt={selectedInfo.name} />
                <p>{selectedInfo.info}</p>
              </div>
            {/if}
          </div>
      </div>
      
       </div>
       
<div class="preview">
    <div class="button">
        <button id="p" on:click={prevw}>Preview</button>
    </div>

    {#if preview}
    <div class="submit-info">
        Token: {selectedToken} <br>
        Amount: {amount} <br>
        Percentage:Less than {selectedPercentage} <br>
        {selectedTime} <br>
        {#if selectedInfo}
        Request to: {selectedInfo.name} <br>
        {/if}

    </div>

    <div class="button">
        {#if selectedToken && selectedInfo}
        <button id="s" on:click={() => submitForm()}>Submit</button>
        {:else}
        <p style="color:brown; margin-left: auto; margin-right:auto;" >Select Everything Correctly to Submit</p>
        {/if}
      
    </div>
   
    {/if}
   
</div>

</div>
       
  <style>
    .card {
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      margin-top: 20px;
    }
    
    .card img {
      max-width: 100%;
      border-radius: 5px;
    }

    .top{
        display: flex;
    }

    .assign{
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 10px;
      margin-top: 2px;
      margin-left: auto;
      margin-right: auto;
      width: 35%;
      background-color: antiquewhite;
    }

    .details{
        width: 60%;
        margin-left: auto;
        margin-right: auto;
    }
    .token-details{
        background-color: rgb(212, 248, 243);
    }
    .panel-details{
        background-color: rgb(212, 238, 248);
    }
    .button{
        display: flex;
        margin-top: 10px;
    }

    #p{
        margin-left: auto;
        margin-right: auto;
    }

    #s{
        margin-left: auto;
        margin-right: auto;
    }

    .preview{
        display: inline;
        margin: auto;
        margin-top: 5px;
    }
    .submit-info{
        display: flex;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin-top: 2px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px;
        width: 95%;
        background-color: rgb(255, 252, 249);
    }
  </style>