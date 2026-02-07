<script>
  import { enhance } from "$app/forms";
  import Button from "$lib/Button.svelte";
  import { LogIn } from "@lucide/svelte";
</script>

<form method="POST" use:enhance>
  <h1>Login</h1>

  <input type="text" name="username" placeholder="Username" autocomplete="username" />
  <input type="password" name="password" placeholder="Password" autocomplete="current-password" />
  <Button type="submit"><LogIn /></Button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 2em;

    background-color: var(--night);
    padding: 2em;
    border-radius: 0.5em;
  }

  h1 {
    margin: 0;
    text-align: center;
  }

  input {
    padding-block: 0.5em;
    padding-inline: 1em;

    min-height: 1lh;
    box-sizing: content-box;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5em;

    background-color: var(--slate);
    border: none;
    border-radius: 0.5em;

    color: inherit;
    font: unset;
  }

  input:focus {
    outline: 2px solid var(--smoke);
  }
</style>
