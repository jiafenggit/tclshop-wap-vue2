<template>
  <div class="ordertoBuildAddress" id="changeAddress">
    <div class="main" id="main">
      <div class="reset-password my-address y-w92">
        <ul class="address-list">
        </ul>
        <div class="my-address-new">
          <a><span class="iky-plus"></span>新建地址</a>
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

    },
    methods: {
      getAddress() {
        this.$http.post('/usercenter/customeraddress/toCustomerAddressKuyu', null, res => {

        })
      }
    }
  }

</script>
