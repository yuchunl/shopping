
// declare variables that are accessible from this whole file
var api,
connection,
squel,
itemTable;

module.exports = function (appInput) {

    // assigning to the variables outside this function
    api = appInput.api;
    connection = appInput.connection;
    squel = appInput.squel;
    itemTable = appInput.itemTable;

  api.get('/item/range/:start/:amount', function (req, res) {
    var start = req.params.start;
    var amount = req.params.amount;

    console.log(amount);

    selectStartEnd(start, amount, function (items) {
      totalCount(function (count) {
        res.json({count: count,
          data: items});
      });
      
    });
    
  });

  api.get('/item/range/predicate/:start/:amount/:sort/:reverse', function (req, res) {
    var start = req.params.start;
    var amount = req.params.amount;
    var sort = req.params.sort;
    var reverse = req.params.reverse;

    console.log(amount);

    selectStartEndWithPredicate(start, amount, sort, reverse, function (items) {
      totalCount(function (count) {
        res.json({count: count,
          data: items});
      });
      
    });
    
  });

  api.get('/item/range/predicate/search/:start/:amount/:sort/:reverse/:titleSearch/:nameSearch/:categorySearch', function (req, res) {
    var start = req.params.start;
    var amount = req.params.amount;
    var sort = req.params.sort;
    var reverse = req.params.reverse;
    var titleSearch = req.params.titleSearch;
    var nameSearch = req.params.nameSearch;
    var categorySearch = req.params.categorySearch;

    console.log("HERE");

    selectStartEndWithPredicateAndSearch(start, amount, sort, reverse, titleSearch, nameSearch, categorySearch, function (items) {
      //@ryan todo need to have this return just for the search!
      totalCount(function (count) {
        res.json({count: count,
          data: items});
      });
    });
    
  });

  //Use: clerkController
  // Use the UPC to get an entire item tuple
  api.get('/item/get/:upc', function (req, res) {
    var upc = req.params.upc;
    // item is an array
    selectByUPC(upc, function (item) { // or error
      res.json(item[0]);
    });
  });

  api.delete('/item/delete/:upc', function (req, res) {
    var upc = req.params.upc;
    deleteByUPC(upc, function (item) {
      res.json(item);
    });
  });
    
    // All items from the item table "SELECT * FROM item"
    api.get('/item/all', function (req, res) {
            // error or all items
            // we are passing a function into the selectAll function as a parameter
            // the query to the DB is asyncronous, meaning that it will return before
            // it has actually gotten the information from the DB
            // we pass a function, and this function is what is run when the query is complete
            // in our case, when the query is complete, we pass the items back in the http response
            selectAll(function (allItems) {
                      res.json(allItems);
                      });
            
            });
    
    api.get('/item/range/:start/:amount', function (req, res) {
            var start = req.params.start;
            var amount = req.params.amount;
            
            console.log(amount);
            
            selectStartEnd(start, amount, function (items) {
                           totalCount(function (count) {
                                      res.json({count: count,
                                               data: items});
                                      });
                           
                           });
            
            });
    
    api.get('/item/range/predicate/:start/:amount/:sort/:reverse', function (req, res) {
            var start = req.params.start;
            var amount = req.params.amount;
            var sort = req.params.sort;
            var reverse = req.params.reverse;
            
            console.log(amount);
            
            selectStartEndWithPredicate(start, amount, sort, reverse, function (items) {
                                        totalCount(function (count) {
                                                   res.json({count: count,
                                                            data: items});
                                                   });
                                        
                                        });
            
            });
    
    // Use the UPC to get an entire item tuple
    api.get('/item/get/:upc', function (req, res) {
            var upc = req.params.upc;
            selectByUPC(upc, function (item) { // or error
                        res.json(item);
                        });
            });
    
    api.delete('/item/delete/:upc', function (req, res) {
               var upc = req.params.upc;
               deleteByUPC(upc, function (item) {
                           res.json(item);
                           });
               });
    
    api.post('/item/insert', function (req, res) {
             // CREATE TABLE item (
             // upc int,
             // title varchar(60),
             // itemType int,
             // category varchar(60),
             // company varchar(60),
             // itemYear int,
             // price decimal(5,2),
             // stock int,
             // PRIMARY KEY(UPC));
             var body = req.body;
             insert(body, function (returned) {
                    res.sendStatus(200);
                    });
             });
    
    api.get('/item/updateStock/:upc/:quantity/:price', function (req, res) {
        if(req.params.price!="previous") {
        
            selectStockByUPC (req.params.upc, function(item) {
            
                var oldQuantity = item;
                var newQuantity = parseInt(oldQuantity[0]['stock']) + parseInt(req.params.quantity);
            
                var query = squel.update().table('item').where("upc = " + parseInt(req.params.upc)).set("stock", newQuantity).set("price", parseFloat(req.params.price)).toString();
                console.log(query);
                              
                connection.query(query, function(error, rows) {
                     if (!error) {
                     res.json({stock:newQuantity, data:rows});
                     } else {
                     res.json(error);
                     }
                });
            });
        }
        else {
            selectStockByUPC (req.params.upc, function(item) {
            
                var oldQuantity = item;
                var newQuantity = parseInt(oldQuantity[0]['stock']) + parseInt(req.params.quantity);

                var query = squel.update().table('item').where("upc = " + parseInt(req.params.upc)).set("stock", newQuantity).toString();
                console.log(query);
                
                connection.query(query, function(error, rows) {
                     if (!error) {
                     res.json({stock:newQuantity, data:rows});
                     } else {
                     res.json(error);
                     }
                });
            });
        }
    });
    
    itemTable.selectAll = selectAll;
    itemTable.selectByUPC = selectByUPC;
    itemTable.deleteByUPC = deleteByUPC;
    itemTable.insert = insert;
    itemTable.selectStockByUPC = selectStockByUPC;
    
}

