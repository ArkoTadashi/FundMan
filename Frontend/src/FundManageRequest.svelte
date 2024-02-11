<script>
  import { onMount } from 'svelte';
  import Navbar from './Navbar.svelte';

  let amount = 0;
  let selectedPercentage="5%"
  let selectedTime='Short term holding'
  let preview=false
  let panelMemberUsername=sessionStorage.getItem('panelMemberUsername')
  
  //fetch from db: panelMember
  let panelMember
  onMount(async () => {
        const response = await fetch(`http://localhost:9000/panel/${panelMemberUsername}`);
        panelMember = await response.json();
        // console.log(panelMember)
    });
 
  function submitForm() {
    // Process the form submission here
    console.log('Amount:', amount);
    console.log('Percentage:', selectedPercentage);
    console.log('Time:', selectedTime);
    console.log('Panel Member Name:', panelMember.name);
  }

  function prevw(){
      preview=!preview
  }

</script>
<Navbar />
<div class="page">
<div class="top">
  <div class="assign">
      <h3>Assign token to Expert panel member</h3>
    
      <label for="amount">Amount(Money):</label>
      <input type="number" id="amount" min=0 bind:value={amount} />
      
      <label>Percentage:</label>
      <div>
        <label for="percentage1"><input type="radio" id="percentage1" name="percentage" value="5%" bind:group={selectedPercentage} /> Less than 5%</label>
        <label for="percentage2"><input type="radio" id="percentage2" name="percentage" value="10%" bind:group={selectedPercentage} /> Less than 10%</label>
        <label for="percentage3"><input type="radio" id="percentage3" name="percentage" value="15%" bind:group={selectedPercentage} /> Less than 15%</label>
      </div>         
  </div>

  <div class="details">  
      <div class="panel-details">
        {#if panelMember}
          <div class="card">
            <img class="img" src='./pic/person.png' alt={panelMember.name} />
            <h2>{panelMember.name.toUpperCase()}</h2>
            <h4>Rating: {panelMember.rating}</h4>
            <h4>PnL: {panelMember.pnl}</h4>
            <h4>Manage Count: {panelMember.manageCount}</h4>
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
      Amount: {amount} <br>
      Percentage:Less than {selectedPercentage} <br>
      {selectedTime} <br>
      {#if panelMember}
      Request to: {panelMember.name} <br>
      {/if}

  </div>

  <div class="button">
      {#if panelMember}
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
    margin-top: auto;
  }
  
  .card img {
    width: 20%;
    height: 30%;
    border-radius: 2px;
  }

  .top{
      display: flex;
  }

  .assign{
    align-content: center;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 10px;
    margin-top: 2px;
    margin-left: auto;
    margin-right: auto;
    max-width: 45%;
    background-color: antiquewhite;
  }

  .details{
    align-content: center;
    height: auto;
    max-width: 45%;
    margin-left: auto;
    margin-right: auto;
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