var wagner = require("wagner-core");
var app = require("../app")(wagner);
var assert = require("assert");
var superagent = require("superagent");

describe("Amazon Rest API", function (){
    var server;
    
    before(function() {
       server = app.listen(3000);
    });

    after(function() {
        server.close();
    });

    describe("Category API", function() {
        var URL = "http://localhost:3000/category";
        
        beforeEach(wagner.invoke(function(Category) {
            return function(done) {
                Category.remove({}, function(error) { 
                    assert.ifError(error);
                    done();
                });
            };
        }));
        
        it("can load a category by id", wagner.invoke(function(Category) {
            return function(done) {
                Category.create({ _id: 'Electronics' }, function(error, doc) { 
                    assert.ifError(error);
                    superagent.get(`${URL}/id/Electronics`, function(error, res) {
                        assert.ifError(error);
                        var result;
                        assert.doesNotThrow(function() {
                            result = JSON.parse(res.text); 
                        });
                        assert.ok(result.category);
                        assert.equal(result.category._id, "Electronics");
                        done();
                    });
                });
            };
        }));
        
        it("can load all categories that have a certain parent", wagner.invoke(function(Category) {
            return function(done) {
            var categories = [
                { _id: "Electronics" },
                { _id: "Phones", parent: "Electronics" },
                { _id: "Laptops", parent: "Electronics" },
                { _id: "Bacon" }
            ];
            
            Category.create(categories, function(error, categories) {
                superagent.get(`${URL}/parent/Electronics`, function(error, res) {
                    assert.ifError(error);
                    var result;
                    assert.doesNotThrow(function() {
                        result = JSON.parse(res.text);
                    });
                    assert.equal(result.categories.length, 2);
                    assert.equal(result.categories[0]._id, "Laptops");
                    assert.equal(result.categories[1]._id, "Phones");
                    done();
                });
            });
            
            };
        }));
    });
    
    describe("Product API", function() {
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
                var PRODUCT_ID = "000000000000000000000001";
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
                var categories = [
                    { _id: "Electronics" },
                    { _id: "Phones", parent: "Electronics" },
                    { _id: "Laptops", parent: "Electronics" },
                    { _id: "Bacon" }
                ];
                
                var products = [
                    {
                        name: "LG G4",
                        category: { _id: "Phones", ancestors: ["Electronics", "Phones"] },
                        price: { amount: 300, currency: "USD" }
                    },
                    {
                        name: "Asus Zenbook Prime",
                        category: { _id: "Laptops", ancestors: ["Electronics", "Laptops"] },
                        price: { amount: 2000, currency: "USD" }
                    },
                    {
                        name: "Flying Pigs Farm Posture Raised Pork Baicon",
                        category: { _id: "Bacon", ancestors: ["Bacon"] },
                        price: { amount: 20, currency: "USD" }
                    },
                ];
                
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
    })
})