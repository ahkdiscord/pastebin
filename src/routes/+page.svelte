<script lang="ts">
  import Confirmation from "$lib/Confirmation.svelte";
  import Editor from "$lib/Editor.svelte";
  import { onMount } from "svelte";

  let script: string = $state("");

  let confirmationOpen: boolean = $state(false);

  function newClicked() {
    if (script === "") return;

    confirmationOpen = true;
  }

  onMount(() => {
    if (!script) {
      script = localStorage.getItem("script") ?? script;
    }
  });

  $effect(() => {
    localStorage.setItem("script", script);
  });
</script>

<form method="POST">
  <header>
    <nav>
      <ul>
        <li>
          <button type="button" onclick={newClicked}>new</button>
        </li>
      </ul>
      <a href="/">ahkbin</a>
      <ul>
        <li><button type="submit">paste</button></li>
      </ul>
    </nav>
  </header>
  <input type="hidden" name="script" value={script} />
</form>

<Editor bind:content={script} />

<Confirmation bind:open={confirmationOpen}>
  Do you want to clear the current script?

  {#snippet yes()}
    <button
      class="dialog-button dangerous"
      onclick={() => {
        script = "";
        confirmationOpen = false;
      }}>Clear</button
    >
  {/snippet}

  {#snippet no()}
    <button class="dialog-button" onclick={() => (confirmationOpen = false)}>Cancel</button>
  {/snippet}
</Confirmation>

<style>
  header {
    background-color: var(--black);
    color: var(--white);

    display: flex;
    align-items: center;
    padding: 0.25em 0.5em;

    font-size: 1.5rem;
  }

  nav {
    display: flex;
    align-items: baseline;
    flex-grow: 1;
  }

  ul {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 1em;

    margin: 0;
    padding: 0;
    list-style: none;
    flex-grow: 1;
  }

  ul:first-child {
    justify-content: start;
  }

  ul:last-child {
    justify-content: end;
  }

  a {
    text-decoration: unset;
    color: unset;
    display: block;
  }

  button,
  a {
    border: none;
    border-radius: 0.25em;
    padding: 0.25em 0.5em;
    color: inherit;
    background-color: transparent;
    font-size: inherit;
    cursor: pointer;
  }

  header button:hover,
  header a:hover {
    background-color: var(--slate);
  }

  .dialog-button {
    padding: 0.5em 1em;
    color: var(--black);
  }

  .dialog-button:hover {
    background-color: color-mix(in srgb, var(--magic) 20%, transparent);
  }

  .dialog-button.dangerous:hover {
    background-color: color-mix(in srgb, var(--coral) 20%, transparent);
  }
</style>