/**
 * Raw sql operations on the table
 */

// "SELECT * FROM item"
function selectAll (callback) {
    
    var query = squel.select().from('item').toString();
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

function totalCount (callback) {
    var query = 'SELECT COUNT(*) FROM item';
    
    var returnObject;
    
    connection.query(query, function(error, rows) {
                     if (!error) {
                     returnObject = rows[0]['COUNT(*)'];
                     } else {
                     returnObject = error;
                     }
                     callback(returnObject);
                     });
}

function selectStartEnd (start, amount, callback) {
    var query = 'SELECT * FROM item INNER JOIN leadSinger  ON item.upc=leadSinger.upc LIMIT ' + start.toString() + ', ' + amount.toString();
    console.log(query);
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

function selectStartEndWithPredicate (start, amount, sort, reverse, callback) {
    var query;
    
    if (reverse === 'true') {
        query = 'SELECT * FROM item INNER JOIN leadSinger ON item.upc=leadSinger.upc ORDER BY ' + sort + ' DESC LIMIT ' + start.toString() + ', ' + amount.toString();
    } else {
        query = 'SELECT * FROM item INNER JOIN leadSinger ON item.upc=leadSinger.upc ORDER BY ' + sort + ' ASC LIMIT ' + start.toString() + ', ' + amount.toString();
    }
    
    console.log(query);
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

function selectStartEndWithPredicateAndSearch (start, amount, sort, reverse, titleSearch, singerSearch, categorySearch, callback) {
    var query;

    if (titleSearch === '#') titleSearch = '';

    if (categorySearch === '#') categorySearch = '';

    if (singerSearch === '#') singerSearch = '';
    
    if (reverse === 'true') {
        query = 'SELECT * FROM item INNER JOIN leadSinger ON item.upc=leadSinger.upc WHERE title LIKE \'%' + titleSearch + '%\'  AND category LIKE \'%' + categorySearch + '%\' AND name LIKE \'%' + singerSearch + '%\'  ORDER BY ' + sort + ' DESC LIMIT ' + start.toString() + ', ' + amount.toString();
    } else {
        query = 'SELECT * FROM item INNER JOIN leadSinger ON item.upc=leadSinger.upc WHERE title LIKE \'%' + titleSearch + '%\'  AND category LIKE \'%' + categorySearch + '%\' AND name LIKE \'%' + singerSearch + '%\'  ORDER BY ' + sort + ' ASC LIMIT ' + start.toString() + ', ' + amount.toString();
    }
    
    console.log(query);
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

function selectStockByUPC (upc, callback) {
    var query = squel.select().from('item').field('stock').where("upc = " + upc).toString();
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

function deleteByUPC (upc, callback) {
    var query = squel.delete().from('item').where("upc = " + upc).toString();
    var returnObject;
    
    //{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
    //{"code":"ER_ROW_IS_REFERENCED_2","errno":1451,"sqlState":"23000","index":0}
    
    connection.query(query, function(error, rows) {
                     if (!error) {
                     returnObject = rows;
                     } else {
                     returnObject = error;
                     }
                     callback(returnObject);
                     });
}

function insert (data, callback) {
  var query = squel.insert().into('item').setFields(data).toString();
  console.log("QUERY: " + query);
  var returnObject;

  // use custom error handling
  // need to do data checking
  // need to do data validation

  connection.query(query, function(error, rows) {
        if (!error) {
          returnObject = rows;
        } else {
          returnObject = error;
        }
        callback(returnObject);
    });
}
