import { describe, expect, it } from 'vitest'
import router from '@/router'

describe('econave route', () => {
  it('registers the new protected route in the router', () => {
    const econaveRoute = router.getRoutes().find((route) => route.name === 'econave')

    expect(econaveRoute?.path).toBe('/econave')
    expect(econaveRoute?.meta.requiresProfile).toBe(true)
  })
})
