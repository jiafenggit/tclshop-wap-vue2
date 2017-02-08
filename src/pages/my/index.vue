<template>
  <div class="usercenter">
    <div class="m-person">
      <a href="/account/login.html">
        <div class="m-person-header">
          <img :src="faceImg" />
        </div>
        <p>{{nickName}}</p>
      </a>
    </div>
    <div class="m-person-info w90 bor-bott">
      <ul>
        <li>
          <a href="/usercenter/orderList.html">
            <div class="icon iky-list">
              <span class="circle myorder">&nbsp;</span>
            </div>
            <p>我的订单</p>
          </a>
        </li>
        <li>
          <a href="/usercenter/orderList.html?type=1">
            <div class="icon iky-time">
              <span class="circle waitpt">&nbsp;</span>
            </div>
            <p>待付款</p>
          </a>
        </li>
        <li>
          <a href="/usercenter/orderList.html?type=6">
            <div class="icon iky-address">
              <span class="circle shopcount">&nbsp;</span>
            </div>
            <p>待收货</p>
          </a>
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
            <span id="points" v-if="item.icon=='icon iky-coupon'" v-text="jifen"></span>
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
        jifen: null,
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
        var _this = this
        console.log(this.jifen)
        this.$api.get('/tclcustomer/userInfo', null, r => {
          _this.jifen = r.data.jifen + '积分'
          // $('.m-person a').attr('href', '/usercenter/info.html');

          this.nickName = r.data.nickName || r.data.customerName

          if (r.data.customerImgUrl) {
            var img = new Image();
            img.onload = function () {
              _this.faceImg = r.data.customerImgUrl
            };
            img.src = r.data.customerImgUrl;
          };
        });
      },
      getCount() {
        if (res.code == '0') {
          //   "waitpay":待付款 ；"waitship":待发货；"shipping":待收货；"waitcomment":待评价；"succeedorder":已完成
          res.data.shipping > 0 && $('.shopcount').text(res.data.shipping).show();
          res.data.waitpay > 0 && $('.waitpt').text(res.data.waitpay).show();
          var count = res.data.shipping + res.data.waitpay + res.data.succeedorder + res.data.waitship;
          count > 0 && $('.myorder').text(count).show();
          //  res.data > 0 && $('.' + eles[i]).text(res.data).show();
        };
      }
    }
  }

</script>
