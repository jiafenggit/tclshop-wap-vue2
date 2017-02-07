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
          <input type="button" id="reset" value="重新选择" />
          <input type="button" id="ok" value="完成" />
        </div>
        <ul class="filter-type">
          <li class="select" v-for="item in types">
            <p @click="showSlect">根据{{item.txt}}选择<span class="typekey"></span><span class="iky-arrow-right"></span></p>
            <ul>
              <li @click="" :data-key="item.key[i]" v-for="(v,i) in item.value">{{v}}</li>
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
      </div>
      <div class="loading-tip">{{loadTxt}}</div>
    </div>
  </main>
</template>
<script>
  // import slider from '../../components/slider.vue'
  // import listview from '../../components/listView.vue'
  export default {
    data() {
      return {
        loadEnd: true,
        loadTxt: '上拉加载更多...',
        bysort: false,
        bykey: false,
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
            key: ['尺寸-32英寸', '尺寸-40英寸,尺寸-42英寸,尺寸-43英寸', '尺寸-48英寸,尺寸-49英寸,尺寸-50英寸', '尺寸-55英寸,尺寸-58英寸',
              '尺寸-65英寸,尺寸-75英寸,尺寸-78英寸,尺寸-85英寸,尺寸-100英寸'
            ]
          }, {
            txt: '特色',
            value: ['曲面屏', '高色域', '4K超高清', '安卓智能', '互联网', '蓝光'],
            key: ['屏幕类型-曲面电视', '高色域', '分辨率-3840*2160（4K分辨率/UHD）', '电视类型-智能电视,操作系统-Android', '电视类型-互联网电视', '3301B'],
          }],
          mobile: [{
            txt: '屏幕尺寸',
            value: ['3.6寸以下', '3.6~4.5英寸', '4.6~5.5英寸', '5.5以上'],
            key: ['屏幕尺寸-手机-2.4英寸', '屏幕尺寸-手机-4.5英寸', '屏幕尺寸-手机-5.15英寸,屏幕尺寸-手机-5英寸,屏幕尺寸-手机-5.5英寸',
              '屏幕尺寸-手机-5.6英寸,屏幕尺寸-手机-5.7英寸,屏幕尺寸-手机-5.8英寸,屏幕尺寸-手机-6英寸'
            ]
          }, {
            txt: '系列',
            value: ['么么哒系列', 'idol系列', 'POP系列', '老人机系列', '平板系列', '手机配件'],
            key: ['么么哒系列', '系列-idol系列', '系列-POP系列', '系列-老人机系列', '平板系列', '手机配件']
          }],
          toIceWash: [{ //洗衣机
            txt: '体积容量',
            value: ['5kg以下', '5-6kg', '6-7kg', '7-8kg'],
            key: ['洗涤容量（公斤）-5公斤', '洗涤容量（公斤）-5.5公斤,洗涤容量（公斤）-6公斤', '洗涤容量（公斤）-6公斤,洗涤容量（公斤）-7公斤',
              '洗涤容量（公斤）-8公斤,洗涤容量（公斤）-7.5公斤'
            ],
          }, {
            txt: '类别',
            value: ['波轮变频', '波轮全自动', '滚筒变频', '滚筒定频'],
            key: ['波轮变频', '波轮全自动', '滚筒变频', '滚筒定频']
          }],
          toIcebox: [{ //冰箱
            txt: '体积容量',
            value: ['100L以下', '101L-200L', '201L-300L', '301L-500L', '500L以上'],
            key: ['总有效容积（L）-91.00', '总有效容积（L）-118.00,总有效容积（L）-171.00,总有效容积（L）-182.00',
              '总有效容积（L）-203.00,总有效容积（L）-205.00,总有效容积（L）-206.00,总有效容积（L）-220.00,总有效容积（L）-288.00',
              '总有效容积（L）-305.00,总有效容积（L）-416.00,总有效容积（L）-456.00',
              '总有效容积（L）-515.00,总有效容积（L）-516.00,总有效容积（L）-518.00'
            ]
          }, {
            txt: '类别',
            value: ['单门式', '双门式', '三门式', '多门式', '对开门式'],
            key: ['单门式', '双门式', '三门式', '多门式', '对开门式']
          }],
          air: [{
            txt: '匹数',
            value: ['1匹', '1.5匹', '2匹', '3匹'],
            key: ['匹数-1P', '匹数-大1.5P', '匹数-2P', '匹数-3P']
          }, {
            txt: '特点',
            value: ['壁挂式', '立柜式', '圆柱式', '移动式', '五氟变频', '高效定频'],
            key: ['空调特点-壁挂式', '空调特点-立柜式', '空调特点-圆柱式', '空调特点-移动式', '定频/变频-变频', '定频/变频-定频']
          }],
          toHealthEleKuyu: [{
            txt: '类别',
            value: ['空气净化器', '净水机', '吸尘器', '除螨仪', '原汁机', '电饭煲', '电磁炉', '电水壶', '电压力锅', '加湿器'],
            key: ['空气净化器', '净水机', '吸尘器', '除螨仪', '原汁机', '电饭煲', '电磁炉', '电水壶', '电压力锅', '加湿器']
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
      showSlect() {

      },
      choose(t) { // 切换
        t == 1 && (this.bysort = false, this.bykey = !this.bykey);
        t == 2 && (this.bykey = false, this.bysort = !this.bysort);
      },
      getBanner(id) { // 取大图
        this.$api.get('/getChannelAds/wap', {
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
          sortType: this.sortType,
          frontCategoryUuid: this.cuuids[this.cid]
        }
        this.loadEnd = false
        this.loadTxt = '数据加载中...'

        this.$api.get('/newchannel/' + this.cid, params, r => {
          this.loadEnd = true
          if (r.totalNum) {
            this.pageCount = Math.ceil(r.totalNum / this.pageShow);
          };

          var favdata = this.favdata
          var list = r.list.filter(function (m) {
            var d = favdata.filter(function (n) {
              return m.uid == n.productUuid;
            })[0];
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
        // console.log(this.nowPage)
      },
      getFavoriteList(callback) {
        var _this = this;

        this.$api.get('/front/product/getMyProductFavoriteList', null, r => {
          if (r.code == '1' && r.retData && r.retData.length > 0) {
            this.favdata = r.retData;
          };
          _this.getData()
        })
      },
      setFavorite(item) {
        // router.go()
        // console.log(this.router)
        this.$router.push({
          name: 'login'
        })
        return
        if (item.isFav) {
          this.$api.get('/front/product/cancelFavorite', {
            productUuid: item.uuid
          }, function (res) {
            res.code == '403' ? Account.toLogin() :
              callback && callback(res);
          });
        } else {
          this.$api.get('/front/product/collectProduct', {
            productUuid: item.uuid,
          }, function (res) {
            res.code == '403' ? Account.toLogin() : ''

          });
        }
      }
    },
  }

</script>
