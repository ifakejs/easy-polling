import { Q } from "../src/Q"

describe("Q", () => {
  let instance: Q<number>
  beforeEach(() => {
    instance = new Q()
  })
  it('enqueue ', () => {
    instance.enqueue(1)
    expect(instance.queue).toEqual([1])
  })

  it('enqueue ', () => {
    instance.enqueue(1)
    expect(instance.dequeue()).toEqual(1)
  })

  it('front ', () => {
    instance.enqueue(2)
    instance.enqueue(1)
    expect(instance.front()).toEqual(2)
  })

  it('clear ', () => {
    instance.enqueue(2)
    instance.enqueue(1)
    instance.clear()
    expect(instance.queue).toEqual([])
  })

  it('isEmpty ', () => {
    expect(instance.isEmpty).toEqual(true)
    instance.enqueue(2)
    expect(instance.isEmpty).toEqual(false)
  })
})
