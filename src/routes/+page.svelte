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
      <a class="unimportant" href="/">ahkbin</a>
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
  <div class="dialog-content">Do you want to clear the current script?</div>

  <div class="dialog-buttons">
    <button onclick={() => (confirmationOpen = false)}>Cancel</button>
    <button
      class="dangerous"
      onclick={() => {
        script = "";
        confirmationOpen = false;
      }}>Clear</button
    >
  </div>
</Dialog>

<Dialog bind:open={settingsOpen}>
  <div class="dialog-content">Settings</div>

  <div class="dialog-buttons">
    <button onclick={() => (settingsOpen = false)}>Cancel</button>
    <button class="positive">Save</button>
  </div>
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

  @media (width < 24rem) {
    .unimportant {
      display: none;
    }
  }

  .dialog-content {
    margin: 1em;
  }

  .dialog-buttons {
    display: flex;
    justify-content: end;
    gap: 1em;
  }

  .dialog-buttons button {
    padding: 0.5em 1em;
    color: var(--black);
  }

  .dialog-buttons button {
    --accent-color: var(--magic);
  }

  .dialog-buttons button.dangerous {
    --accent-color: var(--coral);
  }

  .dialog-buttons button.positive {
    --accent-color: var(--slime);
  }

  .dialog-buttons button:hover {
    background-color: color-mix(in srgb, var(--accent-color) 20%, transparent);
  }

  @media (hover: none) {
    .dialog-buttons button {
      background-color: color-mix(in srgb, var(--accent-color) 10%, transparent);
    }
  }
</style>
