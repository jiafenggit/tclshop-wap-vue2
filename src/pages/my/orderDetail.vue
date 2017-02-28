<template>
  <div class="usercenter">
    <div class="billtitle bor-bott"> 订单详情 </div>
    <div class="billdetail-info-billstatus J-GoodsInfor w90 bor-bott">
      <div class="row">
        <span>订单编号：</span><span>{{orderId}}</span>
      </div>
      <div class="row">
        <span>订单状态：</span><span>{{orderStatusName}}</span>
      </div>
    </div>
    <div class="billdetail-info-status J-Status w90">
      <ul>
        <li v-for="(s,i) in orderStatus">
          <div class="status">{{s.title}}</div>
          <i class="tge1"></i>
          <span class="circle1"></span>
          <span class="time">{{s.time}}</span>
        </li>
      </ul>
    </div>
    <div class="billgoods billdetail-goods-info J-BillGoods">
    </div>
    <div class="billdetail-info-message w90 bor-bott">
      <div class="row">
        <span class="m_label">收货地址：</span>
        <span class="m_content">{{address}}</span>
      </div>
      <div class="row">
        <span class="m_label">收货人名： </span>
        <span class="m_content">{{nick}}</span>
      </div>
      <div class="row">
        <span class="m_label">联系电话： </span>
        <span class="m_content">{{mobile}}</span>
      </div>
      <div class="row">
        <span class="m_label">发票类型：</span>
        <span class="m_content">{{invoiceType}}</span>
        </span>
      </div>
      <div class="row">
        <span class="m_label">发票抬头：</span>
        <span class="m_content">{{invoiceTitle}}</span>
        </span>
      </div>
    </div>
    <div class="billdetail-goods-total w90 bor-bott">
      <div class="billdetail-goods-total-content">
        <div class="row">
          <span class="fl">金额：</span>
          <span class="fl B-prices"></span>
        </div>
        <div class="row">
          <span class="fl">优惠：</span>
          <span class="fl" v-text="freeMoney"></span>
        </div>
        <div class="row">
          <span class="fl">运费：</span>
          <span class="fl" v-text="freight"></span>
        </div>
        <div class="row">
          <span class="fl">积分抵扣：</span>
          <span class="fl" v-text="integralReduceMoney"></span>
        </div>
        <div class="row">
          <span class="fl">合计：</span>
          <span class="fl red" v-text="payMoney"></span>
        </div>
      </div>
    </div>
    <div class="J-PayDeposit">
    </div>
    <div class="w90">
      <p class="Totaltext J-totalM fl">实付总额: <span class="B-totprice"></span></p>
      <i class="fl" v-text="awitTxt"></i>
      <a class="button J-vWuliu fl"></a>
      <a class="button J-cReceipt fr"></a>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        uuid: '',
        orderId: '',
        orderStatusName: '',
        freeMoney: '',
        payMoney: '',
        productMoney: '',
        integralReduceMoney: '',
        freight: '',
        address: '',
        mobile: '',
        nick: '',

        invoiceTitle: '',
        invoiceType: '',

        awitTxt: '',

        orderStatus: {
          orderTime: {
            title: '下单',
            time: '',
            select: false
          },
          payTime: {
            title: '付款',
            time: '',
            select: false
          },
          sendTime: {
            title: '发货',
            time: '',
            select: false
          },
          confirmTime: {
            title: '交易成功',
            time: '',
            select: false
          },
          commentTime: {
            title: '评价',
            time: '',
            select: false
          },
        },
      }
    },
    created() {
      this.uuid = this.$route.query.uuid
      this.getDetail()
    },
    methods: {
      getDetail() {
        this.$http.post('/usercenter/order/ajaxviewKuyu', {
          uuid: this.uuid,
          auth: 1
        }, res => {
          var discountModel = '';
          var sales = '';
          if (res && res.code == '0') {
            if (res.data && res.data.detailList == null || res.data.detailList.length == 0) {
              alert('该订单不存在！');
              return;
            };

            if (res && res.data && res.data.m) {
              var m = res.data.m;
              this.orderId = m.orderId
              this.orderStatusName = m.orderStatusName

              this.productMoney = m.productMoney
              this.payMoney = m.payMoney
              this.freeMoney = m.freeMoney
              this.integralReduceMoney = m.integralReduceMoney

              //   $('.J-Number').text(m.orderId);
              //   $('.J-Type').text(m.orderStatusName);
              //   $('.B-Offers').text('-' + m.freeMoney.toFixed(2) + '元');
              //   $('.B-totprice').text(m.payMoney.toFixed(2) + '元');
              //   $('.B-prices').text(m.productMoney.toFixed(2) + '元');
              //   $('.B-freight').text('0.00元');
              //   $('.B-integral').text('-' + m.integralReduceMoney.toFixed(2) + '元');
              // $('.cancel').attr('href', '/usercenter/cancelorder.html?' + m.uuid);
              // $('.J-Buy').attr('href', '&type=2');
              this.orderStatus['orderTime'].time = m.orderTime
              this.orderStatus['payTime'].time = m.payTime
              this.orderStatus['sendTime'].time = m.sendTime
              this.orderStatus['confirmTime'].time = m.confirmTime
              this.orderStatus['commentTime'].time = m.commentTime
              if (m.commentTime) {
                this.orderStatus['commentTime'].title = '已评价'
              }

              //   if (m.discountModel && m.discountModel.length > 0) {
              //     sales = '<div class="gift">促销：' + m.discountModel[0].description + '</div>';
              //     if (m.discountModel[0].giftNames && m.discountModel[0].giftNames.length > 0) {
              //       discountModel += '<div class="gift"><div class="goods-sales">订单赠：</div><div class="goods-sales">';
              //       m.discountModel[0].giftNames.map(function (item, i) {
              //         discountModel += '<p>' + item + '</p>';
              //       });
              //       discountModel += '</div></div>';
              //     };
              //   }
              if (m.state != '8' && m.orderType == '1') { //已经下单，未支付
                if (m.state == '1') {
                  this.orderStatus['orderTime'].select = true
                  $('.J-PayDeposit').append('<a href="/usercenter/cancelorder.html?uuid=' + m.uuid +
                    '" class="button cancel fl">取消订单 </a><a href="/order/orderpay.html?orderid=' + m.orderId +
                    '&type=2" class="button J-Buy fl">立即支付 </a>');
                };
                if (m.state == '4' || m.state == '5') { //已经付款
                  this.orderStatus['payTime'].select = true
                  $('.cancel,.J-Buy').hide();
                  $('.J-totalM').show();
                  $('.J-Await').html('等待出库');
                  this.awitTxt = '等待出库'
                };
                if (m.state == '7' && m.commentState != '2') {
                  $('.J-Status').find('.J-Ts').eq(0).addClass('bluebg');
                  $('.J-Status').find('.tge4').eq(0).addClass('tge');
                  $('.J-Plan').find('.circle4').eq(0).addClass('circle');
                  // $('.J-StatusTime').find('.time').eq(0).text(item.orderOpeTime);
                  $('.cancel,.J-Buy,.J-totalM,.J-Await').hide();
                  $('.J-cReceipt').show();
                  $('.J-cReceipt').text('发表评论');
                  $('.J-cReceipt').attr('href', '/usercenter/comment.html?uuid=' + m.uuid);
                }
                if (m.state == '6') {
                  $('.J-Status').find('.J-Sp').eq(0).addClass('bluebg');
                  $('.J-Status').find('.tge3').eq(0).addClass('tge');
                  $('.J-Plan').find('.circle3').eq(0).addClass('circle');
                  // $('.J-StatusTime').find('.time').eq(0).text(item.orderOpeTime);
                  $('.J-totalM,.J-Await,.J-Buy,.cancel').hide();
                  $('.J-vWuliu').text('查看物流')
                  $('.J-vWuliu').attr('href', '/usercenter/viewLogistics.html?uuid=' + m.uuid);
                  $('.J-cReceipt,.J-vWuliu').show();
                  $('.J-cReceipt').text('确认收货');
                  // $('.J-cReceipt').attr('href', '/order/orderpay.html?' + m.uuid);
                  //点击确认收货
                  $(document).on('click', '.J-cReceipt', function () {
                    confirm('温馨提示', '确认收货后不能修改，确认收货吗？', function () {
                      Order.reveiveGoods(m.uuid, function (res) {
                        if (res && res.code == 0) {
                          alert('操作成功！', function () {
                            window.location.reload();
                          });
                        } else {
                          alert('操作失败！');
                        }
                      });
                    }, '取消', '确定');

                  });
                }
                if (m.state == '7' && m.commentState == '2') {
                  // $('.J-Status').find('.J-Tor').eq(item.opeType-1).addClass('bluebg');
                  //  $('.J-Status').find('.tge5').eq(item.opeType-1).addClass('tge');
                  //  $('.J-Plan').find('.circle5').eq(item.opeType-1).addClass('circle');
                  // $('.J-StatusTime').find('.time').eq(item.opeType-1).text(item.orderOpeTime);
                  $('.cancel,.J-Buy').hide();
                }

              }

              m.orderStatusName == '交易关闭' ? $('.J-Status, .J-Plan, .J-StatusTime, .cancel ,.J-Buy').remove() : null;

            };

            if (res && res.data && res.data.omam) {
              var om = res.data.omam;
              this.address = om.address
              this.nick = om.name
              this.mobile = om.mobile
            };

            if (res && res.data && res.data.ordernaryInvoice) {
              var orIn = res.data.ordernaryInvoice;
              this.invoiceTitle = orIn.invoiceTitle
              this.invoiceType = orIn.invoiceType == 2 ? '电子发票' : '增值税发票'
            };
            if (res && res.data && res.data.detailList && res.data.detailList.length > 0) {

              res.data.detailList.map(function (item) {
                $('.J-pPic').find('img').attr('src', item.specUuid);
                $('.J-goods-href').attr('href', '/goods/detail.html?uuid=' + item.productUuid);

                var badge = '';
                var give = '';
                if (item.suit) {
                  badge = '<span class="red-block">套装</span>';
                }
                if (m.limitPromotion == true) {
                  badge = '<span class="red-block">秒杀</span>';
                };
                if (m.state == '1' && m.limitPromotion == true) {
                  var remainMinute = Math.ceil(m.limitRemainPayTime / 60000);
                  if (remainMinute > 0 && m.orderStatusName != '交易关闭') {
                    $('.J-GoodsInfor').append('<div class="row"><span>剩余付款时间：</span><span class="J-Type">' + (
                        remainMinute > 60 ? (remainMinute / 60).toFixed(0) : '0') +
                      '小时</span><span class="J-Type">' + remainMinute % 60 + '分钟</span></div>');
                  }
                  if (remainMinute <= 0 && m.orderStatusName != '交易关闭') {
                    $('.J-GoodsInfor').append(
                      '<div class="row"><span>剩余付款时间：</span><span class="J-Type">已过期</span></div>');
                  }

                } else {
                  orderTime = '<div class="m-right txt-black">' + m.orderTime + '</div>';
                }

                if (item.discountModel) {
                  if (item.discountModel.giftNames && item.discountModel.giftNames[0]) {
                    give += '<div class="gift"><div class="goods-sales">赠品：</div><div class="goods-sales">';
                    item.discountModel.giftNames.map(function (item) {
                      give += '<p>' + item + '</p>';
                    });
                    give += '</div></div>';
                  }
                }
                if (item.discountModel) {
                  if ((item.discountModel.giftNames == '' || item.discountModel.giftNames == null) && item.discountModel
                    .description) {
                    give = '促销：' + item.discountModel.description;
                  }
                }
                if (item.suit) {
                  badge = '<span class="red-block">套装</span>';
                }

                html += '<a href="/goods/detail.html?uuid=' + item.productUuid + '" class="J-goods-href">' +
                  '  <div class="billgoodsimg J-pPic">' + badge +
                  '    <img src="' + item.specUuid + '">' +
                  '  </div>' +
                  '  <div class="billgoodstxt J-pTitle">' +
                  '    <p class="P-title">' + item.productName + '</p>' +
                  '    <p class="type ">数量：<span class="P-amount">' + item.buyNum + '</span>台</p>' +
                  '    ' + sales + give + discountModel +
                  '    <p>单价：<span class="P-prices">' + item.basePrice.toFixed(2) + '</span>元</p>' +
                  '  </div>' +
                  '  <div class="billgoodsprice">' +
                  '    <span class="P-tprice">' + item.payMoney.toFixed(2) + '</span>元' +
                  '  </div>' +
                  '</a>';

              });
              $('.J-BillGoods').append(html);

            }
          } else {
            alert('页面加载出错！');
          }
        })
      }
    }
  }

</script>
