<template>
  <div class="main" id="main">
    <!---login html-->
    <div class="m-login">
      <div class="m-form-group group">
        <span class="iky-user"></span>
        <input type="text" class="nminfo" id="uid" placeholder="请输入登录账号" v-model="uid" />
        <i class="iky-remove" v-show="uid.length>0" @click="uid=''"></i>
      </div>
      <div class="m-form-group m-group">
        <span class="iky-lock"></span>
        <input type="password" class="pswdinfo" id="pwd" placeholder="请输入密码" v-model="pwd" ref="ipwd">
        <i class="iky-eye" @click="$refs.ipwd.type=$refs.ipwd.type=='text'?'password':'text'"></i>
      </div>
      <div v-show="showCode">
        <div class="m-form-group m-group">
          <input type="text" class="J-LoginCode" id="captchadata" placeholder="请输入验证码" v-model="captchadata" maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D/g,'')">
            <span class="pass-code"><img v-bind:src="codeUrl" id="imgcode" @click="getCaptcha"></span>
        </div>
      </div>
      <div class="login-password">
        <label class="fl"><input name="Fruit" type="checkbox" value="" />记住账号密码 </label>
      </div>
      <div class="m-btn J-Login">
        <input type="button" class="btn" id="loginbtn" v-bind:disabled="uid.length==0||pwd.length==0" value="登录" @click="login" />
      </div>
      <div class="m-cancel">
        <a href="/account/register.html" class="">立即注册</a>
        <span>|</span>
        <a href="/account/reset-password.html" class="">忘记密码</a>
      </div>
    </div>
    <div class="login-m-other">
      <div class="other-title">
        <span class="line"></span>
        <h3>其他登录</h3>
        <span class="line"></span>
      </div>
      <div class="other-login">
        <a class="J-LoginOther" id="login-qq" data-type="2">
          <span><img src="/res/img/others_qq.png"></span>
          <p>QQ</p>
        </a>
        <a class="J-LoginOther" id="login-webchat" data-type="3">
          <span class="iky-webchat"></span>
          <p>微信</p>
        </a>
        <a href="#" class="J-LoginOther" id="login-weibo" data-type="1">
          <span><img src="/res/img/weibo.png"></span>
          <p>微博</p>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        uid: '',
        pwd: '',
        iswx: this.$util.iswx(),
        captchakey: '',
        captchadata: '',
        showCode: false,
        codeUrl: ''
      }
    },
    created() {
      // console.log(this.$router)
    },
    methods: {
      login() {
        var params = {
          captchadata: this.captchadata,
          captchakey: this.captchakey,
          loginName: this.uid, //"18565735618",
          pwd: this.pwd, //"123456qq",
          simpleDbCart: {},
          backUrl: ''
        }
        // var _this = this
        this.$http.post('/login/login', JSON.stringify(params), r => {
          if (r.code == '-5') {
            alert('验证码错误！')
            this.getCaptcha()
          } else if (r.code == '0') {
            this.$util.setCookie('token', r.token)
            this.getInfo()
          } else {
            alert('用户名/密码错误！');
            this.getCaptcha()
          };
        });
      },
      getCaptcha() {
        // var _this = this
        this.$http.get('/tclcustomerregist/getcaptcha', null, r => {
          if (r.status == 1) {
            this.showCode = true
            this.captchakey = r.key
            this.codeUrl = r.url
          };
        });
      },
      getInfo() {
        // var _this = this
        this.$http.get('/tclcustomer/userInfo', null, r => {
          r.code == '0' && this.$util.setCookie('user', JSON.stringify(r.data));
          this.$router.go(-1)
        })
      }
    }
  }

</script>
