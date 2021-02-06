<script lang="ts">
  import { results } from './stores/searchResults'
  import { userId } from './vkapi/auth'
</script>

<div>
  {#each $results as result (result.userId)}
    <p>
      {result.name} (<a href="https://vk.com/id{result.userId}"
        >{result.userId}</a
      >, {result.probability})
    </p>
  {/each}
</div>

<style>
  div {
    width: 100%;

    overflow-y: auto;
  }
</style>
