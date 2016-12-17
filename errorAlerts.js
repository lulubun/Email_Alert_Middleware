'use strict';

const  {logger} = require('./utilities/logger');
const {sendEmail} = require('./emailer');

const {ALERT_FROM_EMAIL, ALERT_FROM_NAME, ALERT_TO_EMAIL} = process.env;
if(!(ALERT_FROM_EMAIL && ALERT_FROM_NAME && ALERT_TO_EMAIL)) {
  logger.error('Missing required config var in `.env`');
}

const middlewareAlert = (errorTypes) => (err, req, res, next) => {
  if ((errorTypes).find(eType => err instanceof eType) !== undefined) {
    logger.info(`Attempting to send error alert email to ${ALERT_TO_EMAIL}`);
    const data = {
      'FromEmail': ALERT_FROM_EMAIL,
      'FromName': ALERT_FROM_NAME,
      'Subject': `Service Alert: ${err.name}`,
      'TextPart': `Something went wrong. Here's what we know: \n\n${err.message}\n\n${err.stack}`,
      'Recipients': [{'Email': ALERT_TO_EMAIL},]
    };
    sendEmail(data);
  }
  next(err);
  
};

module.exports = {middlewareAlert};

