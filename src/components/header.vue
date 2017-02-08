<template>
  <header>
    <div class="header">
      <router-link to="/" class="iky-tcl-logo"></router-link>
      <div class="top-bar">
        <a @click="toggleMenu('show')"><span class="iky-menu"></span></a>
        <router-link to="/cart/">
          <span class="iky-cart"></span>
          <span class="cart-count" v-show="cartCount>0" v-text="cartCount"></span>
        </router-link>
        <router-link to="/search"><span class="iky-search"></span></router-link>
      </div>
    </div>
    <div class="headermenu">
      <div class="con">
        <router-link to="/" class="iky-tcl-logo"></router-link>
        <div class="iky-delete" @click="toggleMenu('hide')"></div>
        <div class="navmenu">
          <ul>
            <li @click="toggleMenu('hide')">
              <router-link :to="{path:'/my/index'}">
                <span class="iky-user"></span>
                <span>个人中心</span>
              </router-link>
            </li>
            <li class="sub">
              <span class="iky-menu"></span>
              <span>产品分类</span>
              <span class="iky-arrow-down"></span>
              <ul class="sub-item">
                <li v-for="item in menu">
                  <router-link :to="{path:'/goods/catgory',query:{catgoryid:item.link}}">
                    <span :class="item.icon"></span><span>{{item.name}}</span></a>
                  </router-link>
                </li>
              </ul>
            </li>
            <li>
              <a href="http://ym.tcl.com/services/pid" target="_blank">
                <span class="iky-setting"></span>
                <span>服务</span>
              </a>
            </li>
            <li>
              <a href="http://fans.tcl.com" target="_blank">
                <span class="iky-up"></span>
                <span>铁粉社区</span>
              </a>
            </li>
            <li>
              <a href="http://m.tcl.com/tcldealer/dealer/toLogin">
                <span class="iky-home"></span>
                <span>经销商之家</span>
              </a>
            </li>
            <li>
              <a href="http://hy.tcl.com">
                <span class="iky-gift"></span>
                <span>积分兑换</span>
              </a>
            </li>
            <li>
              <a href="http://m.tcl.com/group/news/index" target="_blank">
                <span class="iky-list"></span>
                <span>新闻动态</span>
              </a>
            </li>
            <li>
              <a href="/services/bulk-purchase.html">
                <span class="iky-gift"></span>
                <span>大宗采购</span>
              </a>
            </li>
            <li class="bor-bott backtopage">
              <router-link :to="{path:'/search'}">
                <span class="iky-search"></span>
                <span>搜索</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
  export default {
    data() {
      return {
        menu: [{
          name: '电视',
          link: 'tv',
          icon: 'iky-tv'
        }, {
          name: '手机',
          link: 'mobile',
          icon: 'iky-mobile'
        }, {
          name: '空调',
          icon: 'iky-air-condition',
          link: 'air'
        }, {
          name: '冰箱',
          link: 'toIcebox',
          icon: 'iky-fridge'
        }, {
          name: '洗衣机',
          icon: 'iky-washing',
          link: 'washer'
        }, {
          name: '健康电器',
          icon: 'iky-healthy',
          link: 'health'
        }, ],
        cartCount: 0
      }
    },
    created() {
      this.$util.resize()
      this.getCount()
    },
    methods: {
      toggleMenu(t) {
        // $('html ,body').addClass('noscroll');
        // document.getElementsByName('body').

        var el = document.getElementsByClassName('headermenu')[0]
        el.style.top = t == 'show' ? 0 : '-100%';
        // console.log(el.style.top)
        // $('.headermenu').css('top', 0);
      },
      getCount() {
        if (this.$util.getCookie('token') != null)
          this.$http.get('/cart/count', null, r => {
            if (r.code == '0') {
              this.cartCount = r.data
            }
          });
      }
    }
  }

</script>
