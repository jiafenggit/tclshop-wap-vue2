// 配置API接口地址

// axios 8+ ✔
import axios from 'axios'
import utils from './utils.js'
import router from './routes'

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  if (toType(o) !== 'object') return o
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
      if (o[key].length === 0) {
        delete o[key]
      }
    }
  }
  return o
}

// function getFormData (object) {
//   const formData = new window.FormData()
//   Object.keys(object).forEach(key => formData.append(key, object[key]))
//   return formData;
// }
var syncTime = 0
var syncFun = null
var ld = null

function httpBase(method, url, params, success, failure) {
  syncTime === 0 && ld == null && (ld = utils.loading())
  syncTime++
  syncFun && clearTimeout(syncFun)
  var contentType = ''
  params = filterNull(params)
  if (method === 'POST' || method === 'PUT') {
    if (toType(params) === 'object') {
      contentType = 'application/x-www-form-urlencoded'
    } else {
      contentType = 'application/json; charset=utf-8'
    }
  } else if (method === 'GET' || method === 'DELETE') {
    contentType = 'application/json; charset=utf-8'
  }
  //   console.log(method.toLowerCase(), url, params, contentType)

  axios({
    method: method,
    url: url,
    params: params,
    // baseUrl: 'http://127.0.0.1/rest',
    headers: {
      'Content-Type': contentType,
      'ihome-timestamp': utils.createTimestamp(),
      'ihome-token': utils.getCookie('token'),
      'uid': utils.createTimestamp() + '-' + utils.uuid(),
      'ihome-version': '0.0.1',
      'appversion': '0.0.1'
    },
    // timeout: 1000,
    transformRequest: function (data) {
      //   console.log(data)
    },
    transformResponse: function (data) {
      syncTime--
      syncTime <= 0 && (syncTime = 0)
      // console.log(syncTime)
      syncFun = setTimeout(function () {
        if (syncTime === 0 && ld != null) {
          document.body.removeChild(ld)
          ld = null
        }
      }, 300)
      data = JSON.parse(data)
      if (data && data.code === '403' && params && params.auth) {
        router.push({
          path: '/account/login'
        })
        return
      }
      //   console.log(data)
      success && success(data)
    },
    validateStatus: function (status) {
      //   console.log(status)
      return status >= 200 && status < 300 //   default 
    }
  })
}

var server = '/rest'
// var server = 'http://10.120.54.47/rest'

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return httpBase('GET', server + url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return httpBase('POST', server + url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return httpBase('PUT', server + url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return httpBase('DELETE', server + url, params, success, failure)
  }
}
