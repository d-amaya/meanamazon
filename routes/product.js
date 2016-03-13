var express = require("express");
var status = require("http-status");

module.exports = function (wagner) {
    var router = express.Router();
    
    router.get("/id/:id", wagner.invoke(function (Product) {
        return function (req, res) {
            Product.findOne({ _id: req.params.id }, handleOne.bind(null, "product", res));
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
                   .sort(sort).exec(handleMany.bind(null, "products", res));   
        };
        
    }));
    
    function handleOne (property, res, error, result) {
        if (error) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
        }
        
        if (!result) {
            return res.status(status.NOT_FOUND).json({ error: "Resource not found." })
        }
        
        var jsonResponse = {};
        jsonResponse[property] = result;
        res.json(jsonResponse);
    }
    
    function handleMany (property, res, error, result) {
        if (error) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
        }
        
        if (!result) {
            return res.status(status.NOT_FOUND).json({ error: "Resource not found." });
        }
        
        var jsonResponse = {};
        jsonResponse[property] = result;
        res.json(jsonResponse);
    }
    
    return router;
}