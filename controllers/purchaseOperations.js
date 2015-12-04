// declare variables that are accessible from this whole file
var api,
connection,
squel,
clerkTable;

module.exports = function (appInput) {
    
    // assigning to the variables outside this function
    api = appInput.api;
    connection = appInput.connection;
    squel = appInput.squel;
    clerkTable = appInput.clerkTable;
    

	// purchase functions
	// Retrieve all purchase instances "SELECT * FROM purchase"
	api.get('/purchase/all', function (req, res) {
	    var query = squel.select().from('purchase').toString();
	    console.log(query);
	        
	    connection.query(query, function(error, rows) {
	        if (!error) {
	            res.json(rows);
	                
	        } else {
	            res.json(error);
	        }
	    });
	});

	//clerkController
	// Look up purchase order for an order "SELECT * FROM purchaseItem WHERE (receiptId = :receiptId)"
	api.get('/purchase/forOrder/:receiptId', function (req, res) {
	    var receiptId = req.params.receiptId;
	    var query = squel.select().from('purchase').where("receiptId = " + receiptId).toString();
	    console.log(query);
	        
	    connection.query(query, function(error, rows) {
	        if (!error) {
	            res.json(rows);
	                         
	        } else {
	            res.json(error);
	        }
	    });
	});

	// Add a purchase order to the table
	api.get('/purchase/insert/:receiptId/:orderDate/:cid/:cardNum/:expiryDate/:expectedDate/:deliveryDate', function (req, res) {
	    var receiptId = req.params.receiptId;
	    var orderDate = req.params.orderDate;
	    var cid = req.params.cid;
	    var cardNum = req.params.cardNum;
	    var expiryDate = req.params.expiryDate;
	    var expectedDate = req.params.expectedDate;
	    var deliveredDate = req.params.deliveryDate;

	    var query = squel.insert().into('purchase').set("receiptId", receiptId).set("orderDate", orderDate).set("cid", cid).set("cardNum", cardNum).set("expiryDate", expiryDate).set("expectedDate", expectedDate).set("deliveredDate", deliveredDate).toString();
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

	api.post('/purchase/insert/ryan', function (req, res) {
		var body = req.body;
		var cardNumber = body.cardNumber;
		var cardMonth = body.cardMonth;
		var cardDay = body.cardDay;
		// maybe we should have an index?
		var receipt = Math.floor((Math.random() * 99999999999) + 1);


	    var query = squel.insert().into('purchase').set("receiptId", receiptId).set("orderDate", orderDate).set("cid", cid).set("cardNum", cardNum).set("expiryDate", expiryDate).set("expectedDate", expectedDate).set("deliveryDate", deliveryDate).toString();
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

	// Delete a purchaseItem from the table
	api.get('/purchase/delete/:receiptId/:cid', function (req, res) {
	    var receiptId = req.params.receiptId;
	    var cid = req.params.cid;
	    var query = squel.delete().from('purchase').where("receiptId = " + receiptId).where("cid = " + cid).toString();
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


	api.get('/purchase/maxReceiptId', function (req, res) {
        var query = squel.select().from('purchase').field('MAX(receiptId)').toString();
        console.log(query);
            
        connection.query(query, function(error, rows) {
            if (!error) {
                res.json(rows);

            } else {
                res.json(error);
            }
        });
    });

};