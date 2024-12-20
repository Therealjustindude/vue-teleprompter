import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import VideoStream from '../VideoStream.vue'

describe('VideoStream', () => {
  it('renders the video element', () => {
    const wrapper = mount(VideoStream)

    const video = wrapper.find('video')
    expect(video.exists()).toBe(true)
    expect(video.attributes('id')).toBe('video-stream')
  })
})
