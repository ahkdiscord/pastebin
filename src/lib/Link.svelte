<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  export interface Props extends HTMLAnchorAttributes {
    children: Snippet;
    active?: boolean;
    color?: "shell" | "slate" | "magic" | "slime" | "coral" | "clear";
  }

  const { children, active, color, ...rest }: Props = $props();
</script>

<a {...rest} class:active class={{[color ?? ""]: true}}>
  {@render children()}
</a>

<style>
  a {
    --this-highlight: color-mix(in srgb, 25% var(--highlight, var(--shell)), transparent);

    padding-block: 0.5em;
    padding-inline: 1em;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;

    background-color: color-mix(in srgb, 50% var(--this-highlight), transparent);
    border: none;
    border-radius: 0.5em;

    color: inherit;
    cursor: pointer;
  }

  a.shell {
    --highlight: var(--shell);
  }

  a.slate {
    --highlight: var(--slate);
  }

  a.magic {
    --highlight: var(--magic);
  }

  a.slime {
    --highlight: var(--slime);
  }

  a.coral {
    --highlight: var(--coral);
  }

  a.clear {
    --highlight: transparent;
  }

  a:hover, a.active {
    background-color: var(--this-highlight);
  }

  @media (hover: none) {
    a {
      background-color: var(--this-highlight);
    }
  }
</style>