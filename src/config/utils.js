var utils = {
  createTimestamp: function () { // 取时间撮
    //  201508061018417065
    var dt = new Date()
    var y = dt.getFullYear()
    var M = dt.getMonth() + 1
    var d = dt.getDate()
    var h = dt.getHours()
    var m = dt.getMinutes()
    var sec = dt.getSeconds()
    var minsec = dt.getMilliseconds()
    var str = y + ''
    M = M < 10 ? '0' + M : M
    d = d < 10 ? '0' + d : d
    h = h < 10 ? '0' + h : h
    m = m < 10 ? '0' + m : m
    sec = sec < 10 ? '0' + sec : sec
    minsec = minsec < 1000 ? '0' + minsec : minsec
    str += M + d + h + m + sec + minsec
    return str
  },
  setCookie: function (name, value, days, domain) { //  两个参数，一个是cookie的名子，一个是值
    try {
      if (window.localStorage) {
        window.localStorage.setItem(name, value)
        return
      }
    } catch (e) {
      var Days
      var exp = new Date()
      if (typeof (days) === 'object') {
        Days = days
      } else {
        days = (days === undefined) ? 30 : days //  此 cookie 将被保存 30 天
        Days = exp.getTime() + days * 24 * 60 * 60 * 1000
      }
      //  new Date('December 31, 9998')
      exp.setTime(Days)

      document.cookie = name + '=' + escape(value) + 'expires=' + exp.toGMTString() + 'path=/' + (domain ? 'domain=' + domain : '')
    }
  },
  getCookie: function (name) { //   取cookies函数
    try {
      if (window.localStorage && window.localStorage.getItem(name)) {
        return window.localStorage.getItem(name)
      }
    } catch (e) {
      var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^]*)(|$)'))
      if (arr != null) return unescape(arr[2])
    }
    return null
  },
  delCookie: function (name) { //  删除cookie
    try {
      window.localStorage && window.localStorage.removeItem(name)
      document.cookie = name + '=xexpires=Fri, 31 Dec 1999 23:59:59 GMT'
      document.cookie = name + '=xexpires=Fri, 31 Dec 1999 23:59:59 GMTpath=/'
      document.cookie = name + '=xexpires=Fri, 31 Dec 1999 23:59:59 GMTpath=/domain=tcl.com'
    } catch (e) {}
  },
  parseQuery: function (pkey) { //  url 取值
    var search = window.location.search
    var args = search.substring(1).split('&')
    var argsParsed = {}
    var i, arg, kvp, key, value
    for (i = 0; i < args.length; i++) {
      arg = args[i]
      if (-1 === arg.indexOf('=')) {
        argsParsed[$.trim(decodeURIComponent(arg))] = true
      } else {
        kvp = arg.split('=')
        key = $.trim(decodeURIComponent(kvp[0]))
        value = $.trim(decodeURIComponent(kvp[1]))
        argsParsed[key] = value
      }
    }
    if (pkey) {
      return argsParsed[pkey]
    }
    return argsParsed
  },
  uuid: function () { //    生成uuid 并且寸cookie
    var uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    // this.setCookie('temp_id', uuid, 360)
    return uuid
  },
  guid: function () {
    function s4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4())
  },
  checkStrong: function (v, l1, l2) { //    检测密码强度
    let modes = 0
    let _l1 = l1 || 8
    let _l2 = l2 || 16
    if (v.length < _l1 || v > _l2) {
      return false
    }
    (/\d/.test(v)) && modes++ //    数字
    (/[a-z]/.test(v)) && modes++ //   字母小写
    (/[A-Z]/.test(v)) && modes++ //   字母大写
    (/\W/.test(v)) && modes++ //  特殊字符
    return modes > 1
  },
  checkUser: function (v, t) {
    let emailReg = /^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/
    let mobileReg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/
    let telphone = /^0\d{2,3}-?\d{7,8}$/
    let zhNameReg = /^[\u4e00-\u9fa5]{2,20}$/
    let enNameReg = /^[a-zA-Z\/]{2,20}$/
    let ext = false
    t === 1 && (ext = mobileReg.test(v))
    t === 11 && (ext = mobileReg.test(v) || telphone.test(v))
    t === 2 && (ext = emailReg.test(v))
    t === 3 && (ext = zhNameReg.test(v) || enNameReg.test(v))
    if (!t) {
      (ext = (mobileReg.test(v) || emailReg.test(v)))
    }
    return ext
  },
  formatDate: function (datespan, isfull, lan) { // 时间格式化
    let date = new Date(datespan)
    let Y = date.getFullYear()
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    let D = date.getDate()
    let h = date.getHours() + ':'
    let m = date.getMinutes() + ':'
    let s = date.getSeconds()
    let resut = lan ? Y + '年' + M + '月' + D + '日' + h + m + s : (isfull ? Y + '-' + M + '-' + D + ' ' + h + m + s : Y + '-' + M + '-' + D)

    return resut
  },
  getAyName: function (str) { //    截取字符串中间以*号代替
    if (!str || str.length <= 2) {
      return str
    }
    str = str.toString()
    return str.substring(0, 2) + '***' + str.substring(str.length - 3, str.length - 1)
  },
  urlTojson: function (url) { //    地址传参转数组
    if (!url || url.length === 0) return ''
    url = decodeURIComponent(url)
    var obj = {}
    obj.url = url.split('?')[0]
    var args = url.split('?')[1]
    if (args && args.length > 0) {
      var arg = args.split('&')
      if (arg && arg.length >= 1) {
        arg.map(function (m) {
          var ar = m.split('=')
          if (ar && ar.length > 1) {
            obj[ar[0]] = ar[1]
          }
        })
      }
    }
    return obj
  },
  iswx: function () {
    return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === 'micromessenger'
  },
  btoa: function (str) {
    var out, i, len, c1, c2, c3, char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff
      if (i === len) {
        out += char.charAt(c1 >> 2)
        out += char.charAt((c1 & 0x3) << 4)
        out += '=='
        break
      }
      c2 = str.charCodeAt(i++)
      if (i === len) {
        out += char.charAt(c1 >> 2)
        out += char.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
        out += char.charAt((c2 & 0xF) << 2)
        out += '='
        break
      }
      c3 = str.charCodeAt(i++)
      out += char.charAt(c1 >> 2)
      out += char.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += char.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
      out += char.charAt(c3 & 0x3F)
    }
    return out
  },
  atob: function (str) {
    var c1, c2, c3, c4, i, len, out,
      char = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1)
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      /* c1 */
      do {
        c1 = char[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c1 === -1)
      if (c1 === -1) {
        break
      }
      /* c2 */
      do {
        c2 = char[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c2 === -1)
      if (c2 === -1) {
        break
      }
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))
      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff
        if (c3 === 61) {
          return out
        }
        c3 = char[c3]
      }
      while (i < len && c3 === -1)
      if (c3 === -1) {
        break
      }
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))
      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff
        if (c4 === 61) {
          return out
        }
        c4 = char[c4]
      }
      while (i < len && c4 === -1)
      if (c4 === -1) {
        break
      }
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return out
  },
  resize: function () {
    var win = window

    function w() {
      var eleWid = htmlEle.getBoundingClientRect().width;

      if (eleWid / dprValue > 640) {
        eleWid = 640 * dprValue;
      }
      win.rem = eleWid / 16;
      if (win.rem >= 40) {
        win.rem = 40
      };
      htmlEle.style.fontSize = win.rem + "px";
    }

    var dprValue, initScaleValue, t, doc = win.document,
      htmlEle = doc.documentElement,
      viewport = doc.querySelector('meta[name="viewport"]'),
      metaFlexible = doc.querySelector('meta[name="flexible"]');
    if (viewport) {
      // console.warn("将根据已有的meta标签来设置缩放比例");
      var o = viewport.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);
      o && (initScaleValue = parseFloat(o[2]), dprValue = parseInt(1 / initScaleValue))
    } else {
      if (metaFlexible) {
        var o = metaFlexible.getAttribute("content").match(/initial\-dpr=(["']?)([\d\.]+)\1?/);
        o && (dprValue = parseFloat(o[2]), initScaleValue = parseFloat((1 / dprValue).toFixed(2)))
      }
    }
    if (!dprValue && !initScaleValue) {
      var isAndroid = (win.navigator.appVersion.match(/android/gi), win.navigator.appVersion.match(/iphone/gi)),
        pixelRatio = win.devicePixelRatio;
      if (isAndroid) {
        if (pixelRatio >= 3) {
          dprValue = 3;
        } else if (pixelRatio >= 2) {
          dprValue = 2;
        } else {
          dprValue = 1;
        }
      } else {
        dprValue = pixelRatio;
      }
      initScaleValue = 1 / dprValue;
    }
    if (htmlEle.setAttribute("data-dpr", dprValue), !viewport) {
      if (viewport = doc.createElement("meta"), viewport.setAttribute("name", "viewport"), viewport.setAttribute("content", "initial-scale=" + initScaleValue + ", maximum-scale=" + initScaleValue + ", minimum-scale=" + initScaleValue + ", user-scalable=no"), htmlEle.firstElementChild) {
        htmlEle.firstElementChild.appendChild(viewport)
      } else {
        var newDiv = doc.createElement("div");
        newDiv.appendChild(viewport), doc.write(newDiv.innerHTML)
      }
    }
    win.dpr = dprValue;
    win.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(w, 300);
    }, false);
    if ("complete" === doc.readyState) {
      doc.body.style.fontSize = 12 * dprValue + "px";
    }
    doc.addEventListener("DOMContentLoaded", function () {
      doc.body.style.fontSize = 12 * dprValue + "px";
    }, false)
    w();

  }
}
module.exports = utils
// var __token = util.parseQuery('ihome-token')
// var __fanliCookie = util.parseQuery('fanliCookie')
// __fanliCookie && util.setCookie('fanliCookie', __fanliCookie)
// __token && util.setCookie('token', __token)
