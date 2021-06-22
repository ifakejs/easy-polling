import { Q } from './Q'
import { Emitter } from "./Emitter"
import { FakeInterval } from "./FakeInterval"
import { assert, checkPollingNumber, chunk } from "./utils";

/**
 * 一. 单路:
 * 1. 数据项加入队列
 * 2. 初始化取出初始化需要的数据(returnCount)
 * 3. 轮巡开始时每次取n个(replaceCount就是单路轮巡每次返回的，一个或者n个), 同时维护一个播放队列索引(为了记录每个数据在当前运行中的位置)
 * 4. 轮巡时,每次取一个即将要返回的，索引队列取出它的位置，进行播放列表替换位置, 返回最新数据, 然后将数据入队
 * 二. 多路
 * 1. 分组(根据returnCount)确定每一次返回的数据, 并加入队列
 * 2. 初始化数据
 * 3. 运行时每次取一组，返回给前台, 然后将数据入队
 */

enum RunTypes {
  SINGLE = "single",
  DOUBLE = "double"
}

type RunType = "single" | "double"

interface EasyPollingOptions {
  type: RunType
  source: any[]
  intervalTime: number
  returnCount: number
  replaceCount?: number
}

const EMITTER_KEY = "EMITTER_KEY"

type MainQueueType = string | string[]
type SnapDataType = MainQueueType

const defaultOptions = {
  replaceCount: 1
}

export class EasyPolling extends Emitter {
  public options: EasyPollingOptions
  public mainQueue: Q<MainQueueType>
  public trackerQueue: Q<number>
  private runTimer: FakeInterval | null
  public snapData: SnapDataType[]
  constructor(options: EasyPollingOptions) {
    super()
    const { source, intervalTime, returnCount, type } = options

    assert(Array.isArray(source), "Required array for source type.")
    assert(checkPollingNumber(intervalTime), "Required a number type for intervalTime")
    assert(checkPollingNumber(returnCount), "Required a number type for returnCount")

    const checkType = RunTypes.SINGLE === type || RunTypes.DOUBLE === type
    assert(checkType, "Valid type value is 'single' or 'double'")

    this.options = { ...defaultOptions, ...options }

    // 队列 -> 处理所有数据
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
    this.snapData = []
  }

  /**
   * 初始化队列需要分两种情况
   **/
  initQueue() {
    const { source, type, returnCount } = this.options
    if (type === RunTypes.SINGLE) {
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
    // 轮巡之前的第一轮数据初始化
    await this.beforeStart()
    // 开始轮巡
    this.runTimer.run(this.runAdapter.bind(this), this.options.intervalTime)
  }

  /**
   * 轮巡开始前取出初始化数据
   */
  beforeStart() {
    const { type } = this.options
    return new Promise(resolve => {
      if (type === RunTypes.SINGLE) {
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
    if (type === RunTypes.SINGLE) {
      this.runSingle()
    } else {
      this.runDouble()
    }
  }

  runDouble() {
    // Get target data from queue
    const target = this.mainQueue.dequeue()
    target && this.mainQueue.enqueue(target)
    // Expose the data by trigger the event
    this.trigger(EMITTER_KEY, target)
  }

  beforeRunSingle() {
    const { returnCount } = this.options
    for (let i = 0; i < returnCount; i++) {
      const target = this.mainQueue.dequeue()
      this.snapData.push(target as MainQueueType)
      this.mainQueue.enqueue(target as MainQueueType)

      // Record index for each screen
      this.trackerQueue.enqueue(i)
    }
    // Expose the data by trigger the event
    this.trigger(EMITTER_KEY, this.snapData)
  }

  runSingle() {
    const repeat = this.options.replaceCount as number
    for (let i = 0; i < repeat; i++) {
      const target = this.mainQueue.dequeue()
      this.mainQueue.enqueue(target as MainQueueType)
      // Pick the need to be replaced index
      const recordIndex = this.trackerQueue.dequeue() as number
      // Replace the target screen data
      this.snapData.splice(recordIndex, 1, target as MainQueueType)
      // Insert the head index to the queue
      this.trackerQueue.enqueue(recordIndex)
    }

    // Expose the data by trigger the event
    this.trigger(EMITTER_KEY, this.snapData)
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
    this.runTimer?.stop()
    this.runTimer = null
  }
}
