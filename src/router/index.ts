import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HubView from '@/views/HubView.vue'
import ModuleView from '@/views/ModuleView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import PetView from '@/views/PetView.vue'
import RunnerView from '@/views/RunnerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView
    },
    {
      path: '/hub',
      name: 'hub',
      component: HubView
    },
    {
      path: '/module/:id',
      name: 'module',
      component: ModuleView
    },
    {
      path: '/pet',
      name: 'pet',
      component: PetView
    },
    {
      path: '/runner',
      name: 'runner',
      component: RunnerView
    }
  ]
})

export default router