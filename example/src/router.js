import Vue from 'vue'
import Router from 'vue-router'
import route1 from './views/route1.vue'
import route2 from './views/route2.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'route1',
      component: route1
    },{
      path:'/1',
      name:'home2',
      component:route2
    }
  ]
})
