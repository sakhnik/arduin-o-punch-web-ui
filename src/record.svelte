<style>
.container {
  width: 100%;
  max-height: 400px;
  overflow-y: scroll;
  border: 1px solid #ccc;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>

<script>

export let isOpen = false
let loading = true
let error = null
let record = {}

$: if (isOpen) {
  fetchData()
}

const fetchData = async () => {
  try {
    const response = await fetch('/record')
    if (!response.ok) {
      throw new Error("Не вдалося отримати дані")
    }
    record = parseRecord(await response.text())
  } catch (err) {
    error = err.message
  } finally {
    loading = false
  }
}

function parseRecord(data) {
  if (!data) {
    return []
  }
  const pairs = data.split(' ')
  return pairs.map(pair => {
    const [card, count] = pair.split(':')
    return { card: parseInt(card, 10), count: parseInt(count, 10) }
  });
}

</script>

<div class='container'>
  <p>Журнал відмітки. Натисність ESC щоб закрити.</p>
{#if loading}
  <p>Завантаження…</p>
{:else if error}
  <p>Помилка: {error}</p>
{:else if record.length === 0}
  <p>Відміток ще не було</p>
{:else}
  <table>
    <thead><tr><th>Картка</th><th>Кількість</th></tr></thead>
    <tbody>
      {#each record as entry}
        <tr>
          <td>{entry.card}</td>
          <td>{entry.count}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
</div>
