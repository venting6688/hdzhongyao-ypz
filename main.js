import App from './App'
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from "./store";
import  login from './utils/login.js'
 
Vue.config.productionTip = false
Vue.prototype.$login = login
App.mpType = 'app'
const app = new Vue({
  ...App,
    store,

})
app.$mount()
