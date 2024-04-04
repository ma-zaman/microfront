// Composables
import { createRouter, createWebHistory } from 'vue-router'
import ManageTenant from '@/views/ManageTenant.vue'
import ManageAcl from '@/views/ManageAcl.vue'
import ManageInstance from '@/views/ManageInstance.vue'
import NotFound from '@/views/NotFound.vue'
import AuthCallback from '@/views/Login.vue'

const routes = [
  {
    path: '/',
    redirect: '/tenants'
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthCallback
  },
  {
    path: '/tenants',
    name: 'ManageTenant',
    component: ManageTenant
  },
  {
    path: '/acls',
    name: 'ManageAcl',
    component: ManageAcl,
    props: true
  },
  {
    path: '/instances',
    name: 'ManageInstance',
    component: ManageInstance,
    props: true
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes
})

export default router
