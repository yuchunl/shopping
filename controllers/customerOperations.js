// declare variables that are accessible from this whole file
var api,
    connection,
    squel,
    customerTable;

module.exports = function (appInput) {

    // assigning to the variables outside this function
    api = appInput.api;
    connection = appInput.connection;
    squel = appInput.squel;
    customerTable = appInput.customerTable;

    // Insert into table
    api.post('/customer/addCustomer', function (req, res) {
        var body = req.body;
        addCustomer(body, function (added) {
            if (added.status == 1) {
                res.json({success: 1});
            }
            else {
                res.json({success: 0});
            }
        });
    });

    // Login and store into session storage
    api.post('/customer/doLogin', function (req, res) {
        var body = req.body;
        doLogin(body, function (customer) {
            console.log(customer);
            if (customer.status == 1) {
                res.json({
                    success: 1,
                    name: customer.name,
                    cid: customer.cid
                });
            }
            else {
                res.json({success: 0});
            }
        });
    });

    // Select all from table
    api.get('/customer/selectAll', function (req, res) {
        selectAll(function (allCustomers) { // or error
            res.json(allCustomers);
        });
    });

    customerTable.selectAll = selectAll;
    customerTable.addCustomer = addCustomer;
    customerTable.doLogin = doLogin;
}

function addCustomer(data, callback) {
    var returnObject = {};
    var query = squel.insert().into('customer').setFields(data).toString();
    console.log("QUERY: " + query);
    connection.query(query, function(error, rows) {
        if (!error) {
            returnObject.status = 1;
        } else {
            returnObject.status = 0;
        }
        callback(returnObject);
    });
}
// For debugging only.
function selectAll (callback) {
    var query = squel.select().from('customer').toString();
    console.log("QUERY: " + query);
    var returnObject;
    connection.query(query, function (error, rows) {
        if (!error) {
            returnObject = rows;
        } else {
            returnObject = error;
        }
        callback(returnObject);
    });
}

function doLogin(data, callback) {
    var returnObject = {};
    var query = squel.select('cid, password').from('customer').where("cid = '" + data.cid + "'").toString();
    console.log("QUERY: " + query);
    connection.query(query, function(error, rows) {
        if (!error && rows[0] != null) {
            if (rows[0].password == data.password) {
                returnObject.status = 1;
                returnObject.cid = rows[0].cid;
                returnObject.name = rows[0].name;
            }
            else { // bad password
                returnObject.status = 0;
            }
        } else { // username does not exist in database
            returnObject.status = 0;
        }
        callback(returnObject);
    });
}
