import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  it('renders the router view shell', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: {
            template: '<div data-test="router-view"></div>'
          }
        }
      }
    })

    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
  })
})
