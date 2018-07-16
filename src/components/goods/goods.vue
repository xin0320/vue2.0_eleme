<template>
 <div class="goods">
   <div class="menu-wrapper" ref="menuWrapper">
     <ul><!-- 如果index等于currentIndex,就为这个li添加一个current类，改变左侧导航栏的背景颜色-->
       <li v-for="(item,index) in goods" :key="item.id" class="menu-item" :class="{'current': currentIndex === index}" 
       @click = "selectMenu(index, $event)"> <!--  click所传递的事件-->
         <span class="text" border-1px>
           <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
         </span>
       </li>
     </ul>
   </div>
   <div class="foods-wrapper" ref="foodsWrapper">
     <ul>
       <li v-for="item in goods" :key="item.id" class="food-list food-list-hook">
         <h1 class="title">{{item.name}}</h1>  <!-- 特色粥品-->
         <!-- 粥类可能有很多种粥品-->
         <ul>
           <li v-for="food in item.foods" :key="food.id" class="food-item"  border-1px @click="selectFood(food,$event)">
             <div class="icon">
               <img width="57px" :src="food.icon" alt="">
             </div>
             <div class="content">
               <h2 class="name">{{food.name}}</h2>
               <p class="desc">{{food.description}}</p>
               <div class="extra">
                 <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
               </div>
               <div class="price">
                 <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
               </div>
               <div class="cartcontrol-wrapper">
                <cartcontrol v-on:cart-add="cartAdd" :food="food"></cartcontrol> <!-- 传入food!!!-->
               </div>
             </div>
           </li>
         </ul>
       </li>
     </ul>
   </div>
   <!-- props将seller的属性传进来，数据都存在data.json中 -->
   <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food :food="selectedFood" ref="food"></food> <!-- data中的selectedFood传递进来-->
 </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
//引入组件，并去components中取注册,之后便可以在goods中menu-wrapper和foods-wrapper之后使用shopcart这个组件
import shopcart from 'components/shopcart/shopcart.vue'; 
import cartcontrol from 'components/cartcontrol/cartcontrol.vue'; 
import food from 'components/food/food.vue';
 // vuerouter 将seller传进来
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },

//用data绑定goods，以便后续添加到DOM中
data() {
  return {
    goods: [],
    listHeight: [], //存储区块的高度
    scrollY: 0,
    selectedFood: {} //一开始是空对象，点击food的时候再存入，在li(food)中添加点击事件
  };
},
//计算属性
computed: {
  currentIndex() { //currentIndex对应菜单栏的下标
    for (let i = 0; i < this.listHeight.length; i++) { //不要忘了加this引用
      let height1 = this.listHeight[i];
      let height2 = this.listHeight[i + 1];
      //获得了一个区间的上下范围，判断scrollY落到这个区间，!height2是判断最后一个区间
      //避免i溢出
      if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
        return i; //映射到第5行menu的变化
      }
    }
    return 0;
  },
  selectFoods() { //遍历foods，看看选中了哪些商品
    let foods = [];
    this.goods.forEach((good) => { //先取到每一个分类
      good.foods.forEach((food) => { //后取到每一个分类下的不同food
        if (food.count) {
          foods.push(food); //两层遍历，取到所有被选中的foods
        }
      });
    });
    return foods; //将结果传回到shopcart
   }
},
//vue resource到http的方法
 created() {
   this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    //请求的ajex地址,成功的回调，拿到一个response
    this.$http.get('/api/goods').then((response) => {
      //response是一个属性，将其转化为json对象
      response = response.body;
      //console.log(response);
      if (response.errno === ERR_OK) {
        // 数据在data字段中,将goods对象传给header组件，通过:goods
        this.goods = response.data;
//        console.log(this.goods);
        //异步调用，DOM没有更新,没有正确计算到高度
        this.$nextTick(() => {
           //调用scroll函数，实现滚动
          this._initScroll();
          //拿到数据以后计算高度
          this._calculateHeight();
        }); 
      }
    });
 },
//methods不是一个方法，是一个object
 methods: {
   selectMenu (index, event) {
     if (!event._constructed) { //浏览器直接return掉,去掉自带click事件的点击
        return;
     }
    let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
    let ref = foodList[index]; //取到index对应的DOM
    this.foodsScroll.scrollToElement(ref, 300);//滚动到DOM所在位置
    //console.log(index);
  },
   _initScroll() {
     //v-el(this.$els.foodWrapper)获取DOM对象，json对象
     this.menuScroll = new BScroll(this.$refs.menuWrapper, {
       click: true //阻止默认，允许点击
     });
     this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
       click: true,
       probeType: 3 //BScroll滚动时，能实时告诉我们滚动的位置，类似探针的效果
     });
     //foodsScroll监听事件,在scroll滚动时能见位置实时暴露出来
    this.foodsScroll.on('scroll', (pos) => {
      this.scrollY = Math.abs(Math.round(pos.y)); //取正值
    });
   },
   _calculateHeight() {
     //food-list-hook类的添加知识为了能拿到food列表,例如，拿到的是多个类似整个粥品的区块
    let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
    let height = 0;
    this.listHeight.push(height); //listHeight是一个递增的区间数组，是每个专区高度的累加
    for (let i = 0; i < foodList.length; i++) {
      let item = foodList[i];
      height += item.clientHeight;
      this.listHeight.push(height);
    }
   },
   cartAdd(target) {
     //拿到traget(DOM对象)之后，将其传入shopcart组件中drop(target){}方法，
     //此处用this.$refs调用子组件,访问DOM时用的是ref="menuWrapper"
    this.$nextTick(() => { //回调函数异步执行，两个动画效果就不会卡顿了
      this.$refs.shopcart.drop(target);
    });
   },
  selectFood(food, event) { //@click函数
    if (!event._constructed) { //浏览器直接return掉,去掉自带click事件的点击
        return;
     }
      this.selectedFood = food;
      //调用子组件的show()方法展开food组件
      this.$refs.food.show();
  }
 },
 components: {
   shopcart,
   cartcontrol,
   food
 }
};  
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    width: 100%
    top:174px
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table;  // 使用table做垂直居中 
        height: 54px
        width: 56px
        padding: 12px 12px
        line-height 14px
        &.current
          position relative
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display : inline-block
          width : 12px
          height : 12px 
          margin-right : 2px
          vertical-align : top /* 设置对其方式 */
          background-size : 12px 12px
          background-repeat : no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text 
          display table-cell
          font-size : 12px  
          width 56
          text-align middle 
          border-1px(rgba(7, 17, 27, 0.1)) 

    .foods-wrapper
      flex: 1
      background: #FFF
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background  #f3f5f7
      .food-item
        display flex
        padding 18px
        border-1px(rgba(7, 17, 27, 0.1)) 
        &:last-child
          border-none()
          margin-bottom 0px
        .icon
          flex 0 0 57px /* 左侧宽度固定*/
          margin-right 10px
        .content
          flex 1 //右侧自适应
          .name
            font-size 17px
            margin 2px 0 8px 0
            height 17px
            line-height 17px
            color rgb(7,17,27)
          .desc, .extra
            font-size 10px
            line-height 12px
            color rgb(147,153,159)
          .desc
            margin-bottom 8px
          .extra
            line-height 10px
            .count
              margin-right 12px
          .price
            line-height 24px
            font-weight: 700
            .now
              margin-right 8px
              font-size 14px
              color rgb(240,20,20)
            .old 
               text-decoration line-through
               color rgb(147,153,159)
               font-size 10px
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 24px        
</style>
