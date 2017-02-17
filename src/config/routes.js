import Vue from 'vue'

// 引用路由
import Router from 'vue-router'

Vue.use(Router)

// 配置路由
import layout from '../layout/index'
import layoutTop from '../layout/indexTop'

import index from '../pages/index'
import search from '../pages/search'

// goods
import catgory from '../pages/goods/catgory'
import detail from '../pages/goods/detail'
import comment from '../pages/goods/comment'

import cart from '../pages/cart/index'

// account
import login from '../pages/account/login'
import register from '../pages/account/register'

// my
import collection from '../pages/my/collection'
// import myComments from '../pages/my/comments'
import coupons from '../pages/my/coupons'
import historyOrder from '../pages/my/historyOrder'
import myIndex from '../pages/my/index'
import info from '../pages/my/info'
import orders from '../pages/my/orders'
import reservation from '../pages/my/reservation'
import score from '../pages/my/score'

//  order
import orderConfirm from '../pages/order/confirm'


const routes = [
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: index
      }, {
        path: '/goods/catgory',
        component: catgory
      }
    ]
  },
  {
    path: '/',
    component: layoutTop,
    children: [
      {
        path: '/goods/detail',
        component: detail
      },
      {
        path: '/goods/comment',
        component: comment
      },
      {
        path: '/search',
        component: search
      },
      {
        path: '/cart',
        component: cart
      },
      {
        path: '/account/login',
        name: 'login',
        component: login
      },
      {
        path: '/account/register',
        name: 'register',
        component: register
      },
      {
        path: '/my/index',
        name: 'myIndex',
        component: myIndex
      },
      {
        path: '/my/collection',
        name: 'collection',
        component: collection
      },
      // {
      //   path: '/my/comments',
      //   name: 'myComments',
      //   component: myComments
      // },
      {
        path: '/my/coupons',
        name: 'coupons',
        component: coupons
      },
      {
        path: '/my/historyOrder',
        name: 'historyOrder',
        component: historyOrder
      },
      {
        path: '/my/info',
        name: 'info',
        component: info
      },
      {
        path: '/my/orders',
        name: 'myOrders',
        component: orders
      },
      {
        path: '/my/reservation',
        name: 'reservation',
        component: reservation
      },
      {
        path: '/my/score',
        name: 'score',
        component: score
      },
      {
        path: '/order/confirm',
        name: 'orderConfirm',
        component: orderConfirm
      }
    ]
  }
]
// 使用配置文件规则
const router = new Router({
  routes
})

export default router
