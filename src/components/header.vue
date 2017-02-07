<template>
  <header>
    <div class="header">
      <router-link to="/" class="iky-tcl-logo"></router-link>
      <div class="top-bar">
        <a @click="toggleMenu('show')"><span class="iky-menu"></span></a>
        <router-link to="/cart/"><span class="iky-cart"></span><span class="cart-count">0</span></router-link>
        <router-link to="/search"><span class="iky-search"></span></router-link>
      </div>
    </div>
    <div class="headermenu">
      <div class="con">
        <router-link to="/" class="iky-tcl-logo"></router-link>
        <div class="iky-delete" @click="toggleMenu('hide')"></div>
        <div class="navmenu">
          <ul>
            <li onclick="window.location.href='/usercenter/index.html';">
              <span class="iky-user"></span>
              <span>个人中心</span>
            </li>
            <li class="sub">
              <span class="iky-menu"></span>
              <span>产品分类</span>
              <span class="iky-arrow-down"></span>
              <ul class="sub-item">
                <li>
                  <a href="/goods/catgory.html?catgoryid=tv">
                    <span class="iky-tv"></span><span>电视</span></a>
                </li>
                <li>
                  <a href="/goods/catgory.html?catgoryid=mobile">
                    <span class="iky-mobile"></span><span>手机</span></a>
                </li>
                <li>
                  <a href="/goods/catgory.html?catgoryid=air">
                    <span class="iky-air-condition"></span><span>空调</span></a>
                </li>
                <li>
                  <a href="/goods/catgory.html?catgoryid=toIcebox">
                    <span class="iky-fridge"></span><span>冰箱</span></a>
                </li>
                <li>
                  <a href="/goods/catgory.html?catgoryid=washer">
                    <span class="iky-washing"></span><span>洗衣机</span></a>
                </li>
                <li>
                  <a href="/goods/catgory.html?catgoryid=health">
                    <span class="iky-healthy"></span><span>健康电器</span></a>
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
              <a href="/search.html">
                <span class="iky-search"></span>
                <span>搜索</span></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
  export default {
    created() {
      this.$util.resize()
    },
    methods: {
      toggleMenu(t) {
        // $('html ,body').addClass('noscroll');
        // document.getElementsByName('body').

        var el = document.getElementsByClassName('headermenu')[0]
        el.style.top = t == 'show' ? 0 : '-100%';
        // console.log(el.style.top)
        // $('.headermenu').css('top', 0);
      }
    }
  }

</script>
