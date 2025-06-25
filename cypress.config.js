const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // your frontend URL
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
    specPattern: "cypress/e2e/**/*.cy.js", // path to your test files
    supportFile: "cypress/support/e2e.js", // auto-loaded support file
  },
});
