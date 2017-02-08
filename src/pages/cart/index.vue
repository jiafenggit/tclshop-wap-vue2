<template>
  <div class="cart">
    <div v-show="goodCount>0">
      <div class="cart-list">
        <h2>购物车</h2>
        <div class="item" v-for="n in data">
          <span :class="n.checked?'iky-hook':'iky-hook unchecked'" @click="checkGood(n)"></span>
          <router-link :to="{path:'/goods/detail',query:{uuid:n.productId}}">
            <div class="img"><img :src="n.productImgUrl" alt=""></div>
            <div class="res">
              <p class="title">{{n.productName}}</p>
              <p class="attrs" v-for="x in n.attrValues">{{x.name}}：{{ x.value }}</p>
              <p class="price">单价：{{n.suitUuid ? n.suitTotalPrice : ((n.finalPrice - 0) > 0 ? n.finalPrice : (n.buyNum == 0 ? n.singleMarketPrice : n.totalPrice / n.buyNum))}}元</p>
            </div>
          </router-link>
          <div class="num-box"><button type="button" id="reduce" class="md iky-reduce "></button>
            <span class="num"> {{n.buyNum}}</span><button type="button" class="iky-plus md" id="plus"></button>
            <span class="iky-clear md" id="remove"></span></div>
          <p class="tip"></p>
          <div class="suite" v-if="n.suitSubProduct">
            <div class="sub" v-for="m in n.suitSubProduct">
              <img :src="m.productImgUrl"><span class="name">{{m.productName}}</span>
              <span class="price">x {{n.buyNum}}</span></div>
          </div>
        </div>
      </div>
      <div class="total-all">
        <div class="total">总计：<span class="num">0</span>选中：<span class="num-select">0</span>件</div>
        <div class="price">
          合计：<span class="pay-price">0.00</span>元
          <span class="base-price">0.00元</span>
        </div>
      </div>
      <div class="btn-box">
        <input type="button" value="继续购物" class="toshop">
        <input type="button" value="去结算" class="topay">
      </div>
    </div>
    <div class="empty" v-show="goodCount==0">
      <p></p>
      <span>现在就去选购吧</span>
      <router-link :to="{path:'/'}">去逛逛</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        goodCount: -1,
        data: []
      }
    },
    created() {
      this.getCart()
    },
    methods: {
      getPids(n, type) {
        var pids = []
        pids.push(type + n.productId + '_' + n.attrIds + (n.suitUuid && n.suitUuid != 'null' ? '_' + n.suitUuid : ''))
        if (n.suitSubProduct) {
          // console.log(n.suitSubProduct)
          for (var s in n.suitSubProduct) {
            var q = n.suitSubProduct[s]
            pids.push(type + q.productId + '_' + q.attrIds + (q.suitUuid && q.suitUuid != 'null' ? '_' + q.suitUuid :
              ''));
          }
        }
        return pids.join(';');
      },
      checkGood(n) {
        var params = {
          productIdAndAttrId: this.getPids(n, 'product_'),
          chooseState: !n.checked,
          suitUuid: n.suitUuid == 'null' ? '' : n.suitUuid,
          random: Math.random()
        };
        this.$http.get('/cart/changeChooseKuyu', params, r => {
          if (r.code == '403') {
            this.$router.push({
              path: '/account/login'
            })
          }
          if (r.code == 0) {
            this.getCart()
          } else {
            alert('操作失败')
          }
        });
      },
      getCart() {
        this.$http.get('/cart/show', null, r => {
          if (r.code == 0) {
            this.goodCount = r.data.cartProductCount
            this.data = r.data.carts
          }
        });
      }
    }
  }

</script>
