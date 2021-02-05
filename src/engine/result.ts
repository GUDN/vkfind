import { Item } from './item'

export class Result extends Item {
  get name(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
