
var status = require("http-status");
var express = require("express");

module.exports = function(wagner) {
    var router = express.Router();
    
    router.get("/id/:id", wagner.invoke(function(Category) {
        return function (req, res) {
            Category.findOne({ _id: req.params.id }, function(error, category) {
                if (error) {
                    return res.
                            status(status.INTERNAL_SERVER_ERROR).
                            json({ error: error.toString() });
                }
                
                if (!category) {
                    return res.
                            status(status.NOT_FOUND).
                            json({ error: 'Category not found.' });
                }
                
                res.json({ category: category });
            });  
        };
    }));

    router.get("/parent/:id", wagner.invoke(function(Category) {
        return function(req, res) { 
            Category.
            find({ parent: req.params.id }).
            sort({ _id: 1 }).
            exec(function(error, categories) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString() });                     
                }
                res.status(status.OK).json({ categories: categories });
            });   
        }
    }));
    
    return router;
}
