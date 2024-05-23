<script>
  export let id = 'key';
  export let value = '112233445566'
  let showKey = false
  $: type = showKey ? 'text' : 'password'
  $: revealLabel = showKey ? '••' : '👁️'

  /**
   * @param {any} event
   */
  function onInputKey (event) {
    value = event.target.value
  }
</script>

<span>
  <input {type} {value} {id} name='key' on:input={onInputKey}/>
  <button class='toggle-key' on:click|preventDefault={() => showKey = !showKey}>{revealLabel}</button>
</span>
