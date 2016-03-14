var status = require("http-status");

function handleOne (property, res, error, result) {
    if (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
    }
    
    if (!result) {
        return res.status(status.NOT_FOUND).json({ error: "Resource not found." })
    }
    
    var jsonResponse = {};
    jsonResponse[property] = result;
    res.json(jsonResponse);
}

function handleMany (property, res, error, result) {
    if (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
    }
    
    if (!result) {
        return res.status(status.NOT_FOUND).json({ error: "Resource not found." });
    }
    
    var jsonResponse = {};
    jsonResponse[property] = result;
    res.json(jsonResponse);
}

module.exports = {
    handleOne: handleOne,
    handleMany: handleMany
}