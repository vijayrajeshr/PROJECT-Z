var logger = null; //initialize logger
const { dataLogger, notifyLogger } = require("./dataLogger.js");

if (process.env.NODE_ENV !== "production") {
  logger = dataLogger();
  notify = notifyLogger();
}
else {  // condition added for deployment purpose 
  logger = dataLogger();
  notify = notifyLogger();
}

module.exports = { logger, notify };
