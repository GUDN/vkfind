import { writable } from 'svelte/store'

export interface BasePerson {
  raw: string
  key: number
  value?: string
  userId?: number
}

export enum Gender {
  Unknown,
  Male,
  Female,
  Unsetted,
}

export const name = (() => {
  const { subscribe, set } = writable('')

  return {
    subscribe,
    set,
  }
})()

export const basePersons = (() => {
  const { subscribe, update, set } = writable<BasePerson[]>([])

  return {
    subscribe,
    clear: () => set([]),
    removeEmpty: () => update(arr => arr.filter(val => !!val.raw)),
    addEmpty: () => update(arr => [...arr, { raw: '', key: Date.now() }]),
    update: (i: number, raw: string) =>
      update(arr => {
        arr[i].raw = raw
        arr[i].value = arr[i].raw + '!' // TODO fetch userId and name from vkapi
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
