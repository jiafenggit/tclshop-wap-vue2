// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 引用通用类
import utils from './config/utils'
// // 将API方法绑定到全局
Vue.prototype.$util = utils

// 引用路由配置文件
import router from './config/routes'
// 引用API文件
import http from './config/api'
// // 将API方法绑定到全局
Vue.prototype.$http = http

// 加载公共组件
import components from './components/'
// console.log(components)
Object.keys(components).forEach((key) => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase())
  Vue.component(`v-${name}`, components[key])
  console.log(key + '--' + name)
})
// 跑起来吧
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
