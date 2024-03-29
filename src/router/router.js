import Home from '../views/Home.vue'
export default[
  {
    path: '/home',
    name: 'home',
    descript:'主页',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import(/* webpackChunkName: "about" */ '../components/layout/layout')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/menus',
    name: 'menus',
    component: () => import(/* webpackChunkName: "about" */ '../views/Menus.vue')
  },
  {
    path: '/subject',
    name: 'subject',
    component: () => import(/* webpackChunkName: "about" */ '../views/Subject.vue')
  },
  {
    path: '/add_subject',
    name: 'AddSubject',
    component: () => import(/* webpackChunkName: "about" */ '../views/AddSubject.vue')
  },
  {
    path: '/',
    redirect: '/login'
  }
]
