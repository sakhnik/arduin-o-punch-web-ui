<style>
.container {
  font-family: sans-serif;
}
</style>

<script>
import Settings from './settings.svelte'
import Upgrade from './upgrade.svelte'
import Popup from './popup.svelte'

let project_version = '1.0.0'
let git_revision = 'abcdef'
let recordShown = false

function openRecord() {
  recordShown = false
  recordShown = true
}
</script>

<div class='container'>
  <h1>Станція Arduin-O-Punch</h1>
  <p>Версія <span>{project_version}-{git_revision}</span></p>

  <Settings/>
  <Popup show={recordShown}/>
  <button on:click={openRecord}>Журнал</button>
  <Upgrade/>
</div>
