exports.UserMenuController = function($scope, $user) {
    $scope.user = $user;
    
    setTimeout(function() {
        $scope.$emit("UserMenuController");
    }, 0);
};

exports.ProductDetailsController = function($scope, $routeParams, $http) {
    var encoded = encodeURIComponent($routeParams.id);  
    
    $http.
    get("/product/id/" + encoded).
    success(function(data) {
       $scope.product = data.product; 
    });
    
    setTimeout(function() {
       $scope.$emit("ProductDetailsController"); 
    }, 0); 
};

exports.CategoryTreeController = function($scope, $routeParams, $http) {
    var encoded = encodeURIComponent($routeParams.category)
    
    $http.
    get("/category/id/" + encoded).
    success(function(data) {
        $scope.category = data.category
        $http.
        get("/category/parent/" + encoded).
        success(function() {
            $scope.children = data.categories;
        });
    });
    
    setTimeout(function() {
        $scope.$emit("CategoryTreeController");
    }, 0)
};

exports.CategoryProductsController = function($scope, $routeParams, $http) {
    var encoded = encodeURIComponent($routeParams.category);
    
    $scope.price = undefined;
    
    $scope.handlePriceClick = function() {
        if ($scope.price === undefined) {
            $scope.price = -1;
        } else {
            $scope.price = 0 - $scope.price;
        }
        $scope.load();
    };
    
    $scope.load = function() {
        var queryParams = { price: $scope.price };
        
        $http.
        get("/product/category/" + encoded, { params: queryParams }).
        success(function(data) {
           $scope.products = data.products; 
        });
    };
    
    $scope.load();
    
    setTimeout(function() {
        $scope.$emit("CategoryProductsController");
    }, 0);
};

exports.AddToCartController = function($scope, $http, $user, $timeout) {
    $scope.addToCart = function(product) {
        var obj = { product: product._id, quantity: 1 };
        $user.user.data.cart.push(obj); 
        
        $http.
        put("/user/me/cart", { data: { cart: $user.user.data.cart } }).
        success(function(data) {
            $user.loadUser();
            $scope.success = true;
            
            $timeout(function() {
                $scope.success = false;
            }, 5000)
        });   
    }; 
};