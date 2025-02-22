// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxtjs/google-fonts'],
  ssr: false,

  imports: {
    autoImport: false,
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  googleFonts: {
    families: {
      'EB Garamond': [400],
    },
  },
})
