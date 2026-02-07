<script>
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Output from "$lib/Output.svelte";
  import { Play } from "@lucide/svelte";

  let sqlScript = $state("");
  let sqlOutput = $state("");

  async function runSqlScript() {
    const response = await fetch("/admin/debug", { method: "POST", body: sqlScript });

    const result = await response.text();

    sqlOutput = result;
  }
</script>

<div class="wrapper">
  <h2>The “oh fuck” machine (runs arbitrary sql commands)</h2>
  <span class="row">
    <div class="sql-input">
      <Editor bind:content={sqlScript} language="none" />
    </div>
    <Button color="coral" type="submit" disabled={!sqlScript} onclick={runSqlScript}>
      <Play color="var(--coral)" />
    </Button>
  </span>
  <div class="sql-output">
    <Output content={sqlOutput} />
  </div>
</div>

<style>
  .wrapper {
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
    overflow: clip;
  }

  .sql-output {
    height: 8lh;

    border-radius: 0.5em;
    overflow: clip;
  }
</style>
