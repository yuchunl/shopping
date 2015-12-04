var appControllers = angular.module('appControllers');

appControllers.controller('checkoutController', ['$scope', 'item', 'purchaseService', function ($scope, item, purchaseService) {

	$scope.cartItems = [];

	$scope.totalBill = 0;

	$scope.years = [];
	$scope.months = [];

	for (var i = 2015; i < 2026; i++) {
		$scope.years.push({name: i});
	}
	for (var i = 0; i < 12; i++) {+
		$scope.months.push({name: i+1});
	}


	var cart = {};
	if (cart = sessionStorage.getItem('cart')) {
		cart = JSON.parse(cart);
	} else {
		cart = {};
	}

	var totalQuantity = 0;
	for (var upc in cart) {
		console.log(upc);
		item.singleItem({upc: upc}).$promise.then(function (returnData) {
			returnData.quantity = cart[returnData.upc];
			console.log("Key: " + returnData.upc);
			console.log("Value: " + cart[returnData.upc]);
			totalQuantity = totalQuantity + cart[returnData.upc]; //caculate the total quantity
			console.log(totalQuantity);
			$scope.totalBill = $scope.totalBill + (returnData.price * returnData.quantity);
		    $scope.cartItems.push(returnData);
	    });
	}

	$scope.closeAlert = function() {
    	$scope.alerts = [];
  	};
	
	$scope.purchase = function () {
		console.log($scope.cardNumber);
		console.log($scope.cardMonth);
		console.log($scope.cardYear);

		var parsedCardNumber = $scope.cardNumber;
		var cardMonth = $scope.cardMonth;
		var cardYear = $scope.cardYear;

		if (!parsedCardNumber) {
			$scope.alerts = [{type: 'danger', msg: 'Please enter a valid credit card number.'}];
		} else if (parsedCardNumber.toString().length != 16) {
			$scope.alerts = [{type: 'danger', msg: 'Card number must be 16 digits.'}];
		} else if (!cardMonth) {
			$scope.alerts = [{type: 'danger', msg: 'Please enter a card expiry month.'}];
		} else if (!cardYear) {
			$scope.alerts = [{type: 'danger', msg: 'Please enter a card expiry year.'}];
		} else {
			// @TODO WE NEED TO PURCHASE ITEMS HERE

			
			purchaseService.maxReceiptId({}).$promise.then(function(returnData) {

                $scope.returnIdData = returnData;

                // Create a receiptId
                var maxReceiptId = $scope.returnIdData[0]['MAX(receiptId)'];
                var currReceiptId;
                if(maxReceiptId == null)	{currReceiptId = 1111;}
                else{currReceiptId = maxReceiptId + 1;}
                console.log(currReceiptId);
                sessionStorage.setItem("receiptId", currReceiptId);

                //get the order Date
				var today = new Date();
				var orderDate = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

				//cid NEED to FINISHED
				var user = {};
				if (user = sessionStorage.getItem('user')) {
					user = JSON.parse(user);
				} else {
					user = {};
				}
				var cid = user["cid"];
				console.log(cid);

				//expiryDate
				var expiryDate = cardYear["name"] + "-" + cardMonth["name"] + "-" +"00";

				//expectedDate
				var expectedDateStr = new Date(today);
				expectedDateStr.setDate(today.getDate()+totalQuantity);
				var expectedDate = expectedDateStr.getFullYear() + "-" + (expectedDateStr.getMonth()+1) + "-" + expectedDateStr.getDate();
				console.log(expectedDate);

				//deliveryDate(Need to change)
				var deliveryDate = expectedDate;


				//insert into purchase table
				purchaseService.addPurchase({receiptId:currReceiptId, orderDate:orderDate, cid:cid, cardNum:parsedCardNumber, expiryDate:expiryDate, expectedDate:expectedDate, deliveryDate:deliveryDate}).$promise.then(function(returnData) {
					
                    $scope.vaild = returnData;
                    var vaild = $scope.vaild[0][0]; //Quantity from database
                    if(vaild == 'O') {
                        console.log("purchase insert successed.")
                    }else{              
                        alert("purchase insert failed.");
                    }
					for(var upc in cart){
						console.log(upc);
						quantity = cart[upc];
						purchaseService.addPurchaseItem({receiptId:currReceiptId, upc:upc , quantity:quantity}).$promise.then(function(returnData) {
						//insert into purchase item table
							$scope.vaild = returnData;
		                    var vaild = $scope.vaild[0][0]; //Quantity from database
		                    if(vaild == 'O') {
		                        console.log("purchaseItem insert successed.")
		                    }else{
		                        alert("purchaseItem insert failed.");
		                    }

						});
					}

				});
				window.location.href = '/#/receipt';
			});
			
		}
	};

}]);