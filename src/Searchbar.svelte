<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  export let value: string = ''

  function onSubmit() {
    dispatch('search', value)
    value = ''
  }
</script>

<form class="container" on:submit|preventDefault={onSubmit}>
  <div class="row valign-wrapper">
    <div class="input-field col s9">
      <input placeholder="Enter name..." bind:value />
    </div>
    <button type="submit" class="btn col s2 waves-effect light-blue">
      Search
      <i class="material-icons right">search</i>
    </button>
    <div class="col s1">
      <button class="btn-small waves-effect blue accent-4">
        <i class="material-icons">fullscreen</i>
      </button>
    </div>
  </div>
</form>

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
</style>
