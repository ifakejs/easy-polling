/**
 * 队列类
 */

export class Q {
  q: any[]
  constructor() {
    this.q = []
  }

  enqueue<T>(data: T) {
    this.q.push(data)
  }

  dequeue() {
    return this.q.shift()
  }

  front() {
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
