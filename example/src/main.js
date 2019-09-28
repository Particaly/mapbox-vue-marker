import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxvuemarker from 'mapbox-vue-marker'

let plugOptions = {
  mapboxgl,router,store,
  // 可通过rename修改默认的方法名
  // rename:{
  //   '$addMarker':'addMK',
  //   '$removeMarker':'delMk',
  //   '$makeMarker':'makeMK'
  // }
}

Vue.use(mapboxvuemarker,plugOptions)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
