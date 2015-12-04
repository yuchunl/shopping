var appControllers = angular.module('appControllers');

appControllers.controller('shopController', ['$scope', 'item', function ($scope, item) {


	// function that the table calls to get its data
  	$scope.updateFromServer = function updateFromServer(table) {

	    $scope.isLoading = true;

	    var pagination = table.pagination;

	    var start;

	    if (!pagination.start || pagination.start == 0) {
	    	start = 0;
	    } else {
	    	start = pagination.start + 10; // this is for a bug where the page start is always resseting to 10 items per page
	    }
	    var amount = 20; // 20 items per page

	    if (table.sort.predicate && (!table.search.predicateObject || (Object.keys(table.search.predicateObject).length === 0))) {
	    	// promises are hard to explain, but basically its like a callback
	    	item.rangeWithPredicate({start: start, amount: amount, sort: table.sort.predicate, reverse: table.sort.reverse}).$promise.then(function (returnData) {
	    		$scope.displayed = returnData.data;
		    	$scope.isLoading = false;
		    	table.pagination.numberOfPages = returnData.count / amount;
		    	updateScopeQuantities($scope);
	    	});
	    } else if (table.sort.predicate && table.search.predicateObject && (Object.keys(table.search.predicateObject).length > 0)) {
	    	var titleSearch = '#',
	    		nameSearch = '#',
	    		categorySearch = '#';

	    	if (table.search.predicateObject['title']) {
	    		titleSearch = table.search.predicateObject['title'];
	    	}

	    	if (table.search.predicateObject['name']) {
	    		nameSearch = table.search.predicateObject['name'];
	    	}

	    	if (table.search.predicateObject['category']) {
	    		categorySearch = table.search.predicateObject['category'];
	    	}

	    	item.rangeWithPredicateAndSearch({start: start, amount: amount, sort: table.sort.predicate,
	    		reverse: table.sort.reverse, titleSearch: titleSearch, nameSearch: nameSearch,
	    		categorySearch: categorySearch}).$promise.then(function (returnData) {
	    			
	    		$scope.displayed = returnData.data;
		    	$scope.isLoading = false;
		    	table.pagination.numberOfPages = returnData.count / amount;
		    	updateScopeQuantities($scope);
	    	});
	    } else {
	    	item.range({start: start, amount: amount}).$promise.then(function (returnData) {
	    		$scope.displayed = returnData.data;
		    	$scope.isLoading = false;
		    	table.pagination.numberOfPages = returnData.count / amount;
		    	updateScopeQuantities($scope);
	    	});
	    }
	};

	$scope.addToCart = function (event, item) {
		var quantity = item.quantity;
		var title = item.title;
		var name = item.name;
		var category = item.category;
		var price = item.price;
		var stock = item.stock;
		var cart;

		if (quantity > stock) {
			$scope.alerts = [{type: 'danger', msg: 'Oh no. We don\'t have that many in stock. Please accept the new quantity below.'}];
			if (!stock) {
				stock = 0;
			}
			item.quantity = stock;
			item.warn = true;
		} else {
			item.warn = false;

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

			sessionStorage.setItem('cart', JSON.stringify(cart));

			$scope.alerts = [{type: 'success', msg: 'Successfully added to cart.'}];
		}
		


		//COMPLETE
    };

    //remove item from shopping cart
	$scope.removeItem = function (index) {
		$scope.shopcartList.splice(index, 1);
	};

	//sum the total price
	$scope.listTotal = function () {
		var ret = 0;
		$scope.shopcartList.forEach(function (item, index) {
	 	 ret += item.totalPrice();
		});
		return ret;
	};

	$scope.closeAlert = function() {
    	$scope.alerts = [];
  	};

}]);

function updateScopeQuantities (scope) {
	var cart = {};
	if (cart = sessionStorage.getItem('cart')) {
		cart = JSON.parse(cart);
	} else {
		cart = {};
	}

	sessionStorage.setItem('cart', JSON.stringify(cart));

	for (var i = 0; i < scope.displayed.length; i++) {
		if (cart[scope.displayed[i].upc]) {
			scope.displayed[i].quantity = cart[scope.displayed[i].upc];
		} else {
			scope.displayed[i].quantity = 0;
		}
	}
}