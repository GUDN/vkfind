import { get } from 'svelte/store'
import * as rawOptions from '../stores/searchOptions'

interface BasePerson {
  userId: number
  closed: boolean
}

export interface SearchOptions {
  firstName: string
  lastName: string
  basePersons: Set<BasePerson>
}

export let options: SearchOptions = null

export function initOptions() {
  let name: string[]
  rawOptions.name.rawSubscribe(arg => (name = arg))()
  const basePersons: Set<BasePerson> = new Set()
  for (const person of get(rawOptions.basePersons)) {
    if (person.error || !person.userId) continue
    basePersons.add({
      userId: person.userId,
      closed: person.closed,
    })
  }
  options = {
    firstName: name[0],
    lastName: name[1],
    basePersons,
  }
}
