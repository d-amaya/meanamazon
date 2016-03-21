var assert = require("assert");
var superagent = require("superagent");
var utilTest = require("../util/utilTest");

module.exports = function(wagner, PRODUCT_ID) {
    return function() {
        var URL = "http://localhost:3000/product";
        
        beforeEach("delete before any test", wagner.invoke(function(Product, Category) {
            return function(done) {
                Product.remove({}, function(error) {
                    assert.ifError(error);
                    Category.remove({}, function(error) {
                        assert.ifError(error);
                        done();
                    });
                });   
            };
        }));
        
        it("can load a product by id", wagner.invoke(function(Product) {
            return function(done) {
                var product = {
                    _id: PRODUCT_ID, 
                    name: "LG4", 
                    price: {
                        amount: 300, 
                        currency: "USD"
                    }
                };
                
                Product.create(product, function(error, doc) {
                    assert.ifError(error);
                    superagent.get(`${URL}/id/${PRODUCT_ID}`, function(error, res) {
                        assert.ifError(error);
                        var result;
                        assert.doesNotThrow(function() {
                            result = JSON.parse(res.text);
                        });
                        assert.ok(result);
                        assert.equal(result.product._id, PRODUCT_ID);
                        assert.equal(result.product.name, "LG4");
                        
                        done();
                    });
                });
            };
        }));
        
        it("can load all products in a category with sub-categories", wagner.invoke(function(Category, Product) {
            return function(done) {
                var categories = utilTest.categories();
                var products = utilTest.products();
                
                Category.create(categories, function(error, categories) {
                    assert.ifError(error);
                    Product.create(products, function(error, products) {
                        assert.ifError(error);
                        superagent.get(`${URL}/category/Electronics`, function(error, res) {
                            var result;
                            assert.ifError(error);
                            assert.doesNotThrow(function() {
                                result = JSON.parse(res.text); 
                            });
                            assert.ok(result);
                            assert.equal(result.products.length, 2);
                            assert.equal(result.products[0].name, "Asus Zenbook Prime");
                            assert.equal(result.products[1].name, "LG G4");

                            superagent.get(`${URL}/category/Electronics?price=1`, function(error, res) {
                                var result;
                                assert.ifError(error);
                                assert.doesNotThrow(function() {
                                    result = JSON.parse(res.text); 
                                });
                                assert.ok(result);
                                assert.equal(result.products.length, 2);
                                assert.equal(result.products[0].name, "LG G4");
                                assert.equal(result.products[1].name, "Asus Zenbook Prime");

                                done();
                            });
                        });
                    });
                });
            };
        }));
    }
}