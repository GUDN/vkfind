<script lang="ts">
  import { login } from './vkapi/auth'
  import Search from './Search.svelte'
  import { onMount } from 'svelte'
  import { search, SearchEngine } from './engine'
  import { start } from './utils/networkQueue'
  import Results from './Results.svelte'

  login()
  start()
  let headerText: string = 'VKFind'
  let engine: SearchEngine = null

  function onSearch() {
    engine?.stop()
    headerText = 'Initializing search'
    engine = null
    search()
      .then(engine_ => {
        headerText = 'Search ready'
        engine = engine_
        engine.bindEndCallback(() => (headerText = 'Search end'))
        engine.start()
        headerText = 'Searching (tap to pause)'
      })
      .catch((e: Error) => alert(e.message))
  }

  onMount(() => {
    // @ts-ignore
    M.Modal.init(document.querySelectorAll('.modal'), {})
    // @ts-ignore
    M.FormSelect.init(document.querySelectorAll('select'), {})
  })

  function headerClickHandler() {
    if (engine == null) return
    if (engine.isWorking) {
      engine.stop()
      headerText = 'Pause (tap to unpause)'
    } else {
      engine.start()
      headerText = 'Searching (tap to pause)'
    }
  }
</script>

<main class="container">
  <h1>
    <button on:click={headerClickHandler}>{headerText}</button>
  </h1>
  <Results />
  <Search on:search={onSearch} />
</main>

<style>
  :global(body, html) {
    height: 100%;
  }
  button {
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    background: transparent;
    width: 100%;
    height: 100%;
    text-align: start;
  }

  main {
    height: 100%;
    display: flex;
    flex-direction: column;

    justify-content: space-between;
  }
</style>
