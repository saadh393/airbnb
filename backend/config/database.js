// backend/config/database.js
const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
    logging: true
  },
  production: {
    storage: process.env.DB_FILE,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logging: false,
    define: {
      // Remove the schema definition for SQLite
      // schema: process.env.SCHEMA  // Remove or comment out this line
    }
  }
};
