import { Item } from './item'
import { options } from './searchOptions'
import { any } from '../utils/arrays'

export class Result extends Item {
  get name(): string {
    return `${this.firstName} ${this.lastName}`
  }

  calcProbability() {
    super.calcProbability()
    const firstName: [number, string][] = options.firstNames.get(
      this.firstName,
      []
    )
    if (firstName.length > 0) {
      this._probability += 20 * firstName[0][0]
    }
    if (any(options.lastNames.values(), val => val == this.lastName)) {
      this._probability += 15
    }
    if (any(options.firstNames.values(), val => val == this.firstName)) {
      this._probability += 10
    }
    console.log(this)
  }
}
