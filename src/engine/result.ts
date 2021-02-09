import { Item } from './item'
import { options } from './options'

export class Result extends Item {
  get name(): string {
    return `${this.firstName} ${this.lastName}`
  }

  calcProbability() {
    super.calcProbability()
    this._probability += options.firstNameScore(this.firstName)
  }
}
