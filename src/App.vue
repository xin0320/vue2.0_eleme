<template>
  <div id="app">
    <!-- 将seller对象传递给header组件，v-blind,这是seller.vue的props属性 -->
    <v-header :seller = "seller">
    </v-header>

<div class="tab border-1px">
      <div class="tab-item">
        <router-link v-bind:to="'/goods'">
          商品

        </router-link>

      </div>
      <div class="tab-item">
        <router-link to="/ratings">
          评论
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">
          商家
        </router-link>
      </div>
    </div>
    <!-- 此处挂载的是商品、评论和商家的内容 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import header from './components/header/header';
const ERR_OK = 0;
export default {
  //将data定义为一个函数，为了更好地封装
  data() {
    return {
      seller: {}
    };
  },
  created() {
    //请求的ajex地址,成功的回调，拿到一个response
    this.$http.get('/api/seller').then((response) => {
      //response是一个属性，将其转化为json对象
      response = response.body;
      //console.log(response);
      if (response.errno === ERR_OK) {
        // 数据在data字段中,将seller对象传给header组件，通过:seller
        this.seller = response.data;
        console.log(this.seller);
      }
    });
  },
  name: 'App',
  components: {
    'v-header': header
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl';
.tab
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  border-1px(rgba(7, 17, 27, 0.1))
  .tab-item
    flex: 1
    text-align: center
    & > a
      display : block /* 不用点到a标签的字上就可以，标签所在的块皆可 */
      font-size : 14px
      color : rgb(77,85,93)
      &.active
        color: rgb(240, 20, 20)
/*

 .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    
    border-1px 是在minin.styl中定义的类，画横线，引用方式用(),不用：,
      传入的参数为color, base.styl用来实现缩放(在html中添加第二个类border-1px)，
      所有的styl都在index.styl中
      被引用，并有main.js引入index.styl
     
      border-1px(rgba(7, 17, 27, 0.1));
 
  }

  .tab .tab-item {
    flex: 1;
    text-align: center;
  }

  .tab .tab-item a {
    display: block;
    font-size: 14px;
    color: rgb(77, 85, 93);
    text-decoration : none;
  }

  .tab .tab-item .active {
    color: rgb(240, 20, 20);
  }

*/
</style>
