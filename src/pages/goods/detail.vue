<template>
  <main class="goods-detail" v-if="returnCode==0">
    <div class="goods-title">
      <h2 class="goods-name">{{title}}</h2>
      <div class="sub">
        <span class="iky-weibo-line"></span>
        <span>详情</span>
         <!--this.commentLink = '/goods/comment.html?' + (psale || this.isPreSales ? 'type=presale' : '') + 'uuid=' +              this.uuid + '&attrId=' + this.skuNo-->
        <router-link id="comment" :to="{path:'/goods/comment',query:{uuid:this.uuid,attrId:this.skuNo}}" v-show="commentNum>0"><span id="commentNum">{{commentNum}}</span><span class="iky-msg1"></span></router-link>
      </div>
    </div>
    <div class="slider">
      <v-Slider :pages="sliders" :sliderinit="sliderinit">
        <!-- slot  -->
      </v-Slider>
    </div>
    <div class="info-title" v-html="info"></div>
    <p class="t-price" v-html="price"></p>
    <!--预付定金-->
    <div class="presales">
    </div>
    <!--预购-->
    <div class="reservation">
    </div>
    <!--秒杀-->
    <div class="seckill-time">
      <p class="tip"> 秒杀时间：<span id="startTime">&nbsp;</span> 至<span id="endTime">&nbsp;</span></p>
      <p class="endtime">剩余时间：<span></span></p>
    </div>
    <div class="points">
      <input type="button" value="积分"> 赠送
      <span class="get-pints">{{points}}</span>积分
    </div>
    <!--促销-->
    <div class="sales">
    </div>
    <!--赠品-->
    <div class="gift">
      <input type="button" value="单赠品">
      <div class="giftlist">
      </div>
    </div>
    <div class="coupons">
      <input type="button" value="优惠券">
      <div class="couponlist">
        <a @click="getCoupon(m.uuid)" v-for="m in couponList" :data-jf="m.convertIntegral">{{m.couponTypeName}}</a>
      </div>
    </div>
    <div class="base-types">
      <h2 class="t-title">{{goodsTypeName}}</h2>
      <router-link v-for="m in goodsTypeList" :to="{path:'/goods/detail',query:{id:m.uuid}}">{{m.displayName}}</router-link>
    </div>
    <p class="t-count">数量</p>
    <div class="count-box">
      <span class="reduce">-</span>
      <span class="num">{{buyCount}}</span>
      <span class="plus">+</span>
    </div>
    <div class="suite">
      <div class="item" v-for="m in suiteList">
        <p>{{m.name}}</p>
        <div class="res">
          <ul class="item">
            <li v-for="n in m.suitProductRellist">
              <router-link :to="{path:'/goods/detail',query:{uuid:n.productUuid}}">
                <img :src="n.productSkuListModel.smallImg">
                <p>{{n.productSkuListModel.productName}}</p>
                <p>{{n.productSkuListModel.price}}元</p>
              </router-link>
            </li>
            <li class="plus"><span class="iky-plus"></span></li>
          </ul>
          <div class="price">套装价格：<span>￥{{m.totalAmount}}</span></div>
          <div class="num">库存：<span>{{m.stock}}</span></div>
          <input class="suiteBtn" :data-stock="m.stock" type="button" value="立即购买" :data-puid="productUuid" :data-suid="m.uuid" :data-skuno="skuNo">
        </div>
      </div>
    </div>
    <div class="sendto">
      <p class="t-to">配送到：</p>
      <p class="t-address">
        <span class="all">{{localaddress}}</span>
        <span class="iky-arrow-down"></span>
      </p>
      <p class="t-has">{{hasProductTip}}</p>
    </div>
    <div class="t-more">
      <div class="tab">
        <span class="active" id="description">详情介绍</span>
        <span id="specification">规格参数</span>
        <span id="policy-service">服务政策</span>
        <span id="common-problem">常见问题</span>
      </div>
      <!--详情介绍-->
      <div class="description sub" v-html="desc" v-show="showDesc">
      </div>
      <!--规格参数-->
      <div class="specification sub">
      </div>
      <!--服务政策-->
      <div class="policy-service sub" v-show="showServer">
      </div>
      <!--常见问题-->
      <div class="common-problem sub" v-show="showProblem">
      </div>
    </div>
    <div class="btnbuy-box">
      <input type="button" value="立即购买" class="btnbuy">
    </div>
  </main>
  <main class="goods-detail" v-else="returnCode==1">
    <div class="empty">
      <p>您好，您所查看的商品正在准备中，敬请期待！</p>
      <p>您可以:</p>
      <p>1、您可以继续浏览其他商品</p>
      <p>2、为您推荐更多感兴趣的商品，去<a href="/">首页</a>看看（将在<span class="time">{{t}}</span>秒后自动跳转）</p>
    </div>
  </main>
