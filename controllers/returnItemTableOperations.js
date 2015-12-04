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
    
    // returnItem functions
    // Retrieve all returnItem instances "SELECT * FROM returnItem"
    api.get('/returnItem/all', function (req, res) {
        var query = squel.select().from('returnItem').toString();
        console.log(query);
        
        connection.query(query, function(error, rows) {
            if (!error) {
                res.json(rows);

            } else {
                res.json(error);
            }
        });
    });
    
    //ClerkController
    // Add a returnItem tuple to the table
    api.get('/returnItem/insert/:retId/:upc/:quantity', function (req, res) {
        var retId = req.params.retId;
        var upc = req.params.upc;
        var quantity = req.params.quantity;
        var query = squel.insert().into('returnItem').set("retId", retId).set("upc", upc).set("quantity", quantity).toString();
        console.log(query);
        
        connection.query(query, function(error) {
            if (!error) {
                res.send('OK');
                         
            } else {
                res.json(error);
            }
        });
    });
    
    //Using in: clearkController
    //look up the return item by retId
    api.get('/returnItem/look/:retId/', function(req, res){
        var retId = req.params.retId;
        var query = squel.select().from('returnItem').where("retId = " + retId).toString()
        console.log(query);
            
        connection.query(query, function(error, rows) {
            if (!error) {
                res.json(rows);
                             
            } else {
                res.json(error);
            }
        });
    });

    //Using in: clearkController
    //Update the quantity by retId
    api.get('/returnItem/update/:retId/:quantity', function(req, res){
        var retId = req.params.retId;
        var quantity = req.params.quantity;
        var query = squel.update().table('returnItem').where("retId = " + retId).set("quantity", quantity).toString();
        console.log(query);
            
        connection.query(query, function(error) {
            if (!error) {
               res.send('OK');
                             
            } else {
                res.json(error);
            }
        });
    });

    //Using in: clearkController
    //delete the tuple by retId
    api.get('/returnItem/delete/:retId/', function (req, res) {
        var retId = req.params.retId;
        var quantity = req.params.quantity;
        var query = squel.delete().from('returnItem').where("retId = " + retId).toString();
        console.log(query);
        
        connection.query(query, function(error) {
            if (!error) {
                res.send('OK');
                         
            } else {
                res.json(error);
            }
        });   
    });


    //Using
    //Get the sum(quantity) by upc
    api.get('/returnItem/getSumQuantity/:upc/', function (req, res) {
        var upc = req.params.upc;
        var query = squel.select().from('returnItem').field('sum(quantity)').where("upc = " + upc).toString();
        console.log(query);
        
        connection.query(query, function(error,rows) {
            if (!error) {
                res.json(rows);
                         
            } else {
                res.json(error);
            }
        });   
    });


};