<script>
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Output from "$lib/Output.svelte";
  import { ChevronRight, Play } from "@lucide/svelte";

  let sqlScript = $state("");
  let sqlOutput = $state("");

  async function runSqlScript() {
    const response = await fetch("/admin/debug/sql", { method: "POST", body: sqlScript });

    const result = await response.text();

    sqlOutput = result;
  }

  let passwordInput = $state("");
  let passwordOutput = $state("");

  async function hashPassword() {
    const response = await fetch("/admin/debug/pw", { method: "POST", body: passwordInput });

    const result = await response.text();

    passwordOutput = result;
  }
</script>

<div class="wrapper">
  <section>
    <h2>The “oh fuck” machine (runs arbitrary sql commands)</h2>
    <span class="row">
      <div class="sql-input">
        <Editor bind:content={sqlScript} language="none" />
      </div>
      <Button color="coral" disabled={!sqlScript} onclick={runSqlScript}>
        <Play color="var(--coral)" />
      </Button>
    </span>
    <div class="sql-output">
      <Output content={sqlOutput} />
    </div>
  </section>
  <section>
    <h2>User password hasher</h2>
    <span class="row">
      <input type="text" bind:value={passwordInput} />
      <Button disabled={!passwordInput} onclick={hashPassword}><ChevronRight size={16} /></Button>
      <input type="input" value={passwordOutput} readonly />
    </span>
  </section>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 2em;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1em;
  }

  h2 {
    color: var(--paper);
    margin: 0;
    text-align: center;
    font-weight: normal;
  }

  .row {
    display: flex;
    flex-direction: row;
    gap: 1em;
  }

  .sql-input {
    flex: 1;
    height: 8lh;

    border-radius: 0.5em;
    overflow: hidden;
  }

  .sql-output {
    height: 8lh;

    border-radius: 0.5em;
    overflow: clip;
  }

  input {
    flex: 1;

    --this-highlight: color-mix(in srgb, 25% var(--highlight, var(--shell)), transparent);

    padding-block: 0.5em;
    padding-inline: 1em;

    min-height: 1lh;
    box-sizing: content-box;

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
  input:focus {
    outline: none;
  }
</style>
