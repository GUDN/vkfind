import { Item } from './item'
import { options } from './searchOptions'

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
    console.log(this)
  }
}
