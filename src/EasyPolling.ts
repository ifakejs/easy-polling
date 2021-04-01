import { Q } from './Q'
import { Emitter } from "./Emitter"
import { FakeInterval } from "./FakeInterval"
import { chunk } from "./chunk"

/**
 * 一. 单路:
 * 1. 数据项加入队列
 * 2. 初始化取出初始化需要的数据(returnCount)
 * 3. 轮询开始时每次取一个(队列的头部永远是即将要返回的), 同时维护一个播放队列索引(为了记录每个数据在当前运行中的位置)
 * 4. 轮询时,每次取一个即将要返回的，索引队列取出它的位置，进行播放列表替换位置, 返回最新数据, 然后将数据入队
 * 二. 多路
 * 1. 分组(根据returnCount)确定每一次返回的数据, 并加入队列
 * 2. 初始化数据
 * 3. 运行时每次取一组，返回给前台, 然后将数据入队
 */

enum runTypes {
  SINGLE = "single",
  DOUBLE = "double"
}

type runType = "single" | "double"

interface EasyPollingOptions {
  type: runType
  source: any[]
  intervalTime: number
  returnCount: number
}

const EMITTER_KEY = "EMITTER_KEY"

export class EasyPolling extends Emitter {
  public options: EasyPollingOptions
  public mainQueue: Q
  public trackerQueue: Q
  private runTimer: FakeInterval | null
  public singleResult: any[]
  constructor(options: EasyPollingOptions) {
    super()
    const { source, intervalTime, returnCount } = options
    if (!source || !Array.isArray(source) || !intervalTime || !returnCount) {
      throw new Error(`错误的调用参数! \n${JSON.stringify({
        source: 'any[]',
        intervalTime: 'number',
        mode: 'boolean',
        returnCount: 'number'
      }, null, 2)}`)
    }

    this.options = options

    // 队列 -> 处理所有播放地址数据
    this.mainQueue = new Q()

    /**
     * 当单路时，我们不仅要处理地址数据，还需要记录第几个位置的数据需要更新
     * 单独创建个队列来跟踪具体哪个位置的数据需要更新
     * Note: It only works if type is 'single'
     */
    this.trackerQueue = new Q()

    // 定时器实例
    this.runTimer = null

    // 单路数据暂存
    this.singleResult = []
  }

  /**
   * 初始化队列需要分两种情况
   **/
  initQueue() {
    const { source, type, returnCount } = this.options
    if (type === runTypes.SINGLE) {
      source.forEach(item => {
        this.mainQueue.enqueue(item)
      })
    } else {
      // 按照返回数据数量编组
      chunk(source, returnCount).forEach(urlPath => {
        this.mainQueue.enqueue(urlPath)
      })
    }
  }

  async start() {
    // 实例化定时器
    this.runTimer = new FakeInterval()
    // 初始化队列数据
    this.initQueue()
    // 轮询之前的第一轮数据初始化
    await this.beforeStart()
    // 开始轮询
    this.runTimer.run(this.runAdapter.bind(this), this.options.intervalTime)
  }

  /**
   * 轮询开始前取出初始化数据
   */
  beforeStart() {
    const { type } = this.options
    return new Promise(resolve => {
      if (type === runTypes.SINGLE) {
        this.beforeRunSingle()
        resolve(true)
      } else {
        this.runDouble()
        resolve(true)
      }
    })
  }

  runAdapter() {
    const { type } = this.options
    if (type === runTypes.SINGLE) {
      this.runSingle()
    } else {
      this.runDouble()
    }
  }

  runDouble() {
    // Get target data from queue
    const target = this.mainQueue.dequeue()
    this.mainQueue.enqueue(target)
    // Expose the data by trigger the event
    this.trigger(EMITTER_KEY, target)
  }

  beforeRunSingle() {
    const { returnCount } = this.options
    for (let i = 0; i < returnCount; i++) {
      const target = this.mainQueue.dequeue()
      this.singleResult.push(target)
      this.mainQueue.enqueue(target)

      // Record index for each screen
      this.trackerQueue.enqueue(i)
    }
    // Expose the data by trigger the event
    this.trigger(EMITTER_KEY, this.singleResult)
  }

  runSingle() {
    const target = this.mainQueue.dequeue()
    this.mainQueue.enqueue(target)
    // Pick the need to be replaced index
    const recordIndex = this.trackerQueue.dequeue()
    // Replace the target screen data
    this.singleResult.splice(recordIndex, 1, target)
    // Insert the head index to the queue
    this.trackerQueue.enqueue(recordIndex)

    // Expose the data by trigger the event
    this.trigger(EMITTER_KEY, this.singleResult)
  }

  observe(cb: Function) {
    this.listen(EMITTER_KEY, (data: any) => {
      cb && typeof cb === "function" && cb(data)
    })
  }

  updateIntervalTime(time: number) {
    this.runTimer?.updateIntervalTime(time)
  }

  stop() {
    !this.mainQueue.isEmpty && this.mainQueue.clear()
    !this.trackerQueue.isEmpty && this.trackerQueue.clear()
    this.runTimer && this.runTimer.stop()
    this.runTimer = null
  }
}
