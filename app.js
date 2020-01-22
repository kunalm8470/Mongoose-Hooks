const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/userRoute');
require('./database/config')(config);

const app = express();
const appPort = config.get('port') || 4000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse cookie header
app.use(cookieParser());

// Set default view engine
app.set('view engine', 'ejs');

// Mount user route
app.use('/', userRoute);

app.use((req, res, next) => {
    const error = new Error('Resource not found at path ' + req.originalUrl);
    error.status = 404;
    return next(err);
});

app.use((err, req, res, next) => {
    return res.status(err.status || 500)
              .json({
                  error: {
                      message: err.message
                  }
              });
});

app.listen(appPort, () => console.log(`Server started at http://localhost:${appPort}`));