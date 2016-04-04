var controllers = require("./controllers");
var directives = require("./directives");
var services = require("./services");
var _ = require("underscore");

var components = angular.module("mean-retail.components", ['ng']);

_.each(services, function(service, name) {
   components.factory(name, service); 
});

_.each(controllers, function(controller, name) {
   components.controller(name, controller); 
});

_.each(directives, function(directive, name) {
   components.directive(name, directive); 
});

var app = angular.module("mean-retail", ["mean-retail.components", "ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider.
    when("/category/:category", {
        templateUrl: "/public/templates/category_view.html"
    }).
    when("/product/:id", {
        template: "<product-details></product-details>" 
    });
});

