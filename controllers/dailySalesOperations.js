module.exports = function (app) {

//Select upc, category, price, total(quantity by upc) by date (order, purchaseItem, item) 
api.get('/DailySalesPurchased/:date', function (req, res) {
  var date = req.params.date;
  var query = squel.select().from('item').from('order').from('purchaseItem').field('upc').field('category').field('price').field('sum(quantity)').where("orderDate = '" + date + "'").group('upc').toString();
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