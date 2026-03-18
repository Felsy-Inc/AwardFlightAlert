import { describe, it, expect } from 'vitest'
import { createMockProviderIngest } from '../../lib/providers/mockProvider'

describe('mock provider', () => {
  it('is deterministic with the same seed', () => {
    const a = createMockProviderIngest({ seed: 'seed-1', observations: 5 })
    const b = createMockProviderIngest({ seed: 'seed-1', observations: 5 })

    expect(a.observations.map((o) => o.fingerprintHash)).toEqual(
      b.observations.map((o) => o.fingerprintHash),
    )
  })

  it('does not crash when seed is undefined (uses default)', () => {
    expect(() => createMockProviderIngest({ seed: undefined, observations: 1 })).not.toThrow()
  })

  it('generates requested number of observations', () => {
    const r = createMockProviderIngest({ seed: 'seed-2', observations: 7 })
    expect(r.observations).toHaveLength(7)
  })
})

