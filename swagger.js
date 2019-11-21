"use strict";

const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  info: {
    title: "iM node api", // Title (required)
    version: "1.0.0", // Version (required)
    description: "iM node api" // Description (optional)
  },
  schemes: ["http", "https"]
  // host: config.post.host // Host (optional)
  // basePath: "/" // Base path (optional)
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"]
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
