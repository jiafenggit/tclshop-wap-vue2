<template>
  <div class="dask dask-address" v-show="vShow">
    <div class="address">
      <div class="header">
        <h2>选择地区</h2><span class="iky-delete" @click="$emit('close')"></span></div>
      <ul>
        <li v-for="(d,i) in data" :id="i==0?pCid:cId" v-text="d.provinceName||d.regionName||d.cityName||d.streetName" @click="change(d, $event)"></li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      'vShow': false
    },
    data() {
      return {
        // vShow: true,
        cId: '',
        pCid: '',
        data: [],
        provinceId: '',
        cityId: '',
        regionId: '',
        streetId: '',

        provinceName: '',
        regionName: '',
        cityName: '',
        streetName: '',

        expanProvince: false,
        expanCity: false,
        expanRegion: false,
        expanStreet: false,

      }
    },
    created() {
      this.getAllProvince()
    },
    watch: {
      vShow(v) {
        document.body.className = v ? 'noscroll' : '';
      }
    },
    methods: {
      change(d, e) {
        var id = e.srcElement.id
        switch (id) {
          case "province":
            this.provinceName = d.provinceName
            this.provinceId = d.uuid
            this.data = []
            if (!this.expanProvince) {
              this.data.push(d);
              this.getCities()
            } else {
              this.getAllProvince()
            }
            this.expanProvince = !this.expanProvince
            break;
          case "city":
            this.cityName = d.cityName
            this.cityId = d.uuid
            this.data = []
            if (!this.expanCity) {
              this.data.push(d);
              this.getRegions()
            } else {
              this.data.push({
                uuid: this.provinceId,
                provinceName: this.provinceName
              });
              this.getCities()
            }
            this.expanCity = !this.expanCity
            break;
          case "region":
            this.regionName = d.regionName
            this.regionId = d.uuid
            this.data = []
            if (!this.expanRegion) {
              this.data.push(d);
              this.getStreets()
            } else {
              this.data.push({
                uuid: this.cityId,
                provinceName: this.cityName
              });
              this.getRegions()
            }
            this.expanRegion = !this.expanRegion
            break;
          case "street":
            this.streetName = d.streetName
            this.streetId = d.uuid
            this.$emit('close')
            var add = {
              regionId: this.regionId,
              cityId: this.cityId,
              provinceId: this.provinceId,
              streetId: this.streetId,
              localaddress: this.provinceName + ' ' + this.cityName + ' ' + this.regionName + ' ' + this.streetName
            }
            this.$emit('setLocation', add)
            break;
        }
      },
      getAllProvince() {
        this.$http.get('/usercenter/region/getAllProvince', null, r => {
          this.cId = 'province'
          this.pCid = 'province'
          this.data = r
        })
      },
      getCities() { //取城市
        this.$http.get('/usercenter/region/getCitysByProvinceUuid', {
          provinceUuid: this.provinceId
        }, r => {
          this.pCid = 'province'
          this.cId = 'city'
          this.data = this.data.concat(r)
        });
      },
      getRegions() { //取乡镇区域
        this.$http.get('/usercenter/region/getRegionsByCityUuid', {
          cityUuid: this.cityId
        }, r => {
          this.pCid = 'city'
          this.cId = 'region'
          this.data = this.data.concat(r)
        });
      },
      getStreets() { //取街道区域
        this.$http.get('/usercenter/region/getStreetsByRegionUuid', {
          regionUuid: this.regionId
        }, r => {
          this.pCid = 'region'
          this.cId = 'street'
          this.data = this.data.concat(r)
        });
      },
    }
  }

</script>
