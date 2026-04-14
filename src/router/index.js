import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Quiz from '../views/Quiz.vue'
import Loading from '../views/Loading.vue'
import Result from '../views/Result.vue'
import Suggestions from '../views/Suggestions.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { transition: 'fade' }
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome,
    meta: { transition: 'fade' }
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz,
    meta: { transition: 'slide-right' }
  },
  {
    path: '/loading',
    name: 'Loading',
    component: Loading,
    meta: { transition: 'fade' }
  },
  {
    path: '/result',
    name: 'Result',
    component: Result,
    meta: { transition: 'fade' }
  },
  {
    path: '/suggestions',
    name: 'Suggestions',
    component: Suggestions,
    meta: { transition: 'slide-right' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
