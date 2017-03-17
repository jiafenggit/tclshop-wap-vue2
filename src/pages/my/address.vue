<template>
  <div class="ordertoBuildAddress" id="changeAddress">
    <div class="main" id="main">
      <div class="reset-password my-address y-w92">
        <ul class="address-list">
        <li v-for="item in data">
            <a href="' + tag + '"><h4>
            <span class="name">{{item.consignee}}</span><span class="phone">{{item.mobile}}</span>
            <span class="fr green" v-if="item.isDefault==1">默认地址</span>
            </h4><p>{{item.area}}</p></a>
            <router-link :to="{name:'addressAction',query:{id:item.uuid}}">
             <span class="iky-arrow-right"></span>
            </router-link>
        </li>
        </ul>
        <div class="my-address-new">
          <router-link :to="{name:'addressAction'}"><span class="iky-plus"></span>新建地址</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        from: 'order',
        data:[]
      }
    },
    created() {
      this.getAddress()
    },
    methods: {
      getAddress() {
        this.$http.post('/usercenter/customeraddress/toCustomerAddressKuyu', null, res => {
          if(res.status==1){
            this.data = res.data
          }
        })
      }
    }
  }

</script>
