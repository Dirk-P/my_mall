<template>
<div id="home">
  <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control :titles = "['流行','新款','精选']" 
                class="tab-control" 
                @itemClick="itemClick" 
                ref="tabControl2"
                v-show="isTabFixed"/>

  <scroll class="centent"  
          ref="scroll" 
          :probe-type = "3" 
          @scroll = "contentScroll"
          :pull-up-load="true"
          @pullingUp="loadMore">
  <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
  <recommend-view :recommends="recommends"/>
  <feature-view/>
  <tab-control :titles = "['流行','新款','精选']" 
                @itemClick="itemClick" 
                ref="tabControl1"/>
  <goods-list :goods="showGoods"/>
  </scroll>
  <!-- <back-top @Click="$emit('backClick')"/> -->
  <back-top @click.native="backClick" v-show="isShow"/>
</div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/contente/tabControl/TabControl.vue'

import HomeSwiper from './childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'
import GoodsList from 'components/contente/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll.vue'
import BackTop from 'components/contente/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from 'network/home'
import {debounce} from '@/common/utils/utils'


export default {
    name:"Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data (){
      return {
        banners : [],
        recommends :[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        currentType : 'pop',
        isShow : false,
        tabOffsetTop : 0,
        isTabFixed : false,
        saveY : 0,
      }
    },

    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created(){
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted(){

      const refresh = debounce(this.$refs.scroll.refresh,500)
      this.$bus.$on('itemImageLoad',()=>{
        refresh()
      })
    },
    methods:{
      /**
       * 事件监听相关的方法
       */
      itemClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick(){
         this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(opsition){
        this.isShow = (-opsition.y) > 1000
        this.isTabFixed = (-opsition.y) > this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        //console.log('====')
      },
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl1.$el.offsetTop
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
        })
      }
    },

    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    }
}
</script>

<style scoped>

#home {
  padding-top: 44px;
  height: 100vh;
  position: relative;
}

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control{
    position: sticky;
    top: 40px;
    z-index: 9;
  }

  .centent{
    /* overflow: hidden; */
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0px;
    right: 0px;
  }
</style>