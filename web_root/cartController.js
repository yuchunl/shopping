var appControllers = angular.module('appControllers');

// the manager page controller
appControllers.controller('cartController', ['$scope', 'item', function ($scope, item) {

	$scope.cartItems = [];

	var cart = {};
	if (cart = sessionStorage.getItem('cart')) {
		cart = JSON.parse(cart);
	} else {
		cart = {};
	}

	for (var upc in cart) {
		item.singleItem({upc: upc}).$promise.then(function (returnData) {
			returnData.quantity = cart[returnData.upc];
			console.log(returnData);
		    $scope.cartItems.push(returnData);
	    });
	}

	// could be change quantity, but removing feature
	$scope.removeItem = function (event, item) {
		var quantity = item.quantity;
		var title = item.title;
		var name = item.name;
		var category = item.category;
		var price = item.price;
		var upc = item.upc;
		var cart;

		//remove item, disabling change quantity
		quantity = 0;

		if (cart = sessionStorage.getItem('cart')) {
			cart = JSON.parse(cart);
			if (quantity === 0) {
				delete cart[item.upc];
			} else {
				cart[item.upc] = quantity;
			}
		} else {
			cart = {};
			if (quantity === 0) {
				delete cart[item.upc];
			} else {
				cart[item.upc] = quantity;
			}
		}

		for (var i = 0; i < $scope.cartItems.length; i++) {
			if ($scope.cartItems[i].upc === upc) {
				if (quantity === 0) {
					$scope.cartItems.splice(i, 1);
				} else {
					$scope.cartItems[i].quantity = quantity;
				}
			}
		}

		sessionStorage.setItem('cart', JSON.stringify(cart));

		$scope.alerts = [{type: 'success', msg: 'Removed item.'}];
	};

	$scope.closeAlert = function() {
    	$scope.alerts = [];
  	};


}]);