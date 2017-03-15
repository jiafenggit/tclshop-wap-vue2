<template>
  <div class="ordertoBuildAddress" id="changeAddress">
    <div class="main" id="main">
      <div class="reset-password my-address y-w92">
        <ul class="address-list">
        <li>
            <a href="' + tag + '"><h4><span class="name">' + m.consignee +
            </span><span class="phone">' + m.mobile + '</span>' + defaultEle +
            </h4><p>' + m.area + '</p></a>' +
            <a href="/order/editAddress.html?from=' + from + '&uuid=' + m.uuid + '">' +
            <div class="iky-arrow-right"></div>' +
            </a>'
        </li>
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
