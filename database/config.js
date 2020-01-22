const mongoose = require('mongoose');

module.exports = function(config) {
    const mongoConnectionString = config.get('mongoDbConnectionString');

    mongoose.connect(mongoConnectionString, { useNewUrlParser: true });

    mongoose.connection.on('error', console.error.bind(console, 'Connection error - '));
    mongoose.connection.once('open', () => console.log.bind(console, 'Connected successfully to MongoDb!'));
};
