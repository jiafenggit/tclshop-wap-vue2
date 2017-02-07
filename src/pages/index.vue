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
          <router-link :to="{path:'/goods/catgory',query:{id:item.id}}" v-if="item.id!=''"><span class="iky-a">{{item.icon}}</span>{{item.name}}</router-link>
          <a :href="item.href" target="_blank" v-else><span class="iky-a">{{item.icon}}</span>{{item.name}}</a>
          <li>
            <!--<li><a href="/goods/catgory.html?catgoryid=tv"><span class="iky-tv"></span>电视</a></li>
            <li><a href="/goods/catgory.html?catgoryid=mobile"><span class="iky-mobile"></span>手机</a></li>
            <li><a href="/goods/catgory.html?catgoryid=refrigerator"><span class="iky-fridge"></span>冰箱</a></li>
            <li><a href="/goods/catgory.html?catgoryid=air"><span class="iky-air-condition"></span>空调</a></li>
            <li><a href="/goods/catgory.html?catgoryid=washer"><span class="iky-washing"></span>洗衣机</a></li>
            <li><a href="/goods/catgory.html?catgoryid=health"><span class="iky-healthy"></span>健康电器</a></li>
            <li><a href="http://m.fans.tcl.com" target="_blank"><span class="iky-user"></span>社区</a></li>
            <li><a href="http://hy.tcl.com/wap/default" target="_blank"><span class="iky-points"></span>积分</a></li>-->
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
      getDate(params) {
        if (!params) params = {}
        this.$api.get('/getIndexAds/wap', params, r => {
          // console.log(r)
          this.catgory = r.channels.filter(function (m) {
            m.id = m.href.indexOf('catgory') > -1 ? m.href.split('?')[1].split('=')[1] : '';
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
