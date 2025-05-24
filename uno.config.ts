import { createExternalPackageIconLoader } from '@iconify/utils/lib/loader/external-pkg'

import { presetNimiq } from 'nimiq-css'
import { defineConfig, presetIcons } from 'unocss'
import { presetOnmax } from 'unocss-preset-onmax'

export default defineConfig({
  presets: [
    presetOnmax(),
    presetNimiq({
      utilities: true,
      fonts: false,
      attributifyUtilities: true,
      typography: true,
    }),

    presetIcons({
      collections: {
        ...createExternalPackageIconLoader('nimiq-icons'),
      },
    }),
  ],
})
