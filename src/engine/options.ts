import FuzzySet from 'fuzzyset.js'
import { get } from 'svelte/store'
import * as rawOptions from '../stores/searchOptions'
import { userId } from '../vkapi/auth'

interface BasePerson {
  userId: number
  closed: boolean
}

export interface SearchOptions {
  firstNameScore: (name: string) => number
  lastNameScore: (name: string) => number
  basePersons: Set<BasePerson>
  distanceScore: (x: number) => number
}

export let options: SearchOptions = null

export function initOptions() {
  let name: string[]
  rawOptions.name.rawSubscribe(arg => (name = arg))()
  const firstNamesSet = new FuzzySet()
  const lastNamesSet = new FuzzySet()
  for (const val of name) {
    if (val.startsWith('@')) {
      firstNamesSet.add(val.slice(1))
    } else if (val.startsWith('#')) {
      lastNamesSet.add(val.slice(1))
    } else {
      firstNamesSet.add(val)
      lastNamesSet.add(val)
    }
  }

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
  const distanceScore = (x: number) =>
    -(Math.abs(c * x - x ** 2) + x ** 2 - x * (c - n))

  options = {
    firstNameScore: name => {
      const names: [number, string][] = firstNamesSet.get(name, [])
      if (names.length > 0) {
        return 20 * names[0][0] + 15 * Number(names[0][1] == name)
      }
      return 0
    },
    lastNameScore: name => {
      const names: [number, string][] = lastNamesSet.get(name, [])
      if (names.length > 0) {
        return 30 * names[0][0] + 10 * Number(names[0][1] == name)
      }
      return 0
    },
    basePersons,
    distanceScore,
  }
}
