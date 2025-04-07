// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    footData: {},
	department:{},
	footList:[],
	showState:true,   //切换就诊人后需要重新渲染页面
	showModalState:false, //登录、绑卡弹窗
	loginValue:false, //登录、绑卡数据
  },
  mutations: {
	SET_LOGIN_VALUE(state, newValue) {
	  state.showModalState = newValue
	},
	SET_SHOW_MODAL_STATE(state, newValue) {
	  state.showModalState = newValue
	},
    SET_FOOT_DATA(state, newValue) {
      state.footData = newValue
    },
	SET_SHOW_STATE(state, value){
		state.showState = value
	},
	SET_DEPARTMENT(state, msg) {
		state.department = msg
	}
  },
  actions: {
  }
});
