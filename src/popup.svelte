<style>
.popup {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
}

.show {
  display: flex;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

#closeBtn {
    margin-top: 20px;
}
</style>

<script>

export let isOpen = false

</script>

<div id="popup" class="popup" class:show={isOpen}>
  <div class="popup-content">
    <slot>
      <p>Popup content</p>
    </slot>
    <button id="closeBtn" on:click={() => isOpen = false}>Закрити</button>
  </div>
</div>
<svelte:window on:keydown={() => isOpen = false} />
