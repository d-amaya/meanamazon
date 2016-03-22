var assert = require("assert");
var superagent = require("superagent");
var status = require("http-status");
var utilTest = require("../util/utilTest");

module.exports = function(wagner, PRODUCT_ID) {
    return function() {
        var URL = "http://localhost:3000";
        
        beforeEach("set up before any user test", wagner.invoke(function(Category, Product, User) {
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
                .put(`${URL}/user/me/cart`)
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
                        superagent.get(`${URL}/user/me`, function(error, res) {
                            assert.ifError(error);
                            assert.equal(res.status, status.OK);
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
        
        it("can checkout", wagner.invoke(function(User, Stripe) {
            return function(done) {
                this.timeout(6000);
                
                User.findOne({}, function(error, user) {
                    assert.ifError(error);
                    user.data.cart = [{ product: PRODUCT_ID, quantity: 1 }];
                    user.save(function(error) {
                        assert.ifError(error);
                        
                        superagent.
                        post(`${URL}/payment/checkout`).
                        send({
                            //Fake stripe credentials. StripeToken can be a real credit card
                            //credentials. In production it'll be an encrypted token.
                            stripeToken: {
                                number: "4242424242424242",
                                cvc: "123",
                                exp_month: "12",
                                exp_year: "2016"
                            }
                        }).
                        end(function(error, res) {
                            assert.ifError(error);
                            
                            assert.equal(res.status, status.OK);
                            var result;
                            assert.doesNotThrow(function() {
                               result = JSON.parse(res.text); 
                            });
                            assert.ok(result.id);
                            
                            Stripe.charges.retrieve(result.id, function(error, charge) {
                               assert.ifError(error);
                               assert.ok(charge);
                               assert.equal(charge.amount, 2000 * 100);
                               done(); 
                            });
                        })
                    })
                })
            }
        }));
    }
}