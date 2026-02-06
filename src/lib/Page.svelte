<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";
  import { AtSign, Cog, Github, Heart, Info } from "@lucide/svelte";
  import Dialog from "./Dialog.svelte";
  import Link from "./Link.svelte";

  interface Props {
    children: Snippet;
    headerStart: Snippet;
    headerEnd: Snippet;
  }

  let { children, headerStart, headerEnd }: Props = $props();

  let aboutDialogOpen = $state(false);
</script>

<div class="page">
  <header>
    <div class="together">
      {@render headerStart()}
    </div>
    <div class="together">
      {@render headerEnd()}
    </div>
  </header>

  <main>
    {@render children()}
  </main>

  <footer>
    <Button>
      <Cog size={16} /> Settings
    </Button>

    <Button onclick={() => (aboutDialogOpen = true)}>
      <Info size={16} /> About
    </Button>
  </footer>
</div>

<Dialog dismissable bind:open={aboutDialogOpen}>
  <div class="dialog-header">
    <span>The new ahkbin! <span>(version {__BUILD_INFO__.version})</span></span>
    <Heart fill="currentColor" size={32} />
  </div>
  <span>Made by SimplyMika, with lots of help from:<br />Geek, vieira, ShambleS, Florence, and Descolada.</span>
  <span>Made for the wonderful AutoHotkey community.</span>
  <hr />
  <span> For any suggestions, bug reports, or general feedback: </span>
  <span>
    <Link color="slate" href="mailto:ahkbin@simplymika.com"><AtSign size={16} /> E-mail me</Link>
    or
    <Link color="slate" target="_blank" href="https://github.com/ahkdiscord/pastebin/issues/new"
      ><Github size={16} /> Open a GitHub Issue</Link>
  </span>
</Dialog>

<style>
  .page {
    display: grid;
    grid-template-rows: auto 1fr;
    width: 100%;
    height: 100%;
  }

  .page > * {
    min-height: 0;
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5em;

    padding: 0.5em;

    background-color: var(--black);
  }

  .together {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: inherit;
  }

  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5em;

    padding: 0.5em;

    background-color: var(--black);
  }

  .dialog-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
  }

  span {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5em;
    text-align: center;
  }

  hr {
    margin-inline: 2em;
    border: none;
    height: 1px;
    background-color: var(--smoke);
  }
</style>
