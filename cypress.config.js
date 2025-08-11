const { defineConfig } = require('cypress')

module.exports = defineConfig({

  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
})