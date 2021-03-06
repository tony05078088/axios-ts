import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/cancelToken'
import Axios from './core/Axios'
import mergeConfig from './core/mergeConfig'
import defaults from './defaults'
import { extend } from './helpers/util'
import { AxiosRequestConfig, AxiosStatic } from './types'
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // console.log('Axios: ' + (JSON.stringify(Axios.prototype.request.bind(context))))
  const instance = Axios.prototype.request.bind(context)
  // 把context屬性全部拷貝到instance上
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
export default axios
