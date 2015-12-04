// popular node web server framework
var express = require('express');
// http://hiddentao.github.io/squel/index.html
var squel = require("squel");
// https://www.npmjs.com/package/mysql
var mysql = require('mysql');
// required to be able to process JSON post data from a request body (ie. if you post JSON data to a route)
var bodyParser = require('body-parser');

// create an instance of express for our application
var api = express();
// use the body parser, otherwise the req.body will be undefined
api.use(bodyParser.json());

var connection = mysql.createConnection({
  host     : 'sql.mitts.me',
  user     : 'ryan',
  password : 'computergeek',
  database : '354production' // can use any database that matches the schema that is on the server
});

// setting up an app object to pass to the controllers to be able
// to access the application components
var app = {
  squel: squel,
  connection: connection,
  api: api,
  itemTable: {},
  managerTable: {},
  clerkTable:{},
  customerTable: {}
};

connection.connect(function(error) {
  if (error) {
    console.log('Database Error');
  } else {
  	console.log('Database Connected');
  }
});

// add the separate controllers files here
require('./controllers/itemTableOperations.js')(app);
require('./controllers/purchaseItemTableOperations.js')(app);
require('./controllers/purchaseOperations.js')(app);
require('./controllers/returnTableOperations.js')(app);
require('./controllers/returnItemTableOperations.js')(app);
require('./controllers/hasSongOperations.js')(app);
require('./controllers/leadSingerOperations.js')(app);
require('./controllers/customerOperations.js')(app);



// this entire folder is public and accessible, host the UI from this folder
api.use(express.static('web_root'));

var server = api.listen(80, function () {
  console.log('Server listening at: ' + server.address().address + 
  	'on port: ' + server.address().port);
});
