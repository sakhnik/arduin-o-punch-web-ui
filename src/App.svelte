<script>
import Settings from './settings.svelte'
import Upgrade from './upgrade.svelte'

let project_version = '1.0.0'
let git_revision = 'abcdef'
</script>

<h1>Станція Arduin-O-Punch</h1>
<p>Версія <span>{project_version}-{git_revision}</span></p>

<Settings/>
<Upgrade/>
