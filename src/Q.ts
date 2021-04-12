/**
 * 队列类
 */

export class Q<T> {
  q: T[]
  constructor() {
    this.q = []
  }

  enqueue(data: T) {
    this.q.push(data)
  }

  dequeue(): T | undefined {
    return this.q.shift()
  }

  front(): T {
    return this.q[0]
  }

  clear() {
    this.q.length = 0
  }

  get isEmpty(): boolean {
    return this.q.length === 0
  }

  get queue() {
    return this.q
  }
}
