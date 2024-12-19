import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TeleprompterBox from '../TeleprompterBox.vue'

describe('TeleprompterBox', () => {
  it('renders properly', () => {
    const wrapper = mount(TeleprompterBox, { props: { script: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
