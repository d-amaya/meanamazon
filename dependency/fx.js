var superagent = require("superagent");
var _ = require("underscore");

module.exports = function () {
    var OPEN_EXCHANGE_RATES_KEY = process.env.OPEN_EXCHANGE_RATES_KEY || "3a73c6ec7270418a9d0a57c54a0c17af";
    var URL = `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_RATES_KEY}`;
    
    var rates = {
        USD: 1,
        EUR: 1.1,
        GBP: 1.5
    };
    
    var ping = function (callback) {
        superagent.get(URL, function (error, res) {
            if (error) {
                if (callback) {
                    callback();
                }
                return;
            }
            
            var results;
            try {
                results = JSON.parse(res.text);
                
                _.each(results.rates || {}, function (value, key) {
                    rates[key] = value;
                });
                
                console.log(JSON.stringify(rates));
                
                if (callback) {
                    callback(null, rates);
                }
            } catch (e) {
                if (callback) {
                    callback(e);
                }
            }
        });
    };
    
    setInterval(ping, 60 * 60 * 1000); // Hourly

    var ret = function () {
        return rates;
    }
    ret.ping = ping;
    return ret;
}