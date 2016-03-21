var assert = require("assert");
var superagent = require("superagent");
var utilTest = require("../util/utilTest");

module.exports = function(wagner) {
    return function() {
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
    } 
}
