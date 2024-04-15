// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  routeRules: {
    '/task/**': {
      proxy: { to: "http://taskmanager.test/task/**", },
    }
  },
  // vite: {
  //   server: {
  //     watch: {
  //       usePolling: true,
  //       interval: 100, // Poll files every 100ms
  //     },
  //   }
  // }
})
