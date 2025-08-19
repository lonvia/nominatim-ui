<script>
  import { appState } from '../AppState.svelte.js';

  function dismiss_message() {
    appState.errorMessage = null;
  }
</script>

{#if appState.errorMessage}
  <div id="error" class="container-fluid alert-danger py-3 px-4">
    {appState.errorMessage}

    <button type="button"
            class="btn-close float-end"
            aria-label="dismiss"
            onclick={dismiss_message}></button>
  </div>
{/if}
