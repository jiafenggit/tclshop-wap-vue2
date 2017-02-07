import Vue from 'vue'

// 引用路由
import Router from 'vue-router'

Vue.use(Router)

// 配置路由
import layout from '../layout/index.vue'
import layoutTop from '../layout/indexTop.vue'
import index from '../pages/index.vue'
import search from '../pages/search.vue'
// goods
import catgory from '../pages/goods/catgory.vue'
import detail from '../pages/goods/detail.vue'

import cart from '../pages/cart/index.vue'

import login from '../pages/account/login.vue'
import register from '../pages/account/register.vue'

const routes = [
  {
    path: '/',
    component: layout,
    children: [{
      path: '/',
      component: index
    }, {
      path: '/search',
      component: search
    }]
  },
  {
    path: '/goods',
    component: layout,
    children: [{
      path: 'catgory',
      component: catgory
    }, {
      path: 'detail',
      component: detail
    }]
  }, {
    path: '/cart',
    component: layout,
    children: [{
      path: '/',
      component: cart
    }]
  },
  {
    path: '/account',
    component: layoutTop,
    children: [
      {
        path: '/login',
        name: 'login',
        component: login
      },
      {
        path: '/register',
        name: 'register',
        component: register
      },
      {
        path: '/login1',
        component: resolve => System.import('../pages/account/login.vue')
      },
      {
        path: '/login2',
        component: resolve => System.import('../pages/account/login.vue')
      }
    ]
  }
]
// 使用配置文件规则
const router = new Router({
  routes
})

export default router
