exports.userMenu = function() {
    return {
        controller: "UserMenuController",
        templateUrl: "/public/templates/user_menu.html"  
    };
};

exports.productDetails = function() {
    return {
        controller: "ProductDetailsController",
        templateUrl: "/public/templates/product_details.html"
    };
};

exports.categoryProducts = function() {
    return {
        controller: "CategoryProductsController",
        templateUrl: "/public/templates/category_products.html"    
    };
};

exports.categoryTree = function() {
    return {
        controller: "CategoryTreeController",
        templateUrl: "/public/templates/category_tree.html"    
    };
};

exports.navBar = function() {
    return {
        controller: "NavBarController",
        templateUrl: "/public/templates/nav_bar.html"    
    };
};

exports.addToCart = function() {
    return {
        controller: "AddToCartController",
        templateUrl: "/public/templates/add_to_cart.html"
    }
};