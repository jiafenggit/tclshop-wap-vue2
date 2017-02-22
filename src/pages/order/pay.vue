<template>
  <div class="orderpay">
    <div class="main" id="main">
      <div class="billtitle mar bor-bott y_w92">支付订单</div>
      <div class="m-submitsuccessfully red bor-bott tip" v-text="orderStatusName">&nbsp</div>
      <div class="billdetail-info-message">
        <div class="m-orderamount">
          <div class="m-tit y-w92">
            <div class="row">
              <span class="m-label">收货人：</span>
              <span class="m-content"><span v-text="nick"></span><label class="y-telphone" v-text="mobile"></label></span>
            </div>
            <div class="row">
              <span class="m-label">收货地址： </span>
              <span class="m-content" v-text="address"></span>
            </div>
            <div class="row">
              <span class="m-label">订单总额： </span>
              <span class="m-content" id="orderMoney" v-text="payMoney"></span>
              <div :class="showDetail?'more active':'more'" @click="showDetail=!showDetail">订单详情
                <div class="iky-arrow-up"></div>
              </div>
            </div>
          </div>
          <div class="box detail" v-show="showDetail">
            <div class="row">
              <span class="m-label">订单号：</span>
              <div class="m-content" v-text="orderId"></div>
            </div>
            <div class="row">
              <span class="m-label">收货信息：</span>
              <div class="m-content">
                <p><span v-text="nick"></span><label class="y-telphone" v-text="mobile"></label></p>
                <p><span v-text="address"></span></p>
              </div>
            </div>
            <div class="row">
              <span class="m-label">商品名称：</span>
              <div class="m-content" id="goodName">
                <p v-for="g in goods">{{g.name}} x {{g.buyNum}}</p>
              </div>
            </div>
            <div class="row">
              <span class="m-label">发票抬头：</span>
              <div class="m-content" id="invoice">{{invoiceTitle}}({{invoiceType}})</div>
            </div>
          </div>
          <div class="paytype">
            <a :class="payType=='ALIPAY'?'zfb active':'zfb'" v-show="!iswx" @click="payType='ALIPAY'">
              <img :src="zfb" alt="支付宝" />
              <h1>支付宝</h1>
              <p>已绑定支付宝账户，直接付款</p>
            </a>
            <a :class="payType=='UPOPWAP'?'yl active':'yl'" @click="payType='UPOPWAP'">
              <img :src="yinlian" alt="银联" />
              <h1>银联</h1>
              <p>支持银联的储蓄卡信用卡付款，无需开通网银</p>
            </a>
          </div>
        </div>
      </div>
      <form id="topay" name="topay" method="post" :action="payUrl" accept-charset="gbk">
        <input type="hidden" v-for="m in payData" :name="m.name" :value="m.value" />
      </form>
      <button id="testpay" type="button" class="button" style="position:absolute;top:.5rem;right: .6rem;border: none;padding: .2rem .3rem"
        @click="testPay">模拟支付</button>
      <div class="m-paymentbtn"><button id="gotopay" type="button" class="button" @click="toPay">{{btnTxt}}</button></div>
      <!--</form>-->
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        showDetail: false,
        iswx: true,
        payOrderUuid: '',
        type: '',
        Otype: '',
        payMoney: '',
        orderId: '',
        payType: 'UPOPWAP',
        orderuuid: '',
        orderStatusName: '',

        payUrl: 'https://ipos.tclpay.cn/colgate/colTrans',
        payData: [],
        //order
        nick: '',
        mobile: '',
        address: '',
        orderMoney: '',
        invoiceTitle: '',
        invoiceType: '',
        goods: [],
        btnTxt: '立即支付',
        //
        yinlian: require('../../res/img/yinlian.jpg'),
        zfb: require('../../res/img/zfb.jpg'),
        hostname: ''
      }
    },
    created() {
      this.payOrderUuid = this.$route.query.orderId
      this.type = this.$route.query.type
      this.Otype = this.$route.query.orderType || 3
      this.iswx = this.$util.iswx()
      var local = window.location
      var port = (local.port == '80' || local.port == '') ? '' : ':' + local.port
      this.hostname = local.protocol + '//' + local.hostname + port

      this.getPay()
    },
    methods: {
      getPay() {
        var params = {
          payOrderUuid: this.payOrderUuid,
          payOrderType: this.type,
          auth: 1
        }
        this.$http.get('/orderpay/toOrderPayKuyu', params, res => {
          if (res.code == '0') {
            this.orderStatusName = '您的订单提交成功！'
            var data = res.retData
            var add = data.orderMainAddressModel
            this.payMoney = (data.orderMoney - 0).toFixed(2) + '元'
            this.nick = add.name
            this.mobile = add.mobile
            this.address = add.address
            this.orderId = data.orderId

            var orderPay = {}
            orderPay.payMoney = this.payMoney //res.data.orderPayMoney
            orderPay.uuid = data.orderList[0].uuid
            orderPay.orderId = this.orderId
            this.$util.setCookie('orderPay', JSON.stringify(orderPay))

            // var gn = ''
            var _this = this
            data.orderList.map(function (m) {
              var n = m.detailList
              n && n.length >= 0 && n.map(function (x) {
                // gn += x.productName + ' x ' + data.productMap[x.productUuid] + '<br/>'
                _this.goods.push({
                  name: x.productName,
                  buyNum: data.productMap[x.productUuid]
                })
              })
            })

            // $('#goodName').html(gn)

            this.invoiceType = data.invoice.invoiceType == '2' ? '电子发票' : '增值税发票'
            this.invoiceTitle = data.invoice.invoiceTitle
            // $('#invoice').text(data.invoice.invoiceTitle + '（' + invoiceType + '）')
            // $('.m-paymentbtn').show()

          } else {
            if (res.code == '1' && res.retData && res.retData.order) {
              this.orderuuid = res.retData.order.uuid
              this.orderDetail()
            } else
              alert('无此订单信息，请检查再试！')
          }
          //   NTKF_PARAM['orderid'] = orderId //订单ID
          //   NTKF_PARAM['orderprice'] = payMoney //订单总价
        })
      },
      orderDetail() {
        this.$http.post('/usercenter/order/ajaxviewKuyu', {
          uuid: this.orderuuid,
          auth: 1
        }, res => {
          var m = res.data.m
          var n = res.data.omam
          this.payMoney = (m.payMoney - 0).toFixed(2) + '元'
          this.orderStatusName = '您的订单' + m.orderStatusName + '.'
          this.nick = n.name
          this.mobile = n.mobile
          this.address = n.address
          this.orderId = m.orderId
          //   var gn = ''
          var _this = this
          res.data.detailList.map(function (m) {
            //   gn += m.productName + ' x ' + m.buyNum + '<br/>'
            _this.goods.push({
              name: m.productName,
              buyNum: m.buyNum
            })
          })
          //   $('#goodName').html(gn)
          var invoice = res.data.onlineInvoice

          this.invoiceType = invoice.invoiceType == '2' ? '电子发票' : '增值税发票'
          this.invoiceTitle = invoice.invoiceTitle
          this.btnTxt = '查看详情'
          //   $('#invoice').text(invoice.invoiceTitle + '（' + invoiceType + '）')
          //   $('#gotopay').text('查看详情')
          //   $('.m-paymentbtn').show()
        })
      },
      toPay() {
        if (this.orderuuid) {
          //   if (this.Otype == 1) {
          //     window.location.href = '/usercenter/paydep.html?uuid=' + orderuuid;
          //     return;
          //   }
          this.$router.push({
            path: '/my/orders',
            query: {
              orderId: orderuuid
            }
          })
          //   window.location.href = '/usercenter/orderdetails.html?uuid=' + orderuuid;
          return
        }

        var params = {
          orderId: this.orderId,
          payType: this.payType,
          ranNum: Math.random(),
          successUrl: this.hostname + '/order/paySuccess.html?ordertype=' + this.Otype,
          failUrl: this.hostname + '/order/payFailed.html',
          //   auth: 1
        }
        this.payData = []
        this.$http.post('/wapPay/submitOrder', params, res => {
          if (res.code == '0' && res.data) {
            // var form = $('#topay');
            this.payUrl = res.data.payUrl
            for (var k in res.data) {
              k != 'payUrl' && this.payData.push({
                name: k,
                value: res.data[k]
              })
            };
            this.payData.push({
              name: 'buyer_id',
              value: ''
            })
            window.setTimeout(function() {
                document.getElementById('topay').submit()
            }, 300);
          } else {
            alert(res.msg || '该订单无法支付,请联系客服');
          };
        });
      },
      testPay() {
        if (this.orderuuid) {
          //   if (this.Otype == 1) {
          //     window.location.href = '/usercenter/paydep.html?uuid=' + orderuuid;
          //     return;
          //   }
          //   window.location.href = '/usercenter/orderdetails.html?uuid=' + orderuuid;
          this.$router.push({
            path: '/my/orderDetail',
            query: {
              uuid: this.orderuuid
            }
          })
          return;
          //  window.location.href = '/usercenter/orderdetails.html?uuid=' + orderuuid;
        };
        // orderId=GROUP0000000000162&payType=ALIPAY&ranNum=0.5598896070770238
        var params = {
          orderId: this.orderId,
          payType: 'ALIPAY',
          ranNum: Math.random(),
          successUrl: this.hostname + '/order/paySuccess.html?ordertype=' + this.Otype,
          failUrl: this.hostname + '/order/payFailed.html'
        };
        // console.log(params)
        // return;
        this.$http.post('/pay/submitorderKuyuTest', params, res => {
          if (res.code == '0') {
            // window.location.href = '/order/paySuccess.html?ordertype=' + this.Otype;
            this.$router.push({
              path: '/order/paySuccess',
              query: {
                orderType: this.Otype
              }
            })
          } else {
            alert(res.msg || '模拟支付失败');
          };
        });
      }
    }
  }

</script>
