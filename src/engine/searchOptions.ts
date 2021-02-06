import FuzzySet from 'fuzzyset.js'
import { get } from 'svelte/store'
import * as rawOptions from '../stores/searchOptions'

interface BasePerson {
  userId: number
  closed: boolean
}

export interface SearchOptions {
  firstNames: FuzzySet
  lastNames: FuzzySet
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
  const firstNames = name
    .filter(val => !val.startsWith('#'))
    .map(val => (val.startsWith('@') ? val.slice(1) : val))
  const lastNames = name
    .filter(val => !val.startsWith('@'))
    .map(val => (val.startsWith('#') ? val.slice(1) : val))
  options = {
    firstNames: new FuzzySet(firstNames),
    lastNames: new FuzzySet(lastNames),
    basePersons,
  }
}
