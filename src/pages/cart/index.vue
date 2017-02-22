<template>
  <div class="cart">
    <div v-show="goodCount>0">
      <div class="cart-list">
        <h2>购物车</h2>
        <div class="item" v-for="n in data">
          <span :class="n.checked?'iky-hook':'iky-hook unchecked'" @click="checkGood(n)"></span>
          <router-link :to="{path:'/goods/detail',query:{id:n.productId}}">
            <div class="img"><img :src="n.productImgUrl" alt=""></div>
            <div class="res">
              <p class="title">{{n.productName}}</p>
              <p class="attrs" v-for="x in n.attrValues">{{x.name}}：{{ x.value }}</p>
              <p class="price">单价：{{n.suitUuid ? n.suitTotalPrice : ((n.finalPrice - 0) > 0 ? n.finalPrice : (n.buyNum == 0 ? n.singleMarketPrice
                : n.totalPrice / n.buyNum))}}元</p>
            </div>
          </router-link>
          <div class="num-box">
            <button type="button" id="reduce" class="md iky-reduce " @click="updateCart(n,'reducestock_')"></button>
            <span class="num"> {{n.buyNum}}</span>
            <button type="button" class="iky-plus md" id="plus" @click="updateCart(n,'addstock_')"></button>
            <span class="iky-clear md" id="remove" @click="updateCart(n,'remove_')"></span></div>
          <p class="tip">{{n.tip}}</p>
          <div class="suite" v-if="n.suitSubProduct">
            <div class="sub" v-for="m in n.suitSubProduct">
              <img :src="m.productImgUrl"><span class="name">{{m.productName}}</span>
              <span class="price">x {{n.buyNum}}</span></div>
          </div>
        </div>
      </div>
      <div class="total-all">
        <div class="total">总计：<span class="num">{{goodCount}}</span>选中：<span class="num-select">{{checkCount}}</span>件</div>
        <div class="price">
          合计：<span class="pay-price">{{price}}</span>元
          <span class="base-price" v-show="basePrice>price">{{basePrice}}元</span>
        </div>
      </div>
      <div class="btn-box">
        <input type="button" value="继续购物" class="toshop" @click="$router.push({path:'/'})">
        <input type="button" value="去结算" class="topay" @click="toOrder" />
      </div>
    </div>
    <div class="empty" v-show="goodCount==0">
      <p>您的购物车是空的！</p>
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
        checkCount: 0,
        data: [],
        price: 0,
        basePrice: 0,
        updateCartFun: null,
      }
    },
    created() {
      if (!this.$util.getCookie('token')) {
        this.goodCount = 0
      } else {
        this.getCart()
      }
    },
    methods: {
      updateCart(n, t) {
        if (this.updateCartFun != null) {
          clearTimeout(this.updateCartFun);
          this.updateCartFun = null;
        }
        if (t == 'remove_') {
          var _this = this
          confirm('你确定要删除该宝贝吗？', function () {
            var params = {
              productIdAndAttrId: _this.getPids(n, 'remove_'),
              auth: 1,
              random: Math.random(),
              suitUuid: n.suitUuid == 'null' ? '' : n.suitUuid,
            };
            _this.$http.get('/cart/removeKuyu', params, r => {
              if (r.code == 0)
                _this.getCart();
            });
          });
          return
        } else if (t == 'reducestock_') {
          n.buyNum--
            n.buyNum = n.buyNum <= 0 ? 1 : n.buyNum
        } else if (t == 'addstock_') {
          n.buyNum++
        }
        if (n.buyNum <= 0) return

        if (n.buyNum >= n.stockNo) {
          n.tip = `最多可购买${n.stockNo}件`
          n.buyNum = n.stockNo
        } else {
          n.tip = ''
        }
        var p = {
          auth: 1,
          productIdAndAttrId: this.getPids(n, t),
          changeNum: n.buyNum,
          suitUuid: n.suitUuid == 'null' ? '' : n.suitUuid,
        }
        this.updateCartFun = setTimeout(() => {
          this.update(p)
        }, 500);
      },
      update(p) {
        this.$http.get('/cart/changeNumsKuyu', p, r => {
          if (r.code == 0) {
            this.getCart()
          } else {
            alert('操作失败')
          }
        });
      },
      getPids(n, type) {
        var pids = []
        pids.push(type + n.productId + '_' + n.attrIds + (n.suitUuid && n.suitUuid != 'null' ? '_' + n.suitUuid : ''))
        if (n.suitSubProduct) {
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
          auth: 1,
          productIdAndAttrId: this.getPids(n, 'product_'),
          chooseState: !n.checked,
          suitUuid: n.suitUuid == 'null' ? '' : n.suitUuid,
          random: Math.random()
        };
        this.$http.get('/cart/changeChooseKuyu', params, r => {
          if (r.code == 0) {
            this.getCart()
          } else {
            alert('操作失败')
          }
        });
      },
      getCart() {
        this.$http.get('/cart/show', {
          auth: 1
        }, r => {
          if (r.code == 0) {
            this.goodCount = r.data.cartProductCount
            var data = r.data.carts
            var count = 0
            for (var d in data) {
              data[d]['tip'] = data[d].buyNum >= data[d].stockNo ? `最多可购买${data[d].stockNo}件` : ''
              if (data[d].checked) {
                count += data[d].buyNum
                if (data[d].suitSubProduct) {
                  for (var s in data[d].suitSubProduct) {
                    count += data[d].suitSubProduct[s].buyNum
                  }
                }
              }
            }
            this.data = data
            this.checkCount = count
            this.price = r.data.cartsTotalMount
            this.basePrice = r.data.productTotalMount
          } else {
            this.goodCount = 0
          }
          this.$store.state.count = this.goodCount
        });
      },
      toOrder() {
        var t = this.data.length
        this.data.map(function (m) {
          m.checked == false && t--
        })
        t == 0 ? alert('至少选择一件商品才能结算') :
          this.$router.push({
            path: '/order/confirm'
          })
      }
    }
  }

</script>
