import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import User from '@/views/User'
import RoleList from '@/views/RoleList'
import Roleuser from '@/views/Roleuser'

Vue.use(Router)


export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: User
        },
        {
          name: 'rolelist',
          path: '/rolelist',
          component: RoleList
        },
        {
          name: 'roleuser',
          path: '/roleuser',
          component: Roleuser
        }
      ]
    }
  ]
})
