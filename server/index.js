const Service = require('./classes/Service');
const config = require('./config')

const service = new Service(config.port);

service.start();