import axios from 'axios'
import { message } from 'antd'
import { stringify, parse } from 'qs'

//message 全局配置
message.config({
  top: 50
})

export default function request(url, options) {
  if (options.cross) {
    return get('http://query.yahooapis.com/v1/public/yql', {
      q: "select * from json where url='" + url + '?' + stringify(options.data) + "'",
      format: 'json'
    })
  }
  switch (options.method.toLowerCase()) {
    case 'get':
      return get(url, options.data)
      break
    case 'post':
      return post(url, options.data)
      break
  case 'put':
    return put(url, options.data)
    break
    case 'delete':
      return deleted(url, options.data)
      break
    default:
      break
  }
}

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  }
}

function handelData(res) {
  const data = res.data
  if(data && data.msg && !data.success) {
    message.warning(data.msg)
  } else if(data && data.msg && data.success) {
    message.success(data.msg)
  }
  return data
  // return { ...data.data, success: data.success, msg: data.msg }
}

function handleError(error) {
  message.error(error.response.data.errors, 5)
}

export function get(url, params) {
  return axios.get(url, { params: params })
  .then(checkStatus)
  .then(handelData)
  .catch(handleError)
}

export function post(url, data) {
  return axios.post(url, parse(data))
  .then(checkStatus)
  .then(handelData)
  .catch(handleError)
}

export function put(url, data) {
  return axios.put(url,  parse(data))
  .then(checkStatus)
  .then(handelData)
  .catch(handleError)
}

export function deleted(url, data) {
  return axios.delete(url, { data })
  .then(checkStatus)
  .then(handelData)
  .catch(handleError)
}
