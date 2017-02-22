// 配置API接口地址

// 引用superagent
import request from 'superagent'
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
  var r = request(method, url).type('text/plain')
  syncTime === 0 && ld == null && (ld = utils.loading())
  syncTime++
  syncFun && clearTimeout(syncFun)
  if (params) {
 //   params = filterNull(params)
    if (method === 'POST' || method === 'PUT') {
      if (toType(params) === 'object') {
        // params = JSON.stringify(params)
        // params = getFormData(params)
        r.set('Content-Type', 'application/x-www-form-urlencoded')
        r.send(params)
      } else {
        r.set('Content-Type', 'application/json; charset=utf-8')
        r = r.send(params)
      }
      // console.log(params)
      // r = r.send(params)
    } else if (method === 'GET' || method === 'DELETE') {
      r.set('Content-Type', 'application/json; charset=utf-8')
      r = r.query(params)
    }
  }
  // var router = this.$router
  r.set('ihome-timestamp', utils.createTimestamp())
  r.set('ihome-token', utils.getCookie('token'))
  r.set('uid', utils.createTimestamp() + '-' + utils.uuid())
  r.set('ihome-version', '0.0.1')
  r.set('appversion', '0.0.1')
  r.end(function (err, res) {
    syncTime--
    syncTime <= 0 && (syncTime = 0)
    // console.log(syncTime)
    syncFun = setTimeout(function () {
      if (syncTime === 0 && ld != null) {
        document.body.removeChild(ld)
        ld = null
      }
    }, 300)
    // console.log(err, res)
    // return
    if (err) {
      window.alert('api error, HTTP CODE: ' + res.status)
      return
    };
    if (res.status === 200) {
      if (success) {
        if (res.body && res.body.code === '403' && params && params.auth) {
          router.push({
            path: '/account/login'
          })
          return
        }
        success(res.body || res.text)
      }
    } else {
      if (failure) {
        failure(res.body || res.text)
      } else {
        window.alert('error: ' + JSON.stringify(res.body))
      }
    }
  })
}

var server = '/rest'

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
