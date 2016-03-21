process.env.NODE_ENV = "testing";

var wagner = require("wagner-core");
var app = require("../app")(wagner);

var categoryTest = require("./scenario/categoryTest");
var productTest = require("./scenario/productTest");
var userTest = require("./scenario/userTest");

describe("Amazon Rest API", function () {
    var PRODUCT_ID = "000000000000000000000001";
    var server;
    
    before(function() {
       server = app.listen(3000);
    });

    after(function() {
        server.close();
    });

    describe("Category API", categoryTest(wagner));
    describe("Product API", productTest(wagner, PRODUCT_ID));
    describe("User API", userTest(wagner, PRODUCT_ID));
})