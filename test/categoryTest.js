var models = require("../schemas/models/models");
var categoryRoute = require("../routes/category");
var wagner = require("wagner-core");
var app = require("../app")(wagner);
var express = require("express");
var assert = require("assert");
var superagent = require("superagent");

describe("Category API", function() {
    var URL_ROOT = "http://localhost:3000/category";
    var server; 
    
    before(function() {
       server = app.listen(3000);
    });
    
    after(function() {
        server.close();
    });
    
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
                superagent.get(`${URL_ROOT}/id/Electronics`, function(error, res) {
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
             superagent.get(`${URL_ROOT}/parent/Electronics`, function(error, res) {
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