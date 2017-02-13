<template>
  <div class="usercenter">
    <!-- Bill title start -->
    <div class="billtitle bor-bott">编辑资料</div>
    <nav class="editor-information">
      <ul>
        <li>
          <!-- <label class="y-name">图像</label>
          <span class="y-picshow">
            <img id="headerimgUpload" src="../res/img/user-img.png" />
            <input type="hidden" name="remotePaths" value="" id="remotePaths" class="cameraInput" />
          </span> -->
          <label class="y-name">头像</label>
          <b class="y-ico iky-arrow-right"></b>
          <span class="y-picshow" id="avatar">
            <img id="headerimgUpload" src="/res/img/default.png" />
          </span>
          <input type="file" accept="image/*" class="cameraInput" id="imgFile" name="imgFile">
        </li>
        <li>
          <label class="y-name">生日</label>
          <b class="y-ico iky-arrow-right"></b>
          <input type="text" class="y-inputdata" id="appDate" placeholder="" readonly="">
        </li>
        <li>
          <a href="/usercenter/bindPhone.html">
            <label class="y-name">手机号</label>
            <b class="y-ico iky-arrow-right"></b>
            <span class="y-data" id="phoneNum"></span>
          </a>
        </li>
        <li>
          <a href="/usercenter/bindEmail.html">
            <label class="y-name">邮箱</label>
            <b class="y-ico iky-arrow-right"></b>
            <span class="y-data" id="email"></span>
          </a>
        </li>
        <li>
          <a href="/order/changeAddress.html?from=usercenter">
            <label class="y-name">收货地址</label>
            <b class="y-ico iky-arrow-right"></b>
          </a>
        </li>
        <li>
          <a href="/account/reset-password.html">
            <label class="y-name">修改密码</label>
            <b class="y-ico iky-arrow-right"></b>
          </a>
        </li>
        <li>
          <a href="javascript:;" id="logOut" @click="logout">
            <label class="y-name">退出当前账户</label>
          </a>
        </li>
      </ul>
    </nav>
    <!-- Bill title end -->
  </div>
</template>
<script>
  export default {
    methods: {
      logout() {
        this.$http.get('/tclcustomer/logout', null, r => {
          if (r.code == '0') {
            this.$util.delCookie('token');
            alert('您已经安全退出！');
            var _this = this
            setTimeout(function () {
              _this.$router.push({
                path: '/account/login'
              })
            }, 1500);
          } else {
            this.$util.delCookie('token');
            this.$router.push({
              path: '/account/login'
            })
          };
        });
      }
    }
  }

</script>
