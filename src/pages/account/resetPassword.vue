<template>
    <div class="main" id="main">
    <!--Reset password html-->
    <div class="m-register reset-password">
        <h3 class="reset-title">重置密码</h3>
        <div class="m-register-item">
            <ul>
                <li class="bor-bott">
                    <div class="item">
                        <input class="fl item-input contact" v-model="uid" type="text" placeholder="请输入手机号或邮箱账号" />
                        <div class="icon iky-remove" @click="uid=''" v-show="uid.length>0"></div>
                    </div>
                </li>
                <li class="bor-bott">
                    <div class="item">
                        <input class="item-input" type="text" placeholder="请输入验证码" v-model="code"  maxlength="6"/>
                        <a href="javascript:;" class="item-input-txt" @click="checkUser">{{sendCodeBtnText}}</a>
                    </div>
                </li>
                <li class="bor-bott">
                    <div class="item">
                        <input class="fl item-input" type="password" ref="pwd" placeholder="请输入新密码" v-model="pwd" />
                        <div class="icon passwordSee fr iky-eye" @click="$refs.pwd.type=$refs.pwd.type=='text'?'password':'text'"></div>
                    </div>
                </li>
                <li class="bor-bott">
                    <div class="item">
                        <input class="fl item-input" type="password" ref="repwd" placeholder="请输入确认密码" v-model="repwd" />
                        <div class="icon passwordSee fr iky-eye" @click="$refs.repwd.type=$refs.repwd.type=='text'?'password':'text'"></div>
                    </div>
                </li>
            </ul>
            <div class="m-register-tip">
                密码长度8~16位，数字、字母、字符至少包含两种
            </div>
            <button class="m-option-submit y-registbtn" @click="submit" v-bind:disabled="uid.length==0||pwd.length==0||code.length==0||repwd.length==0">提交</button>
        </div>
    </div>
    <!--Reset password html end-->
</div>
</template>
<script>
    export default{
        data(){
            return{
                mins:60,
                uid:'',
                pwd:'',
                repwd:'',
                code:'',
                issendCode:true,
                startTimeInt:null,
                sendCodeBtnText:'获取验证码',
                exitsUser:true,
            }
        },
        created(){

        },
        methods:{
            checkUser(){
                if (!this.$util.checkUser(this.uid)) {
                    alert('请填写正确的手机号或邮箱账号！');
                    return false;
                };
                if (!this.issendCode) {
                    return false;
                };
                this.$http.post('/tclcustomerregist/checkusername', {
                        'username': this.uid
                    },res=> {
                    if (res && res.code == '0') {
                        this.exitsUser = false;
                        alert('该账号不存在，请检查');
                    } else {
                        this.exitsUser = true;
                        this.sendCode()
                    }
                });
            },
            sendCode(){
                var _this = this
                this.$http.post('/tclcustomerresetpassword/sendSafetyCode',{username:this.uid}, r=> {
                    if (r && r.status == '1') {
                        alert('验证码发送成功，请注意查收！');
                        _this.issendCode = false; 
                        _this.mins = 60;
                        _this.startTimeInt && clearInterval(_this.startTimeInt);
                        _this.startTimeInt = setInterval(function(){
                            if (_this.mins == 0) {
                                _this.sendCodeBtnText='获取验证码'
                                _this.startTimeInt && clearInterval(_this.startTimeInt);
                                _this.issendCode = true;
                            } else {
                                _this.mins--;
                                _this.sendCodeBtnText='(' + _this.mins + 's)后重发'
                            };
                        }, 1000);
                    } else  {
                        alert('发送验证码失败，请稍后重试');
                    }
                });
            },
            submit(){
                if (!this.exitsUser) {
                    alert('该账号不存在！')
                    return;
                }    
                if (!this.$util.checkStrong(this.repwd)) {
                    alert('密码规格不符合，请重新填写');
                    return;
                };

                if (this.pwd !== '' && this.repwd !== '' && this.pwd !== this.repwd) {
                    alert('两次输入的密码不一致，请重新输入');
                    return;
                };

                var param = {
                    username: this.uid,
                    safecode: this.code,
                    newPassword: this.repwd
                };
                this.$http.post('/tclcustomerresetpassword/resetPassword', param, res=> {
                    if (res.status == '1') {
                        alert('恭喜您重置密码成功！');
                        setTimeout(function () {
                            window.location.href = "/account/login.html";
                        }, 1000)
                    } else if (res.status == '-1') {
                        alert('验证码错误！');
                    } else {
                        alert('重置密码失败，请稍后重试！')
                    }
                })
            }
        }
    }
</script>