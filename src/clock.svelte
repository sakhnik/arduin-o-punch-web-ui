<style>
</style>

<script>
import { onMount, onDestroy } from 'svelte'

const oneDayMs = 24 * 60 * 60 * 1000;
let latency
let clockOffsetMs
let deviceClock
let interval

// Get local time in milliseconds from the Unix epoch.
function getLocalTimeMs(now) {
  // Timezone offset is negative count of minutes
  return now.getTime() - now.getTimezoneOffset() * 60000
}

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
  // The device's clock has a second precision. We can estimate the second edge by polling
  // the clock and measuring with ours.
  let prevClock = await readClock()
  while (true) {
    let t1 = performance.now()
    let curClock = await readClock()
    let t2 = performance.now()
    if (curClock != prevClock) {
      latency = (t2 - t1) * 0.5
      curClock = curClock * 1000 + latency
      let localTimeMs = getLocalTimeMs(new Date())
      clockOffsetMs = Math.round(curClock - localTimeMs)
      break
    }
  }
}

function formatTime(offsetMs) {
  let milliseconds = offsetMs % 1000
  offsetMs = Math.round(offsetMs / 1000)
  if (!offsetMs) {
    return '0.' + milliseconds + ' с'
  }
  let seconds = offsetMs % 60
  offsetMs = Math.round(offsetMs / 60)
  let ds = Math.round(milliseconds / 100)
  if (!offsetMs) {
    return seconds + "." + ds + ' с'
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

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function synchronizeClock() {
  let prevLatency = latency
  clockOffsetMs = null
  latency = null

  let now = getLocalTimeMs(new Date())
  // Target for the next second edge
  let targetTime = Math.floor(now / 1000) + 1
  let msLeft = 1000 - now % 1000
  if (msLeft < prevLatency) {
    msLeft += 1000
    targetTime += 1
  }
  let t1 = performance.now()
  let targetWaitMs = msLeft - prevLatency
  let bulkWait = targetWaitMs - 50
  if (bulkWait > 0) {
    await wait(bulkWait)
  }
  // busy wait
  while (performance.now() - t1 < targetWaitMs) {
  }
  /*const response =*/ await fetch('/clock', {
    'method': 'POST',
    'headers': {
      'Content-Type': 'text/plain',
    },
    'body': String(targetTime),
  })

  await wait(750)
  await measureClockOffset()
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
    {deviceClock.toLocaleTimeString('uk-UA')} ({formatClockOffset()} ±{Math.floor(latency)} мс)
{/if}
  </p>
  <button on:click={measureClockOffset}>Звірити</button>
  <button on:click={synchronizeClock}>Підвести</button>
</div>
