<template>
 <div class="ordertoUpdateAddress" id="editAddress">
	<div class="reset-password new-address  f09">
		<h3>
			修改地址
		</h3>
		<div class="form-group">
			<span>收货人：</span>
			<input type="text" v-model="form.consignee" name="consignee"  placeholder="姓名">
		</div>
		<div class="form-group">
			<span>手机号码：</span>
			<input type="text" name="mobile" v-model="form.mobile" maxlength="11"  placeholder="请输入手机号码">
		</div>
		<div class="form-group m-address">
			<span>所在地区：</span>
			<div class="m_addressbox">
				<input class="address-box" v-model="form.area" style="width:70%" type="text" @focus="vShow=true" placeholder="请选择区域" name="area" />
				<i class="iky-arrow-down "></i>
			</div>
		</div>
		<div class="form-group ">
			<span>详细地址:</span>
			<textarea v-model="form.address" name="address" style="resize:none; " placeholder="区，街道编号/名称，楼宇名称 "></textarea>
		</div>
		<div class="form-group m-setup ">
			<p class="y-text"  @click="form.isDefault =form.isDefault==1?0:1">
				<span :class="form.isDefault==1?'iky-hook checked':'iky-hook'"></span>设为默认地址
			</p>
		</div>
		<div class="modify-address-btn ">
			<a href="javascript:; " class="btn" @click="deleteAddress" v-if="addressId">删除</a>
			<a href="javascript:; " class="btn" @click="$router.back()" v-else>取消</a>
			<a href="javascript:; " class="btn btn-color" @click="save">保存地址</a>
		</div>
	</div>
	<v-Address :vShow="vShow" @setLocation="setLocation" @close="close"></v-Address>
</div>
</template>
<script>
	export default{
		data(){
			return{
				addressId:'',
				vShow:false,
				form: {
					uuid:'',
					consignee: '',
					mobile:'',
					province:  '',
					city:  '',
					region:  '',
					street: '',
					zipcode: '',
					address:'',
					telephone: '',
					addresstitle: '',
					area: '',
					isDefault:0,
					auth:1
				}
			}
		},
		created(){
			this.addressId = this.$route.query.id
			if(this.addressId)
				this.getAddressById()
		},
		methods:{ 
			save(){
				if(this.addressId)
					this.updateAddress()
				else
					this.insertAddress()
			},
			close() {
				this.vShow = false
			},
			setLocation(add) {
				this.form.region = add.regionId
				this.form.city = add.cityId
				this.form.province = add.provinceId
				this.form.street = add.streetId
				this.form.area = add.localaddress 
			},
			getForm () {
				if (this.form.consignee.length < 2) {
					alert('收货人姓名格式不正确');
					return false;
				};
				if (!this.$util.checkUser(this.form.mobile, 1)) {

					alert('请输入正确的手机号码！');
					return false;
				};
				if (!this.form.province || !this.form.city || !this.form.region || !this.form.street) {
					alert('请选择所在地区！');
					return false;
				};
				if (this.form.address.length == 0) {
					alert('请填写详细地址！');
					return false;
				};
				return true;
			},
			getAddressById(){
				this.$http.post('/usercenter/customeraddress/getAddressByuuid', {uuid: this.addressId,auth:1},res=>{
					if (res && res.consignee) {
						this.form.address =res.address
						this.form.area =res.area
						this.form.city =res.city
						this.form.consignee =res.consignee
						this.form.isDefault =res.isDefault
						this.form.mobile =res.mobile
						this.form.province =res.province
						this.form.region =res.region
						this.form.street =res.street
						this.form.telephone =res.telephone
						this.form.uuid =res.uuid
						this.form.zipcode =res.zipcode
						this.form.addresstitle =res.addresstitle
					}
				})
			},
			updateAddress(){
				var form= JSON.stringify(this.form)
				this.$http.post('/usercenter/customeraddress/doEdit',{param:form},res=>{
					if (res.status == '1') {
						alert('地址更新成功');
						this.$router.back()
						// setTimeout(function () {
						// 	window.location.href = '/order/changeAddress.html?from=' + from;
						// }, 1000);
					} else {
						alert('地址更新失败，请重试');
					};
				})
			},
			insertAddress(){
				var p = this.getForm()
				if(!p)return
				this.$http.post('/usercenter/customeraddress/addAddress',{param:JSON.stringify(this.form)},res=>{
					if (res.status == '1') {
						alert('地址添加成功');
						// setTimeout(function () {
						// 	window.location.href = '/order/changeAddress.html?from=' + from;
						// }, 1000);
					} else {
						alert('地址添加失败，请重试');
					};
			   })
			},
			deleteAddress(){
				this.$http.post('/usercenter/customeraddress/delDeliveryAddress', {
                uuid:this.addressId},res=>{
					if (res == 'true') {
						alert('地址删除成功');
						this.$router.back()
						// setTimeout(function () {
						// 	window.location.href = '/order/changeAddress.html?from=' + from;
						// }, 1000);
					} else {
						alert('地址删除失败，请重试');
					};
				})
			}
		}
	}
</script>