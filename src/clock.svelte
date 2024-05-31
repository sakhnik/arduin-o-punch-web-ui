<style>
</style>

<script>
import { onMount, onDestroy } from 'svelte'

const oneDayMs = 24 * 60 * 60 * 1000;
let latency
let clockOffsetMs
let deviceClock
let interval

function updateTime() {
  if (clockOffsetMs !== null) {
    deviceClock = new Date(Date.now() + clockOffsetMs)
  }
}

onMount(async () => {
  interval = setInterval(updateTime, 1000);
  measureClockOffset()

  return () => {
    clearInterval(interval);
  };
});

onDestroy(() => {
    clearInterval(interval);
});

const readClock = async function() {
  const response = await fetch('/clock')
  const text = await response.text()
  return Number(text.trim())
}

const measureClockOffset = async function() {
  clockOffsetMs = null
  latency = null
  let prevClock = await readClock()
  while (true) {
    let t1 = performance.now()
    let curClock = await readClock()
    let t2 = performance.now()
    if (curClock != prevClock) {
      latency = (t2 - t1) * 0.5
      let now = new Date()
      curClock = curClock * 1000 + latency
      clockOffsetMs = Math.round(curClock - now.getTime())
      break
    }
  }
}

function formatTime(offsetMs) {
  let milliseconds = offsetMs % 1000
  offsetMs = Math.round(offsetMs / 1000)
  if (!offsetMs) {
    return '0.' + milliseconds
  }
  let seconds = offsetMs % 60
  offsetMs = Math.round(offsetMs / 60)
  let ds = Math.round(milliseconds / 100)
  if (!offsetMs) {
    return seconds + "." + ds
  }
  let minutes = offsetMs % 60
  let hours = Math.round(offsetMs / 60)
  if (seconds < 10) seconds = '0' + seconds
  if (!hours) {
    return minutes + ':' + seconds
  }
  if (minutes < 10) minutes = '0' + minutes
  return hours + ':' + minutes + ':' + seconds
}

function formatClockOffset() {
  const offsetMs = clockOffsetMs % oneDayMs
  if (offsetMs > 0) {
    return '+' + formatTime(offsetMs)
  }
  return '−' + formatTime(-offsetMs)
}

function formatDayOffset() {
  const offset = Math.round(clockOffsetMs / oneDayMs)
  if (offset > 0) {
    return '+' + offset
  }
  return offset
}

</script>

<div>
  <h3>Годинник</h3>
  <p>Дата:
{#if !clockOffsetMs || !deviceClock}
    …
{:else}
    {deviceClock.toLocaleDateString('uk-UA')}
  {#if clockOffsetMs > oneDayMs || clockOffsetMs < -oneDayMs}
    ({formatDayOffset()} днів)
  {/if}
{/if}
  </p>
  <p>Час:
{#if !clockOffsetMs || !deviceClock}
    …
{:else}
    {deviceClock.toLocaleTimeString('uk-UA')} ({formatClockOffset()} ±{latency} мс)
{/if}
  </p>
  <button on:click={measureClockOffset}>Звірити</button>
</div>
