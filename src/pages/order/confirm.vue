<template>
  <div class="orderConfrim">
    <div class="main" id="main">
      <div class="billtitle bor-bott">我的订单</div>
      <!-- 地址 -->
      <div class="billaddress bor-bott">
        <router-link :to="{path:'/order/changeAddress',query:{from:from}}">
          <div class="default">
            <div class="name" v-text="add.consignee"></div>
            <div class="phone" v-text="add.mobile"></div>
            <div class="detail" v-text="add.area"></div>
          </div><span class="iky-arrow-right"></span>
        </router-link>
      </div>
      <div class="pay bor-bott">
        <div class="paytitle"> 支付方式： </div>
        <div class="paytxt">在线支付</div>
        <span class="paytxt gray">(支付宝，银联等)</span>
      </div>
      <div class="payType">
        <div class="paytitle">发票类型</div>
        <div class="payTypeSelect">电子发票</div>
      </div>
      <div class="payType">
        <ul>
          <li class="payTypebox active" data-type="2">电子发票</li>
          <li class="payTypebox" data-type="3">增值税发票</li>
        </ul>
      </div>
      <div class="balance">
        <!-- 电子发票  -->
        <div class="pay-tab hidden" id="elec">
          <div class="m-payType">
            <div class="row">
              <input type="text" placeholder="请填写发票抬头" id="titleContent" maxlength="30" class="ordinaryinput">
            </div>
            <div class="row txtcenter">
              <div class="row txtcenter">
                <select class="ordinaryinput black" id="invoiceContent">
                                <option value="商品明细" selected="selected">商品明细</option>
                            </select>
              </div>
            </div>
            <div class="btngroup">
              <div class="btn cancel" id="EleCancel">重新填写</div>
              <div class="btn confirm" id="EleBtn">确定</div>
            </div>
          </div>
        </div>
        <div class="pay-tab hidden" id="VAT">
          <div class="m-payType">
            <div class="row txtcenter">
              <input class="ordinaryinput" type="text" id="add_companyName" placeholder="请填写发票抬头">
            </div>
            <div class="row txtcenter">
              <div class="row txtcenter">
                <select class="ordinaryinput black">
						<option value="商品明细" selected="">商品明细</option>
					</select>
              </div>
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput" type="text" id="add_code" placeholder="请输入纳税人识别号">
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput black" type="text" id="add_address" placeholder="请输入注册地址">
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput black" value="" id="add_registerMobile" type="text" placeholder="请输入注册电话">
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput" value="" type="text" id="add_bankName" placeholder="请输入开户银行">
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput" type="text" id="add_bankNo" placeholder="请输入银行账户">
            </div>
            <div class="btngroup">
              <div class="btn cancel" id="VATCancel">重新填写</div>
              <div class="btn confirm" id="VATSaveBtn">确定</div>
            </div>
          </div>
        </div>
      </div>
      <div id="showInvoice" class="balance">
        <div class="payType bor-top bor-bott tab">
          <div class="paytitle">我有优惠劵</div>
          <div class="iky-arrow-right"></div>
          <div class="useCoupon hidden">
            <span class="useCouponTxt">使用优惠券</span>
            <span class="useCoupondetail"></span>
          </div>
        </div>
        <!--优惠券入口-->
        <div class="payType billbg billCouponcontent" id="coupon">
          <div class="coupon-list">
            <p v-for="c in couponList">
              <span class="iky-hook"></span>
              <span class="txt">{{c.couponTypeName}}</span>
              <span class="time">有效期至{{c.endTime}}</span>
            </p>
          </div>
          <div class="paybillinput fl">
            <input type="text" placeholder="请输入优惠券码" id="couponCode">
          </div>
          <input type="button" class="billconfirm fr" id="useCouponCode" value="确定" />
        </div>
        <div class="payType bor-top bor-bott tab">
          <div class="paytitle">使用积分抵现</div>
          <div class="iky-arrow-right"></div>
        </div>
        <!--优惠券入口-->
        <div class="payType billbg billCouponcontent jifen" id="coupon">
          <div class="paybillinput fl ">
            使用<input type="text" id="jifen" placeholder="0" :placeholder="useMaxIntegral" />积分，抵扣<span id="deduct">0</span>元
          </div>
          <input type="button" class="billconfirm fr" id="jifenBtn" value="确定" />
        </div>
        <div id="showStores" class="goods-list">
          <div class="billgoods">
            <div class="sales">
              <p v-for="s in sales"><input type="button" :value="s.value">{{s.promotionName}}</p>
            </div>
          </div>
          <div class="billgoods" v-for="g in goodsList">
            <div class="billgoodsimg"><img src="http://img.mall.tcl.com/dev1/0/000/202/0000202586.fid"></div>
            <div class="billgoodstxt">
              <p> 观影王4K护眼版 65英寸</p>
              <p class="attrs" v-for="x in g.attrs">' + x.name + '：' + x.value + '</p>
              <p>5999.00元 X 20</p>
              <span class="stock" data-uid="23f072dc96ee48e69c2f76eab6765e69">有货</span>
            </div>
            <div class="gift"></div>
          </div>
        </div>
        <!-- total price begin -->
        <div class="totals bor-top fixbutton">
          <div class="paytitle">
            <p>数量：<span class="count">0</span>件</p>
            <p>合计：<span class="price">0.00</span>元
              <s>00.00元</s>
            </p>
          </div>
          <input type="submit" class="totalprice-btn" id="saveOrder" value="确认购买">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        from: 'order',
        add: '',
        // jifenPromotionUUID, //积分ID
        integralReduceNum: 0, //使用积分 
        invoiceCate: 2,
        invoiceUuid: '',
        exitsGoods: true,
        useMaxIntegral: 0, //最多可使用积分抵现
        olduseMaxIntegral: 0, //最多可使用积分抵现
        paymoney: 0,
        params: {},
        products: [],
        couponList: [], //优惠券列表
        goodsList: [], //商品列表
        sales: [],
        data: '',
        cartuid: '',
        denomination: 0, //优惠券减的钱
        couponMoney: 0, //优惠码减去的钱
        jfMoney: 0, //积分减去的钱
        oldMoney: 0, //时时价格
        //预付定金信息
        ispreSales: false, //是否预付定金
        pIds: '',
        attrIds: '',
        buyNum: 1,
        willType: 2,
        ordertype: 0,

        proportion: 1, //抵现比例  积分数量
        proportion2: 1, //抵现比例  人民币数量
        percentage: 1, //抵现百分比

        items: [], //小熊客户

        //秒杀信息
        isKill: false,
        promotionUuid: '',
        skuNo: '',
        areaId: '',
      }
    },
    created() {
      if (this.$router.query) {
        this.pIds = this.$router.query.pIds
        this.attrIds = this.$router.query.attrIds
        this.buyNum = this.$router.query.buyNum
        this.willType = this.$router.query.willType
        this.promotionUuid = this.$router.query.promotionUuid
        this.skuNo = this.$router.query.skuNo
        this.areaId = this.$router.query.areaId
      }
      if (this.promotionUuid && this.skuNo) {
        this.iskill = true
        this.getSecKillProduct()
      } else
      if (this.pIds && this.attrIds) {
        this.ispreSales = true
        this.getpresaleProduct()
      } else {
        this.getBalance()
      }
    },
    methods: {
      hasGoods(param) {
        if (!param.addressUuid) return;
        this.$http.post('/splitorder/chooseaddressNewKuyu', params, res => {
          if (res.stockMap) {
            this.exitsGoods = true;
            for (var key in res.stockMap) {
              var _cls = 'stock';
              res.stockMap[key] == '无货' && (exitsGoods = false, _cls += ' nostock');
              $('.stock[data-uid="' + (ispreSales ? param.pIds : key) + '"]').text(res.stockMap[key]).attr('class',
                _cls);
            };
          };
        });
      },
      seckillHasGoods(params) {
        if (!params.addressUuid) return;
        this.$http.post('/splitorder/findStockNum', params, res => {
          this.exitsGoods = true;
          if (res.retData && res.retData.split_error == "error") {
            this.exitsGoods = false;
            var data = res.retData.cartManager,
              uid = data &&
              data.detailModelList &&
              data.detailModelList[0] &&
              data.detailModelList[0].productUuid;
            $('.stock[data-uid="' + uid + '"]').text('无货').addClass('nostock');
          };
        });
      },
      renderAddress() {
        this.from = (this.$router.query && this.$router.query.from || 'order');
        this.isKill && (this.from = 'seckill');
        this.ispreSales && (this.from = 'presales');
        //取地址
        if (this.data && this.data.addressList && this.data.addressList.length > 0) {
          var addressId = this.$router.query && this.$router.query.addressId
          var selectAdd
          var defaultAdd;

          this.data.addressList.filter(function (m) {
            m.uuid == addressId && (selectAdd = m);
            m.isDefault == '1' && (defaultAdd = m);
          });
          this.add = selectAdd || defaultAdd || this.data.addressList[0]
          //   if (this.add) {
          //     $('#titleContent').val(add.consignee);
          //     $('.billaddress').append('<a href="/order/changeAddress.html?from=' + from + '">' +
          //       '<div class="default">' +
          //       '<div class="name">' + add.consignee + '</div>' +
          //       '<div class="phone">' + add.mobile + '</div>' +
          //       '<div class="detail">' + add.area + '</div>' +
          //       '</div>' +
          //       '<span class="iky-arrow-right"></span>' +
          //       '</a>')
          //   } else {
          //     $('.billaddress').append('<a href="/order/changeAddress.html?from=' + from + '">' +
          //       '<div class="my-address-new">' +
          //       '<span class="iky-arrow-right"></span> 选择地址' +
          //       '</div>' +
          //       '</a>');
          //   };
          // } else {
          //   $('.billaddress').append('<a href="/order/changeAddress.html?from=' + from + '">' +
          //     '<div class="my-address-new">' +
          //     '<span class="iky-arrow-right"></span> 新增地址</div></a>');
        }
      },
      renderCart() {
        var md = this.data.integralToNowModel;
        if (md) {
          this.proportion = md.proportion; //抵现比例  积分数量
          this.proportion2 = md.proportion2; //抵现比例  人民币数量
          this.percentage = md.percentage; //抵现百分比
        };

        if (this.data.preSale) {
          this.ispreSales = true;
          if (this.data.preSale.firstCost && this.data.preSale.firstCost > 0)
            this.ordertype = 1;
        };



        if (this.data.cartManager && this.data.cartManager.detailModelList.length > 0) {
          this.goodsList = []
          // $('.goods-list').html('')
          var c = this.data.cartManager.detailModelList;
          var cx = this.data.cartManager.storePromotionsList; //促销
          var mzgift = this.data.cartManager.productGiftLists; //促销满赠的礼品

          // 促销信息
          if (cx && cx.length > 0 && cx[0].promotionTypes) {
            var getProType = function (p) {
              if (!p) return '';
              var _p = '';
              p.indexOf('1') >= 0 && (_p += '满减');
              p.indexOf('4') >= 0 && (_p += '满赠');
              p.indexOf('5') >= 0 && (_p += '打折');
              p.indexOf('6') >= 0 && (_p += '满折');
              p.indexOf('7') >= 0 && (_p += '买减');
              return _p;
            };
            // $('#showStores').append('<div class="billgoods"><div class="sales"></div></div>')
            cx.map(function (m) {
              this.sales.push({
                name: m.promotionName,
                value: getProType(m.promotionTypes)
              })
              // $('.sales').append('<p><input type="button" value="' + getProType(m.promotionTypes) + '"> ' + m.promotionName +
              //   '</p>')
            });
          };
          if (mzgift && mzgift.length > 0) {
            mzgift.map(function (m) {
              this.sales.push({
                name: '赠品',
                value: `${m.productName} x 1`
              })
              // $('.sales').append('<p><input type="button" value="赠品"> ' + m.productName + ' X ' + 1 + '</p>')
            });
          };
          var _this = this
          c.filter(function (n, i) {
            _this.items[i] = {
              id: n.productUuid,
              count: n.buyNum
            };
            var good = {}
            goods.uid = n.productUuid
            goods.hasGoods = true
            goods.attrs = []
            var tip3 = '';
            if (!_this.ispreSales) {
              for (var key in _this.data.stockMap) {
                _this.data.stockMap[key] == '无货' && (_this.exitsGoods = false);
                if (key == n.productUuid) {
                  // tip = _this.data.stockMap[key] == '有货' ? '<span class="stock" data-uid="' + n.productUuid +
                  //   '">有货</span>' : '<span class="nostock stock" data-uid="' + n.productUuid + '">无货</span>';
                  _this.data.stockMap[key] == '有货' ? (good.hasGoods = true) : (goods.hasGoods = false)
                  break;
                };
              };
            };
            n.productWarning && (_this.exitsGoods = false, goods.hasGoods = false);
            // !tip && !n.productWarning && (tip = '<span class="stock" data-uid="' + n.productUuid + '">有货</span>');
            // console.log(tip);
            //商品属性。颜色，是否只能，容量等
            if (n.attrValues && n.attrValues.length > 0) {
              n.attrValues.map(function (x) {
                // attrs += '<p class="attrs">' + x.name + '：' + x.value + '</p>';
                goods.attrs.push({
                  name: x.name,
                  value: x.value
                })
              });
            };
            //赠品
            if (n.productGiftLists && n.productGiftLists.length > 0) {
              // if (n.promotionName)
              //     tip3 += '<p><input type="button" value="促销"/>' + n.promotionName + '</p>';
              n.productGiftLists.map(function (s) {
                tip3 += '<p><input type="button" value="赠品"/><a href="/goods/detail.html?uuid=' + s.productUuid +
                  '">' + s.productName + ' X ' + n.buyNum + '</a></p>';
              });
            } else {
              if (n.promotionName && !isKill)
                tip3 += '<p><input type="button" value="促销"/>' + n.promotionName + '</p>';
            };
            //预购
            if (_this.ispreSales && _this.data.cartManager.firstPay && _this.data.cartManager.firstPay > 0) {
              tip = '<p>定金：' + _this.data.cartManager.firstPay + '</p>' + tip;
            };
            // console.log(tip);

            //单品活动促销
            var promotiontype = n.pim && n.pim.promotionTypes && n.pim.promotionTypes[0];

            //套装显示
            var url = n.productImgUrl || n.productImg || (data.productModel && data.productModel.productImage.smallImageUrl) ||
              '';
            var tztip = ''
            if (_this.data.suitMap && _this.data.suitMap.length > 0) {
              for (var key in data.suitMap) {
                if (key == n.suitUuid) {
                  tztip += '<span>(套装：' + _this.data.suitMap[key].name + ')</span>';
                  break;
                };
              };
              _this.params['suitNum_' + n.suitUuid] = n.buyNum;
            };
            var pe = _this.ispreSales ? n.basePrice : (n.buyNum == 0 ? n.basePrice : n.totalPrice / n.buyNum);

            $('#showStores').append('<div class="billgoods">' +
              '<div class="billgoodsimg">' + (isKill ? '<span>秒杀</span>' : '') +
              '<img src="' + url + '">' +
              '</div>' +
              '<div class="billgoodstxt">' +
              '<p>' + n.productName + tztip + '</p>' + attrs +
              (_this.ispreSales ? '' : ('<p>' + (pe - 0).toFixed(2) + '元 X ' + n.buyNum + '</p>')) + tip +
              '</div><div class="gift">' + tip3 + '</div>' +
              '</div>');
            //使用优惠券参数
            var p = {
              storeUuid: _this.data.cartManager.storeUuid,
              productUuid: n.uuid,
              productCost: n.totalPrice
            };
            this.products.push(p);
            if (!this.ispreSales) {
              var suid = n.suitUuid ? '_' + n.suitUuid : '';
              this.params['productBasePrice_' + n.attrAndValue + suid] = n.basePrice;
              this.params['productNowPrice_' + n.attrAndValue] = n.nowPrice;
              this.params['productPrice_' + n.attrAndValue + suid] = n.totalPrice;
              // params['productGiftIds_' + n.attrAndValue] = '';
            };

            //下单参数
            // paymoney += n.nowPrice; //付款金额
            this.oldMoney += n.basePrice * n.buyNum; //时时价格
            if (!n.suitUuid)
              this.params['productNum_' + n.attrAndValue] = n.buyNum;

            //促销赠送
            if (n.productGiftIds && n.productGiftIds.length > 0) {
              this.params['productGiftIds_' + n.attrAndValue] = n.productGiftIds.join(',');
            };
          });


          //满减
          this.paymoney = this.ispreSales ? this.data.orderTotalMoney : this.data.cartManager.totalMoney; //付款金额
          this.cartuid = this.data.cartManager.storeUuid;
          this.params['affix_' + cartuid] = this.data.cartManager.affix || 0;
          this.params['shipType_' + cartuid] = 1; //res.cartManager.storeUuid;
          this.params['cartTotal_' + cartuid] = this.paymoney;
          this.params['storeReduce_' + cartuid] = this.data.cartManager.reduceMoney || 0;


          if (this.data.cartManager.storePromotionsList && this.data.cartManager.storePromotionsList['0']) {
            this.params['storePromotion_' + this.cartuid] = this.data.cartManager.storePromotionsList['0'].promotionUuid;
          };

        };
        var pcount = this.ispreSales ? this.ata.buyNum : (this.isKill ? 1 : this.data.real_total_num);


        var pMoney = this.isKill ? this.data.cartManager.detailModelList[0].totalPrice : (this.ispreSales ? (this.data.preSale
            .firstCost &&
            this.data.preSale.firstCost - 0 > 0 ? this.data.preSale.firstCost : this.data.orderTotalMoney) : this.data
          .cartManager.totalMoney);
        $('.paytitle .count').text(pcount);
        $('.paytitle .price').text((pMoney - 0).toFixed(2));
        // console.log(oldMoney)
        // console.log(oldMoney, pMoney);
        (this.oldMoney - 0) > (pMoney - 0) && !this.ispreSales && $('.paytitle s').text((this.oldMoney - 0).toFixed(2) +
          '元').show();


        //小熊客户
        var ntalkerparam = {
          cartprice: pMoney,
          items: items
        };

        NTKF_PARAM['ntalkerparam'] = ntalkerparam;
      },
      getSecKillProduct() { //秒杀
        this.$http.get('/front/product/fastBuyLimitProduct', {
          skuNo: this.skuNo,
          promotionUuid: this.promotionUuid,
          auth: 1
        }, res => {
          if (res) {
            this.data = res;
            this.renderAddress();
            this.renderCart(this.data);
            this.add && this.seckillHasGoods({
              productSku: this.skuNo,
              promotionUuid: this.promotionUuid,
              addressUuid: this.add.uuid
            });
            this.paymoney = res.cartManager.detailModelList[0].totalPrice
            this.cartuid = res.cartManager.storeUuid;
            this.params['affix_' + this.cartuid] = res.cartManager.affix || 0;
            // params['shipType_' + cartuid] = res.cartManager.storeUuid;
            this.params['cartTotal_' + this.cartuid] = res.orderTotalMoney;
            this.params['storeReduce_' + this.cartuid] = data.cartManager.reduceMoney || 0;
            this.params['hipType_' + this.cartuid] = 1;
            this.params.productBuyNum = 1;
            this.params.promotionUuid = this.promotionUuid;
            this.params.productSku = this.skuNo;
          }
        });
      },
      getpresaleProduct() { //预付定金
        this.$http.post('/front/product/presaleProductToOrder', params, r => {
          if (r.code == 0) {
            data = res.retData;
            renderAddress();
            renderCart(data);
            add && hasGoods({
              pIds: pIds,
              attrIds: attrIds,
              buyNum: buyNum,
              willType: 2,
              orderType: 'reserve',
              reserveUuid: data.preSale.uuid,
              addressUuid: add.uuid
            });

            paymoney = data.preSale.firstCost && data.preSale.firstCost - 0 > 0 ? data.preSale.firstCost : data.orderTotalMoney; //付款金额

            params.productUuid = data.pIds;
            params.buyNum = buyNum;
            params.productBuyNum = buyNum;
            params.jifenPromotionUUID = '';
            params.attrIds = data.attrIds;
            params.willType = '2'
            params.pIds = data.pIds;
            if (data.preSale) {
              cartuid = data.preSale.storeUuid;
              params['affix_' + cartuid] = data.preSale.affix || 0;
              params['storeReduce_' + cartuid] = data.preSale.reduceMoney || 0;
              params['storePromotion_' + cartuid] = data.preSale.uuid;
            }
          }
        });
      },
      getBalance() { // 订单详情
        this.$http.post('/order/toBalanceKuyu', {
          terminalType: '02',
          auth: 1
        }, res => {
          // if (!res.cartManagerList || res.cartManagerList.length == 0) {
          //   //   alert('您的购物车是空的！');
          //   setTimeout(function () {
          //     //   window.location.href = '/cart/cart.html';
          //   }, 1000);
          //   return false;
          // };
          // $('.tab').show();
          this.useMaxIntegral = res.useMaxIntegral;
          this.olduseMaxIntegral = res.useMaxIntegral;
          // $('#jifen').attr('placeholder', useMaxIntegral.toFixed(0));
          this.data = res;

          this.renderAddress();
          //购物车
          this.renderCart(this.data);

          this.add && this.hasGoods({
            addressUuid: this.add.uuid
          });
          //优惠券列表
          if (this.data.cartManager && this.data.cartManager.couponList) {
            this.couponList = this.data.cartManager.couponList
            // this.data.cartManager.couponList.map(function (m) {
            //   $('.coupon-list').append('<p data-denomination="' + m.denomination + '" data-uid="' + m.uuid +
            //     '"><span class="iky-hook"></span><span class="txt">' + m.couponTypeName +
            //     '</span><span class="time">有效期至' + m.endTime + '</span></p>');
            // });
          };
          var jf = res.integralToNowModel && res.integralToNowModel.uuid || '';
          this.params.jifenPromotionUUID = jf;
        });
      }
    }
  }

</script>
