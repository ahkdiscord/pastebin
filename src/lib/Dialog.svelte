<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade, fly } from "svelte/transition";

  interface Props {
    open: boolean;
    children: Snippet;
    buttons: Snippet;
  }

  const transitionDurationMs = 200;

  let { open = $bindable(), buttons, children }: Props = $props();
</script>

{#if open}
  <div
    class="container"
    onmousedown={() => (open = false)}
    role="none"
    tabindex="-1"
    transition:fade={{ duration: transitionDurationMs }}
  >
    <div
      class="dialog"
      onmousedown={e => e.stopPropagation()}
      role="dialog"
      tabindex="0"
      transition:fly={{ y: -5, duration: transitionDurationMs }}
    >
      <div class="body">
        <div class="content">
          {@render children()}
        </div>

        <div class="buttons">
          {@render buttons()}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;

    background-color: color-mix(in srgb, var(--black) 20%, transparent);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog {
    border: none;
    border-radius: 1em;
    padding: 1em;
    color: var(--black);
    background-color: var(--shell);

    /* because I keep forgetting: <x> <y> <blur> <spread> <color> */
    box-shadow: 0em 1em 0.5em 0.5em color-mix(in srgb, var(--black) 20%, transparent);
  }

  .body {
    display: flex;
    flex-direction: column;
  }

  .content {
    padding: 1em;
  }

  .buttons {
    display: flex;
    justify-content: end;
    gap: 1em;
  }
</style>
