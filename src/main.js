import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.qqbot_url = process.env.NODE_ENV === 'development' ? "/qqbot" : "http://127.0.0.1:3000";
Vue.prototype.sohu_url = process.env.NODE_ENV === 'development' ? "/sohu" : "http://pv.sohu.com";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
