<script lang="ts">
  import Dialog from "$lib/Dialog.svelte";
  import Editor from "$lib/Editor.svelte";
  import SettingsIcon from "$lib/SettingsIcon.svelte";
  import { onMount } from "svelte";

  let script: string = $state("");

  let confirmationOpen: boolean = $state(false);
  let settingsOpen: boolean = $state(false);

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
          <button
            type="button"
            onclick={() => {
              if (script === "") return;

              confirmationOpen = true;
            }}>new</button
          >
        </li>
      </ul>
      <a href="/">ahkbin</a>
      <button class="icon" type="button" onclick={() => (settingsOpen = true)}>
        <SettingsIcon />
      </button>
      <ul>
        <li><button type="submit">paste</button></li>
      </ul>
    </nav>
  </header>
  <input type="hidden" name="script" value={script} />
</form>

<Editor bind:content={script} />

<Dialog bind:open={confirmationOpen}>
  Do you want to clear the current script?

  {#snippet buttons()}
    <button class="dialog-button" onclick={() => (confirmationOpen = false)}>Cancel</button>
    <button
      class="dialog-button dangerous"
      onclick={() => {
        script = "";
        confirmationOpen = false;
      }}>Clear</button
    >
  {/snippet}
</Dialog>

<Dialog bind:open={settingsOpen}>
  Settings

  {#snippet buttons()}
    <button class="dialog-button" onclick={() => (settingsOpen = false)}>Cancel</button>
    <button class="dialog-button positive">Save</button>
  {/snippet}
</Dialog>

<style>
  header {
    background-color: var(--black);
    color: var(--white);

    display: flex;
    align-items: center;
    padding: 0.25em;

    font-size: 1.5rem;
    line-height: 1.5;
  }

  nav {
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: 0.5em;
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

  button.icon {
    align-self: center;
    padding: 0.5em;
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

  .dialog-button.positive:hover {
    background-color: color-mix(in srgb, var(--slime) 20%, transparent);
  }
</style>
