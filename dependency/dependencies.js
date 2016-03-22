var Stripe = require("stripe");
var fx = require("./fx");

module.exports = function(wagner) {
    
    var stripe = Stripe(process.env.STRIPE_API_KEY || "sk_test_LE4K1LXkLOYy5cIkfs15DlU3");
    wagner.factory("Stripe", function() {
        return stripe;
    });
    
    wagner.factory("fx", fx);
    
    return {
        Stripe: stripe
    };
}