<script lang="ts">
  import { login } from './vkapi/auth'
  import Search from './Search.svelte'
  import { onMount } from 'svelte'
  import { search } from './engine'

  login()

  function onSearch() {
    search()
  }

  onMount(() => {
    // @ts-ignore
    M.Modal.init(document.querySelectorAll('.modal'), {})
    // @ts-ignore
    M.FormSelect.init(document.querySelectorAll('select'), {})
  })
</script>

<main class="container">
  <h1>VKFind</h1>
  <Search on:search={onSearch} />
</main>
