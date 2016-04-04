var Stripe = require("stripe");
var fx = require("./fx");
var fs = require("fs");

module.exports = function(wagner) {
    
    var Config = JSON.parse(fs.readFileSync('./config.json').toString());
    wagner.factory('Config', function() {
        return Config;
    });
    
    var stripe = Stripe(Config.stripeKey);
    wagner.factory("Stripe", function() {
        return stripe
    });
    
    wagner.factory("fx", fx);
}