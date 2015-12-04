module.exports = function (app) {

  var api = app.api;
  var connection = app.connection;
  var squel = app.squel;
  
// hasSong functions
// Retrieve all hasSong instances "SELECT * FROM hasSong"
api.get('/hasSong/all', function (req, res) {
	var query = squel.select().from('hasSong').toString();
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

// Search song title for an order "SELECT * FROM hasSong WHERE (upc = :upc)"
api.get('/hasSong/search/:upc', function (req, res) {
	var upc = req.params.upc;
	var query = squel.select().from('hasSong').where("upc = " + upc).toString();
	console.log(query);
	        
	connection.query(query, function(error, rows) {
		if (!error) {
			res.json(rows);                 
		} else {
			res.json(error);
		}
	});
});

// Add a song to the table by given "upc" and "title"
api.get('/hasSong/insert/:upc/:title', function (req, res) {
	var upc = req.params.upc;
	var title = req.params.title;
	var query = squel.insert().into('hasSong').set("upc", upc).set("title", title).toString();
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

// Delete a song from the table by given "upc" and "title"
api.get('/hasSong/delete/:upc/:title', function (req, res) {
	var upc = req.params.upc;
	var title = req.params.title;
	var query = squel.delete().from('hasSong').where("upc = " + upc).where("title = " + title).toString();
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