</template>
<script>
  // import slider from '../../components/slider.vue'

  export default {
    data() {
      return {
        commentNum: 0,
        couponList: [],
        suiteList: [],
        goodsTypeList: [],
        goodsTypeName: null,
        showDesc: true,
        showServer: false,
        showProblem: false,
        t: 5,
        _location: null,
        region: null,
        areaUuid: null,
        cityId: null,
        provinceId: null,
        localaddress: null,
        uuid: null,
        title: null,
        price: null,
        points: null,
        desc: null,
        info: null,
        sliders: [],
        returnCode: 0,
        sliderinit: {
          currentPage: 1,
          // start: {},
          // end: {},
          // tracking: false,
          thresholdTime: 500, //滑动时间阈值判定距离
          thresholdDistance: 100, //滑动距离阈值
          // direction:'vertical',//垂直滚动
          // loop:true,//无限循环
          // autoplay:1000,//自动播放:时间[ms]
        },
        skuNo: null,
        isKill: false, //是否秒杀
        isPreSales: false, //是否预付定金,
        isReservation: false, //是否是预约商品
        reserveOrderId: null, //预约的ID，存在就是预约过了然否
        parentSkuNo: null,
        wartforbuy: false,
        buyCount: 1, //$('.count-box .num').text(),
        productUuid: null,
        reservation: null, //预约状态 activeStatus,
        hasProductParams: {},
        promotionUuid: null, //秒杀商品的uuid
        hasProductTip: null,
        storeUuid: null,
 
      }
    },
    created() {
      this.uuid = this.$route.query.id
      this._location = this.$util.getCookie('location') != null ? JSON.parse(this.$util.getCookie('location')) : {
        region: 1385,
        areaUuid: 15845,
        cityId: 154,
        provinceId: '05',
        address: '广东省 深圳市 南山区 西丽街道'
      }
      this.region = this._location.region || 1385
      this.areaUuid = this._location.areaUuid || 15845
      this.cityId = this._location.cityId || 154
      this.provinceId = this._location.provinceId || '05'
      this.localaddress = this._location.address || '广东省 深圳市 南山区 西丽街道'
      this.detai()
    },
    // components: {
    //   slider,
    // },
    methods: {
      setGoodsInfo(res) {
        var pro = res.productModel.productMain;
        // secondParentCategoryName = res.secondParentCategoryName;
        //名字
        this.title = pro.productName;
        //赠送积分
        this.points = (parseInt(res.front.priceAndPromotion.price));
        //轮播图
        var sliders = this.sliders

        sliders.push({
          style: 'background-image:url("' + res.front.bigPicture + '")'
        })
        res.productModel.productMultiImage.map(function (m) {
          sliders.push({
            style: 'background-image:url("' + m.basicImageUrl + '")'
          })
        })

        //详情
        this.desc = res.productModel.productDescription.description;

        // $('.btnbuy-box').show();
        //赠品//和打折
        if (res.front && res.front.priceAndPromotion) {
          var cx = res.front.priceAndPromotion;
          var gift = cx.promotionInteactiveModel && cx.promotionInteactiveModel.productGiftList || '';
          //   if (cx.name && !this.isKill)
          //     $('.sales').append('<p><input type="button" value="促销"> ' + cx.name + '</p>');

          //   if (gift && gift.length > 0) {
          //     $('.gift').show();
          //     gift.map(function (m) {
          //       $('.giftlist').append('<a href="/goods/detail.html?uuid=' + m.productUuid + '">' + m.productName +
          //         '</a>')
          //     });
          //   };
        };
      },
      detai() {
        this.$http.get('/front/product/toProductKuyu', {
          uuid: this.uuid,
          terminalType: '02'
        }, res => {
          this.returnCode = res.returnCode == null ? 0 : 1;

          if (this.returnCode == 1) {
            t = 5;
            setInterval(function () {
              t == 0 && (window.location.href = '/');
              $('.time').text(t);
              t--;
            }, 1000);
            return false;
          };
          //首先判断是否是秒杀商品
          this.promotionUuid = res.promotionUuid
          this.skuNo = res.skuNo;
          //秒杀
          if (this.promotionUuid && this.skuNo) {
            this.isKill = true;
            $('.count-box, .t-count').hide();
            //  setCommentLink();
            this.getSecKillDetai();
            return false;
          };

          //预付定金
          var titleTip = '';
          var psale = res.preSale
          if (psale) {
            this.isPreSales = true;
            var ps = $('.presales');
            if (psale.firstCost - 0 > 0) {
              ps.append('<p>定金：<span>￥' + (psale.firstCost - 0).toFixed(2) + '元</span></p>');
              (psale.promotionCost - 0) > 0 && ps.append('<p>预付首款优惠金额：<span>￥' + (psale.promotionCost - 0).toFixed(
                2) + '元</span></p>');
              ps.append('<p>付定金剩余：<span>' + psale.endTime + '</span></p>');
              psale.firstCost - 0 > 0 && psale.endPayEndTime && ps.append('<p>尾款截至时间：<span>' + psale.endPayEndTime +
                '</span></p>');
              psale.sendGoodsTime - 0 > 0 && ps.append('<p>发货时间：<span>付尾款后' + psale.sendGoodsTime + '天内</span></p>');
            };
            $('.btnbuy').val(psale.type == 1 ? '立即预定' : '立即付定金');
            titleTip = '<span>预定商品</span>';
            this.hasProductParams['reservePromotionUuid'] = psale.uuid;
          };
          //预约
          this.reservation = res.activeStatus;
          this.reserveOrderId = res.reserveOrderId;
          if (this.reservation) {
            var rt = {
              'status1': {
                txt: '等待预约',
                s: true
              },
              'status2': {
                txt: '立即预约',
                s: false
              },
              'status3': {
                txt: '等待抢购',
                s: true
              },
              'status4': {
                txt: '立即抢购',
                s: false
              },
              'status5': {
                txt: '等待抢购',
                s: true
              }
            };
            this.isReservation = true;
            titleTip = '<span>预约商品</span>';
            wartforbuy = rt[reservation].s;
            $('.btnbuy').val(rt[reservation].txt)
              .prop('disabled', rt[reservation].s);

            var t1, t2, t3, f4;
            switch (reservation) {
              case 'status1':
                t1 = '预约开始剩余时间：';
                t2 = '活动进行中...';
                t3 = '立即预约';
                f4 = false;
                break;
              case 'status2':
                t1 = '预约剩余时间：';
                t2 = '预约活动已经结束';
                t3 = '活动结束';
                f4 = true;
                break;
              case 'status3':
              case 'status5':
                t1 = '抢购活动开始剩余时间：';
                t2 = '抢购活动进行中...';
                t3 = '立即抢购';
                f4 = false;
                break;
              case 'status4':
                t1 = '抢购活动剩余时间：';
                t2 = '抢购活动已经结束';
                t3 = '活动结束';
                f4 = true;
                break;
            };

            // if (reservation == 'status3' || reservation == 'status5') {
            $('.reservation').append('<p>' + t1 + '<span id="endTime"></span></p>');
            tEle = $('#endTime');
            time = res.day * 24 * 3600 + res.hour * 3600 + res.minute * 60 + res.second;
            skillTile.callback = function () {
              tEle.text(t2);
              $('.btnbuy').val(t3).prop('disabled', f4);
            };
            killFun = setInterval(skillTile.start, 1000);
            //  }; 
            $('.reservation').append('<p>发货时间：付款后<span>7</span>天内</p>');
          };


          if (res.productModel != null) {
            this.skuNo = res.productModel.productSku[0].skuNo;
            this.parentSkuNo = res.productModel.productSku[0].parentSkuNo
            this.productUuid = res.productSku.productUuid;
            var t = res.productSkuPrice > res.productBasePrice ? '<s>' + (res.productBasePrice - 0).toFixed(2) +
              '元</s>' : '';

            this.price = ((res.productSkuPrice - 0).toFixed(2) + '元' + t);
            this.info = (titleTip + res.productModel.productMain.adviceNote);

            this.setGoodsInfo(res);

            this.hasProductParams['region'] = this.region;
            this.hasProductParams['areaUuid'] = this.areaUuid;
            this.hasProductParams['skuNo'] = this.skuNo;
            this.hasProductParams['parentSkuNo'] = this.parentSkuNo;
            this.hasProductParams['buyNum'] = this.buyCount;
            this.hasProductParams['time'] = Math.random();

            //判断是否有货
            this.hasProduct();
            //加载用户评论数量
            // if (!psale && !isKill && !isPreSales) {
           
            this.getComentsCount();
            //  };

            //商品颜色,和类别
            this.getGoodsTypes();

            this.storeUuid = res.productSku.storeUuid

            //取促销信息
            //promotionTypes 1满减  4满赠 6满折 
            this.getStorePromotion();

            //加载优惠券
            this.getCouponList();
            //加载套装信息

            this.getSuite();
          }
        })
      },
      getServicePolicies() {

      },
      getSecKillDetai() {
        this.$http.post('/front/product/toLimitProductKuyu', {
          promotionUuid: this.promotionUuid,
          skuNo: this.skuNo
        }, res => {
          if (res.productModel != null) {
            var sT = res.promotionLimitBuy;
            $('#startTime').text(sT.beginTime);
            $('#endTime').text(sT.endTime + sT.description || '');
            time = res.remindSeconds;
            var t = '';
            t = res.front.priceAndPromotion.stock == 0 ? '售馨' : '立即秒杀';
            $('.btnbuy').val(t)
            if (time <= 0) {
              if (res.activeStatus == 'status2') {
                tEle.text('活动还没开始！');
              } else {
                tEle.text('活动已结束');
              };
            } else {
              killFun = setInterval(skillTile.start, 1000);
            };
            $('.seckill-time').show();
            $('.t-price').html('秒杀价：' + (res.front.priceAndPromotion.price - 0).toFixed(2) + '元<span><s>原价' +
              (res.productSkuPrice - 0).toFixed(2) + '元</s> 仅剩' + res.front.priceAndPromotion.stock +
              '件</span>');

          } else {
            alert('获取商品详情失败，请稍后再试...');
          };
          $('.seckill-time').show();
          //简介
          $('.info-title').html('<span>秒杀商品</span>' + res.productModel.productMain.adviceNote);
          this.setProinfo(res);
          this.hasSecKillProduct();
        });
      },
      hasSecKillProduct() {
        var params = {
          region: this.region,
          areaUuid: this.areaUuid,
          provinceId: this.provinceId,
          cityId: this.cityId,
          skuNo: this.skuNo,
          bType: '',
          parentSkuNo: this.parentSkuNo,
          buyNum: this.buyCount,
          promotionUuid: this.promotionUuid,
          time: Math.random()
        }
        this.$http.post('/front/product/hasLimitProduct', params, res => {
          if (res.retData && res.retData.canBuy && res.retData.hasProduct) {
            this.hasProductTip = '有货'
            // $('.btnbuy,.suiteBtn').prop('disabled', false);
          } else {
            this.hasProductTip = '没有足够的库存或不在该地区销售'
            // $('.t-has').text('没有足够的库存或不在该地区销售');
            // $('.btnbuy,.suiteBtn').prop('disabled', true);
          };
        });
      },
      getCouponList(params) {
        this.$http.get('/front/product/getProductDetailExtraInfo/getCouponList', {
          storeUuid: this.storeUuid,
          productUuid: this.productUuid,
          regionId: this.region,
          terminalType: '02'
        }, r => {
          //   if (r.code == '0' && r.data && r.data.length > 0) {
          this.couponList = r.data;
          //   };
        });
      },
      getCoupon(uuid) {
        this.$http.get('/cart/downLoadCoupon', {
          couponTypeUuid: uuid
        }, res => {
          if (res.code == '0')
            alert('领取成功！');
          else if (res.code == '-3')
            alert('已超过限领数量！');
          else
            alert('已经领过或者会员积分不够');
        });
      },
      getSuite() {
        this.$http.post('/front/product/getSuitMainByRegion', {
          productUuid: '20672c74183745ce95430560e1a9d547', //this.productUuid,
          regionId: this.region,
          terminalType: '02'
        }, r => {
          //   if (r.code == '1' && r.retData && r.retData.length > 0) {
          this.suiteList = r.retData;
          //   };
        });
      },
      getGoodsTypes() {
        this.$http.get('/front/product/babyset', {
          productUuid: this.productUuid
        }, res => {
          this.goodsTypeName = res.displayName;
          this.goodsTypeList = res.resultlist;
        })
      },
      getStorePromotion() {
        this.$http.get('/front/product/getStorePromotion', {
          storeUuid: this.storeUuid,
          productUuid: this.productUuid
        }, function (res) {
          if (res.code == '0' && res.retData.length > 0) {
            res.retData.map(function (m) {
              $('.sales').append('<p><input type="button" value="' + getProType(m.promotionTypes) +
                '"> ' + m.promotionName + '</p>')
            });
          };
        });
      },
      getComentsCount() {
        this.$http.get('/front/product/getAppraiseCount', {
          productUuid: this.productUuid
        }, res => {
          //   if (res.code == '0') {
        //   res.data - 0 > 0 && ($('#commentNum').text(res.data), $('.goods-title .sub').show())
          //   };
          commentNum = res.data
        });
      },
      hasProduct() {
        this.$http.post('/front/product/hasProduct', this.hasProductParams, res => {
          if (res.retData && res.retData.canBuy && res.retData.hasProduct) {
            this.hasProductTip = '有货';
            // !wartforbuy && $('.btnbuy,.suiteBtn').prop('disabled', false);
          } else {
            if (this.buyCount > 1) {
              alert('库存不足,最多可购买' + res.retData.totalNum);
              this.buyCount = res.retData.totalNum;
              //   $('.count-box .num').text(res.retData.totalNum);

              this.hasProductTip = '有货';
              //   $('.btnbuy,.suiteBtn').prop('disabled', false);
            } else {
              this.hasProductTip = '没有足够的库存或不在该地区销售';
              //   $('.btnbuy,.suiteBtn').prop('disabled', true);
            }
          };
        });
      }
    }
  }

</script>
