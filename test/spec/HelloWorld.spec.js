import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import HelloWorld from '../../src/components/HelloWorld.vue'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')
const template = '<v-layout><hello-world></hello-world></v-layout>'
test('mount component', () => {
  expect(HelloWorld).toBeTruthy()
  const wrapper = mount({
    template
  }, {
    props: {
      msg: 'Hello from Vitest'
    },
    global: {
      components: {
        HelloWorld,
      },
      plugins: [vuetify],
    }
  })

  expect(wrapper.html()).toContain('Vitest')
})
test('displays message', () => {
  const wrapper = mount({
    template
  }, {
    props: {},
    global: {
      components: {
        HelloWorld,
      },
      plugins: [vuetify],
    }
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Components')
})
