<template>
  <div class="usercenter">
    <div class="reset-password m-order">
      <div class="resetpswd J-OrderTab">
        <router-link v-for="item in tabs" :to="{path:'/my/orders',query:{type:item.t}}" v-text="item.n" :class="type==item.t?'on':''"></router-link>
      </div>
      <div class="m-order-list J-Order-List">
        <div class="m-itme wait-pay" v-for="item in data">
          <a href="/usercenter/refund.html?orderId=c710a12abf1e4d92b9eaf756d707de8b&amp;uuid=08500568b61a46bb99169863f3be4aff&amp;type=2"
            class="m-refund">退款/退货</a>
            <a href="/usercenter/orderdetails.html?uuid=c710a12abf1e4d92b9eaf756d707de8b">
              <div class="order-state">
                <div class="order-number">
                  <div class="m-left">订单号：<span class="red">INDENT100000201694</span></div>
                </div>
                <div class="order-number">
                  <div class="m-left">状态：等待卖家发货</div>
                  <div class="m-right txt-black">2017-01-19 19:33:11</div>
                </div>
              </div>
              <ul class="order-commodity">
                <li>
                  <div class="order-itme order-block">
                    <div class="img"><img src="http://img.mall.tcl.com/dev1/0/000/202/0000202565.fid" alt=" 观影王4K护眼版 65英寸"></div>
                    <div class="res">
                      <p> 观影王4K护眼版 65英寸</p>
                      <p>购买数量：1</p>
                      <p>单价：5999.00元</p>
                    </div>
                  </div>
                </li>
              </ul>
            </a>
            <div class="payment">
              <div class="payment-price ">合计：<span>￥5999.00</span></div>
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
        type: 0,
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
    create() {
      this.type = this.$router.query.type
      this.getData()
    },
    methods: {
      getData() {
          alert()
        var params = {
          pageShow: this.pageShow,
          nowPage: this.nowPage,
          orderState: this.type,
          searchName: '',
          ranNum: Math.ceil(Math.random() * 10000)
        };
        this.$http.post('/usercenter/order/listKuyu', params, r => {
          if (r.code == '403') {
            this.$router.push({
              path: '/account/login'
            })
          }
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
