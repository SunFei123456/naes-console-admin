import axios from 'axios'
import { loadingBegin, loadingEnd } from '../stores/loading'

// Axios 实例（后续可接入实际后端，当前主要使用本地 mock）
const http = axios.create({
  baseURL: '/naes/console',
  timeout: 10000
})

// 请求拦截：按 key 计数，默认使用 'global'，支持最小展示时长
http.interceptors.request.use((config) => {
  const key = config.loadingKey || 'global'
  if (config.enableLoading !== false) {
    loadingBegin(key)
  }
  return config
})

// 响应拦截：结束计数，应用最小展示时长（默认 300ms）
http.interceptors.response.use(
  (resp) => {
    const cfg = resp.config || {}
    const key = cfg.loadingKey || 'global'
    if (cfg.enableLoading !== false) {
      loadingEnd(key, cfg.loadingMinDuration || 300)
    }
    return resp
  },
  (err) => {
    const cfg = (err && err.config) || {}
    const key = cfg.loadingKey || 'global'
    if (cfg && cfg.enableLoading !== false) {
      loadingEnd(key, cfg.loadingMinDuration || 300)
    }
    return Promise.reject(err)
  }
)

export default http
