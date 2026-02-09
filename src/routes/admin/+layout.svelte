<script lang="ts">
  import { page } from "$app/state";
  import Link from "$lib/Link.svelte";
  import { LogOut } from "@lucide/svelte";
  import { fly } from "svelte/transition";

  const { children, data } = $props();
</script>

<div class="wrapper">
  <header>
    <span class="together padded">
      <h1>ahkbin!dashboard</h1>
      <h2>{__BUILD_INFO__.version}</h2>
    </span>
    <span class="together">
      <Link href="/admin" active={page.route.id === "/admin"}>Overview</Link>
      <Link href="/admin/pastes" active={page.route.id === "/admin/pastes"}>Pastes</Link>
      <Link href="/admin/debug" active={page.route.id === "/admin/debug"}>Debug</Link>
    </span>
    <span class="together padded">
      Logged in as: {data.user.name}
      <Link href="/admin/login" data-sveltekit-preload-data="off">
        <LogOut size={16} />
      </Link>
    </span>
  </header>
  <main>
    {#key page.route}
      <div class="animation-wrapper" in:fly={{ x: "1em" }} out:fly={{ x: "-1em" }}>
        {@render children()}
      </div>
    {/key}
  </main>
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;

    background-color: var(--night);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5em;
  }

  .together {
    display: flex;
    align-items: inherit;
    gap: inherit;
  }

  .padded {
    padding: 0.5em;
  }

  h1,
  h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: normal;
  }

  h2 {
    color: var(--paper);
  }

  main {
    background-color: var(--black);
    border-radius: 1.5em;

    width: min(100%, 64em);
    justify-self: center;

    display: grid;

    position: relative;
  }

  .animation-wrapper {
    position: absolute;
    width: 100%;

    padding: 1em;
    box-sizing: border-box;
  }
</style>
