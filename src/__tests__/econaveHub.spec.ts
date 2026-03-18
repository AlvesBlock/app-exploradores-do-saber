import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const push = vi.fn()
const replace = vi.fn()
const toastAdd = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
    replace
  })
}))

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: toastAdd
  })
}))

import HubView from '@/views/HubView.vue'
import { gameModules } from '@/data/modules/modules.data'
import { playerProfileService } from '@/services/playerProfile.service'
import { econaveProgressService } from '@/services/econaveProgress.service'

describe('hub econave integration', () => {
  beforeEach(() => {
    push.mockReset()
    replace.mockReset()
    toastAdd.mockReset()
    localStorage.clear()
    playerProfileService.save({
      name: 'Bia',
      avatar: 'exploradora-espacial',
      stars: 0
    })
    econaveProgressService.clear()
  })

  it('renders the EcoNave hub card without removing the learning modules', () => {
    const wrapper = mount(HubView, {
      global: {
        stubs: {
          Button: {
            template: '<button><slot /></button>'
          },
          Toast: {
            template: '<div />'
          },
          MagicGalleryHubCard: {
            template: '<div />'
          },
          MagicGalleryUnlockOverlay: {
            template: '<div />'
          }
        }
      }
    })

    expect(wrapper.findAll('.module-card')).toHaveLength(gameModules.length)
    expect(wrapper.find('[data-test="hub-econave-card"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('EcoNave')
  })
})
