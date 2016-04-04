var mongoose = require("mongoose");
var Category = require("./category");

module.exports = function (db, fx) {
    
    var productSchema = {
        name : { type: String, required : true },
        pictures: [{ type: String, match: /^http:\/\//i }],
        price: {
            amount: { 
                type: Number, 
                required: true,
                set: function(v) {
                    this.internal.approximatePriceUSD = v / (fx()[this.price.currency] || 1);
                    return v;
                }
            },
            currency: { 
                type: String,
                enum: ['USD', 'EUR', 'GBP'],
                required: true,
                set: function(v) {
                    this.internal.approximatePriceUSD = this.price.amount / (fx([v] || 1));
                    return v;
                }
            }
        },
        category: Category.categorySchema,
        internal : {
            approximatePriceUSD: { type: Number }
        }
    };

    var schema = new mongoose.Schema(productSchema);
    schema.index({ name : "text" });
    
    var currencySimbols = { "USD": "$", "EUR": "€", "GBP": "£" };
    schema.virtual("displayPrice").get(function() {
        return currencySimbols[this.price.currency] + this.price.amount;
    });
    
    schema.set("toObject", { virtuals: true });
    schema.set("toJson", { virtuals: true });
    
    return db.model("Product", schema, "products");
}