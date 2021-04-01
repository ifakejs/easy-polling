/**
 * @desc
 * Simple publish-subscribe class
 */
export class Emitter {
  emitterList: Record<string, Function[]>
  constructor() {
    this.emitterList = {}
  }
  listen(key: string, fn: Function) {
    if (!this.emitterList[key]) {
      this.emitterList[key] = []
    }
    this.emitterList[key].push(fn)
  }
  // TODO can be refactor as (key, ...arg), ensure the key type
  trigger(...arg: any[]) {
    const fnName = arg[0]
    const args = arg.splice(1)
    const fns = this.emitterList[fnName]
    if (!fns) {
      return
    }
    for (let i = 0; i < fns.length; i++) {
      const fnTarget = fns[i]
      fnTarget.apply(this, args.length > 1 ? [args] : args)
    }
  }
  off(key: string, fn: Function) {
    const fns = this.emitterList[key]
    if (!fns) {
      return
    }
    if (!fn) {
      fns && (fns.length = 0)
    } else {
      for (let i = 0; i < fns.length; i++) {
        const _fns = fns[i]
        if (_fns === fn) {
          fns.splice(i, 1)
        }
      }
    }
  }
}
