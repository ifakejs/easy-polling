/**
 * @desc
 * Simple mock native setInterval function
 */
export class FakeInterval {
  private intervalInstance: null | number
  private intervalTime: number
  constructor() {
    this.intervalInstance = null
    this.intervalTime = 0
  }

  public run(func: Function, wait: number): void {
    this.updateIntervalTime(wait)
    const interval = () => {
      if (typeof func !== 'function') {
        throw new Error('Required a function.')
      }
      func && func.call(null)
      this.stop()
      // @ts-ignore
      this.intervalInstance = setTimeout(interval, this.intervalTime)
    }
    // @ts-ignore
    this.intervalInstance = setTimeout(interval, this.intervalTime)
  }

  public updateIntervalTime(time: number): void {
    this.intervalTime = time
  }

  public stop(): void {
    this.intervalInstance && clearTimeout(this.intervalInstance)
    this.intervalInstance = null
  }
}
