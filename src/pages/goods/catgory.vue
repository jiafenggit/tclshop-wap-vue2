<template>
  <main class="catgory">
    <div class="slider">
      <v-Slider :pages="sliders" :sliderinit="sliderinit">
        <!-- slot  -->
      </v-Slider>
    </div>
    <div class="item-list">
      <div class="filter-btns">
        <a class="btn-filter" @click="choose(1)"><span class="iky-menu"></span>筛选</a>
        <a class="btn-sort" @click="choose(2)">排序<span class="iky-triangle"></span></a>
      </div>
      <div class="filter" v-show="bykey">
        <div class="btns">
          <input type="button" id="reset" value="重新选择" @click="reset(types)" />
          <input type="button" id="ok" value="完成" @click="ok(types)" />
        </div>
        <ul class="filter-type">
          <li v-for="item in types" :class="item.select?'select active':'select'">
            <p @click="item.select=!item.select">根据{{item.txt}}选择<span class="typekey">{{item.selectTxt}}</span><span class="iky-arrow-right"></span></p>
            <ul v-show="render">
              <li @click="cheSub(item,i)" v-for="(v,i) in item.value" :class="item.actives[i]==1?'active':''">{{v}}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="sort" v-show="bysort">
        <ul>
          <li @click="showBySort(s)" :data-sortBy="s.key" :data-sortType="s.value" v-for="s in sorts">{{s.txt}}</li>
        </ul>
      </div>
      <div class="list" v-scroll="loadMore">
        <div class="item" v-for="item in lists">
          <router-link :to="{path:'/goods/detail',query:{id:item.uuid}}">
            <div class="img"><img :src="item.pic" alt="" /></div>
            <div class="txt">{{item.name}}</div>
            <div class="price" :v-if="this.promotionPrice > 0">{{item.promotionPrice}} 元</div>
          </router-link>
          <div class="btns"><a :class="item.cls" @click="setFavorite(item)"><span class="iky-fav"></span><span class="txt">{{item.favTxt}}</span></a></div>
        </div>
        <p class="empty" v-show="count==0">没有找到您要搜寻的产品...</p>
      </div>
      <div class="loading-tip" v-show="lists.length>0">{{loadTxt}}</div>
    </div>
  </main>
