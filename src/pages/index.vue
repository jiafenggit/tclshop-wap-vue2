<template>
  <main class="index">
    <div class="slider">
      <v-Slider :pages="sliders" :sliderinit="sliderinit">
        <!-- slot  -->
      </v-Slider>
    </div>
    <div class="pro-catgory">
      <h3 class="title">产品分类</h3>
      <ul>
        <li v-for="item in catgory">
          <router-link :to="{path:'/goods/catgory',query:{id:item.id}}" v-if="item.id.indexOf('http')==-1"><span class="iky-a">{{item.icon}}</span>{{item.name}}</router-link>
          <a :href="item.href" target="_blank" v-else><span class="iky-a">{{item.icon}}</span>{{item.name}}</a>
          <li>
      </ul>
    </div>
    <div class="pro-collection">
      <h3 class="title">优惠合集</h3>
      <div class="item">
        <router-link v-for="(item ,index) in collection" :to="{path: '/goods/detail',query:{id:item.id}}">
          <img :src="item.src">
          <p>{{item.title}}</p>
          <p>{{item.desc}}</p>
        </router-link>
      </div>
    </div>
    <div class="pro-recommend">
      <h3 class="title">精品推荐</h3>
      <ul class="item">
        <li v-for="item in niceAds">
          <router-link :to="{path:'/goods/detail',query:{id:item.id}}">
            <div class="pro-img"><img :src="item.src"></div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="pro-hot">
      <h3 class="title">热销商品</h3>
      <ul class="item">
        <li v-for="item in hotSaleAds">
          <router-link :to="{path:'/goods/detail',query:{id:item.id}}">
            <div class="pro-img"><span v-if="item.type!=''">{{item.type}}</span><img :src="item.src"></div>
            <p>{{item.title}}</p>
            <p class="price">{{item.desc}}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="news">
      <h3 class="title">TCL动态</h3>
      <div class="item">
        <a v-for="item in news" :href="item.href" target="_blank"><img :src="item.src"></a>
      </div>
    </div>
  </main>
</template>
<script> 
  export default {
    data() {
      return {
        catgory: [],
        collection: [],
        news: [],
        hotSaleAds: [],
        niceAds: [],
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
        }
      }
    },
    created() {
      this.getDate()
    },
    // components: {
    //   slider
    // },
    methods: {
      getCategoryId:function(url){
        if(url){
          url = url.indexOf('catgory') > -1 ? url.split('?')[1].split('=')[1] : url;
          var x = url.replace('http://m.tcl.com/frontback/platDfFront/toChannel/','')
          switch(x){
            case '100b389129474b29966fbcbcae80bbca':return 'tv';
            case 'e6a8905919754222901f97193ec2fd9a':return 'mobile';
            case '33926b5759eb4daab650c713fe2227fb':return 'refrigerator';
            case 'd1e7f190c7a24af5847a362f0c7e1903':return 'air';
            case '84b404ef5b73405a8a1940f4d6222e1c':return 'washer';
            case '28866f5e0825457e91b3301ea54c103f':return 'health';
            default: return url
          }
        }
      },
      getDate(params) {
        if (!params) params = {}
        this.$http.get('/getIndexAds/wap', params, r => {
          var _this =this;
          this.catgory = r.channels.filter(function (m) {
            m.id = _this.getCategoryId(m.href)
            return m;
          });
          this.collection = r.mainAds.filter(function (m) {
            m.id = m.href.indexOf('uuid') > -1 ? m.href.split('?')[1].split('=')[1] : '';
            m.desc > 0 && (m.desc = (m.desc - 0).toFixed(2) + '元')
            return m;
          });
          this.news = r.news
          this.hotSaleAds = r.hotSaleAds.filter(function (m) {
            m.id = m.href.indexOf('uuid') > -1 ? m.href.split('?')[1].split('=')[1] : '';
            m.desc > 0 && (m.desc = (m.desc - 0).toFixed(2) + '元')
            return m;
          })
          this.niceAds = r.niceAds.filter(function (m) {
            m.id = m.href.indexOf('uuid') > -1 ? m.href.split('?')[1].split('=')[1] : '';
            return m;
          })
          var s = this.sliders
          r.topAds.filter(function (m) {
            s.push({style:'background-image:url("' + m.src + '")'});
          })
        })
      }
    },
  }

</script>
