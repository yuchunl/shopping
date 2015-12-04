module.exports = function (app) {

  var api = app.api;
  var connection = app.connection;
  var squel = app.squel;


// leadSinger functions
// Retrieve all leadSinger instances "SELECT * FROM leadSinger"
api.get('/leadSinger/all', function (req, res) {
	var query = squel.select().from('leadSinger').toString();
	console.log(query);
	        
	connection.query(query, function(error, rows) {
		if (!error) {
			res.json(rows);           
		} 
		else {
			res.json(error);
		}
	});
});

// Search song name for an order "SELECT * FROM leadSinger WHERE (upc = :upc)"
api.get('/leadSinger/search/:upc', function (req, res) {
	var upc = req.params.upc;
	var query = squel.select().from('leadSinger').where("upc = " + upc).toString();
	console.log(query);
	        
	connection.query(query, function(error, rows) {
		if (!error) {
			res.json(rows);                 
		} else {
			res.json(error);
		}
	});
});

// Add a song to the table by given "upc" and "name"
api.get('/leadSinger/insert/:upc/:name', function (req, res) {
	var upc = req.params.upc;
	var name = req.params.name;
	var query = squel.insert().into('leadSinger').set("upc", upc).set("name", name).toString();
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

// Delete a song from the table by given "upc" and "name"
api.get('/leadSinger/delete/:upc/:name', function (req, res) {
	var upc = req.params.upc;
	var name = req.params.name;
	var query = squel.delete().from('leadSinger').where("upc = " + upc).where("name = " + name).toString();
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

};