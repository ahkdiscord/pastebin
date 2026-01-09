<script lang="ts">
  import Editor from "$lib/Editor.svelte";

  let script = $state("test");

  let length = $derived(script.length);

  function newClicked() {
    console.log("click");
  }
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

  <Editor
    initialContent={script}
    onUpdate={content => {
      script = content;
    }}
  />

  <div>
    The document is {length} characters long.
  </div>
</form>

<style>
  header {
    position: sticky;

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

  button:hover,
  a:hover {
    background-color: var(--slate);
  }
</style>
