var Stripe = require("stripe");

module.exports = function(wagner) {
    var stripe = Stripe("sk_test_LE4K1LXkLOYy5cIkfs15DlU3" /*process.env.STRIPE_API_KEY*/);
    
    wagner.factory("Stripe", function() {
        return stripe;
    });
    
    return {
        Stripe: stripe
    };
}