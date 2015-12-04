/**
 * These are what 'controls' the different pages to provide them with information
 */

var appControllers = angular.module('appControllers');

// the manager page controller
appControllers.controller('managerController', ['$scope', 'managerService', function ($scope, managerService) {


	$scope.topSellingSource = [];
	$scope.topSellingDisplay = [];


	$scope.salesSourceRock = [];
    $scope.salesSourcePop = [];
    $scope.salesSourceRap = [];
    $scope.salesSourceCountry = [];
    $scope.salesSourceClassical = [];
    $scope.salesSourceNewAge = [];
    $scope.salesSourceInstrumental = [];

    $scope.salesDisplayRock = [].concat($scope.salesSourceRock);
    $scope.salesDisplayPop = [].concat($scope.salesSourcePop);
    $scope.salesDisplayRap = [].concat($scope.salesSourceRap);
    $scope.salesDisplayCountry = [].concat($scope.salesSourceCountry);
    $scope.salesDisplayClassical = [].concat($scope.salesSourceClassical);
    $scope.salesDisplayNewAge = [].concat($scope.salesSourceNewAge);
    $scope.salesDisplayInstrumental = [].concat($scope.salesSourceInstrumental);

    $scope.totalUnitsRock = 0;
	$scope.totalUnitsPop = 0;
	$scope.totalUnitsRap = 0;
	$scope.totalUnitsCountry = 0;
	$scope.totalUnitsClassical = 0;
	$scope.totalUnitsNewAge = 0;
	$scope.totalUnitsInstrumental = 0;

	$scope.totalValueRock = 0;
	$scope.totalValuePop = 0;
	$scope.totalValueRap = 0;
	$scope.totalValueCountry = 0;
	$scope.totalValueClassical = 0;
	$scope.totalValueNewAge = 0;
	$scope.totalValueInstrumental = 0;

	$scope.totalUnits = 0;
	$scope.totalValue = 0;

	$scope.updateDeliveryDate = function updateDeliveryDate(manager) {
    
        console.log(manager);
        
        if(manager==undefined || manager.receiptId==undefined || manager.date==undefined || manager.receiptId=="") {
            alert("Please enter all required fields correctly");
        }
        
        else {
            var receiptId = manager.receiptId;
            var date = manager.date.getFullYear() + "-" + (manager.date.getMonth()+1) + "-" + manager.date.getDate();

            managerService.updateDelivery({receiptId:receiptId, date:date}).$promise.then(function (returnData) {
	        
                if(returnData.affectedRows==1)
                    alert("Delivery Date Recorded");
                else
                    alert("Failed to Record Delivery");
	        });
        }

	};

	$scope.updateStock = function updateStock(manager) {
    
        console.log(manager);

        if(manager==undefined || manager.upc==undefined || manager.quantity==undefined || manager.upc=="" || manager.quantity=="") {
            alert("Please enter all required fields correctly");
        }
        else {
        
            var upc = manager.upc;
            var quantity = manager.quantity;
            var price;
        
            if(manager.price==undefined) {
                price = "previous";
            }
            else {
                price = manager.price;
            }
	    
            console.log(upc);
            console.log(quantity);
            console.log(price);
	        
            managerService.addStock({upc:upc, quantity:quantity, price:price}).$promise.then(function(returnData) {
	    
            console.log(returnData);
	        
                if(returnData.data.affectedRows==1) {
                    alert("Stock Updated: New Stock = " + returnData.stock);
                }
                else {
                    alert("Failed to Update Stock");
                }
            });
        }
	}

	$scope.getTopSellers = function getTopSellers(manager) {
    
        if(manager==undefined || manager.statDate==undefined || manager.n==undefined || manager.n=="") {
            alert("Please enter all required fields correctly");
        } else {
            var date = manager.statDate.getFullYear() + "-" + (manager.statDate.getMonth()+1) + "-" + manager.statDate.getDate();
            var n = manager.n;
	    
            managerService.topSelling ({date:date, n:n}).$promise.then(function (returnData) {
                
                if (returnData.count=="failed") {
                    alert ("No sales for this date, please choose another");
                }
                
	            else {
                    $scope.topSelling = returnData.data;
                    $scope.topSellingSource = returnData.data;
                        
                    //var table = document.getElementById("resultsTable");
	            
                    // // Create table header
                    // var header = table.createTHead();
                    // var row = header.insertRow(0);
                    // var cell1 = row.insertCell(0);
                    // var cell2 = row.insertCell(1);
                    // cell1.innerHTML = "<b>UPC</b>";
                    // cell2.innerHTML = "<b>Quantity</b>"
	            
                    // // Insert data into table
                    // for(var i = 1; i<=$scope.topSelling.length; i++) {
                    
                    //     var newRow = table.insertRow(i);
                    //     cell1 = newRow.insertCell(0);
                    //     cell2 = newRow.insertCell(1);

                    //     cell1.innerHTML = $scope.topSelling[i-1]['upc'];
                    //     cell2.innerHTML = $scope.topSelling[i-1]['quantity'];
                    // }
	        
                    // var table = document.getElementById("viewResults");
                    // table.style.visibility = "visible";
                }
            });
                
        }
	}

	$scope.viewDailySales = function viewDailySales(manager) {

        
        if(manager==undefined || manager.reportDate==undefined) {
            alert("Please enter all required fields correctly");
        }
        
        else {
            var date = manager.reportDate.getFullYear() + "-" + (manager.reportDate.getMonth()+1) + "-" + manager.reportDate.getDate();
	    
            managerService.dailyReport ({date:date}).$promise.then(function (returnData) {

            	returnData = returnData.data;

            	var rock = [];
            	var pop = [];
            	var rap = [];
            	var country = [];
            	var classical = [];
            	var newAge = [];
            	var instrumental = [];

            	$scope.totalUnitsRock = 0;
            	$scope.totalUnitsPop = 0;
            	$scope.totalUnitsRap = 0;
            	$scope.totalUnitsCountry = 0;
            	$scope.totalUnitsClassical = 0;
            	$scope.totalUnitsNewAge = 0;
            	$scope.totalUnitsInstrumental = 0;

            	$scope.totalValueRock = 0;
            	$scope.totalValuePop = 0;
            	$scope.totalValueRap = 0;
            	$scope.totalValueCountry = 0;
            	$scope.totalValueClassical = 0;
            	$scope.totalValueNewAge = 0;
            	$scope.totalValueInstrumental = 0;
	    
                $scope.reportDetails = returnData;

                for (var i = 0; i < returnData.length; i++) {

                	if (returnData[i].category.trim().toLowerCase() === 'rock') {
                		rock.push(returnData[i]);
                		$scope.totalUnitsRock++;
                		$scope.totalValueRock += returnData[i].totalValue;
                	} else if (returnData[i].category.trim().toLowerCase() === 'pop') {
                		pop.push(returnData[i]);
                		$scope.totalUnitsPop++;
                		$scope.totalValuePop += returnData[i].totalValue;
                	} else if (returnData[i].category.trim().toLowerCase() === 'rap') {
                		rap.push(returnData[i]);
                		$scope.totalUnitsRap++;
                		$scope.totalValueRap += returnData[i].totalValue;
                	} else if (returnData[i].category.trim().toLowerCase() === 'country') {
                		country.push(returnData[i]);
                		$scope.totalUnitsCountry++;
                		$scope.totalValueCountry += returnData[i].totalValue;
                	} else if (returnData[i].category.trim().toLowerCase() === 'classical') {
                		classical.push(returnData[i]);
                		$scope.totalUnitsClassical++;
                		$scope.totalValueClassical += returnData[i].totalValue;
                	} else if (returnData[i].category.trim().toLowerCase() === 'new age') {
                		newAge.push(returnData[i]);
                		$scope.totalUnitsNewAge++;
                		$scope.totalValueNewAge += returnData[i].totalValue;
                	} else if (returnData[i].category.trim().toLowerCase() === 'instrumental') {
                		instrumental.push(returnData[i]);
                		$scope.totalUnitsInstrumental++;
                		$scope.totalValueInstrumental += returnData[i].totalValue;
                	}
                }

                $scope.totalUnits = $scope.totalUnitsRock + $scope.totalUnitsPop + $scope.totalUnitsRap + $scope.totalUnitsCountry + $scope.totalUnitsClassical + $scope.totalUnitsNewAge + $scope.totalUnitsInstrumental;
                $scope.totalValue = $scope.totalValueRock + $scope.totalValuePop + $scope.totalValueRap  + $scope.totalValueCountry + $scope.totalValueClassical + $scope.totalValueNewAge + $scope.totalValueInstrumental;

                $scope.salesSourceRock = rock;
                $scope.salesSourcePop = pop;
                $scope.salesSourceRap = rap;
                $scope.salesSourceCountry = country;
                $scope.salesSourceClassical = classical;
                $scope.salesSourceNewAge = newAge;
                $scope.salesSourceInstrumental = instrumental;


	        
               //  var table = document.getElementById("resultsTable");
                    
               //  // Create table header
               //  var header = table.createTHead();
               //  var row = header.insertRow(0);
               //  var cell1 = row.insertCell(0);
               //  var cell2 = row.insertCell(1);
               //  var cell3 = row.insertCell(2);
               //  var cell4 = row.insertCell(3);
               //  var cell5 = row.insertCell(4);
               //  cell1.innerHTML = "<b>UPC</b>";
               //  cell2.innerHTML = "<b>Category</b>"
               //  cell3.innerHTML = "<b>Unit Price</b>"
               //  cell4.innerHTML = "<b>Units</b>"
               //  cell5.innerHTML = "<b>Total Value</b>"
	        
               //  var rockCount = 0;
               //  var rockTotalPrice = 0;
               //  var rockItem = 0;
               //  var popCount = 0;
               //  var popTotalPrice = 0;
               //  var popItem = 0;
               //  var rapCount = 0;
               //  var rapTotalPrice = 0;
               //  var rapItem = 0;
               //  var countryCount = 0;
               //  var countryTotalPrice = 0;
               //  var countryItem = 0;
               //  var classicalCount = 0;
               //  var classicalTotalPrice = 0;
               //  var classicalItem = 0;
               //  var newAgeCount = 0;
               //  var newAgeTotalPrice = 0;
               //  var newAgeItem = 0;
               //  var instrumentalCount = 0;
               //  var instrumentalTotalPrice = 0;
               //  var instrumentalItem = 0;
               //  var freeRow = 1;
            
               //  // Insert data into table
               //  for(var i = 1; i<=$scope.reportDetails.length; i++) {
                                
               //      if($scope.reportDetails[i-1]['category']=="Rock" || $scope.reportDetails[i-1]['category']=="rock") {
	        
               //          var newRow = table.insertRow(freeRow);
               //          cell1 = newRow.insertCell(0);
               //          cell2 = newRow.insertCell(1);
               //          cell3 = newRow.insertCell(2);
               //          cell4 = newRow.insertCell(3);
               //          cell5 = newRow.insertCell(4);
	                                                
               //          cell1.innerHTML = $scope.reportDetails[i-1]['upc'];
               //          cell2.innerHTML = $scope.reportDetails[i-1]['category'];
               //          cell3.innerHTML = $scope.reportDetails[i-1]['unitPrice'];
               //          cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          cell5.innerHTML = $scope.reportDetails[i-1]['totalValue'];
                    
               //          freeRow ++;
               //          rockCount += cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          rockTotalPrice += $scope.reportDetails[i-1]['totalValue'];
               //          rockItem = 1;
               //      }
               //      console.log(rockItem);
               //      if(i==$scope.reportDetails.length && rockItem==1) {
               //          var newRow = table.insertRow(freeRow);
               //              cell1 = newRow.insertCell(0);
               //              cell2 = newRow.insertCell(1);
               //              cell3 = newRow.insertCell(2);
               //              cell4 = newRow.insertCell(3);
               //              cell5 = newRow.insertCell(4);
	                                                
               //              cell1.innerHTML = "";
               //              cell2.innerHTML = "Total";
               //              cell3.innerHTML = "";
               //              cell4.innerHTML = rockCount;
               //              cell5.innerHTML = Math.round(rockTotalPrice * 100) / 100;
                            
               //              console.log(freeRow);
               //              freeRow++;
               //              rockItem=0;
               //      }
               //  }
                    
               //  for(var i = 1; i<=$scope.reportDetails.length; i++) {
                
               //      if($scope.reportDetails[i-1]['category']=="Pop" || $scope.reportDetails[i-1]['category']=="pop") {
                    	        
               //          var newRow = table.insertRow(freeRow);
               //          cell1 = newRow.insertCell(0);
               //          cell2 = newRow.insertCell(1);
               //          cell3 = newRow.insertCell(2);
               //          cell4 = newRow.insertCell(3);
               //          cell5 = newRow.insertCell(4);
	                                                
               //          cell1.innerHTML = $scope.reportDetails[i-1]['upc'];
               //          cell2.innerHTML = $scope.reportDetails[i-1]['category'];
               //          cell3.innerHTML = $scope.reportDetails[i-1]['unitPrice'];
               //          cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          cell5.innerHTML = $scope.reportDetails[i-1]['totalValue'];
                    
               //          freeRow ++;
               //          popCount += cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          popTotalPrice += $scope.reportDetails[i-1]['totalValue'];
               //          popItem = 1;
               //      }
                    
               //      if(i==$scope.reportDetails.length && popItem==1) {
               //          var newRow = table.insertRow(freeRow);
               //              cell1 = newRow.insertCell(0);
               //              cell2 = newRow.insertCell(1);
               //              cell3 = newRow.insertCell(2);
               //              cell4 = newRow.insertCell(3);
               //              cell5 = newRow.insertCell(4);
	                                                
               //              cell1.innerHTML = "";
               //              cell2.innerHTML = "Total";
               //              cell3.innerHTML = "";
               //              cell4.innerHTML = popCount;
               //              cell5.innerHTML = Math.round(popTotalPrice * 100) / 100;
                            
               //              freeRow++;
               //              popItem=0;
               //      }
               //  }
                        
               // for(var i = 1; i<=$scope.reportDetails.length; i++) {
                
               //      if($scope.reportDetails[i-1]['category']=="Rap" || $scope.reportDetails[i-1]['category']=="rap") {
                    	        
               //          var newRow = table.insertRow(freeRow);
               //          cell1 = newRow.insertCell(0);
               //          cell2 = newRow.insertCell(1);
               //          cell3 = newRow.insertCell(2);
               //          cell4 = newRow.insertCell(3);
               //          cell5 = newRow.insertCell(4);
	                                                
               //          cell1.innerHTML = $scope.reportDetails[i-1]['upc'];
               //          cell2.innerHTML = $scope.reportDetails[i-1]['category'];
               //          cell3.innerHTML = $scope.reportDetails[i-1]['unitPrice'];
               //          cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          cell5.innerHTML = $scope.reportDetails[i-1]['totalValue'];
                    
               //          freeRow ++;
               //          rapCount += cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          rapTotalPrice += $scope.reportDetails[i-1]['totalValue'];
               //          rapItem = 1;
               //      }
                    
               //      if(i==$scope.reportDetails.length && rapItem==1) {
               //          var newRow = table.insertRow(freeRow);
               //              cell1 = newRow.insertCell(0);
               //              cell2 = newRow.insertCell(1);
               //              cell3 = newRow.insertCell(2);
               //              cell4 = newRow.insertCell(3);
               //              cell5 = newRow.insertCell(4);
	                                                
               //              cell1.innerHTML = "";
               //              cell2.innerHTML = "Total";
               //              cell3.innerHTML = "";
               //              cell4.innerHTML = rapCount;
               //              cell5.innerHTML = Math.round(rapTotalPrice * 100) / 100;
                            
               //              freeRow++;
               //              rapItem=0;
               //      }
               //  }
                        
               //  for(var i = 1; i<=$scope.reportDetails.length; i++) {
                
               //      if($scope.reportDetails[i-1]['category']=="Country" || $scope.reportDetails[i-1]['category']=="country") {
                    	        
               //          var newRow = table.insertRow(freeRow);
               //          cell1 = newRow.insertCell(0);
               //          cell2 = newRow.insertCell(1);
               //          cell3 = newRow.insertCell(2);
               //          cell4 = newRow.insertCell(3);
               //          cell5 = newRow.insertCell(4);
	                                                
               //          cell1.innerHTML = $scope.reportDetails[i-1]['upc'];
               //          cell2.innerHTML = $scope.reportDetails[i-1]['category'];
               //          cell3.innerHTML = $scope.reportDetails[i-1]['unitPrice'];
               //          cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          cell5.innerHTML = $scope.reportDetails[i-1]['totalValue'];
                    
               //          freeRow ++;
               //          countryCount += cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          countryTotalPrice += $scope.reportDetails[i-1]['totalValue'];
               //          countryItem = 1;
               //      }
                    
               //      if(i==$scope.reportDetails.length && countryItem==1) {
               //          var newRow = table.insertRow(freeRow);
               //              cell1 = newRow.insertCell(0);
               //              cell2 = newRow.insertCell(1);
               //              cell3 = newRow.insertCell(2);
               //              cell4 = newRow.insertCell(3);
               //              cell5 = newRow.insertCell(4);
	                                                
               //              cell1.innerHTML = "";
               //              cell2.innerHTML = "Total";
               //              cell3.innerHTML = "";
               //              cell4.innerHTML = countryCount;
               //              cell5.innerHTML = Math.round(countryTotalPrice * 100) / 100;
                            
               //              freeRow++;
               //              countryItem=0;
               //      }
               //  }
                    
               //  for(var i = 1; i<=$scope.reportDetails.length; i++) {
                
               //      if($scope.reportDetails[i-1]['category']=="Classical" || $scope.reportDetails[i-1]['category']=="classical") {
                    	        
               //          var newRow = table.insertRow(freeRow);
               //          cell1 = newRow.insertCell(0);
               //          cell2 = newRow.insertCell(1);
               //          cell3 = newRow.insertCell(2);
               //          cell4 = newRow.insertCell(3);
               //          cell5 = newRow.insertCell(4);
	                                                
               //          cell1.innerHTML = $scope.reportDetails[i-1]['upc'];
               //          cell2.innerHTML = $scope.reportDetails[i-1]['category'];
               //          cell3.innerHTML = $scope.reportDetails[i-1]['unitPrice'];
               //          cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          cell5.innerHTML = $scope.reportDetails[i-1]['totalValue'];
                    
               //          freeRow ++;
               //          classicalCount += cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          classicalTotalPrice += $scope.reportDetails[i-1]['totalValue'];
               //          classicalCount==1;
               //      }
                    
               //      if(i==$scope.reportDetails.length && classicalCount==1) {
               //          var newRow = table.insertRow(freeRow);
               //              cell1 = newRow.insertCell(0);
               //              cell2 = newRow.insertCell(1);
               //              cell3 = newRow.insertCell(2);
               //              cell4 = newRow.insertCell(3);
               //              cell5 = newRow.insertCell(4);
	                                                
               //              cell1.innerHTML = "";
               //              cell2.innerHTML = "Total";
               //              cell3.innerHTML = "";
               //              cell4.innerHTML = classicalCount;
               //              cell5.innerHTML = Math.round(classicalTotalPrice * 100) / 100;
                            
               //              freeRow++;
               //              classicalItem=0;
               //      }
               //  }
                        
               //  for(var i = 1; i<=$scope.reportDetails.length; i++) {
                
               //      if($scope.reportDetails[i-1]['category']=="New Age" || $scope.reportDetails[i-1]['category']=="new age" || $scope.reportDetails[i-1]['category']=="New age") {
                    	        
               //          var newRow = table.insertRow(freeRow);
               //          cell1 = newRow.insertCell(0);
               //          cell2 = newRow.insertCell(1);
               //          cell3 = newRow.insertCell(2);
               //          cell4 = newRow.insertCell(3);
               //          cell5 = newRow.insertCell(4);
	                                                
               //          cell1.innerHTML = $scope.reportDetails[i-1]['upc'];
               //          cell2.innerHTML = $scope.reportDetails[i-1]['category'];
               //          cell3.innerHTML = $scope.reportDetails[i-1]['unitPrice'];
               //          cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          cell5.innerHTML = $scope.reportDetails[i-1]['totalValue'];
                    
               //          freeRow ++;
               //          newAgeCount += cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          newAgeTotalPrice += $scope.reportDetails[i-1]['totalValue'];
               //          newAgeCount==1;
               //      }
                    
               //      if(i==$scope.reportDetails.length && newAgeCount==1) {
               //          var newRow = table.insertRow(freeRow);
               //              cell1 = newRow.insertCell(0);
               //              cell2 = newRow.insertCell(1);
               //              cell3 = newRow.insertCell(2);
               //              cell4 = newRow.insertCell(3);
               //              cell5 = newRow.insertCell(4);
	                                                
               //              cell1.innerHTML = "";
               //              cell2.innerHTML = "Total";
               //              cell3.innerHTML = "";
               //              cell4.innerHTML = newAgeCount;
               //              cell5.innerHTML = Math.round(newAgeTotalPrice * 100) / 100;
                            
               //              freeRow++;
               //              newAgeItem=0;
               //      }
               //  }
                        
               //  for(var i = 1; i<=$scope.reportDetails.length; i++) {
                
               //      if($scope.reportDetails[i-1]['category']=="Instrumental" || $scope.reportDetails[i-1]['category']=="instrumental") {
                    	        
               //          var newRow = table.insertRow(freeRow);
               //          cell1 = newRow.insertCell(0);
               //          cell2 = newRow.insertCell(1);
               //          cell3 = newRow.insertCell(2);
               //          cell4 = newRow.insertCell(3);
               //          cell5 = newRow.insertCell(4);
	                                                
               //          cell1.innerHTML = $scope.reportDetails[i-1]['upc'];
               //          cell2.innerHTML = $scope.reportDetails[i-1]['category'];
               //          cell3.innerHTML = $scope.reportDetails[i-1]['unitPrice'];
               //          cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          cell5.innerHTML = $scope.reportDetails[i-1]['totalValue'];
                    
               //          freeRow ++;
               //          instrumentalCount += cell4.innerHTML = $scope.reportDetails[i-1]['units'];
               //          instrumentalTotalPrice += $scope.reportDetails[i-1]['totalValue'];
               //          instrumentalItem = 1;
               //      }
                    
               //      if(i==$scope.reportDetails.length && instrumentalCount==1) {
               //          var newRow = table.insertRow(freeRow);
               //              cell1 = newRow.insertCell(0);
               //              cell2 = newRow.insertCell(1);
               //              cell3 = newRow.insertCell(2);
               //              cell4 = newRow.insertCell(3);
               //              cell5 = newRow.insertCell(4);
	                                                
               //              cell1.innerHTML = "";
               //              cell2.innerHTML = "Total";
               //              cell3.innerHTML = "";
               //              cell4.innerHTML = instrumentalCount;
               //              cell5.innerHTML = Math.round(instrumentalTotalPrice * 100) / 100;
                            
               //              freeRow++;
               //              instrumentalItem = 0;
               //      }
               //  }
                
               //  var newRow = table.insertRow(freeRow);
               //              cell1 = newRow.insertCell(0);
               //              cell2 = newRow.insertCell(1);
               //              cell3 = newRow.insertCell(2);
               //              cell4 = newRow.insertCell(3);
               //              cell5 = newRow.insertCell(4);
	                                                
               //              cell1.innerHTML = "";
               //              cell2.innerHTML = "Total Daily Sales";
               //              cell3.innerHTML = "";
               //              cell4.innerHTML = rockCount + popCount + rapItem + countryCount + classicalCount + newAgeCount + instrumentalCount;
               //              cell5.innerHTML = Math.round((rockTotalPrice + popTotalPrice + rapTotalPrice + countryTotalPrice + classicalTotalPrice + newAgeTotalPrice + instrumentalTotalPrice) * 100) / 100;
                            
               //              freeRow++;
               //              instrumentalItem = 0;
	        
               //  var table = document.getElementById("viewResults");
               //  table.style.visibility = "visible";
	    
            });
        }
	}

}]);
