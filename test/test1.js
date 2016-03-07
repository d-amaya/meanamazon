var superagent = require("superagent");
var app = require("../app");
var assert = require("assert");

describe("server", function() {
    var server;
    
    beforeEach(function() {
        server = app.listen(3001);
    });
    
    afterEach(function() {
        server.close();
    });
    
    it("prints out 'Hello, world!' when user goes to /users", function(done) {
        superagent.get("http://localhost:3001/users", function(error, res) {
            assert.ifError(error);
            assert.equal(res.status, 200);
            assert.equal(res.body.message, "Hello, world!!");
            done();
        });
    });
});
