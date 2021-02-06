import type { User as VKUser } from '../vkapi/user'
import { options } from './searchOptions'

export class Item implements VKUser {
  userId: number
  firstName: string
  lastName: string

  closed: boolean

  distance: number
  protected _probability: number

  constructor(user: VKUser, distance: number) {
    this.userId = user.userId
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.closed = user.closed

    this.distance = Math.max(distance, 0)

    this.calcProbability()
  }

  calcProbability() {
    let result = -Math.round(this.distance ** 2)
    // TODO extract 100 to options
    const firstName: [number, string][] = options.firstNames.get(
      this.firstName,
      []
    )
    const lastName: [number, string][] = options.lastNames.get(
      this.lastName,
      []
    )
    if (firstName.length > 0) {
      result += 10 * firstName[0][0]
    }
    if (lastName.length > 0) {
      result += 30 * lastName[0][0]
    }
    this._probability = result
  }

  public get probability(): number {
    return this._probability
  }
}

export function compare(a: Item, b: Item): number {
  if (a.probability > b.probability) {
    return -1
  } else if (a.probability < b.probability) {
    return 1
  } else {
    return 0
  }
}
