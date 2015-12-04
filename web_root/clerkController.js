/**
 * These are what 'controls' the different pages to provide them with information
 */

var appControllers = angular.module('appControllers');

//the clerk page controller
appControllers.controller('clerkController', ['$scope', 'clerkService', function ($scope,clerkService) {

	$scope.refundSource = [];
    $scope.refundDisplay= [];


	$scope.refund = function refund(clerk) {



        var receiptId = clerk.receiptId;
        var upc = clerk.upc;
        var clerkQuantity = clerk.quantity; //Quantity from clerk
        console.log(receiptId);
        console.log(upc);
        console.log(clerkQuantity);

        //return error if no input
        if(receiptId == undefined|| upc == undefined|| clerkQuantity == undefined){
            alert("Please enter all the input data.");
        }

       
        //from Purchase table get the purchase date
        clerkService.allPurchaseData({receiptId:receiptId}).$promise.then(function(returnData) {
             
            $scope.returnOrderData = returnData;
            var orderDateStr = $scope.returnOrderData[0]['orderDate'];
            var cardNum = $scope.returnOrderData[0]['cardNum'];
            console.log(orderDateStr);
            var orderDate = new Date(orderDateStr); 
            var today = new Date(); 
            console.log(orderDate);
            console.log(today);
            
            var timeDiff = today.getTime() - orderDate.getTime(); //caculate the time different
            console.log(timeDiff);
            var oneDay = 24 * 60 * 60 * 1000; // a day = hours*minutes*seconds*milliseconds
            var diffDays = Math.round(Math.abs(timeDiff) / (oneDay)); //milliseconds -> one day
            console.log(diffDays);

            if(diffDays <= 15){ //within 15 days from the purchase date

            //get the quantity & upc from PurchaseItem
            clerkService.checkQuantity({receiptId:receiptId, upc:upc}).$promise.then(function(returnData) {
                $scope.reutrnItemData = returnData;
                var sqlQuantity = $scope.reutrnItemData[0]['quantity']; //Quantity from database
                console.log(sqlQuantity);

                if(sqlQuantity >= clerkQuantity){

                    ///DO　MORE
                    clerkService.getQuantitySum({receiptId:receiptId, upc:upc}).$promise.then(function(returnData) {

                        var sumQuantity = 0;
                        $scope.quantityData = returnData;
                        if ($scope.quantityData[0] == undefined) {sumQuantity = 0;}
                        else{
                            var sumQuantityStr = $scope.quantityData[0]['SUM(returnItem.quantity)']; //Sum of Quantity from database
                            sumQuantity = sumQuantityStr;
                        }

                        console.log(sumQuantity);
                        

                        //the previous return quantity + the input form clerk < the purchase quantity
                        if (sumQuantity + clerkQuantity <= sqlQuantity) {



                            // get the maximum return id for genrating the new return ID
                            clerkService.maxRetId({}).$promise.then(function(returnData) {

                                $scope.reutrnIdData = returnData;

                                // Create a return ID
                                var maxRetId = $scope.reutrnIdData[0]['MAX(retId)'];
                                var currRetId; 
                                if(maxRetId == null)    {currRetId = 111;}
                                else{currRetId = maxRetId + 1;}
                                
                                console.log(maxRetId);

                                var returnDate = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

                                //insert data into orderReutrn table
                                clerkService.insertOrderReturn({retId:currRetId, returnDate:returnDate, receiptId:receiptId}).$promise.then(function(returnData){
                                    $scope.vaild = returnData;
                                    var vaild = $scope.vaild[0][0]; //Quantity from database
                                    if(vaild == 'O') {
                                        console.log("OrderReturn insert successed.");
                                    }else{
                                        alert("OrderReturn insert failed.");
                                    }


                                    //insert data into ReturnItem table
                                    clerkService.insertReturnItem({retId:currRetId, upc:upc, quantity:clerkQuantity}).$promise.then(function(returnData){
                                        $scope.vaild = returnData;
                                        var vaild = $scope.vaild[0][0]; //Quantity from database
                                        if(vaild == 'O') {
                                            console.log("returnItem insert successed.")
                                        }else{
                                            alert("ReturnItem insert failed.");
                                        }

                                        //create a result table
                                        //refund table:show cardNum and refund money
                                        clerkService.getUnitPrice({upc:upc}).$promise.then(function(returnData){
                                            $scope.itemData = returnData;
                                            var unitPrice = $scope.itemData['price']; 
                                            var totalRefundMoney = clerkQuantity*unitPrice;  //total refund money 
                                            // console.log(totalRefundMoney);


                                            // var table = document.getElementById("resultsTable");
                                        
                                            // // Create table header
                                            // var header = table.createTHead();
                                            // var row = header.insertRow(0);
                                            // var cell1 = row.insertCell(0);
                                            // var cell2 = row.insertCell(1);
                                            // cell1.innerHTML = "<b>Credit Card Number</b>";
                                            // cell2.innerHTML = "<b>Total Refund</b>"
                                                
                                            // // Insert data into table 
                                            // var newRow = table.insertRow(1);
                                            // cell1 = newRow.insertCell(0);
                                            // cell2 = newRow.insertCell(1);

                                            // cell1.innerHTML = cardNum;
                                            // cell2.innerHTML = totalRefundMoney;
                                            // 
                                            $scope.refundSource = [{cardNum: cardNum, totalRefundMoney: totalRefundMoney}];

                                           
                                            // var table = document.getElementById("viewResults");
                                            // table.style.visibility = "visible";                   
                                        });
                                    });
                                });
                            });
                        }
                        else
                        {
                            alert("Quantity is wrong. Please retype again. ");
                        }
                    });
                }
                else{//error: sqlQ < clerkQ
                    alert("Quantity is wrong. Please retype again.");
                }

            });
            }
            else{//excess 15 days
                alert("Can not refund: excess 15 days from the purchase date");
            }            
        });
	};
}]);
