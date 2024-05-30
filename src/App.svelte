<style>
.container {
  font-family: sans-serif;
}
</style>

<script>
import Settings from './settings.svelte'
import Upgrade from './upgrade.svelte'
import Popup from './popup.svelte'
import Record from './record.svelte'
import Clock from './clock.svelte'

let recordShown = false
</script>

<div class='container'>
  <h1>Станція Arduin-O-Punch</h1>
  <p>Версія <span>0.0.0-abcdef</span></p>

  <Settings/>
  <Clock/>
  <Popup bind:isOpen={recordShown}>
    <Record bind:isOpen={recordShown}/>
  </Popup>
  <div>
    <h3>Різне</h3>
    <button on:click={() => recordShown = true}>Журнал</button>
  </div>
  <Upgrade/>
</div>
