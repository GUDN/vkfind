declare type Comparator<T> = (a: T, b: T) => number

export default class Queue<T> {
  private comparator: Comparator<T>
  private heap: T[]

  constructor(comparator: Comparator<T>) {
    this.comparator = comparator
    this.heap = []
  }

  public push(value: T) {
    this.heap.push(value)
    this.siftdown(0, this.length - 1)
  }

  public pop(): T {
    const last = this.heap.pop()
    if (this.length > 0) {
      const item = this.top
      this.heap[0] = last
      this.siftup(0)
      return item
    }
    return last
  }

  public get length(): number {
    return this.heap.length
  }

  public get top(): T {
    return this.heap[0]
  }

  private siftdown(startPos: number, pos: number) {
    const newItem = this.heap[pos]
    while (pos > startPos) {
      const parentPos = (pos - 1) >>> 1
      const parent = this.heap[parentPos]
      if (this.comparator(newItem, parent) < 0) {
        this.heap[pos] = parent
        pos = parentPos
        continue
      }
      break
    }
    this.heap[pos] = newItem
  }

  private siftup(pos: number) {
    const startPos = pos
    const newItem = this.heap[pos]
    let childPos = 2 * pos + 1
    while (childPos < this.length) {
      let rightPos = childPos + 1
      if (
        rightPos < this.length &&
        this.comparator(this.heap[childPos], this.heap[rightPos]) >= 0
      ) {
        childPos = rightPos
      }
      this.heap[pos] = this.heap[childPos]
      pos = childPos
      childPos = 2 * pos + 1
    }
    this.heap[pos] = newItem
    this.siftdown(startPos, pos)
  }

  clear() {
    this.heap = []
  }
}
