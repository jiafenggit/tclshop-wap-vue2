<template>
  <main class="search">
    <div class="search-box">
      <span class="iky-search"></span>
      <input type="text" id="search-key" placeholder="超薄电视" v-model="keyword" />
      <input type="button" id="submits" value="取消" @click="$router.go(-1)" />
      <span class="iky-remove" v-show="keyword.length>0" @click="keyword=''"></span>
    </div>
    <div class="search-hotkey">
      <p>热门搜索</p>
      <ul>
        <li v-for="item in hotKey" @click="hotKeySearch(item)">{{item}}</li>
      </ul>
    </div>
    <div class="search-hotkey history" v-show="historySearch.length>0">
      <p>历史搜索</p>
      <ul>
        <li v-for="item in historySearch" @click="hotKeySearch(item)"><span class="iky-timing"></span>{{item}}</li>
      </ul>
    </div>
    <div class="item-list">
      <div class="filter-btns">
        <a class="btn-filter"><span class="iky-menu"></span>筛选</a>
        <a class="btn-sort">排序<span class="iky-triangle"></span></a>
      </div>
      <div class="filter" v-show="bykey">
        <div class="btns">
          <input type="button" id="reset" value="重新选择" />
          <input type="button" id="ok" value="完成" />
        </div>
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
    </div>
  </main>
</template>
<script>
  export default {
    data() {
      return {
        bysort: false,
        bykey: false,
        keyword: '',
        historySearch: [],
        lists: [],
        attributeAttrValueStr: [],
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
            if (document.body.scrollTop + window.innerHeight >= el.clientHeight + 500) {
              binding.value();
            }
          })
        }
      }
    },
    created() {
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
      choose(t) { // 切换
        t == 1 && (this.bysort = false, this.bykey = !this.bykey);
        t == 2 && (this.bykey = false, this.bysort = !this.bysort);
      },
      getData(){},
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
        if (item.isFav) {
          this.$api.get('/front/product/cancelFavorite', {
            productUuid: item.uuid
          }, function (res) {
            res.code == '403' ? this.$router.push({
                name: 'login'
              }) :
              callback && callback(res);
          });
        } else {
          this.$api.get('/front/product/collectProduct', {
            productUuid: item.uuid,
          }, function (res) {
            res.code == '403' ? this.$router.push({
              name: 'login'
            }) : ''
          });
        }
      },
      hotKeySearch(key) {
        this.keyword = key;
        this.sortBy = 'sortWeight';
        this.sortType = 1;
        this.nowPage = 1;
        this.attributeAttrValueStr = [];
        this.pageCount = 0;
        this.firstCategoryId = '';

        //存储搜索历史记录
        if (this.keyword && this.historySearch.indexOf(this.keyword) == -1) {
          this.historySearch.splice(0, 0, this.keyword);
        } else {
          this.historySearch.splice(this.historySearch.indexOf(this.keyword), 1);
          this.historySearch.splice(0, 0, this.keyword);
        };
        this.$util.setCookie('historySearch', this.historySearch.toString());
        this.getData();
      }
    }
  }

</script>
