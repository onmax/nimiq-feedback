import process from 'node:process'
import { defineNuxtConfig } from 'nuxt/config'
import { object, optional, string } from 'valibot'

// Define runtime config schema for validation
const runtimeConfigSchema = object({
  github: object({
    owner: string(),
    repo: string(),
    token: string(),
  }),
  slack: object({
    webhookUrl: optional(string()),
  }),
  productionUrl: string(),
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-05-05',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxthub/core',
    'reka-ui/nuxt',
    '@unocss/nuxt',
    '@nuxt/scripts',
    'nuxt-safe-runtime-config',
  ],
  future: { compatibilityVersion: 4 },

  unocss: {
    configFile: './uno.config.ts',
  },

  eslint: {
    config: {
      standalone: false,
      autoInit: false,
    },
  },

  hub: {
    database: true,
    blob: true,
    kv: true,
  },

  runtimeConfig: {
    github: {
      owner: process.env.NUXT_GITHUB_OWNER,
      repo: process.env.NUXT_GITHUB_REPO,
      token: process.env.NUXT_GITHUB_TOKEN,
    },
    slack: {
      webhookUrl: process.env.NUXT_SLACK_WEBHOOK_URL,
    },
    productionUrl: process.env.NUXT_PRODUCTION_URL,
  },

  safeRuntimeConfig: {
    $schema: runtimeConfigSchema,
  },

  typescript: {
    tsConfig: {
      include: ['./app/types.d.ts'],
    },
  },

  watch: ['~~/../widget/**/*.{ts,vue,js,css}'],

  routeRules: {
    '/widget.js': {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/javascript',
      },
      cache: { maxAge: 3600 }, // Cache for 1 hour
      static: true,
    },
    '/widget.css': {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/css',
      },
      cache: { maxAge: 3600 }, // Cache for 1 hour
      static: true,
    },
    '/api/feedback': {
      // we do also have a rate limit middleware in the server/middleware/rate-limit.ts file
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    },
  },
})
