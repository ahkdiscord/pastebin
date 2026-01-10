<script lang="ts">
  import type { Snippet } from "svelte";
  import { preventDefault } from "svelte/legacy";
  import { fly } from "svelte/transition";

  interface Props {
    open: boolean;
    children: Snippet;
    yes: Snippet;
    no: Snippet;
  }

  const transitionDurationMs = 200;

  let { open = $bindable(), yes, no, children }: Props = $props();
</script>

{#if open}
  <div class="container" onmousedown={() => (open = false)} role="none" tabindex="-1">
    <div
      class="dialog"
      onmousedown={e => e.stopPropagation()}
      role="dialog"
      tabindex="0"
      transition:fly={{ y: -5, duration: transitionDurationMs }}
    >
      <div class="content">
        <div class="question">
          {@render children()}
        </div>

        <div class="buttons">
          {@render no()}
          {@render yes()}
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

    background-color: color-mix(in srgb, var(--black) 10%, transparent);

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
  }

  .content {
    display: flex;
    flex-direction: column;
  }

  .question {
    padding: 1em;
  }

  .buttons {
    display: flex;
    justify-content: end;
    gap: 1em;
  }
</style>
