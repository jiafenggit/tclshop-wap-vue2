<template>
  <main class="goods-comment">
    <div class="type-title">
      <ul>
        <li class="active">全部({{count}})</li>
        <!--<li></li>-->
        <!--<li></li>-->
        <!--<li></li>-->
      </ul>
    </div>
    <div class="main">
      <div class="left">
        <span class="point" v-text="point"></span>
        <p class="num"><span v-text="totalNum"></span>人评价</p>
        <p class="starts" v-html="countS"></p>
      </div>
      <div class="right">
        <ul>
          <li v-for="s in starts">{{s.i}}星<span class="bar"><s :style="`width:${s.w}%`"></s></span><span class="txt" v-text="s.c"></span></li>
        </ul>
      </div>
      <div class="list" v-scroll="loadMore">
        <div class="item" v-for="m in lists">
          <div class="info"><img :src="m.customerImageUrl||face" alt="" class="face">
            <p>{{m.firstShopComment.customerName}} <span class="v">{{m.firstShopComment.version}}</span></p>
            <p v-html="getCustomerS(m.firstShopCommentScores)">
              <s></s>
              <s></s>
              <s></s>
              <s></s>
              <s></s><span class="time" v-text="$util.formatDate(m.firstShopComment.createTime)"></span></p>
          </div>
          <div class="con" v-text="m.firstShopComment.comments"></div>
          <div class="imgs" v-if="m.firstShowImgs.length>0">
            <img :src="img.imgUrl" alt="" v-for="img in m.firstShowImgs">
            <p class="imgcount"><span>共{{m.firstShowImgs.length}}张</span></p>
          </div>
          <div class="reply" v-if="m.firstReplyComment">官方回复：<span>{{m.firstReplyComment.replyContent}}</span></div>
          <div class="after-comm" v-if="m.afterShopComment">用户追评：<span>{{m.afterShopComment.comments}}</span></div>
          <div class="imgs" v-if="m.afterShowImgs&&m.afterShowImgs.length>0">
            <img :src="img.imgUrl" alt="" v-for="img in m.afterShowImgs">
            <p class="imgcount"><span>共{{m.afterShowImgs.length}}张</span></p>
          </div>
          <div class="reply" v-if="m.afterReplyComment">官方回复：<span>{{m.afterReplyComment.replyContent}}</span></div>
        </div>
      </div>
      <div class="btnbox">
        <input type="button" id="addCartBtn" :value="btnTxt" @click="addCart">
      </div>
    </div>
  </main>
</template>
<script>
  export default {
    data() {
      return {
        face: require('../../res/img/default.png'),
        btnTxt: '',
        uuid: '',
        countS: '',
        point: 0,
        count: 0,
        totalNum: 0,
        attrId: '',
        type: '',
        params: {},
        canbuy: false,
        pageShow: 8,
        nowPage: 1,
        pageCount: 0,
        loadEnd: false,
        starts: [],
        loadTxt: '',
        lists: [],

      }
    },
    watch: {
      nowPage(val) {
        this.getData()
      }
    },
    directives: {
      scroll: {
        bind: function (el, binding) {
          var _this = this;
          window.addEventListener('scroll', () => {
            if (document.body.scrollTop + window.innerHeight >= el.clientHeight + 100) {
              binding.value();
            }
          })
        }
      }
    },
    created() {
      this.uuid = this.$route.query.uuid
      this.attrId = this.$route.query.attrId
      this.type = this.$route.query.type
      this.getProductCommentCounts()
      this.getData()
    },
    methods: {
      loadMore() {
        if (this.nowPage == this.pageCount) {
          this.loadTxt = '后面没有了...'
        } else {
          this.loadTxt = '上拉加载更多...'
        }
        if (this.loadEnd && this.nowPage < this.pageCount) {
          this.nowPage++
        }
      },
      getProductCommentCounts() {
        this.$http.get('/front/product/getProductCommentCounts', {
          productUuid: this.uuid
        }, r => {
          if (r.code == '0') {
            var st = ['oneStartCount', 'twoStartCount', 'threeStartCount', 'fourStartCount', 'fiveStartCount'];
            // var obj = $('.right ul');
            var count = 0;
            st.map(function (m) {
              count += r.data[m];
            })
            for (var k = 5; k > 0; k--) {
              // console.log(k);
              var i = r.data[st[k - 1]];
              var p = i / count * 100;
              this.starts.push({
                i: k,
                w: p,
                c: i
              })
              // obj.append('<li>' + k + '星<span class="bar"><s style="width:' + p +
              //   '%"></s></span><span class="txt">' + i + '</span></li>')
            }
          }
        })
      },
      getCustomerS(data) {
        var num = data.filter(function (n) {
          return n.appType == 1;
        })[0].appScore;
        return this.getstar(num)
      },
      getstar(i, h) {
        var i = i || 5;
        i = i > 5 ? 5 : i;
        var s = '';
        for (var k = 1; k <= i; k++) {
          s += '<s></s>';
        };
        if (h && i < 5) {
          var u = parseInt(i)
          if (Math.round(i) > u && Math.floor(i) == u) {
            s += '<s class="h"></s>';
          };
          for (var k = 1; k <= 5 - Math.round(i); k++) {
            s += '<s class="e"></s>';
          };
        };
        return s;
      },
      getData() {
        if (!this.uuid && !this.attrId) {
          alert('参数丢失，请返回重试！');
        };
        this.loadEnd = false;

        this.params = {
          productUuid: this.uuid,
          nowPage: this.nowPage,
          pageShow: this.pageShow,
          ranNum: Math.random()
        };

        this.$http.post('/front/product/showProductComments', this.params, r => {
          if (r.wm && r.wm.totalNum && r.wm.totalNum > 0) {
            this.canbuy = true;
            this.point = r.averagescore.toFixed(1)
            this.totalNum = r.wm.totalNum
            this.count = r.wm.totalNum
            this.pageCount = Math.ceil(r.wm.totalNum / this.pageShow);

            this.countS = this.getstar(r.averagescore, 1)
            this.lists = this.lists.concat(r.commentList)
            this.loadEnd = true;
            this.btnTxt = this.type ? '返回商品详情' : '加入购物车';
          } else {
            this.canbuy = false;
            this.btnTxt = '返回商品详情'
          }
        })
      },
      addCart() {
        if (!this.canbuy || this.type) {
          this.$router.push({
            path: '/goods/detail',
            query: {
              uuid: this.uuid
            }
          })
          // window.location.href = '/goods/detail.html?uuid=' + uuid;
          return;
        };
        var params = {
          productUuid: this.uuid,
          buyNum: 1,
          attrId: this.attrId,
          auth: 1
        };
        this.$http.post('/front/product/addProductToCart', params, r => {
          if (r.code == 0) {
            this.$router.push({
              path: '/cart',
            })
          } else {
            alert('加入购物车失败，请稍后重试！')
          }
        });
      }
    }
  }

</script>
