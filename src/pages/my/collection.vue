<template>
    <div class="usercenter">
        <div class="billtitle bor-bott">我的收藏</div>
            <div id="loadFavouritePro" v-show="empty">
                <div class="choose qc">
                    <p>没有收藏的商品!</p>
                    <span>现在就去选购吧</span>
                    <router-link :to="{path:'/'}">去逛逛</router-link>
                 </div>
            </div>

         <div class="fav-item" v-for="item in data">
            <div class="billgoods y_collectlist">
               <router-link :to="{path:'/goods/detail',query:{id:item.productUuid}}"> 
                  <div class="billgoodsimg">
                    <img :src="item.pim.productImage.centerImageUrl">
                    </div>
                    <div class="billgoodstxt">
                        <p class="y_title" v-text="item.productName"></p>
                        <p>单价：{{item.favoritePrice}}元</p>
                    </div>
                </router-link>
            </div>
            <div class="billgoods bor-bott book">
                <div class="fr collect" style="color:#000" @click="addCart(item)"><span class="iky-cart "></span>&nbsp;{{item.cartText}}</div>
                <div class="fr collect" style="color:#000" @click="cancel(item)"><span class="iky-fav red"></span>{{item.favText}} </div>
            </div>
        </div>
    </div>
</template>
<script>
   export default {
        data(){
            return{
                pageShow: 8,
                nowPage: 1,
                totalNum: 100,
                pageCount: 0,
                data:[],
                cartData:[],
                loadTxt:'',
                empty:false
            }
        },
         watch: {
            nowPage(val) {
                this.getData()
            }
        },
        directives: {
            scroll: {
                bind: function (el, binding) {
                var _this = this;
                window.addEventListener('scroll', () => {
                    if (document.body.scrollTop + window.innerHeight >= el.clientHeight + 500) {
                    binding.value();
                    }
                })
                }
            }
        },
        mounted(){
        },
        created(){
            if(this.$store.state.token)
                this.getCart()
            else{
                this.getDate()
            }
            // this.getData()
        },
        methods:{
            getCart(){
                this.$http.get('/cart/show', {
                terminalType: '02'
                    }, res=>{
                        if(res.code==0){
                            this.cartData= res.data.carts
                            this.getData()
                        }else{
                            this.empty=true
                        }
                })
            },
            getData(){
                var params = {
                    pageShow: this.pageShow,
                    nowPage: this.nowPage,
                    totalNum: this.totalNum,
                    auth:1
                }
                this.loadEnd = false
                this.loadTxt = '数据加载中...'

                this.$http.get('/usercenter/productfavorite/toProductFavoriteKuyu', params, r => {
                    this.loadEnd = true
                    if(r.data.pagination.totalNum==0) this.empty=true
                    if (r.data.pagination.totalNum) {
                        this.pageCount = Math.ceil(r.data.pagination.totalNum / this.pageShow);
                    };

                    var cartData = this.cartData
                    var list = r.data.productFavoriteModels.map(function (m) {
                        var d = cartData.filter(function (n) {
                            console.log(n.productId)
                            return n.productId == m.productUuid;
                        })[0];
                        // console.log(d)
                        if (d && d.productId) {
                            m.cartText = '已加入购物车'
                            m.isCart = true
                        } else {
                            m.cartText = '加入购物车'
                            m.isCart = false
                        }
                        m.isFav=true
                        m.favText='取消收藏'
                        return m
                    })
                    this.data = this.data.concat(list)
                    // console.log(this.data)
                    this.loadTxt = this.data.length < 8 ? '后面没有了...' : '上拉加载更多...'
                })
            },
            loadMore(){
               if (this.nowPage == this.pageCount) {
                  this.loadTxt = '后面没有了...'
                } else {
                  this.loadTxt = '上拉加载更多...'
                }
                if (this.loadEnd && this.nowPage < this.pageCount) {
                  this.nowPage++
                }
            },
            cancel(item){
                 this.$http.get('/front/product/cancelFavorite', {
                        productUuid: item.productUuid,
                        auth: 1
                    }, r => {
                        if (r == 1) {
                            this.data.splice(this.data.indexOf(item),1)
                            this.empty=this.data.length==0
                        }
                    });
            },
            addCart(item){
                if(item.isCart)return
                var params = {
                    productUuid: item.productUuid,
                    buyNum: 1,
                    auth: 1,
                    attrId: item.pim.skuNo
                };
                this.$http.post('/front/product/addProductToCart', params, r => {
                    if (r.code == 0) {
                        item.cartText = '已加入购物车'
                        item.isCart = true
                        this.$store.state.count++
                    } else {
                        alert('加入购物车失败')
                    }
                });
            }
        }
    }
</script>
