var mongoose = require("mongoose");
var Category = require("./category");
var fx = require("./helper/fx");

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

module.exports = schema;
module.exports.productSchema = productSchema;