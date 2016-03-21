process.env.NODE_ENV = "testing";

var wagner = require("wagner-core");
var app = require("../app")(wagner);
var assert = require("assert");
var superagent = require("superagent");
var utilTest = require("./utilTest");
var status = require("http-status");

describe("Amazon Rest API", function () {
    var PRODUCT_ID = "000000000000000000000001";
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
            var categories = utilTest.categories();
            
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
    });
    
    describe("User API", function() {
        var URL = "http://localhost:3000/user";
        
        before("set up before any user test", wagner.invoke(function(Category, Product, User) {
            return function(done) {
                var categories = utilTest.categories();
                var products = utilTest.products();
                var users = utilTest.users();
                
                User.remove({}, function(error) {
                    assert.ifError(error);
                    Product.remove({}, function(error) {
                        assert.ifError(error);
                        Category.remove({}, function(error) {
                            
                            User.create(users, function(error, res) {
                                assert.ifError(error);
                                Category.create(categories, function(error) {
                                    assert.ifError(error);
                                    Product.create(products, function(error) {
                                        assert.ifError(error);
                                        done();
                                    });
                                }); 
                            });
                            
                        });
                    });
                });
            }   
        }));
        
        it("can save users cart", wagner.invoke(function(User) {
            return function(done) {
                superagent
                .put(`${URL}/me/cart`)
                .send({
                    data: {
                        cart: [{ product: PRODUCT_ID, quantity: 1 }]
                    }
                }).
                end(function(error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);
                    User.findOne({}, function(error, user) {
                        assert.ifError(error);
                        assert.equal(user.data.cart.length, 1);
                        assert.equal(user.data.cart[0].product, PRODUCT_ID);
                        assert.equal(user.data.cart[0].quantity, 1);
                        done();
                    });
                });
            };
        }));
        
        it("can load users cart", wagner.invoke(function(User) {
            return function(done) {
                User.findOne({}, function(error, user) {
                    assert.ifError(error);
                    user.data.cart = [{ product: PRODUCT_ID, quantity: 1 }];
                    user.save(function(error) {
                        assert.ifError(error);
                        superagent.get(`${URL}/me`, function(error, res) {
                            assert.ifError(error);
                            assert.equal(res.status, 200);
                            var result;
                            assert.doesNotThrow(function() {
                                //console.log(res.text);
                                result = JSON.parse(res.text).user; 
                                
                            });
                            assert.ok(result);
                            assert.equal(result.data.cart.length, 1);
                            assert.equal(result.data.cart[0].product.name, "Asus Zenbook Prime");
                            assert.equal(result.data.cart[0].quantity, 1);
                            done();
                        });
                    });
                }); 
            };
        }));
    });
})