<script lang="ts">
  import { results } from './stores/searchResults'
  import Result from './Result.svelte'
</script>

<div>
  {#each $results as result (result.userId)}
    <Result user={result} />
  {/each}
</div>

<style>
  div {
    width: 100%;

    overflow-y: auto;
  }
</style>
