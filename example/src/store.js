import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		zoom: 0
	},
	mutations: {
		setZoom(state, value) {
			state.zoom = value;
		}
	},
	actions: {
	
	}
})
