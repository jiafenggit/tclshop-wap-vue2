<template>
  <div class="usercenter">
    <div class="reset-password m-order">
      <div class="resetpswd J-OrderTab">
        <a v-for="item in tabs" v-text="item.n" :class="types==item.t?'on':''" @click="checkState(item.t)"></a>
      </div>
      <div class="m-order-list J-Order-List">
        <div class="m-itme wait-pay" v-for="item in data">
          <a href="" class="m-refund" v-if="item.detailList[0].state!='null'">退款/退货</a>
          <a href="" class="m-refund" v-else>查看售后</a>
          <a href="/usercenter/orderdetails.html?uuid=c710a12abf1e4d92b9eaf756d707de8b">
            <div class="order-state">
              <div class="order-number">
                <div class="m-left">订单号：<span class="red">{{item.orderId}}</span></div>
              </div>
              <div class="order-number">
                <div class="m-left">状态：{{item.orderStatusName}}</div>
                <div class="m-right txt-black">{{item.orderTime}}</div>
              </div>
            </div>
            <ul class="order-commodity">
              <li v-for="n in item.detailList">
                <div class="order-itme order-block">
                  <span class="red-block" v-if="item.suit">套装</span>
                  <span class="red-block" v-if="n.discountModel&&n.discountModel.length > 0">赠品</span>
                  <span class="red-block" v-if="n.limitPromotion == true">秒杀</span>
                  <span class="red-block" v-if="n.discountModel&&n.discountModel.length > 0">促销</span>
                  <div class="img"><img :src="n.specUuid" :alt="n.productName"></div>
                  <div class="res">
                    <p> {{n.productName}}</p>
                    <p>购买数量：{{n.buyNum}}</p>
                    <p>单价：{{n.detailTotalPrice / n.buyNum - 0}}元</p>
                  </div>
                </div>
              </li>
            </ul>
          </a>
          <div class="payment">
            <div class="payment-price ">合计：<span>￥{{item.payMoney}}</span></div>
            <div class="payment-btn"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        types: '0',
        cls: '',
        tabs: [{
            n: '全部',
            t: '0'
          },
          {
            n: '待付款',
            t: '1'
          },
          {
            n: '待发货',
            t: '4'
          },
          {
            n: '待收货',
            t: '6'
          },
          {
            n: '待评价',
            t: '11'
          },
        ],
        pageShow: 8,
        nowPage: 1,
        pageCount: 0,
        loadEnd: false,
        data: []
      }
    },
    watch: {
      types(val) {
        this.getData()
      }
    },
    created() {
      this.types = this.$router.query && this.$router.query.types || 0
      this.getData()
    },
    methods: {
      checkState(t) {
        this.types = t
      },
      getData() {
        var params = {
          pageShow: this.pageShow,
          nowPage: this.nowPage,
          orderState: this.types == 0 ? '' : this.types,
          searchName: '',
          auth: 1,
          ranNum: Math.ceil(Math.random() * 10000)
        };
        this.$http.post('/usercenter/order/listKuyu', params, r => {
          if (r && r.data && r.data.dataList && r.data.dataList.length > 0) {

            if (r.data.pagination.totalNum) {
              this.pageCount = Math.ceil(r.data.pagination.totalNum / this.pageShow);
            };

            this.data = r.data.dataList

          }
        });
      }
    }
  }

</script>
