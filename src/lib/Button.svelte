<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  export interface Props extends HTMLButtonAttributes {
    children: Snippet;
    active?: boolean;
    color?: "shell" | "slate" | "magic" | "slime" | "coral" | "clear";
  }

  const { children, active, color, ...rest }: Props = $props();
</script>

<button {...rest} class:active class={{ [color ?? ""]: true }}>
  {@render children()}
</button>

<style>
  button {
    --this-highlight: color-mix(in srgb, 25% var(--highlight, var(--shell)), transparent);

    padding-block: 0.5em;
    padding-inline: 1em;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5em;

    background-color: color-mix(in srgb, 50% var(--this-highlight), transparent);
    border: none;
    border-radius: 0.5em;

    color: inherit;
    font: unset;
  }
  button:not(:disabled) {
    cursor: pointer;
  }

  button.shell {
    --highlight: var(--shell);
  }

  button.slate {
    --highlight: var(--slate);
  }

  button.magic {
    --highlight: var(--magic);
  }

  button.slime {
    --highlight: var(--slime);
  }

  button.coral {
    --highlight: var(--coral);
  }

  button.clear {
    --highlight: transparent;
  }

  button:not(:disabled):hover,
  button.active {
    background-color: var(--this-highlight);
  }

  @media (hover: none) {
    button {
      background-color: var(--this-highlight);
    }
  }
</style>
