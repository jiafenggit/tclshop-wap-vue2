import Vue from 'vue'
import Vuex from 'vuex'
import util from '../config/utils'
Vue.use(Vuex)

// const store = new Vuex.Store({
//   state: {
//     count: 0
//   }
// })

// export default {
//     store
// }


export default new Vuex.Store({
  state: {
    count: 0,
    token:util.getCookie('token')
  }
})
