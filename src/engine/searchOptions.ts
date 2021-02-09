import FuzzySet from 'fuzzyset.js'
import { get } from 'svelte/store'
import * as rawOptions from '../stores/searchOptions'
import { userId } from '../vkapi/auth'

interface BasePerson {
  userId: number
  closed: boolean
}

export interface SearchOptions {
  firstNames: FuzzySet
  lastNames: FuzzySet
  basePersons: Set<BasePerson>
  distancePenalty: (x: number) => number
}

export let options: SearchOptions = null

export function initOptions() {
  let name: string[]
  rawOptions.name.rawSubscribe(arg => (name = arg))()
  const firstNames = new FuzzySet(
    name
      .filter(val => !val.startsWith('#'))
      .map(val => (val.startsWith('@') ? val.slice(1) : val))
  )
  const lastNames = new FuzzySet(
    name
      .filter(val => !val.startsWith('@'))
      .map(val => (val.startsWith('#') ? val.slice(1) : val))
  )

  const basePersons: Set<BasePerson> = new Set()
  for (const person of get(rawOptions.basePersons)) {
    if (person.error || !person.userId) continue
    basePersons.add({
      userId: person.userId,
      closed: person.closed,
    })
  }
  if (basePersons.size == 0) {
    basePersons.add({
      userId: userId,
      closed: false,
    })
  }

  const n = 3 / 4
  const c = 3
  const distancePenalty = (x: number) =>
    Math.abs(c * x - x ** 2) + x ** 2 - x * (c - n)

  options = {
    firstNames,
    lastNames,
    basePersons,
    distancePenalty,
  }
}
