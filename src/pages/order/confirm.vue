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
        <div class="payTypeSelect" v-text="invoiceName"></div>
      </div>
      <div class="payType">
        <ul>
          <li :class="invoiceCate==2?'payTypebox active':'payTypebox'" @click="changeInvoice(2)">电子发票</li>
          <li :class="invoiceCate==3?'payTypebox active':'payTypebox'" @click="changeInvoice(3)">增值税发票</li>
        </ul>
      </div>
      <div class="balance">
        <!-- 电子发票  -->
        <div class="pay-tab" id="elec" v-show="showElec">
          <div class="m-payType">
            <div class="row">
              <input type="text" placeholder="请填写发票抬头" id="titleContent" maxlength="30" class="ordinaryinput" v-model="titleContent" />
            </div>
            <div class="row txtcenter">
              <div class="row txtcenter">
                <select class="ordinaryinput black" id="invoiceContent">
                    <option value="商品明细" selected="selected">商品明细</option>
                </select>
              </div>
            </div>
            <div class="btngroup">
              <div class="btn cancel" id="EleCancel" @click="titleContent=''">重新填写</div>
              <div class="btn confirm" id="EleBtn" @click="showElec=false">确定</div>
            </div>
          </div>
        </div>
        <!--增值税发票-->
        <div class="pay-tab" id="VAT" v-show="showVAT">
          <div class="m-payType">
            <div class="row txtcenter">
              <input class="ordinaryinput" type="text" v-model="add_companyName" placeholder="请填写发票抬头">
            </div>
            <div class="row txtcenter">
              <div class="row txtcenter">
                <select class="ordinaryinput black">
                  <option value="商品明细" selected="">商品明细</option>
                </select>
              </div>
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput" type="text" v-model="add_code" placeholder="请输入纳税人识别号">
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput black" type="text" v-model="add_address" placeholder="请输入注册地址">
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput black" v-model="add_registerMobile" type="text" placeholder="请输入注册电话">
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput" type="text" v-model="add_bankName" placeholder="请输入开户银行">
            </div>
            <div class="row txtcenter">
              <input class="ordinaryinput" type="text" v-model="add_bankNo" placeholder="请输入银行账户">
            </div>
            <div class="btngroup">
              <div class="btn cancel" id="VATCancel" @click="emptyVAT">重新填写</div>
              <div class="btn confirm" id="VATSaveBtn" @click="saveVAT">确定</div>
            </div>
          </div>
        </div>
      </div>
      <div id="showInvoice" class="balance">
        <div :class="showCoupon?'payType bor-bott active':'payType bor-bott'" @click="showCoupon=!showCoupon">
          <div class="paytitle">我有优惠劵</div>
          <div class="iky-arrow-right"></div>
        </div>
        <!--优惠券入口-->
        <div class="payType billbg billCouponcontent" id="coupon" v-show="showCoupon">
          <div class="coupon-list">
            <p v-for="c in couponList" @click="checkCoupon(c)">
              <span :class="!c.select?'iky-hook':'iky-hook checked'"></span>
              <span class="txt">{{c.couponTypeName}}</span>
              <span class="time">有效期至{{c.endTime}}</span>
            </p>
          </div>
          <div class="paybillinput fl">
            <input type="text" placeholder="请输入优惠券码" v-model="couponCode" />
          </div>
          <input type="button" class="billconfirm fr" @click="useCouponCode" value="确定" />
        </div>
        <div :class="showPoints?'payType bor-bott active':'payType bor-bott'" @click="showPoints=!showPoints">
          <div class="paytitle">使用积分抵现</div>
          <div class="iky-arrow-right"></div>
        </div>
        <!--使用积分抵现-->
        <div class="payType billbg billCouponcontent jifen" id="coupon" v-show="showPoints">
          <div class="paybillinput fl ">
            使用<input type="text" id="jifen" placeholder="0" :placeholder="useMaxIntegral" v-model="inputJf" @keyup="jfChange"
            />积分，抵扣<span id="deduct" v-text="jfMoney"></span>元
          </div>
          <input type="button" class="billconfirm fr" id="jifenBtn" value="确定" @click="showPoints=false" />
        </div>
        <div id="showStores" class="goods-list">
          <div class="billgoods">
            <div class="sales">
              <p v-for="s in sales"><input type="button" :value="s.value">{{s.promotionName}}</p>
            </div>
          </div>
          <div class="billgoods" v-for="g in goodsList">
            <div class="billgoodsimg"><img :src="g.url"></div>
            <div class="billgoodstxt">
              <p v-text="g.name"></p>
              <p class="attrs" v-for="x in g.attrs">{{x.name}}：{{x.value}}</p>
              <p>{{g.price}}元 X {{g.buyNum}}</p>
              <span class="stock">有货</span>
            </div>
            <div class="gift"></div>
          </div>
        </div>
        <!-- total price begin -->
        <div class="totals bor-top fixbutton">
          <div class="paytitle">
            <p>数量：<span class="count" v-text="buyCount"></span>件</p>
            <p>合计：<span class="price" v-text="payCount"></span>元
              <s v-show="oldMoney-payCount>0" v-text="oldMoney"></s>
            </p>
          </div>
          <input type="submit" class="totalprice-btn" @click="saveOrder" value="确认购买">
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
        inputJf: '',


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

        buyCount: 0,
        payCount: 0,

        proportion: 1, //抵现比例  积分数量
        proportion2: 1, //抵现比例  人民币数量
        percentage: 1, //抵现百分比

        items: [], //小熊客户

        //秒杀信息
        isKill: false,
        promotionUuid: '',
        skuNo: '',
        areaId: '',

        //tab show
        showElec: false,
        showVAT: false,
        showCoupon: false,
        showPoints: false,

        //
        couponCode: '',
        invoiceCate: 2,
        invoiceUuid: '',
        invoiceName: '电子发票',
        titleContent: '',
        add_companyName: '',
        add_code: '',
        add_address: '',
        add_registerMobile: '',
        add_bankName: '',
        add_bankNo: ''

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
      jfChange() { //  监听积分改变
        var v = this.inputJf
        v = v.length == 1 ? v.replace(/[^1-9]/g, '') : v.replace(/\D/g, '')
        v = v > this.useMaxIntegral ? this.useMaxIntegral : v

        v = parseInt(v - 0)
        this.jfMoney = (v / this.proportion - 0).toFixed(2) //抵扣积分的钱 ，

        // $(this).val(v)
        this.inputJf = v
        // $('#deduct').text(jfMoney)
        this.integralReduceNum = v
        this.payCount = (this.paymoney - this.denomination - this.couponMoney - this.jfMoney).toFixed(2)
        // $('.paytitle .price').text((paymoney - denomination - couponMoney - jfMoney).toFixed(2))
      },
      checkCoupon(item) { //  优惠券点选
        this.couponList.map(function (m) {
          m.uuid != item.uuid && (m.select = false)
        })
        item.select = !item.select
        this.showCoupon = false
        this.showCoupon = true
        this.couponMoney = 0
        this.jfMoney = 0

        for (var k in this.params) {
          if (k.indexOf('storeCoupon_') > -1 || k.indexOf('storeCouponReduce_') > -1)
            delete this.params[k]
        }

        if (item.select == true) {
          this.denomination = item.denomination - 0
          this.params['storeCoupon_' + this.cartuid] = item.uuid
          this.params['storeCouponReduce_' + this.cartuid] = this.denomination

          var endMax = (this.paymoney - this.denomination) * this.percentage / 100 / this.proportion2 * this.proportion
          // console.log(endMax, this.olduseMaxIntegral, this.olduseMaxIntegral)
          this.useMaxIntegral = this.olduseMaxIntegral > 0 ? (endMax <= this.olduseMaxIntegral ? endMax : this.olduseMaxIntegral) :
            0
        } else {
          this.denomination = 0
          this.useMaxIntegral = this.olduseMaxIntegral
        }


        this.useMaxIntegral = parseInt(this.useMaxIntegral - 0)

        // jf.attr('placeholder', (useMaxIntegral - 0).toFixed(0))
        // jf.val('')
        // df.text(0)
        this.jfMoney = 0
        this.inputJf = ''
        this.payCount = this.paymoney - this.denomination
        // $('.paytitle .price').text((paymoney - denomination).toFixed(2))
      },
      useCouponCode() { // 使用优惠券
        // var couponCode = $('#couponCode').val()
        if (this.couponCode.length == 0) {
          alert('请填写优惠码')
        } else {
          var p = {
            couponNo: this.couponCode,
            orderMoney: this.paymoney,
            products: this.products,
            auth: 1
          }
          this.$http.post('/cart/exchangeCoupons', JSON.stringify(p), res => {
            if (res.code == '0') {
              alert('优惠券使用成功！')
              this.denomination = 0
              this.jfMoney = 0
              this.couponMoney = res.data.money
              //使用成功后重新计算积分
              // var jf = $('#jifen')
              // var df = $('#deduct')
              var endMax = (this.paymoney - this.couponMoney) * this.percentage / 100 / this.proportion2 * this.proportion
              this.useMaxIntegral = this.olduseMaxIntegral > 0 ? (endMax <= this.olduseMaxIntegral ? endMax : this.olduseMaxIntegral) :
                0

              this.useMaxIntegral = parseInt(this.useMaxIntegral - 0)

              // jf.attr('placeholder', (useMaxIntegral - 0).toFixed(0))
              // jf.val('')
              // df.text(0)
              this.jfMoney = 0
              this.inputJf = ''
              this.payCount = this.paymoney - this.denomination
              // $('.paytitle .price').text((paymoney - couponMoney).toFixed(2))
              this.couponList.map(function (m) {
                m.select = false
              })
              this.showCoupon = false
              this.showCoupon = true
              // $('.coupon-list p').find('.iky-hook').removeClass('checked')
              params['storeCoupon_' + cartuid] = res.uuid
              params['storeCouponReduce_' + cartuid] = couponMoney
              // $('#coupon').slideToggle()
              this.showCoupon = false
            } else {
              alert('优惠券号已过期或者不存在')
            }
          })
        }
      },
      changeInvoice(t) { // 电子发票切换
        this.invoiceCate = t
        this.invoiceName = t == 2 ? '电子发票' : '增值税发票'
        t == 2 ?
          (this.showElec = !this.showElec, this.showVAT = false) :
          (this.showVAT = !this.showVAT, this.showElec = false, !this.invoiceUuid && this.getVATInvoice())
      },
      emptyVAT() { // 重置电子发票
        this.add_companyName = ''
        this.add_code = ''
        this.add_address = ''
        this.add_registerMobile = ''
        this.add_bankName = ''
        this.add_bankNo = ''
      },
      saveVAT() { // 保存电子发票
        var input = this.$el.querySelectorAll('#VAT .ordinaryinput')
        for (var k in input) {
          if (!input[k].value && k < input.length) {
            alert(input[k].placeholder)
            return false
          }
        }
        var params = {
          companyName: this.add_companyName,
          code: this.add_code,
          address: this.add_address,
          registerMobile: this.add_registerMobile,
          bankName: this.add_bankName,
          bankNo: this.add_bankNo
        }
        if (!this.invoiceUuid) {
          this.$http.post('/usercenter/addInvoice/createAddInvoiceSetting', {
            param: JSON.stringify(params),
          }, r => {
            if (r.code == '0') {
              alert('保存成功！')
              this.showVAT = false
            } else alert('保存失败，请稍后重试!')
          })
        } else {
          params.uuid = this.invoiceUuid
          this.$http.post('/usercenter/addInvoice/update', {
            param: JSON.stringify(params),
          }, r => {
            if (r.code == '0') {
              alert('保存成功！')
              this.showVAT = false
            } else alert('保存失败，请稍后重试!')
          })
        }
      },
      getVATInvoice() { // 取增值税发票信息
        this.$http.post('/usercenter/addInvoice/getByCustomerUuid', {
          auth: 1
        }, r => {
          if (r.code == '0' && r.data && r.data.length > 0) {
            var d = r.data[r.data.length - 1]
            this.invoiceUuid = d.uuid
            this.add_companyName = d.companyName
            this.add_code = d.code
            this.add_address = d.address
            this.add_registerMobile = d.registerMobile
            this.add_bankName = d.bankName
            this.add_bankNo = d.bankNo
          }
        })
      },
      hasGoods(param) {
        if (!param.addressUuid) return
        this.$http.post('/splitorder/chooseaddressNewKuyu', param, res => {
          if (res.stockMap) {
            this.exitsGoods = true
            for (var key in res.stockMap) {
              var _cls = 'stock'
              res.stockMap[key] == '无货' && (this.exitsGoods = false, _cls += ' nostock')
              // $('.stock[data-uid="' + (ispreSales ? param.pIds : key) + '"]').text(res.stockMap[key]).attr('class',
              //   _cls)
            }
          }
        })
      },
      seckillHasGoods(params) {
        if (!params.addressUuid) return
        this.$http.post('/splitorder/findStockNum', params, res => {
          this.exitsGoods = true
          if (res.retData && res.retData.split_error == "error") {
            this.exitsGoods = false
            var data = res.retData.cartManager,
              uid = data &&
              data.detailModelList &&
              data.detailModelList[0] &&
              data.detailModelList[0].productUuid
            $('.stock[data-uid="' + uid + '"]').text('无货').addClass('nostock')
          }
        })
      },
      renderAddress() {
        this.from = (this.$router.query && this.$router.query.from || 'order')
        this.isKill && (this.from = 'seckill')
        this.ispreSales && (this.from = 'presales')
        //取地址
        if (this.data && this.data.addressList && this.data.addressList.length > 0) {
          var addressId = this.$router.query && this.$router.query.addressId
          var selectAdd
          var defaultAdd

          this.data.addressList.filter(function (m) {
            m.uuid == addressId && (selectAdd = m)
            m.isDefault == '1' && (defaultAdd = m)
          })
          this.add = selectAdd || defaultAdd || this.data.addressList[0]
          this.titleContent = this.add.consignee
          //   if (this.add) {
          //     $('#titleContent').val(add.consignee)
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
          //       '</a>')
          //   }
          // } else {
          //   $('.billaddress').append('<a href="/order/changeAddress.html?from=' + from + '">' +
          //     '<div class="my-address-new">' +
          //     '<span class="iky-arrow-right"></span> 新增地址</div></a>')
        }
      },
      renderCart() {
        var md = this.data.integralToNowModel
        if (md) {
          this.proportion = md.proportion //抵现比例  积分数量
          this.proportion2 = md.proportion2 //抵现比例  人民币数量
          this.percentage = md.percentage //抵现百分比
        }

        if (this.data.preSale) {
          this.ispreSales = true
          if (this.data.preSale.firstCost && this.data.preSale.firstCost > 0)
            this.ordertype = 1
        }
        var mg = this.data.cartManager
        if (mg && mg.detailModelList.length > 0) {
          this.goodsList = []
          // $('.goods-list').html('')
          var c = mg.detailModelList
          var cx = mg.storePromotionsList //促销
          var mzgift = mg.productGiftLists //促销满赠的礼品

          // 促销信息
          if (cx && cx.length > 0 && cx[0].promotionTypes) {
            var getProType = function (p) {
              if (!p) return ''
              var _p = ''
              p.indexOf('1') >= 0 && (_p += '满减')
              p.indexOf('4') >= 0 && (_p += '满赠')
              p.indexOf('5') >= 0 && (_p += '打折')
              p.indexOf('6') >= 0 && (_p += '满折')
              p.indexOf('7') >= 0 && (_p += '买减')
              return _p
            }
            // $('#showStores').append('<div class="billgoods"><div class="sales"></div></div>')
            cx.map(function (m) {
              this.sales.push({
                name: m.promotionName,
                value: getProType(m.promotionTypes)
              })
              // $('.sales').append('<p><input type="button" value="' + getProType(m.promotionTypes) + '"> ' + m.promotionName +
              //   '</p>')
            })
          }
          if (mzgift && mzgift.length > 0) {
            mzgift.map(function (m) {
              this.sales.push({
                name: '赠品',
                value: `${m.productName} x 1`
              })
              // $('.sales').append('<p><input type="button" value="赠品"> ' + m.productName + ' X ' + 1 + '</p>')
            })
          }
          var _this = this

          c.filter(function (n, i) {
            _this.items[i] = {
              id: n.productUuid,
              count: n.buyNum
            }
            var good = {}
            good.uid = n.productUuid
            good.name = n.productName
            good.buyNum = n.buyNum
            good.hasGoods = true
            good.attrs = []
            var tip3 = ''
            if (!_this.ispreSales) {
              for (var key in _this.data.stockMap) {
                _this.data.stockMap[key] == '无货' && (_this.exitsGoods = false)
                if (key == n.productUuid) {
                  // tip = _this.data.stockMap[key] == '有货' ? '<span class="stock" data-uid="' + n.productUuid +
                  //   '">有货</span>' : '<span class="nostock stock" data-uid="' + n.productUuid + '">无货</span>'
                  _this.data.stockMap[key] == '有货' ? (good.hasGoods = true) : (good.hasGoods = false)
                  break
                }
              }
            }
            n.productWarning && (_this.exitsGoods = false, good.hasGoods = false)
            // !tip && !n.productWarning && (tip = '<span class="stock" data-uid="' + n.productUuid + '">有货</span>')
            // console.log(tip)
            //商品属性。颜色，是否只能，容量等
            if (n.attrValues && n.attrValues.length > 0) {
              n.attrValues.map(function (x) {
                // attrs += '<p class="attrs">' + x.name + '：' + x.value + '</p>'
                good.attrs.push({
                  name: x.name,
                  value: x.value
                })
              })
            }
            //赠品
            if (n.productGiftLists && n.productGiftLists.length > 0) {
              // if (n.promotionName)
              //     tip3 += '<p><input type="button" value="促销"/>' + n.promotionName + '</p>'
              n.productGiftLists.map(function (s) {
                tip3 += '<p><input type="button" value="赠品"/><a href="/goods/detail.html?uuid=' + s.productUuid +
                  '">' + s.productName + ' X ' + n.buyNum + '</a></p>'
              })
            } else {
              if (n.promotionName && !isKill)
                tip3 += '<p><input type="button" value="促销"/>' + n.promotionName + '</p>'
            }
            //预购
            if (_this.ispreSales && _this.data.cartManager.firstPay && _this.data.cartManager.firstPay > 0) {
              tip = '<p>定金：' + _this.data.cartManager.firstPay + '</p>' + tip
            }
            // console.log(tip)

            //单品活动促销
            var promotiontype = n.pim && n.pim.promotionTypes && n.pim.promotionTypes[0]

            //套装显示
            good.url = n.productImgUrl || n.productImg || (_this.data.productModel && _this.data.productModel.productImage
                .smallImageUrl) ||
              ''
            var tztip = ''
            if (_this.data.suitMap && _this.data.suitMap.length > 0) {
              for (var key in data.suitMap) {
                if (key == n.suitUuid) {
                  tztip += '<span>(套装：' + _this.data.suitMap[key].name + ')</span>'
                  break
                }
              }
              _this.params['suitNum_' + n.suitUuid] = n.buyNum
            }
            good.price = _this.ispreSales ? n.basePrice : (n.buyNum == 0 ? n.basePrice : n.totalPrice / n.buyNum)

            // $('#showStores').append('<div class="billgoods">' +
            //   '<div class="billgoodsimg">' + (isKill ? '<span>秒杀</span>' : '') +
            //   '<img src="' + url + '">' +
            //   '</div>' +
            //   '<div class="billgoodstxt">' +
            //   '<p>' + n.productName + tztip + '</p>' + attrs +
            //   (_this.ispreSales ? '' : ('<p>' + (pe - 0).toFixed(2) + '元 X ' + n.buyNum + '</p>')) + tip +
            //   '</div><div class="gift">' + tip3 + '</div>' +
            //   '</div>')
            //使用优惠券参数
            var p = {
              storeUuid: _this.data.cartManager.storeUuid,
              productUuid: n.uuid,
              productCost: n.totalPrice
            }
            _this.products.push(p)
            if (!_this.ispreSales) {
              var suid = n.suitUuid ? '_' + n.suitUuid : ''
              _this.params['productBasePrice_' + n.attrAndValue + suid] = n.basePrice
              _this.params['productNowPrice_' + n.attrAndValue] = n.nowPrice
              _this.params['productPrice_' + n.attrAndValue + suid] = n.totalPrice
              // params['productGiftIds_' + n.attrAndValue] = ''
            }

            //下单参数 
            // paymoney += n.nowPrice //付款金额
            _this.oldMoney += n.basePrice * n.buyNum //时时价格
            if (!n.suitUuid)
              _this.params['productNum_' + n.attrAndValue] = n.buyNum

            //促销赠送
            if (n.productGiftIds && n.productGiftIds.length > 0) {
              _this.params['productGiftIds_' + n.attrAndValue] = n.productGiftIds.join(',')
            }
            _this.goodsList.push(good)
          })
          // console.log(this.goodsList)
          //满减
          this.paymoney = this.ispreSales ? this.data.orderTotalMoney : mg.totalMoney //付款金额
          this.cartuid = mg.storeUuid
          this.params['affix_' + this.cartuid] = mg.affix || 0
          this.params['shipType_' + this.cartuid] = 1 //res.cartManager.storeUuid
          this.params['cartTotal_' + this.cartuid] = this.paymoney
          this.params['storeReduce_' + this.cartuid] = mg.reduceMoney || 0

          if (mg.storePromotionsList && mg.storePromotionsList['0']) {
            this.params['storePromotion_' + this.cartuid] = mg.storePromotionsList['0'].promotionUuid
          }

          this.buyCount = this.ispreSales ? this.ata.buyNum : (this.isKill ? 1 : this.data.real_total_num)
          this.payCount = this.isKill ? mg.detailModelList[0].totalPrice : (this.ispreSales ? (this.data.preSale
            .firstCost && this.data.preSale.firstCost - 0 > 0 ? this.data.preSale.firstCost : this.data.orderTotalMoney
          ) : mg.totalMoney)
        }

        // $('.paytitle .count').text(pcount)
        // $('.paytitle .price').text((pMoney - 0).toFixed(2))
        // console.log(oldMoney)
        // console.log(oldMoney, pMoney)
        // (this.oldMoney - 0) > (pMoney - 0) && !this.ispreSales && $('.paytitle s').text((this.oldMoney - 0).toFixed(2) +
        //   '元').show()


        //小熊客户
        // var ntalkerparam = {
        //   cartprice: pMoney,
        //   items: items
        // }

        // NTKF_PARAM['ntalkerparam'] = ntalkerparam
      },
      getSecKillProduct() { //秒杀
        this.$http.get('/front/product/fastBuyLimitProduct', {
          skuNo: this.skuNo,
          promotionUuid: this.promotionUuid,
          auth: 1
        }, res => {
          if (res) {
            this.data = res
            this.renderAddress()
            this.renderCart(this.data)
            this.add && this.seckillHasGoods({
              productSku: this.skuNo,
              promotionUuid: this.promotionUuid,
              addressUuid: this.add.uuid
            })
            this.paymoney = res.cartManager.detailModelList[0].totalPrice
            this.cartuid = res.cartManager.storeUuid
            this.params['affix_' + this.cartuid] = res.cartManager.affix || 0
            // params['shipType_' + cartuid] = res.cartManager.storeUuid
            this.params['cartTotal_' + this.cartuid] = res.orderTotalMoney
            this.params['storeReduce_' + this.cartuid] = data.cartManager.reduceMoney || 0
            this.params['hipType_' + this.cartuid] = 1
            this.params.productBuyNum = 1
            this.params.promotionUuid = this.promotionUuid
            this.params.productSku = this.skuNo
          }
        })
      },
      getpresaleProduct() { //预付定金
        this.$http.post('/front/product/presaleProductToOrder', params, r => {
          if (r.code == 0) {
            data = res.retData
            renderAddress()
            renderCart(data)
            add && hasGoods({
              pIds: pIds,
              attrIds: attrIds,
              buyNum: buyNum,
              willType: 2,
              orderType: 'reserve',
              reserveUuid: data.preSale.uuid,
              addressUuid: add.uuid
            })

            paymoney = data.preSale.firstCost && data.preSale.firstCost - 0 > 0 ? data.preSale.firstCost : data.orderTotalMoney //付款金额

            params.productUuid = data.pIds
            params.buyNum = buyNum
            params.productBuyNum = buyNum
            params.jifenPromotionUUID = ''
            params.attrIds = data.attrIds
            params.willType = '2'
            params.pIds = data.pIds
            if (data.preSale) {
              cartuid = data.preSale.storeUuid
              params['affix_' + cartuid] = data.preSale.affix || 0
              params['storeReduce_' + cartuid] = data.preSale.reduceMoney || 0
              params['storePromotion_' + cartuid] = data.preSale.uuid
            }
          }
        })
      },
      getBalance() { // 订单详情
        this.$http.post('/order/toBalanceKuyu', {
          terminalType: '02',
          auth: 1
        }, res => {
          // if (!res.cartManagerList || res.cartManagerList.length == 0) {
          //   //   alert('您的购物车是空的！')
          //   setTimeout(function () {
          //     //   window.location.href = '/cart/cart.html'
          //   }, 1000)
          //   return false
          // }
          // $('.tab').show()
          this.useMaxIntegral = res.useMaxIntegral
          this.olduseMaxIntegral = res.useMaxIntegral
          // $('#jifen').attr('placeholder', useMaxIntegral.toFixed(0))
          this.data = res

          this.renderAddress()
          //购物车
          this.renderCart(this.data)

          this.add && this.hasGoods({
            addressUuid: this.add.uuid
          })
          //优惠券列表
          if (this.data.cartManager && this.data.cartManager.couponList) {
            this.couponList = this.data.cartManager.couponList
            this.couponList.map(function (m) {
              m.select = false
            })
            // this.data.cartManager.couponList.map(function (m) {
            //   $('.coupon-list').append('<p data-denomination="' + m.denomination + '" data-uid="' + m.uuid +
            //     '"><span class="iky-hook"></span><span class="txt">' + m.couponTypeName +
            //     '</span><span class="time">有效期至' + m.endTime + '</span></p>')
            // })
          }
          var jf = res.integralToNowModel && res.integralToNowModel.uuid || ''
          this.params.jifenPromotionUUID = jf
        })
      },
      saveOrder() {
        if (!this.exitsGoods) {
          alert('购物车中有库存不足或者不在该地区销售的商品，请返回购物车修改！')
          return false
        }
        if (!this.add || !this.add.uuid) {
          alert('请选择收货地址！')
          return false
        }
        this.params.integralReduceNum = this.integralReduceNum //使用积分
        this.params.checkArea = this.add.uuid
        this.params.area = this.add.uuid

        this.params.totalMoneyShow = (this.paymoney - this.jfMoney - this.denomination - this.couponMoney).toFixed(2) //res.orderTotalMoney

        this.params.invoiceCate = this.invoiceCate

        this.params.orderFrom = this.$util.iswx() ? 6 : 1 //判断下单来源
        // console.log(params)
        // return
        //返利网的请求数据
        var __fanliCookie = this.$util.getCookie('fanliCookie')
        if (__fanliCookie) {
          __fanliCookie = JSON.parse(__fanliCookie.replace(/'/g, '"'))
          for (var k in __fanliCookie) {
            params[k] = __fanliCookie[k]
          }
        }

        if (this.invoiceCate == "2") {
          this.params.electron_titleContent = this.titleContent
          this.params.electron_invoiceContent = '商品明细'
          //检测个人税发票填写。
          if (this.params.electron_titleContent.length == 0) {
            alert('请填写发票抬头！')
            return false
          }

        } else if (this.invoiceCate == "3") {
          //检测增值税发票填写。
          var input = this.$el.querySelectorAll('#VAT .ordinaryinput')
          for (var k in input) {
            if (!input[k].value && k < input.length) {
              alert(input[k].placeholder)
              return false
            }
          }

          this.params.add_uuid = invoiceUuid
          this.params.add_companyName = add_companyName
          this.params.add_code = add_code
          this.params.add_address = add_address
          this.params.add_registerMobile = add_registerMobile
          this.params.add_bankName = add_bankName
          this.params.add_bankNo = add_bankNo
        }
        // console.log(params)
        // return
        this.params['terminalType'] = '02'
        if (this.isKill) {
          this.$http.post('/cart/saveLimitOrder', this.params, res => {
            if (res.code == '0') {
              //isGroup 1是组合，2是单品
              this.$util.delCookie('seckilldata')
              this.$router.replace({
                path: '/order/pay',
                query: {
                  orderId: res.payOrderId,
                  type: res.isGroup
                }
              })
              // window.location.href = '/order/orderpay.html?orderid=' + res.data.payOrderId + '&type=' + res.data.isGroup
            } else if (res.code == '10' || res.code == 'no_stock') {
              alert('库存不足，或者商品不在送货地址区域销售！')
            } else if (res.code == 'only_one') {
              alert('用同一个会员只能购买一件')
            } else if (res.code == '11') {
              alert('促销库存不足！')
            } else {
              alert('订单提交失败，请重试！')
            }
          })
          return
        } else if (this.ispreSales) { //预付定金
          // productUuid	9500ccd7bce7483585c53f3db92bf8ab
          // checkArea	dacce5ef66d84d2a9127331a4dadb2e3
          // area	dacce5ef66d84d2a9127331a4dadb2e3
          // buyNum	1
          // productBuyNum	1
          // invoiceCate	2
          // jifenPromotionUUID	
          // integralReduceNum	0
          // totalMoneyShow	1499
          // attrIds	TP001050103020100003
          // willType	2
          // pIds	9500ccd7bce7483585c53f3db92bf8ab
          // affix_03d03b6b05604c5cb065aef65b72972e	0
          // storeReduce_03d03b6b05604c5cb065aef65b72972e	0
          // storePromotion_03d03b6b05604c5cb065aef65b72972e	8158f274c12a44018b420b2fa8633ad0
          // electron_titleContent	你好哈哈
          // electron_invoiceContent	商品明细

          this.$http.get('/front/product/presaleSaveOrder', this.params, res => {
            if (res.code == '0') {
              this.$util.delCookie('presalesdata')
              // window.location.href = '/order/orderpay.html?orderid=' + res.retData.payOrderId + '&ordertype=' +
              // ordertype + '&type=' + res.retData.orderType
              this.$router.replace({
                path: '/order/pay',
                query: {
                  orderId: res.payOrderId,
                  ordertype: this.ordertype,
                  type: res.isGroup
                }
              })
            } else if (res.code == '10' || res.code == 'no_stock') {
              alert('库存不足，或者商品不在送货地址区域销售！')
            } else if (res.code == '11') {
              alert('促销库存不足！')
            } else {
              alert('订单提交失败，请重试！')
            }
          })
          return
        } else {
          // console.log(params)
          // return

          this.$http.get('/cart/saveOrderKuyu', this.params, res => {
            if (res.code == '0') {
              this.$router.replace({
                path: '/order/pay',
                query: {
                  orderId: res.payOrderId,
                  type: res.isGroup
                }
              })
              // window.location.href = '/order/orderpay.html?orderid=' + res.payOrderId + '&type=' + res.isGroup
            } else if (res.code == '10' || res.code == 'no_stock') {
              alert('库存不足，或者商品不在送货地址区域销售！')
            } else if (res.code == '11') {
              alert('促销库存不足！')
            } else {
              alert('订单提交失败，请重试！')
            }
          })
          return
        }
      }
    }
  }

</script>
