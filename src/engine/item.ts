import type { Gender } from '../stores/searchOptions'
import type { User as VKUser } from '../vkapi/user'
import { options } from './options'

export class Item implements VKUser {
  userId: number
  firstName: string
  lastName: string
  gender: Gender

  closed: boolean

  distance: number
  protected _probability: number

  constructor(user: VKUser, distance: number) {
    this.userId = user.userId
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.closed = user.closed
    this.gender = user.gender

    this.distance = Math.max(distance, 0)

    this.calcProbability()
  }

  calcProbability() {
    let result = options.distanceScore(this.distance)
    result += options.lastNameScore(this.lastName)
    result += options.genderScore(this.gender)
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
