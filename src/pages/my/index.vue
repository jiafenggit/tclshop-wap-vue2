<template>
  <div class="usercenter">
    <div class="m-person">
      <router-link :to="{path:faceLink}">
        <div class="m-person-header">
          <img :src="faceImg" />
        </div>
        <p>{{nickName}}</p>
      </router-link>
    </div>
    <div class="m-person-info w90 bor-bott">
      <ul>
        <li>
          <router-link :to="{path:'/my/orders'}">
            <div class="icon iky-list">
              <span class="circle myorder" v-text="orderCount" v-show="orderCount>0">&nbsp;</span>
            </div>
            <p>我的订单</p>
          </router-link>
        </li>
        <li>
          <router-link :to="{path:'/my/orders',query:{types:1}}">
            <div class="icon iky-time">
              <span class="circle waitpt" v-text="waitpt" v-show="waitpt>0">&nbsp;</span>
            </div>
            <p>待付款</p>
          </router-link>
        </li>
        <li>
          <router-link :to="{path:'/my/orders',query:{types:6}}">
            <div class="icon iky-address">
              <span class="circle shopcount" v-text="shopcount" v-show="shopcount>0">&nbsp;</span>
            </div>
            <p>待收货</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="m-person-item w90">
      <router-link :to="item.link" v-for="item in menu">
        <div class="row bor-bott">
          <div class="fl">
            <span :class="item.icon"></span>{{item.name}}
          </div>
          <div class="fr">
            <span id="points" v-if="item.name=='我的积分'" v-text="jifen"></span>
            <span class="icon iky-arrow-right"></span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        waitpt: 0,
        shopcount: 0,
        orderCount: 0,
        faceLink: '/account/login',
        jifen: '',
        nickName: '点击登陆',
        faceImg: '/res/img/default.png',
        menu: [{
            name: '我的收藏',
            link: '/my/collection',
            icon: 'icon iky-fav'
          },
          {
            name: '我的优惠劵',
            link: '/my/coupons',
            icon: 'icon iky-coupon'
          },
          {
            name: '我的服务',
            link: 'http://ym.tcl.com/services/pid',
            icon: 'icon iky-setting'
          },
          {
            name: '我的预约',
            link: '/my/reservation',
            icon: 'icon iky-timing'
          },
          {
            name: '历史订单',
            link: '/my/historyOrder',
            icon: 'icon iky-list'
          },
          {
            name: '我的评价',
            link: '/my/comments',
            icon: 'icon iky-list'
          },
          {
            name: '我的积分',
            link: '/my/score',
            icon: 'icon iky-coupon'
          },
        ]

      }
    },
    created() {
      this.getInfo()
    },
    methods: {
      getInfo() {
        this.$http.get('/tclcustomer/userInfo', null, r => {
          if (r.code == '0') {
            this.jifen = r.data.jifen + '积分'
            this.nickName = r.data.nickName || r.data.customerName
            this.faceLink = '/my/info'
            var _this = this
            if (r.data.customerImgUrl) {
              var img = new Image();
              img.onload = function () {
                _this.faceImg = r.data.customerImgUrl
              };
              img.src = r.data.customerImgUrl;
            };
            this.getCount()
          }
        });
      },
      getCount() {
        this.$http.post('/usercenter/order/query/queryAllStatusOrderCountKuyu', null, r => {
          if (r.code == '0') {
            //   "waitpay":待付款 ；"waitship":待发货；"shipping":待收货；"waitcomment":待评价；"succeedorder":已完成
            this.shopcount = r.data.shipping
            this.waitpt = r.data.waitpay
            this.orderCount = r.data.shipping + r.data.waitpay + r.data.succeedorder + r.data.waitship;
          }
        })
      }
    }
  }

</script>