</template>
<script>
  // import slider from '../../components/slider.vue'
  // import listview from '../../components/listView.vue'
  export default {
    data() {
      return {
        render: true,
        count: -1,
        loadEnd: true,
        loadTxt: '上拉加载更多...',
        bysort: false,
        bykey: false,
        keyword1: '',
        lists: [],
        favdata: [],
        banner: [],
        pageShow: 8,
        nowPage: 1,
        totalNum: 100,
        pageCount: 0,
        sortBy: 'sortWeight',
        sortType: 1,
        sliders: [],
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
        cText: {
          tv: [{
            txt: '尺寸',
            value: ['32英寸', '40-43英寸', '48-50英寸', '50-56英寸', '60英寸以上'],
            actives: [0, 0, 0, 0, 0],
            key: ['尺寸-32英寸', '尺寸-40英寸,尺寸-42英寸,尺寸-43英寸', '尺寸-48英寸,尺寸-49英寸,尺寸-50英寸', '尺寸-55英寸,尺寸-58英寸',
              '尺寸-65英寸,尺寸-75英寸,尺寸-78英寸,尺寸-85英寸,尺寸-100英寸'
            ],
            select: false,
            selectTxt: ''
          }, {
            txt: '特色',
            value: ['曲面屏', '高色域', '4K超高清', '安卓智能', '互联网', '蓝光'],
            actives: [0, 0, 0, 0, 0, 0],
            key: ['屏幕类型-曲面电视', '高色域', '分辨率-3840*2160（4K分辨率/UHD）', '电视类型-智能电视,操作系统-Android', '电视类型-互联网电视', '3301B'],
            select: false,
            selectTxt: ''
          }],
          mobile: [{
            txt: '屏幕尺寸',
            value: ['3.6寸以下', '3.6~4.5英寸', '4.6~5.5英寸', '5.5以上'],
            actives: [0, 0, 0, 0],
            key: ['屏幕尺寸-手机-2.4英寸', '屏幕尺寸-手机-4.5英寸', '屏幕尺寸-手机-5.15英寸,屏幕尺寸-手机-5英寸,屏幕尺寸-手机-5.5英寸',
              '屏幕尺寸-手机-5.6英寸,屏幕尺寸-手机-5.7英寸,屏幕尺寸-手机-5.8英寸,屏幕尺寸-手机-6英寸'
            ],
            select: false,
            selectTxt: ''
          }, {
            txt: '系列',
            value: ['么么哒系列', 'idol系列', 'POP系列', '老人机系列', '平板系列', '手机配件'],
            actives: [0, 0, 0, 0, 0, 0],
            key: ['么么哒系列', '系列-idol系列', '系列-POP系列', '系列-老人机系列', '平板系列', '手机配件'],
            select: false,
            selectTxt: ''
          }],
          toIceWash: [{ //洗衣机
            txt: '体积容量',
            value: ['5kg以下', '5-6kg', '6-7kg', '7-8kg'],
            actives: [0, 0, 0, 0],
            key: ['洗涤容量（公斤）-5公斤', '洗涤容量（公斤）-5.5公斤,洗涤容量（公斤）-6公斤', '洗涤容量（公斤）-6公斤,洗涤容量（公斤）-7公斤',
              '洗涤容量（公斤）-8公斤,洗涤容量（公斤）-7.5公斤'
            ],
            select: false,
            selectTxt: ''
          }, {
            txt: '类别',
            value: ['波轮变频', '波轮全自动', '滚筒变频', '滚筒定频'],
            actives: [0, 0, 0, 0],
            key: ['波轮变频', '波轮全自动', '滚筒变频', '滚筒定频'],
            select: false,
            selectTxt: ''
          }],
          toIcebox: [{ //冰箱
            txt: '体积容量',
            value: ['100L以下', '101L-200L', '201L-300L', '301L-500L', '500L以上'],
            actives: [0, 0, 0, 0, 0],
            key: ['总有效容积（L）-91.00', '总有效容积（L）-118.00,总有效容积（L）-171.00,总有效容积（L）-182.00',
              '总有效容积（L）-203.00,总有效容积（L）-205.00,总有效容积（L）-206.00,总有效容积（L）-220.00,总有效容积（L）-288.00',
              '总有效容积（L）-305.00,总有效容积（L）-416.00,总有效容积（L）-456.00',
              '总有效容积（L）-515.00,总有效容积（L）-516.00,总有效容积（L）-518.00'
            ],
            select: false,
            selectTxt: ''
          }, {
            txt: '类别',
            value: ['单门式', '双门式', '三门式', '多门式', '对开门式'],
            actives: [0, 0, 0, 0, 0],
            key: ['单门式', '双门式', '三门式', '多门式', '对开门式'],
            select: false,
            selectTxt: ''
          }],
          air: [{
            txt: '匹数',
            value: ['1匹', '1.5匹', '2匹', '3匹'],
            actives: [0, 0, 0, 0],
            key: ['匹数-1P', '匹数-大1.5P', '匹数-2P', '匹数-3P'],
            select: false,
            selectTxt: ''
          }, {
            txt: '特点',
            value: ['壁挂式', '立柜式', '圆柱式', '移动式', '五氟变频', '高效定频'],
            actives: [0, 0, 0, 0, 0, 0],
            key: ['空调特点-壁挂式', '空调特点-立柜式', '空调特点-圆柱式', '空调特点-移动式', '定频/变频-变频', '定频/变频-定频'],
            select: false,
            selectTxt: ''
          }],
          toHealthEleKuyu: [{
            txt: '类别',
            value: ['空气净化器', '净水机', '吸尘器', '除螨仪', '原汁机', '电饭煲', '电磁炉', '电水壶', '电压力锅', '加湿器'],
            actives: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            key: ['空气净化器', '净水机', '吸尘器', '除螨仪', '原汁机', '电饭煲', '电磁炉', '电水壶', '电压力锅', '加湿器'],
            select: false,
            selectTxt: ''
          }],
        },
        cuuids: {
          tv: '456a4e26d34540eab1b31c7212a5fd98',
          mobile: '9dcd3d03e0674150831553d1bcd86176',
          air: '325fe3718b3f4d4f8abe611373df821a',
          toIcebox: 'bbef5c0d59e74f04a1aadcc8003d9511',
          toIceWash: '51dc2554485d4c549503a63298c34fae',
          toHealthEleKuyu: '778c3418ca0a459b925a1edd09620c88'
        },
        types: [],
        sorts: [{
            txt: '综合排序',
            key: 'sortWeight',
            value: '1'
          },
          {
            txt: '销量排序',
            key: 'salsnum',
            value: '1'
          },
          {
            txt: '价格从低到高',
            key: 'price',
            value: '2'
          },
          {
            txt: '价格从高到低',
            key: 'price',
            value: '1'
          },
          {
            txt: '重置',
            key: 'sortWeight',
            value: '1'
          }
        ],
        cid: 0,
      }
    },
    // components: {
    //   slider,
    //   // listview
    // },
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
            if (document.body.scrollTop + window.innerHeight >= el.clientHeight + 500) {
              binding.value();
            }
          })
        }
      }
    },
    created() {
      var id = this.$route.query.id;
      switch (id) {
        case 'refrigerator':
          this.cid = 'toIcebox';
          break;
        case 'washer':
          this.cid = 'toIceWash';
          break;
        case 'health':
          this.cid = 'toHealthEleKuyu';
          break;
        default:
          this.cid = id;
      }
      this.getBanner(id);
      // this.getData();
      this.types = this.cText[this.cid];

      if (this.$util.getCookie('token') != null) {
        this.getFavoriteList();
      } else {
        this.getData();
      };
    },
    methods: {
      showBySort(i) { //  排序
        this.lists = []
        this.nowPage = 1
        this.sortBy = i.key
        this.sortType = i.value
        this.getData()
      },
      cheSub(item, i) {
        var xx = []
        for (var s in item.actives) {
          xx[s] = 0
        }
        var x = item.actives[i] == 0 ? 1 : 0
        xx[i] = x
        item.actives = xx
        item.selectTxt = x == 1 ? `(${item.value[i]})` : ''
        this.render = false
        this.render = true
      },
      reset(t) {
        this.keyword1 = ''
        for (var n in t) {
          t[n].selectTxt = ''
          for (var s in t[n].actives) {
            t[n].actives[s] = 0
          }
        }
        this.render = false
        this.render = true
      },
      ok(t) {
        var d = []
        for (var n in t) {
          for (var s in t[n].actives) {
            t[n].actives[s] == 1 && d.push(t[n].key[s])
          }
        }
        if (this.keyword1 != d.join(';')) {
          this.lists = []
        }
        this.keyword1 = d.join(';')
        this.choose(3)

        this.getData()
      },
      choose(t) { // 切换
        t == 1 && (this.bysort = false, this.bykey = !this.bykey);
        t == 2 && (this.bykey = false, this.bysort = !this.bysort);
        t == 3 && (this.bykey = this.bysort = false)
      },
      getBanner(id) { // 取大图
        this.$http.get('/getChannelAds/wap', {
          channel: id
        }, r => {
          let slider = this.sliders
          r.filter(function (m) {
            slider.push({
              style: 'background-image:url("' + m.src + '")'
            });
          })
        })
      },
      getData() {
        var params = {
          pageShow: this.pageShow,
          nowPage: this.nowPage,
          totalNum: this.totalNum,
          sortBy: this.sortBy,
          keyword1: this.keyword1,
          sortType: this.sortType,
          frontCategoryUuid: this.cuuids[this.cid]
        }
        this.loadEnd = false
        this.loadTxt = '数据加载中...'

        this.$http.get('/newchannel/' + this.cid, params, r => {
          this.loadEnd = true
          this.count = r.totalNum
          if (r.totalNum) {
            this.pageCount = Math.ceil(r.totalNum / this.pageShow);
          };

          var favdata = this.favdata
          var list = r.list.map(function (m) {
            var d = favdata.filter(function (n) {
              return n.productUuid == m.uuid;
            })[0];
            // console.log(d)
            if (d && d.uuid) {
              m.favTxt = '已收藏'
              m.cls = 'favorite active'
              m.isFav = true
            } else {
              m.favTxt = '收藏'
              m.cls = 'favorite'
              m.isFav = false
            }
            return m
          })
          this.lists = this.lists.concat(list)
          this.loadTxt = this.lists.length < 8 ? '后面没有了...' : '上拉加载更多...'
        })
      },
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
      getFavoriteList() {
        var _this = this;
        this.$http.get('/front/product/getMyProductFavoriteList', null, r => {
          if (r.code == '1' && r.retData && r.retData.length > 0) {
            this.favdata = r.retData;
          };
          _this.getData()
        })
      },
      setFavorite(item) {
        var _this = this
        if (item.isFav) {
          this.$http.get('/front/product/cancelFavorite', {
            productUuid: item.uuid,
            auth: 1
          }, r => {
            if (r == '1') {
              item.isFav = false
              item.favTxt = '收藏'
              item.cls = 'favorite'
            }
          });
        } else {
          this.$http.get('/front/product/collectProduct', {
            productUuid: item.uuid,
            auth: 1
          }, r => {
            if (r == '1') {
              item.isFav = true
              item.favTxt = '已收藏'
              item.cls = 'favorite active'
              var d = this.favdata
              d.map(function (n) {
                if (n.productUuid != item.uuid) {
                  d.push({
                    productUuid: item.productUuid,
                    isFav: true,
                    favTxt: '已收藏',
                    cls: 'favorite active'
                  })
                }
              })
            } else {
              alert('该商品无法收藏')
            }
          });
        }
      }
    },
  }

</script>
