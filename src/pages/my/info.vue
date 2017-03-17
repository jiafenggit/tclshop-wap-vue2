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
            <img id="headerimgUpload" :src="face" />
          </span>
          <input type="file" accept="image/*" class="cameraInput" @change="upload" id="imgFile" name="imgFile">
        </li>
        <li>
          <label class="y-name">生日</label>
          <b class="y-ico iky-arrow-right"></b>
          <input type="date" class="y-inputdata" v-model="birthday" @change="updateBirthday" />
        </li>
        <li>
          <a href="/usercenter/bindPhone.html">
            <label class="y-name">手机号</label>
            <b class="y-ico iky-arrow-right"></b>
            <span class="y-data" v-text="bindPhone"></span>
          </a>
        </li>
        <li>
          <a href="/usercenter/bindEmail.html">
            <label class="y-name">邮箱</label>
            <b class="y-ico iky-arrow-right"></b>
            <span class="y-data" v-text="bindMail"></span>
          </a>
        </li>
        <li>
          <router-link :to="{name:'address'}">
            <label class="y-name">收货地址</label>
            <b class="y-ico iky-arrow-right"></b>
          </router-link>
        </li>
        <li>
          <router-link :to="{name:'resetPassword'}">
            <label class="y-name">修改密码</label>
            <b class="y-ico iky-arrow-right"></b>
          </router-link>
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
    data(){
      return{
        customerUuid:'',
        face:require('../../res/img/default.png'),
        birthday:'',
        bindPhone:'',
        bindMail:'',
      }
    },
    created(){
      this.getUserInfo()
    },
    methods: {
      getUserInfo(){
        this.$http.get('/tclcustomer/userInfo', {auth:1}, res=> {
              if(res.code==0){
                 var user = res.data
                 if(user.customerImgUrl){
                    var img = new Image();
                    var _this = this
                    img.onload = function () {
                         _this.face = user.customerImgUrl
                    };
                    img.src = user.customerImgUrl;
                 }
                 this.customerUuid = user.customerUuid
                 this.birthday =user.birthday
                 this.bindPhone =user.bindPhone
                 this.bindMail =user.bindMail
              }
        });
      },
      upload(){
        this.$http.upload('/usercenter/customercomplex/uploadImage','imgFile',res=>{
               if (res.code == '-1') {
                    alert('上传失败');
                } else if (res.code == '-2') {
                    alert("图片大小不能超过4M");
                } else if (res.code == '-3') {
                    alert("请选择正确的图片格式");
                } else if (res.code == '0') {
                    this.face = res.data.remotePath
                    //保存更新头像信息
                    this.$http.post('/usercenter/customercomplex/updateImage', {
                        img: this.face
                    }, r=> {
                        if (res.code == '0') {
                            alert("头像修改成功");
                        };
                    });
                };
        })
      },
      updateBirthday(){
          this.$http.post('/usercenter/customercomplex/doModifyCustomerInfoKuyu', {
            birthday:this.birthday,
            customerUuid:this.customerUuid,
            auth:1
            }, res=>{
                if (res.code == '0') {
                    alert("恭喜，修改成功");
                } else {
                    alert("修改失败，请稍后重试");
                }
            })
      },
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
