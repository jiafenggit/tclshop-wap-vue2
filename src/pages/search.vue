<template>
  <main class="search">
    <div class="search-box">
      <span class="iky-search" @click="getData"></span>
      <input type="text" id="search-key" placeholder="超薄电视" v-model="keyword" @keyup.13="getData" />
      <input type="button" id="submits" value="取消" @click="$router.go(-1)" />
      <span class="iky-remove" v-show="keyword.length>0" @click="keyword=''"></span>
    </div>
    <div class="search-hotkey">
      <p>热门搜索</p>
      <ul>
        <li v-for="item in hotKey" @click="hotKeySearch(item)">{{item}}</li>
      </ul>
    </div>
    <div class="search-hotkey history" v-show="historySearch.length>0&&count<0">
      <p>历史搜索</p>
      <ul>
        <li v-for="item in historySearch" @click="hotKeySearch(item)"><span class="iky-timing"></span>{{item}}</li>
      </ul>
    </div>
    <div class="item-list">
      <div class="filter-btns" v-show="count>=0">
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
        <p class="empty" v-show="count==0">没有找到您要搜寻的产品...<router-link :to="{path:'/'}">返回首页</router-link></p>
      </div>
      <div class="loading-tip" v-show="lists.length>0">{{loadTxt}}</div>
    </div>
  </main>
</template>
<script>
  export default {
    data() {
      return {
        loadTxt: '上拉加载更多...',
        render: true,
        count: -1,
        bysort: false,
        bykey: false,
        keyword: '',
        oldkeyword: '',
        historySearch: [],
        lists: [],
        types: [],
        favdata: [],
        attributeAttrValueStr: '',
        firstCategoryId: '',
        nowPage: 1,
        pageShow: 8,
        totalNum: 100,
        sortBy: 'sortWeight',
        sortType: 1,
        loadEnd: false,
        hotKey: ['曲面', '机器人', '4K', '变频', '滚筒'],
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
            if (document.body.scrollTop + window.innerHeight >= el.clientHeight + 50) {
              binding.value();
            }
          })
        }
      }
    },
    created() {
      if (this.$util.getCookie('token') != null) {
        this.getFavoriteList();
      }
      this.historySearch = this.$util.getCookie('historySearch') != null ? this.$util.getCookie('historySearch').split(
        ',') : []
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

        if (item.fid) {
          this.firstCategoryId = x == 1 ? item.fid[i] : ''
        }



        this.render = false
        this.render = true
      },
      reset(t) {
        // this.keyword = ''
        for (var n in t) {
          t[n].selectTxt = ''
          for (var s in t[n].actives) {
            t[n].actives[s] = 0
          }
        }
        this.firstCategoryId = ''
        this.attributeAttrValueStr = ''
        this.render = false
        this.render = true
      },
      ok(t) {
        var d = []
        for (var n in t) {
          for (var s in t[n].actives) {
            t[n].actives[s] == 1 && t[n].attrs && d.push(t[n].attrs[s])
          }
        }
        if (this.keyword != d.join(';')) {
          this.lists = []
        }
        this.attributeAttrValueStr = d.join(';')
        this.choose(3)

        this.getData()
      },
      choose(t) { // 切换
        t == 1 && (this.bysort = false, this.bykey = !this.bykey);
        t == 2 && (this.bykey = false, this.bysort = !this.bysort);
        t == 3 && (this.bykey = this.bysort = false)
      },
      getData() {
        if (this.keyword.length == 0) {
          alert('请输入关键字!')
          return
        }
        var params = {
          pageShow: this.pageShow,
          nowPage: this.nowPage,
          totalNum: this.tottotalNum,
          keyword: this.keyword,
          firstCategoryId: this.firstCategoryId,
          sortBy: this.sortBy,
          sortType: this.sortType,
          attributeAttrValueStr: this.attributeAttrValueStr,
          ranNum: Math.random()
        }
        this.loadEnd = false
        this.loadTxt = '数据加载中....'
        this.$http.post('/itemsearch/toProductList', params, r => {
          this.loadEnd = true
          this.count = r.totalNum

          if (this.oldkeyword != this.keyword) {
            this.lists = []
            this.types = []
            this.sortBy = 'sortWeight'
            this.sortType = 1
            this.nowPage = 1
            this.attributeAttrValueStr = ''
            this.pageCount = 0


            //存储搜索历史记录
            if (this.keyword && this.historySearch.indexOf(this.keyword) == -1) {
              this.historySearch.splice(0, 0, this.keyword);
            } else {
              this.historySearch.splice(this.historySearch.indexOf(this.keyword), 1);
              this.historySearch.splice(0, 0, this.keyword);
            };
            this.$util.setCookie('historySearch', this.historySearch.toString());
          };
          if (r.totalNum) {
            this.pageCount = Math.ceil(r.totalNum / this.pageShow);
          };
          var types = this.types

          var lb = r.categoryMap
          var attr = r.attributeMap
          var attrSub = r.attributeValueMap
          //筛选分类
          if (lb && lb.length > 0 && this.oldkeyword != this.keyword) {

            // {
            //   txt: '尺寸',
            //   value: ['32英寸', '40-43英寸', '48-50英寸', '50-56英寸', '60英寸以上'],
            //   actives: [0, 0, 0, 0, 0],
            //   key: ['尺寸-32英寸', '尺寸-40英寸,尺寸-42英寸,尺寸-43英寸', '尺寸-48英寸,尺寸-49英寸,尺寸-50英寸', '尺寸-55英寸,尺寸-58英寸',
            //     '尺寸-65英寸,尺寸-75英寸,尺寸-78英寸,尺寸-85英寸,尺寸-100英寸'
            //   ],
            //   select: false,
            //   selectTxt: ''
            // }

            //
            //类别分类
            var x = {}
            x.txt = '类别'
            x.selectTxt = ''
            x.select = false
            x.value = []
            x.fid = []
            x.actives = []
            lb.map(function (m) {
              x.value.push(m.name)
              x.fid.push(m.id)
              x.actives.push(0)
            })
            types.push(x)

            //类型
            attr.map(function (m) {
              var x = {}
              x.txt = m.name
              x.selectTxt = ''
              x.select = false
              x.value = []
              x.attrs = []
              x.actives = []
              attrSub[m.id].map(function (n) {
                x.value.push(n.name)
                x.attrs.push(`${m.id}#${n.id}`)
                x.actives.push(0)
              })
              types.push(x)
            })
          };

          //收藏情况
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
          this.loadTxt = this.lists.length < 8 ? '' : '上拉加载更多...'
          this.oldkeyword = this.keyword
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
          // _this.getData()
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
      },
      hotKeySearch(key) {
        this.keyword = key;
        // this.sortBy = 'sortWeight';
        // this.sortType = 1;
        // this.nowPage = 1;
        // this.attributeAttrValueStr = [];
        // this.pageCount = 0;
        // this.firstCategoryId = '';

        this.getData();
      }
    }
  }

</script>
