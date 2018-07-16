// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
/* 第三方插件用块的方式去引用的时候要去注册 */
import VueResource from 'vue-resource';
/* import需要用的路由组件 */
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';
/* 引入样式 index.styl 在webpack-base中国配置alias 加入common：，之后就不用加./了 */
/* 修改webpack要重新编译 */
import './common/stylus/index.styl';
Vue.config.productionTip = false;
/* 类似于全局注册 */
Vue.use(VueRouter);
Vue.use(VueResource);
/* eslint-disable no-new */
// 定义路由
let routes = [
  {
    path: '/', 
    name: 'index', 
    component: App, 
    children: [
      {path: '/goods', component: goods}, 
      {path: '/ratings', component: ratings},
      {path: '/seller', component: seller}]
  }
];
// 创建router实例,创建实例的时候是可以传一些配置进去
let router = new VueRouter({
  'linkActiveClass': 'active', // 此处默认active链接为红色 
   routes // （缩写）相当于 routes: routes
});
// 创建和挂载实例，记得要通过router配置的参数注入路由，从而让整个应用都拥有路由功能
const app = new Vue({
  router
}).$mount('#app');
//router.push('/goods'); // 默认进入商家页面
// /////////
export default app;
/*
new Vue({
  el: '#app',
  components: { App },
  // template: '<App/>'
  router: router
});
*/
