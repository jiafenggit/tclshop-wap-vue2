<template>
<div class="usercenter">
    <!--Coupon html-->
    <div class="reset-password">
        <h3 class="y_w92">我的优惠券</h3>
        <div class="resetpswd coupon">
            <a href="javascript:void(0)" v-for="item in types" :class="item.cls" @click="getDataWithType(item)" v-text="item.text"></a> 
            <ul class="m-coupon" v-for="item in data">
                <li :class="item.state==1?'m-usable':(item.state==2?'m-already':'m-hasexpired')">
                <div><span class="m-left fs48" style="font-size: 0.9rem;">{{item.money}}元</span></div>
                <div class="m-center">
                <p class="p1">消费{{item.minConsumeMoney}}元可以使用</p>
                <p class="p2">{{item.beginTime.substring(0, 10)}}至{{item.endTime.substring(0, 10)}}</p>
                </div>
                <div class="m-right">{{item.txt}}</div>
                </li>
            </ul>.
            <div style="padding:3rem 0;text-align:center;font-size:.6rem;" v-show="data.length==0">暂无数据...</div>
            <div class="m-coupon-ts" style="display: inline-block;">此券为商业扣券，一经使用，不可找零或退换</div>
        </div> 
    </div>
</div>
</template>
<script>
    export default{
        data(){
            return{
                types:[
                    {cls:'on',state:'1',text:'可使用'},
                    {cls:'',state:'2',text:'已使用'},
                    {cls:'',state:'3',text:'已过期'},
                    ],
                pageShow : 5,
                nowPage : 1,
                pageCount : 0,
                loadEnd : false,
                state : 1,
                data:[]
            }
        },
        created(){
            this.getData()
        },
        methods:{
            getDataWithType(item){
                this.types.map(function(m){
                    m.cls=''
                })
                item.cls='on'
                this.state =item.state 
                this.data=[]
                this.getData()
            },
            getData(){
                var params = {
                    nowPage: this.nowPage,
                    pageShow: this.pageShow,
                    state: this.state,
                    couponId: '',
                    auth:1
                };
                this.loadEnd = false;
                this.$http.post('/usercenter/coupondetails/searchCouponDetailsKuyu', params, res=> {
                    if(res.code==0){
                        this.data = this.data.concat(res.data.list)
                    }
                    this.loadEnd = true;
                });
            }
        }
    }
</script>