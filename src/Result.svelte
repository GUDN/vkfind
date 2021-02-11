<script lang="ts">
  import type { Result } from './engine/result'
  export let user: Result
</script>

<div class="row">
  <div class="col s12">
    {#if user}
      <div class="card">
        <div class="card-content">
          <img src={user.photo} class="circle" alt="" />
          <h5 class="center-align">
            {user.name}, ({user.settedCity ?? 'город не указан'}, probability: {user.probability.toFixed(
              3
            )})
          </h5>
        </div>
        <div class="card-action">
          <a target="_blank" href="https://vk.com/id{user.userId}"
            >Открыть профиль</a
          >
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
  }

  .card-action {
    padding: 12px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  h5 {
    margin: 0;
    flex-grow: 1;
  }

  img {
    height: 50px;
    width: 50px;
  }

  .row {
    margin-bottom: 0px;
  }
</style>
