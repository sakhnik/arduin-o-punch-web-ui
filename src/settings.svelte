<style>
.container {
  font-family: sans-serif;
}
</style>

<script>
import KeyEntry from './key-entry.svelte'

let id = 19
let key = '112233445566'
let record_size = 512
let record_bits = 2
let record_days = 1

let bit_sizes = [
  { id: 1, text: '0–1' },
  { id: 2, text: '0–3' },
  { id: 4, text: '0–15' },
  { id: 8, text: '0–255' },
];

</script>

<div class="container">
  <h3>Налаштування</h3>

  <form method='POST' action='/settings' id='settings-form' target='_self'>
    <table>
      <tr>
        <td><label for='id'>Номер:</label></td>
        <td><input type='number' id='id' name='id' min='1' max='255' bind:value={id}/></td>
      </tr>
      <tr>
        <td><label for='key'>Ключ:</label></td>
        <td><KeyEntry id='key' bind:value={key}/></td>
      </tr>
      <tr>
        <td><label for='record-size'>Записів у журналі:</label></td>
        <td><input type='number' id='record-size' name='rec-size' bind:value={record_size}/></td>
      </tr>
      <tr>
        <td><label for='record-bits'>Відміток на запис:</label></td>
        <td>
          <select id='record-bits' name='rec-bits' bind:value={record_bits}>
{#each bit_sizes as bit_size_option}
			<option value={bit_size_option.id}>
				{bit_size_option.text}
			</option>
{/each}
          </select>
        </td>
      </tr>
      <tr>
        <td><label for='record-days'>Період журналу (днів):</label></td>
        <td><input type='number' id='record-days' name='rec-days' bind:value={record_days}/></td>
      </tr>
      <tr>
        <td></td>
        <td><input type='submit' value='Застосувати'></td>
      </tr>
    </table>
  </form>
</div>
