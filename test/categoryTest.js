var models = require("../schemas/models/models");
var categoryRoute = require("../routes/category");
var path = require("path");
var wagner = require("wagner-core");
var assert = require("assert");
var superagent = require("superagent");
var URL_ROOT = "http://localhost/3000/category";

describe("Category API", function() {
    var server;
    var Category;
    
    before(function() {
       var app = express();
       
       //Bootstrap server
       models(wagner);
       app.use("/category", categoryRoute(wagner));
       
       server = app.listen(3000);
       Category = models.Category;
    });
    
    after(function() {
        // Shut the server down when we're down
        server.close();
    });
    
    beforeEach(function(done) {
        // Make sure categories are empty before each test
        Category.remove({}, function(error) {
            assert.ifError(error);
            done();
        });
    });
    
    it("can load a category by id", function(done) {
        Category.create({ _id: 'Electronics' }, function(error, doc) {
           assert.ifError(error);
           var url = path.join(URL_ROOT, "/id/Electronics");
           superagent.get(url, function(error, res) {
               assert.ifError(error);
               var result;
               assert.doesNotThrow(function() {
                  result = JSON.parse(res.text); 
               });
               assert.ok(result.category);
               assert.equal(result.category._id, 'Electronics');
               done();
           });
        });
    });
});