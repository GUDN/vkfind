import { Item } from './item'
import { options } from './options'

export class Result extends Item {
  realCity: string

  constructor(item: Item, realCity: string) {
    super({ ...item }, item.distance)

    this.realCity = realCity
    // End calculation
    this._probability += options.realCityScore(this.realCity)
  }

  get name(): string {
    return `${this.firstName} ${this.lastName}`
  }

  calcProbability() {
    super.calcProbability()
    this._probability += options.firstNameScore(this.firstName)
    this._probability += options.realCityScore(this.realCity ?? null)
  }
}
