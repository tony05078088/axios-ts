import { Canceler, CancelExecutor, CancelTokenSource } from '..'
// class 可以作為值也可以作為類型
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve as ResolvePromise
    })
    executor(message => {
      if (this.reason) return
      this.reason = new Cancel(message)
      // 把promise 從 pending 變成 resolve狀態
      resolvePromise(this.reason)
    })
  }
  throwIfRequested() {
    if (this.reason) throw this.reason
  }
  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
