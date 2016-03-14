var express = require("express");
var status = require("http-status");
var handleResponse = require("./util/handleResponse");

module.exports = function (wagner) {
    var router = express.Router();
    
    router.get("/id/:id", wagner.invoke(function (Product) {
        return function (req, res) {
            Product.findOne({ _id: req.params.id }, handleResponse.handleOne.bind(null, "product", res));
        };
    }));
    
    router.get("/category/:id", wagner.invoke(function (Product) {
        return function(req, res) {
            var sort;
            
            if (req.query.price === "1") {
                sort = { "internal.approximatePriceUSD": 1 };
            } else if (req.query.price === "-1") {
                sort = { "internal.approximatePriceUSD": -1 };
            } else {
                sort = { name: 1 }
            }
            
            Product.find({ "category.ancestors": req.params.id })
                   .sort(sort).exec(handleResponse.handleMany.bind(null, "products", res));   
        };
        
    }));
    
    return router;
}