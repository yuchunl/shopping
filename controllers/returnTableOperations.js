// declare variables that are accessible from this whole file
var api,
connection,
squel,
itemTable,
clerkTable;

module.exports = function (appInput) {
    
    api = appInput.api;
    connection = appInput.connection;
    squel = appInput.squel;
    itemTable = appInput.itemTable;
    clerkTable = appInput.clerkTable;
    
    // orderReturn functions
    // Retrieve all orderReturn instances "SELECT * FROM orderReturn"
    api.get('/orderReturn/all', function (req, res) {
        var query = squel.select().from('orderReturn').toString();
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
    // Add a orderReturn tuple to the table
    api.get('/orderReturn/insert/:retId/:returnDate/:receiptId', function (req, res) {
        var retId = req.params.retId;
        var returnDate = req.params.returnDate;
        var receiptId = req.params.receiptId;
        var query = squel.insert().into('orderReturn').set("retId", retId).set("returnDate", returnDate).set("receiptId", receiptId).toString();
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
    
    // Delete a orderReturn tuple from the table
    api.get('/orderReturn/delete/:retId', function (req, res) {
        var retId = req.params.retId;
        var query = squel.delete().from('orderReturn').where("retId = " + retId).toString();
        console.log(query);
        
        connection.query(query, function(error) {
            if (error) {
                res.json(error);
            }
            else {
                res.send(rows);
            }
        });
    });

    //select all by retId, receiptId
   api.get('/orderReturn/get/:retId/:receiptId', function (req, res) {
        var retId = req.params.retId;
        var query = squel.select().from('orderReturn').where("retId = " + retId).where("receiptId = " + receiptId).toString();
        console.log(query);
        
        connection.query(query, function(error, rows) {
            if (!error) {
                res.json(rows);
            } else {
                res.json(error);
            }
        });
    });

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
    
    api.get('/totalReturns/:date', function (req,res) {
        var date = req.params.date;
        var query = squel.select().from('orderReturn').from('returnItem').field('upc').field('sum(quantity)').where("returnDate = '" + date + "'").where("orderReturn.retId = returnItem.retId").group('upc').toString();
        console.log(query);
            
        connection.query(query, function(error, rows) {
            if (!error) {
                res.json(rows);

            } else {
                res.json(error);
            }
        });
    });

    api.get('/orderReturn/maxRetId', function (req, res) {
        var query = squel.select().from('orderReturn').field('MAX(retId)').toString();
        console.log(query);
            
        connection.query(query, function(error, rows) {
            if (!error) {
                res.json(rows);

            } else {
                res.json(error);
            }
        });
    });

    //SELECT SUM(returnItem.quantity) FROM orderReturn, returnItem 
    //WHERE orderReturn.receiptId = '1120' AND orderReturn.retId = returnItem.retId AND returnItem.upc = '736159' GROUP BY returnItem.upc;
    api.get('/orderReturn/quantity/:receiptId/:upc', function (req, res) {
        var upc = req.params.upc;
        var receiptId = req.params.receiptId;
        var query = squel.select().from('orderReturn').from('returnItem').field('SUM(returnItem.quantity)').where("orderReturn.receiptId = '" + receiptId + "' AND orderReturn.retId = returnItem.retId AND returnItem.upc = '" + upc + "'").group('returnItem.upc').toString();
        console.log(query);
            
        connection.query(query, function(error, rows) {
            if (!error) {
                res.json(rows);

            } else {
                res.json(error);
            }
        });
    });   
    
}



