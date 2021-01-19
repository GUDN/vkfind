<script lang="ts">
  import { login } from './vkapi/auth'
  import Searchbar from './Searchbar.svelte'

  login()

  function onSearchbar(event: CustomEvent) {
    const value = event.detail as string
    console.log(`Searching ${value}...`)
  }
</script>

<main class="container">
  <h1>VKFind</h1>
  <Searchbar on:search={onSearchbar} />
</main>
