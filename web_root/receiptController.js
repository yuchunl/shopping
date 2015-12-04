var appControllers = angular.module('appControllers');

appControllers.controller('receiptController', ['$scope', 'item', 'receiptService', function ($scope, item, receiptService) {

	var receiptId = sessionStorage.getItem("receiptId");
	receiptService.getPurchase({receiptId: receiptId}).$promise.then(function(returnData) {

		$scope.OrderData = returnData;
		var expectedDateStr = new Date($scope.OrderData[0]['expectedDate']);
		var expectedDate = expectedDateStr.getFullYear() + "-" + (expectedDateStr.getMonth()+1) + "-" + expectedDateStr.getDate();


		var table = document.getElementById("viewResults");
		table.style.visibility = "visible";

	    var table = document.getElementById("resultsTable");
	        
	    // Create table header
	    var header = table.createTHead();
	    var row = header.insertRow(0);
	    var cell1 = row.insertCell(0);
	    var cell2 = row.insertCell(1);
	    var cell3 = row.insertCell(2);
	    cell1.innerHTML = "<b>Customer ID</b>";
	    cell2.innerHTML = "<b>Receipt ID</b>";
	    cell3.innerHTML = "<b>Expected delivery date</b>";
	        
	    // Insert data into tabl   
	    var newRow = table.insertRow(1);
	    cell1 = newRow.insertCell(0);
	    cell2 = newRow.insertCell(1);
	    cell3 = newRow.insertCell(2);

	    cell1.innerHTML = $scope.OrderData[0]['cid'];
	    cell2.innerHTML = receiptId;
	    cell3.innerHTML = expectedDate;
	    
	    var table = document.getElementById("viewResults");
	    table.style.visibility = "visible";

	    $scope.cartItems = [];
		$scope.totalBill = 0;
		var cart = {};
		if (cart = sessionStorage.getItem('cart')) {
			cart = JSON.parse(cart);
		} else {
			cart = {};
		}

		for (var upc in cart) {
			console.log(upc);
			item.singleItem({upc: upc}).$promise.then(function (returnData) {
				returnData.quantity = cart[returnData.upc];
				console.log("Key: " + returnData.upc);
				console.log("Value: " + cart[returnData.upc]);
				 var totalQuantity = totalQuantity + cart[returnData.upc]; //caculate the total quantity
				$scope.totalBill = $scope.totalBill + (returnData.price * returnData.quantity);
			    $scope.cartItems.push(returnData);
		    });
		}

		// clear cart
		sessionStorage.removeItem('cart');
	


	});







}]);