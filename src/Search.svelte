<script lang="ts">
  import SearchExtra from './SearchExtra.svelte'
  import { createEventDispatcher } from 'svelte'
  import { name } from './stores/searchOptions'

  const dispatch = createEventDispatcher()
  let extra: SearchExtra

  function onSubmit() {
    dispatch('search')
  }
</script>

<form class="container" on:submit|preventDefault={onSubmit}>
  <div class="row valign-wrapper">
    <div class="input-field">
      <i class="material-icons prefix">person_search</i>
      <input placeholder="Enter name..." bind:value={$name} />
    </div>
    <div class="col">
      <button
        class="btn-small waves-effect light-blue"
        on:click|preventDefault={extra.open}>Опции</button
      >
    </div>
    <div class="col">
      <button type="submit" class="btn-small waves-effect blue accent-4">
        <i class="material-icons">search</i>
      </button>
    </div>
  </div>
</form>

<SearchExtra bind:this={extra} />

<style>
  form {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  div.row {
    margin-bottom: 0;
  }

  input:focus {
    border-bottom: 1px solid #03a9f4 !important;
    box-shadow: 1px solid 0 0 #03a9f4 !important;
  }

  div.input-field {
    width: 80%;
  }
</style>
