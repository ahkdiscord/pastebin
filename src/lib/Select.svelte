<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLSelectAttributes } from "svelte/elements";
  import Button from "./Button.svelte";
  import { fly } from "svelte/transition";
  import { ChevronDown } from "@lucide/svelte";

  export interface Props {
    children: Snippet;
    options: Snippet;
    color?: "shell" | "slate" | "magic" | "slime" | "coral";
  }

  const { children, options, color }: Props = $props();

  let expanded = $state(false);

  export function close() {
    expanded = false;
  }
</script>

<div class="wrapper">
  <Button active={expanded} {color} onclick={() => expanded = !expanded}>
    {@render children()}

    <div class="chevron" class:rotated={expanded}><ChevronDown size={16}/></div>
  </Button>
  
  {#if expanded}
    <div class="dropdown" transition:fly={{y: -8, duration: 250}}>
      <div class="shape">
        <div class="options" onclick={close} role="none">
          {@render options()}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .dropdown {
    z-index: 1;
    min-width: 100%;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    padding-block-start: 0.5em;
  }
  
  .shape {
    background-color: var(--shell);
    color: var(--black);
    border-radius: 0.5em;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .chevron {
    transition: transform 0.25s ease;
    display: flex;
  }

  .chevron.rotated {
    transform: rotateZ(180deg);
  }
</style>