var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var categoryRoute = require('./routes/category');
var productRoute = require("./routes/product");
var userRoute = require("./routes/user");
var models = require("./schemas/models/models");

module.exports = function(wagner) {
    var app = express();

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    models(wagner);
    app.use("/category", categoryRoute(wagner));
    app.use("/product", productRoute(wagner));
    app.use("/user", userRoute(wagner));
    
    // catch 404 and forward to error handler
    /*app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.json({"message": err.message, "error": err});
        });
    }

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({"message": err.message, "error": {}});
    });*/
    
    return app;
}
