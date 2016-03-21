var express = require('express');
var path = require('path');
var logger = require('morgan');

var models = require("./schemas/models/models");
var dependencies = require("./dependency/dependencies");
var auth = require("./security/auth");

var categoryRoute = require('./routes/category');
var productRoute = require("./routes/product");
var userRoute = require("./routes/user");
var paymentRoute = require("./routes/payment");

module.exports = function(wagner) {
    var app = express();
    
    models(wagner);
    dependencies(wagner);
    wagner.invoke(auth, { app: app });
    
    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
    
    if (process.env.NODE_ENV === 'testing') {
        app.use(wagner.invoke(function (User) {
           return function(req, res, next) {
                User.findOne({}, function(error, user) {
                    req.user = user;
                    next(); 
                });
            }; 
       }));
    }
    
    app.use("/category", categoryRoute(wagner));
    app.use("/product", productRoute(wagner));
    app.use("/user", userRoute(wagner));
    app.use("/payment", paymentRoute(wagner));
    
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
