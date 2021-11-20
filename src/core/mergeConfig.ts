import { AxiosRequestConfig } from '..'
import { deepMerge, isPlainObject } from '../helpers/util'
const strats = Object.create(null)

// 預設的合併策略
function defaultStart(val1: any, val2: any): void {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只取val2
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    // val2有值 且不是一個Object
    return val2
  } else if (isPlainObject(val1)) {
    // 只傳入val1, 因為val2值為空
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    // val1存在 且 不是一個Obj
    return val1
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})
const strateKeysDeepMerge = ['headers']

strateKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

console.log(strats)

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStart
    config[key] = strat(config1[key], config2![key])
  }
  return config
}
