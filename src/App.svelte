<script lang="ts">
  import Searchbar from './Searchbar.svelte'

  function onSearchbar(event: CustomEvent) {
    const value = event.detail as string
    console.log(`Searching ${value}...`)
  }
</script>

<main class="container">
  <h1>VKFind App</h1>
  <Searchbar on:search={onSearchbar} />
</main>
