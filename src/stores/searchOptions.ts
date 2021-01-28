import { getBaseInfo } from '../vkapi/getBaseInfo'

import { writable } from 'svelte/store'

export interface BasePerson {
  raw: string
  key: number
  value?: string
  userId?: number
  closed?: boolean
  error: boolean
}

export enum Gender {
  Unknown,
  Male,
  Female,
  Unsetted,
}

export const name = (() => {
  const store = writable<string[]>([])

  return {
    subscribe(callback: (arg: string) => void) {
      return store.subscribe(value => callback(value.join(' ')))
    },
    set(value: string) {
      let splitted = value
        .split(' ')
        .filter(v => v.length > 0)
        .slice(0, 2)
      store.set(splitted)
    },
  }
})()

export const basePersons = (() => {
  const { subscribe, update, set } = writable<BasePerson[]>([])

  return {
    subscribe,
    clear: () => set([]),
    removeEmpty: () => update(arr => arr.filter(val => !!val.raw)),
    addEmpty: () =>
      update(arr => [...arr, { raw: '', key: Date.now(), error: false }]),
    update: (i: number, raw: string) =>
      update(arr => {
        arr[i].raw = raw
        getBaseInfo(raw).then(result => {
          if (result == null) {
            arr[i].value = 'Пользователь не найден'
            arr[i].error = true
            return
          }
          arr[i].value = result.value
          arr[i].closed = result.closed
          arr[i].userId = result.userId
          arr[i].error = false
          update(arr => arr)
        })
        return arr
      }),
    remove: (i: number) =>
      update(arr => {
        arr.splice(i, 1)
        return arr
      }),
  }
})()

export const gender = (() => {
  const { subscribe, set } = writable(Gender.Unknown)
  return {
    subscribe,
    set,
  }
})()

export const settedCity = (() => {
  const { subscribe, set } = writable('')

  return {
    subscribe,
    set,
  }
})()

export const realCity = (() => {
  const { subscribe, set } = writable('')

  return {
    subscribe,
    set,
  }
})()

export const age = (() => {
  const { subscribe, set } = writable(-1)

  return {
    subscribe,
    set,
  }
})()
