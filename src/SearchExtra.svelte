<script lang="ts">
  import {
    basePersons,
    realCity,
    settedCity,
    Gender,
    gender,
    age,
  } from './stores/searchOptions'

  let modalElem: HTMLElement

  export function open() {
    // @ts-ignore
    M.Modal.getInstance(modalElem).open()
  }

  function switchInput(i: number) {
    setTimeout(() => {
      document.getElementById(`search-extra-base-${i}`)?.focus()
    }, 100)
  }
</script>

<div class="modal bottom-sheet" id="search-extra" bind:this={modalElem}>
  <form class="modal-content">
    <div class="row">
      <div class="input-field col s12 m6">
        <i class="material-icons prefix">apartment</i>
        <input
          id="search-extra-setted-city"
          type="text"
          bind:value={$settedCity}
        />
        <label for="search-extra-setted-city">Город</label>
        <span class="helper-text">Город, указанный в профиле</span>
      </div>
      <div class="input-field col s12 m6">
        <i class="material-icons prefix">location_city</i>
        <input id="search-extra-real-city" type="text" bind:value={$realCity} />
        <label for="search-extra-real-city">Настоящий город</label>
        <span class="helper-text">Наиболее частый город среди друзей</span>
      </div>
    </div>
    <div class="row">
      <div class="input-field col s12 m6">
        <i class="material-icons prefix">hourglass_full</i>
        <input id="search-extra-age" type="number" bind:value={$age} />
        <label for="search-extra-age">Предполагаемый возраст</label>
        <span class="helper-text">Учитывается, если указан</span>
      </div>
      <div class="input-field col s12 m6">
        <i class="material-icons prefix">family_restroom</i>
        <select id="search-extra-gender" bind:value={$gender}>
          <option value={Gender.Unknown} selected>Неизвестен</option>
          <option value={Gender.Male}>Мужской</option>
          <option value={Gender.Female}>Женский</option>
          <option value={Gender.Unsetted}>Не указан</option>
        </select>
        <label for="search-extra-gender">Пол</label>
      </div>
    </div>
    <div class="col s12">
      {#each $basePersons as { error, value, key }, i (key)}
        <div class="row valign-wrapper">
          <div class="input-field col s10">
            <i class="material-icons prefix">person</i>
            <input
              type="text"
              id={`search-extra-base-${i}`}
              on:keydown={event => {
                if (event.key == 'Enter') {
                  event.preventDefault()
                  if (i == $basePersons.length - 1) {
                    basePersons.addEmpty()
                  }
                  switchInput(i + 1)
                }
              }}
              on:change={event => {
                basePersons.update(i, event.currentTarget.value)
              }}
              class:invalid={error}
            />
            <label for={`search-extra-base-${i}`}>{i + 1}</label>
            {#if value}
              <span class="helper-text">{value}</span>
            {/if}
          </div>
          <button
            class="btn blue col s2"
            on:click|preventDefault={() => basePersons.remove(i)}>
            <i class="material-icons">delete</i>
          </button>
        </div>
      {/each}
      <div
        class="row"
        on:click|preventDefault={() => {
          basePersons.addEmpty()
          switchInput($basePersons.length - 1)
        }}
      >
        <div class="col s6">
          Укажите тех, кто предположительно связан с целью
        </div>
        <button class="btn blue col s3 push-s3">
          <i class="material-icons left">add</i>
          Add
        </button>
      </div>
    </div>
  </form>
  <div class="modal-footer">
    <!-- svelte-ignore missing-declaration -->
    <button
      class="waves-effect btn light-blue"
      on:click={() => {
        // @ts-ignore
        M.Modal.getInstance(modalElem).close()
        basePersons.removeEmpty()
      }}>Закрыть</button
    >
  </div>
</div>

<style>
  :global(.dropdown-content li > span) {
    color: black !important;
  }
</style>
