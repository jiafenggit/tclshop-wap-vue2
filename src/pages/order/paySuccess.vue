<template>
  <div class="t-success">
      <h4>&nbsp;付款成功</h4>
      <p>订单编号：<span v-text="orderId">&nbsp;</span></p>
      <p>支付金额：<span v-text="payMoney">&nbsp;</span></p>
      <div class="btnbox">
        <router-link :to="{path:'/my/orderDetail',query:{uuid:uuid}}" id="orderInfo">查看订单</router-link>
        <router-link :to="{path:'/'}" class="to">继续购物</router-link>
      </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        orderId: '',
        payMoney: '',
        uuid: ''
      }
    },
    created() {
      var orderPay = this.$util.getCookie('orderPay')
      var Otype = this.$route.query.orderType
      if (orderPay) {
        orderPay = JSON.parse(orderPay);
        this.orderId = orderPay.orderId
        this.payMoney = orderPay.payMoney
        this.uuid = orderPay.uuid
      }
    },
    methods: {

    }
  }

</script>
