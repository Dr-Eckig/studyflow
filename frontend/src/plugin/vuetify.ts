import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import {
  VApp,
  VBtn,
  VChip,
  VCheckbox,
  VIcon,
  VProgressCircular,
  VProgressLinear,
  VSelect,
  VTextarea,
  VTextField,
} from 'vuetify/components'
import * as directives from 'vuetify/directives'

const components = {
  VApp,
  VBtn,
  VIcon,
  VProgressCircular,
  VProgressLinear,
  VChip,
  VCheckbox,
  VSelect,
  VTextField,
  VTextarea,
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#274C77',
          secondary: '#666666',
          success: '#44633F',
          error: '#C1121F',
          warning: '#BF6900',
          info: '#2196F3',
          background: '#fafaff',
          text: '#000000',
          border: 'rgba(228, 228, 228, 0.1)',
          shadow: 'rgb(212, 210, 210)',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#AFCBFF',
          secondary: '#D3D3D3',
          success: '#99D98C',
          error: '#FF6B6B',
          warning: '#FFB347',
          info: '#2196F3',
          background: '#181818',
          text: '#000000',
          border: 'rgba(99, 99, 99, 0.1)',
          shadow: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
})
