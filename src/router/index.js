import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import DrugManagement from '../views/DrugManagement.vue'
import PurchaseManagement from '../views/PurchaseManagement.vue'
import SupplierView from '@/views/SupplierView.vue'

const routes = [
  {
    path: '/',
    component: App,
  },
  {
    path: '/drugs',
    name: 'Drugs',
    component: DrugManagement,
  },
  {
    path: '/orders',
    name: 'Orders',
    component: PurchaseManagement,
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    component: SupplierView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
