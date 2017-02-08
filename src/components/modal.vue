<template>
  <div class="dask">
    <div class="dialog confirm bounceInDown animated"><span class="iky-info"></span>
      <h1>dd</h1>
      <p>我就弹个框</p>
      <div><span id="btncancel">取消</span><span id="btnok">确定</span></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "child1",
    props: "msg",
    methods: {
      handleParentClick(e) {
        console.info(e)
      }
    }
  }

</script>
