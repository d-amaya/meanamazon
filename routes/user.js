var express = require("express");
var status = require("http-status");
var bodyParser = require("body-parser");
var handleResponse = require("./util/handleResponse");

module.exports = function(wagner) {
    var router = express.Router();
    router.use(bodyParser.json());
    
    router.get("/me", function(req, res) {
       if (!req.user) {
           return res.status(status.UNAUTHORIZED).json({ error: "Not logged in." });
       }
       
       req.user.populate(
           { path: "data.cart.product", model: "Product" },
           handleResponse.handleOne.bind(null, "user", res)
       );
    });

    router.put("/me/cart", wagner.invoke(function (User) {
        return function(req, res) {
            try {
                var cart = req.body.data.cart;
            } catch (error) {
                return res.status(status.BAD_REQUEST).json({error: "No cart specified."});
            }
            
            req.user.data.cart = cart;
            req.user.save(function(error, user) {
                if (error) {
                    return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
                }
                res.status(status.OK).json({ user: user });
            });
        };
    }));
    
    return router;
}