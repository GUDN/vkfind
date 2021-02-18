import FuzzySet from 'fuzzyset.js'
import CyrillicToTranslit from 'cyrillic-to-translit-js'
import { get } from 'svelte/store'
import { Gender } from '../stores/searchOptions'
import * as rawOptions from '../stores/searchOptions'
import { userId } from '../vkapi/auth'

const cyrillicToTranslit = new CyrillicToTranslit()
interface BasePerson {
  userId: number
  closed: boolean
}

export interface SearchOptions {
  firstNameScore: (name: string) => number
  lastNameScore: (name: string) => number
  basePersons: Set<BasePerson>
  distanceScore: (x: number) => number
  genderScore: (gender: Gender) => number
  settedCityScore: (settedCity: string | null) => number
  realCityScore: (realCity: string | null) => number
}

export let options: SearchOptions = null

export function initOptions() {
  let name: string[]
  rawOptions.name.rawSubscribe(arg => (name = arg))()
  const firstNamesSet = new FuzzySet()
  const lastNamesSet = new FuzzySet()
  for (let val of name) {
    val = val.toLowerCase()
    if (val.startsWith('@!')) {
      firstNamesSet.add(val.slice(2))
    } else if (val.startsWith('#!')) {
      lastNamesSet.add(val.slice(2))
    } else if (val.startsWith('@')) {
      val = val.slice(1)
      firstNamesSet.add(val)
      firstNamesSet.add(cyrillicToTranslit.transform(val))
    } else if (val.startsWith('#')) {
      val = val.slice(1)
      lastNamesSet.add(val)
      lastNamesSet.add(cyrillicToTranslit.transform(val))
    } else if (val.startsWith('!')) {
      val = val.slice(1)
      firstNamesSet.add(val)
      lastNamesSet.add(val)
    } else {
      firstNamesSet.add(val)
      lastNamesSet.add(val)
      firstNamesSet.add(cyrillicToTranslit.transform(val))
      lastNamesSet.add(cyrillicToTranslit.transform(val))
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

  const gender = get(rawOptions.gender)
  const genderScore =
    gender == Gender.Unknown
      ? (_: any) => 0
      : (x: Gender) => (x == gender ? 5 : -1)

  const settedCity = get(rawOptions.settedCity).toLowerCase()
  const settedCityScore = settedCity
    ? (x: string | null) => {
        if (x == null) return 0
        return x.toLowerCase() == settedCity ? 5 : -3
      }
    : (_: string) => 0

  const realCity = get(rawOptions.realCity).toLowerCase() || settedCity
  const realCityScore = realCity
    ? (x: string | null) => {
        if (x == null) return 0
        return x.toLowerCase() == realCity ? 5 : -3
      }
    : (_: string) => 0

  options = {
    firstNameScore: name => {
      name = name.toLowerCase()
      const names: [number, string][] = firstNamesSet.get(name, [])
      if (names.length > 0) {
        return 20 * names[0][0] + 15 * Number(names[0][1] == name)
      }
      return 0
    },
    lastNameScore: name => {
      name = name.toLowerCase()
      const names: [number, string][] = lastNamesSet.get(name, [])
      if (names.length > 0) {
        return 30 * names[0][0] + 10 * Number(names[0][1] == name)
      }
      return 0
    },
    basePersons,
    distanceScore,
    genderScore,
    settedCityScore,
    realCityScore,
  }
}
