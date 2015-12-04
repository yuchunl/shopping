// declare variables that are accessible from this whole file
var api,
connection,
squel,
itemTable,
managerTable;

module.exports = function (appInput) {
    
    // assigning to the variables outside this function
    api = appInput.api;
    connection = appInput.connection;
    squel = appInput.squel;
    itemTable = appInput.itemTable;
    managerTable = appInput.managerTable;
    

	// purchaseItem functions
	// Retrieve all purchaseItem instances "SELECT * FROM purchaseItem"
	api.get('/purchaseItem/all', function (req, res) {
	    var query = squel.select().from('purchaseItem').toString();
	    console.log(query);
	        
	    connection.query(query, function(error, rows) {
	        if (!error) {
	            res.json(rows);
	                
	        } else {
	            res.json(error);
	        }
	    });
	});

	// Look up items for an order "SELECT * FROM purchaseItem WHERE (receiptId = :receiptId)"
	api.get('/purchaseItem/forOrder/:receiptId', function (req, res) {
	    var receiptId = req.params.receiptId;
	    var query = squel.select().from('purchaseItem').where("receiptId = " + receiptId).toString();
	    console.log(query);
	        
	    connection.query(query, function(error, rows) {
	        if (!error) {
	            res.json(rows);
	                         
	        } else {
	            res.json(error);
	        }
	    });
	});

	// Add a purchaseItem to the table
	api.get('/purchaseItem/insert/:receiptId/:upc/:quantity', function (req, res) {
	    var receiptId = req.params.receiptId;
	    var upc = req.params.upc;
	    var quantity = req.params.quantity;
	    var query = squel.insert().into('purchaseItem').set("receiptId", receiptId).set("upc", upc).set("quantity", quantity).toString();
	    console.log(query);
	        
	    connection.query(query, function(error) {
	        if (error) {
	            res.json(error);
	        }
	        else {
	            res.json('OK');
	        }
	    });
	});

	// Delete a purchaseItem from the table
	api.get('/purchaseItem/delete/:receiptId/:upc', function (req, res) {
	    var receiptId = req.params.receiptId;
	    var upc = req.params.upc;
	    var query = squel.delete().from('purchaseItem').where("receiptId = " + receiptId).where("upc = " + upc).toString();
	    console.log(query);
	       
	    connection.query(query, function(error) {
	        if (error) {
	            res.json(error);
	        }
	        else {
	            res.send('OK');
	        }
	    });
	});

    //clerkController
    //Get the quantity from purchaseItem by receipt ID and upc  
    api.get('/purchaseItem/get/:receiptId/:upc', function (req, res) {
        var receiptId = req.params.receiptId;
        var upc = req.params.upc;
        var query = squel.select().from('purchaseItem').where("receiptId = " + receiptId).where("upc = " + upc).toString();
        console.log(query);
           
        connection.query(query, function(error,rows) {
            if (error) {
                res.json(error);
            }
            else {
                res.json(rows);
            }
        });
    });


    
    // Top Selling Items Report Transaction

     api.get('/topSelling/:date/:n', function (req,res) {
     var date = req.params.date;
     var n = req.params.n;
     
     var sales = [];
     var returns = [];
             
     selectPurItemByDate(date, function(item) {
            sales = item;
     
            selectRetItemByDate(date, function(item) {
                returns = item;
                                
                var objectTotals = [];
                                
                    for (var i = 0; i < sales.length; i++) {
                        for (var j = 0; j < returns.length; j++) {
                                
                            if(sales[i].upc == returns[j].upc) {
                                sales[i]['sum(quantity)'] = sales[i]['sum(quantity)'] - returns[j]['sum(quantity)'];
                            }
                        }
                    }
                    
                    if(sales.length==0) {
                        res.json({count:"failed", data:"unavailable"});
                    }
                    else {
                        var mostPopular = 0;
                        for (var i = 0; i < n; i++) {
                            for (var j = 0; j < sales.length; j++) {
                                if (sales[mostPopular]['sum(quantity)'] < sales[j]['sum(quantity)']) {
                                    mostPopular = j;
                                }
                            }
                                
                            var bestSeller = {upc:sales[mostPopular]['upc'], quantity:sales[mostPopular]['sum(quantity)']};
                                
                            objectTotals[objectTotals.length] = bestSeller;
                            sales[mostPopular]['sum(quantity)'] = 0;
                                
                        }
                                
                        res.json({count:n, data:objectTotals});
                    }
            });
     });
      
     });
    
     // Daily Sales Report Transaction

     api.get('/dailySales/:date', function (req,res) {
     var date = req.params.date;
     
     var sales = [];
     var returns = [];
             
     selectDailySales(date, function(item) {
            sales = item;
     
            selectRetItemByDate(date, function(item) {
                returns = item;
                                
                var objectTotals = [];
                                
                    for (var i = 0; i < sales.length; i++) {
                        for (var j = 0; j < returns.length; j++) {
                                
                            if(sales[i].upc == returns[j].upc) {
                                sales[i]['sum(quantity)'] = sales[i]['sum(quantity)'] - returns[j]['sum(quantity)'];
                            }
                        }
                    }
                                
                    for (var k = 0; k < sales.length; k++) {
                        
                        totalPrice = sales[k]['price'] * sales[k]['sum(quantity)'];
                    
                        var soldItem = {upc:sales[k]['upc'], category:sales[k]['category'], unitPrice:sales[k]['price'], units:sales[k]['sum(quantity)'], totalValue:totalPrice};
                        
                        objectTotals[objectTotals.length] = soldItem;
                    }
                                
                    res.json({count:sales.length, data:objectTotals});
            });
     });
      
     });
    
    // Record delivery of an order
    api.get('/manager/purchaseDelivery/:receiptId/:date', function (req,res) {
    
        var date = req.params.date;
        
        var query = squel.update().table('purchase').where("receiptId = " + req.params.receiptId).set("deliveredDate", req.params.date).toString();
        
        console.log(query);
        
        connection.query(query, function(error, rows) {
                     if (!error) {
                     res.json(rows);
                     } else {
                     res.json(error);
                     }
                });
    });
    
    // Select upc and total quantity of purchaseItems by date
    api.get('/totalPurchases/:date', function (req,res) {
            var date = req.params.date;
            var query = squel.select().from('purchase').from('purchaseItem').field('upc').field('sum(quantity)').where("orderDate = '" + date + "'").where("purchase.receiptId = purchaseItem.receiptId").group('upc').toString();
            console.log(query);
            
            connection.query(query, function(error, rows) {
                             if (!error) {
                             res.json(rows);
                             
                             } else {
                             res.json(error);
                             }
                             });
            });
 
    managerTable.selectPurItemByDate = selectPurItemByDate;
    managerTable.selectRetItemByDate = selectRetItemByDate;
    
}
    
    // Select upc and total quantity of returnItems by date
    function selectRetItemByDate (date, callback){
        var query = squel.select().from('orderReturn').from('returnItem').field('upc').field('sum(quantity)').where("returnDate = '" + date + "'").where("orderReturn.retId = returnItem.retId").group('upc').toString();
        console.log(query);
        var returnObject;
        
        connection.query(query, function(error, rows) {
                         if (!error) {
                         returnObject = rows;
                         
                         } else {
                         returnObject = error;
                         }
                         callback(returnObject);
                         });
    }
    
    // Select upc and total quantity of purchaseItems by date
    function selectPurItemByDate (date, callback){
        var query = squel.select().from('purchase').from('purchaseItem').field('upc').field('sum(quantity)').where("orderDate = '" + date + "'").where("purchase.receiptId = purchaseItem.receiptId").group('upc').toString();
        console.log(query);
        var returnObject;
        
        connection.query(query, function(error, rows) {
                         if (!error) {
                         returnObject = rows;
                         
                         } else {
                         returnObject = error;
                         }
                         callback(returnObject);
                         });
    }

    function selectByUPC (upc, callback) {
    var query = squel.select().from('item').where("upc = " + upc).toString();
    var returnObject;
    
    connection.query(query, function(error, rows) {
                     if (!error) {
                     returnObject = rows;
                     } else {
                     returnObject = error;
                     }
                     callback(returnObject);
                     });
}

//Select upc, category, price, total(quantity by upc) by date (order, purchaseItem, item)
function selectDailySales (date, callback) {

  var query = squel.select().from('item').from('purchase').from('purchaseItem').field('item.upc').field('category').field('price').field('sum(quantity)').where("orderDate = '" + date + "'").where("purchase.receiptId = purchaseItem.receiptId").where("item.upc = purchaseItem.upc").group('upc').toString();
  var returnObject;
  
  connection.query(query, function(error, rows) {
      if (!error) {
        returnObject = rows;
      } else {
        returnObject = error;
      }
      callback(returnObject);
  });
}