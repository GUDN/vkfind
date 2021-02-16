import Queue from '../utils/priorityQueue'
import { getUsers } from '../vkapi/user'
import { getFriends } from '../vkapi/friends'
import { compare, Item } from './item'
import { Result } from './result'
import { initOptions, options, SearchOptions } from './options'
import { results as resultsStore } from '../stores/searchResults'
import { getMutual } from '../vkapi/mutual'

let queue = new Queue(compare)
let viewed = new Set<number>()
export class SearchEngine {
  private _results: Result[] = []
  private works: boolean = false
  private endCallback: () => void = null

  constructor() {
    this._results = []
    this.works = false
    this.endCallback = null
  }

  bindEndCallback(callback: () => void) {
    this.endCallback = callback
  }

  start() {
    this.works = true
    this.doIteration()
  }

  stop() {
    this.works = false
  }

  async doIteration() {
    if (queue.length == 0) {
      this.stop()
      if (this.endCallback != null) {
        this.endCallback()
      }
      return
    }
    // TODO make calls parallel
    const item = queue.pop()
    try {
      const res = await this.process(item)
      this._results.push(res)
    } catch (e) {
      console.log('Requeue', item)
      queue.push(item)
    }
    this._results = this._results
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 12)
    resultsStore.set(this._results)
    if (this.works) {
      setTimeout(this.doIteration.bind(this), 100)
    }
  }

  async process(item: Item): Promise<Result> {
    console.debug(item)
    const friends = await getFriends(item)

    const cities: Map<string, number> = new Map()
    let bestCity = null
    let bestCityValue = -1

    for (const friend of friends) {
      const city = friend.settedCity
      if (city) {
        const cityValue = (cities.get(city) ?? 0) + 1
        cities.set(city, cityValue)
        if (cityValue > bestCityValue) {
          bestCity = city
          bestCityValue = cityValue
        }
      }
      if (viewed.has(friend.userId)) {
        continue
      }
      const friendItem = new Item(friend, item.distance + 1)
      queue.push(friendItem)
      viewed.add(friend.userId)
    }
    return new Result(item, bestCity)
  }

  get isWorking(): boolean {
    return this.works
  }
}

export async function search(): Promise<SearchEngine> {
  initOptions()
  queue.clear()
  resultsStore.set([])
  viewed.clear()

  const basePersons = Array.from(options.basePersons)
  if (basePersons.length == 0) {
    throw new Error('Не указаны отправные точки')
  } else {
    const baseUsers = await getUsers(basePersons.map(person => person.userId))
    for (const [user, bonus] of await getMutual(baseUsers)) {
      const item = new Item(user, 0, bonus * 50)
      viewed.add(user.userId)
      queue.push(item)
    }
    for (const user of baseUsers) {
      const item = new Item(user, 0, 49)
      viewed.add(user.userId)
      queue.push(item)
    }
  }
  if (queue.length == 0) {
    throw new Error('Нет доступных отправных точек')
  }
  return new SearchEngine()
}
