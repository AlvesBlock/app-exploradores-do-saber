import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HubView from '@/views/HubView.vue'
import ModuleView from '@/views/ModuleView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import PetView from '@/views/PetView.vue'
import RunnerView from '@/views/RunnerView.vue'
import { playerProfileService } from '@/services/playerProfile.service'

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
      component: HubView,
      meta: { requiresProfile: true }
    },
    {
      path: '/module/:id',
      name: 'module',
      component: ModuleView,
      meta: { requiresProfile: true }
    },
    {
      path: '/pet',
      name: 'pet',
      component: PetView,
      meta: { requiresProfile: true }
    },
    {
      path: '/runner',
      name: 'runner',
      component: RunnerView,
      meta: { requiresProfile: true }
    }
  ]
})

router.beforeEach((to) => {
  const hasProfile = playerProfileService.exists()

  if (to.meta.requiresProfile && !hasProfile) {
    return { name: 'onboarding' }
  }

  if (to.name === 'onboarding' && hasProfile) {
    return { name: 'hub' }
  }

  return true
})

export default router

