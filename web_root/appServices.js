var databaseServices = angular.module('databaseServices', ['ngResource']);



// creates an item service that talks to the backend
databaseServices.factory('item', ['$resource', function($resource){
    return $resource('item/all', {}, {
      all: {method: 'GET', isArray: true},
      range: {method: 'GET', isArray: false, url: 'item/range/:start/:amount'},
      // sort is the column name to sort by
      rangeWithPredicate: {method: 'GET', isArray: false, url: 'item/range/predicate/:start/:amount/:sort/:reverse'},
      rangeWithPredicateAndSearch: {method: 'GET', isArray: false, url: 'item/range/predicate/search/:start/:amount/:sort/:reverse/:titleSearch/:nameSearch/:categorySearch'},
      singleItem: {method: 'GET', isArray: false, url: '/item/get/:upc'}

      //add the select item by upc
      //if I added this one, localhost:8080 won't work
      //AddSelectItem :{method: 'GET', isArray: false, url: '/item/get/:upc'}

    });

  }]);

// creates an manager service that talks to the backend
databaseServices.factory('managerService', ['$resource',
    function($resource){
        return $resource('topSelling/:date/:n', {}, {
            topSelling: {method: 'GET', isArray: false},
            updateDelivery: {method: 'GET', isArray: false, url: 'manager/purchaseDelivery/:receiptId/:date'},
            addStock: {method: 'GET', url: 'item/updateStock/:upc/:quantity/:price'},
            dailyReport: {method: 'GET', url: 'dailySales/:date'}
        });
                                  
}]);

// creates an purchase service that talks to the backend
databaseServices.factory('purchaseService', ['$resource',
    function($resource){
        return $resource('/purchase/maxReceiptId', {}, {
            maxReceiptId: {method: 'GET', isArray: true},
            addPurchase: {method: 'GET', url: '/purchase/insert/:receiptId/:orderDate/:cid/:cardNum/:expiryDate/:expectedDate/:deliveryDate'},
            addPurchaseItem: {method: 'GET', url: '/purchaseItem/insert/:receiptId/:upc/:quantity'}
        });
}]);

// creates an clerk service that talks to the backends
databaseServices.factory('clerkService', ['$resource',
    function($resource){
        return $resource('/purchase/forOrder/:receiptId', {}, {
          allPurchaseData: {method: 'GET', isArray: true},
          checkQuantity: {method: 'GET', isArray:true, url: '/purchaseItem/get/:receiptId/:upc'},
          maxRetId: {method: 'GET', isArray:true, url: '/orderReturn/maxRetId'},
          insertReturnItem: {method: 'GET',  url: '/returnItem/insert/:retId/:upc/:quantity'},
          insertOrderReturn: {method: 'GET', url: '/orderReturn/insert/:retId/:returnDate/:receiptId'},
          getUnitPrice: {method: 'GET', url: '/item/get/:upc'},
          getQuantitySum: {method: 'GET', isArray:true, url: '/orderReturn/quantity/:receiptId/:upc'},
          all: {method: 'GET', isArray: true},
          selectByrecId: {method: 'GET', isArray: false, url: '/orderReturn/get/:retId'},
          refundOrder: {method: 'GET', isArray: false, url: '/orderReturn/delete/:retId'},
          refundItem: {method: 'GET', isArray: false, url: '/returnItem/delete/:retId/:upc'}
        });

}]);

// creates a receipt service that talks to the backend
// creates an purchase service that talks to the backend
databaseServices.factory('receiptService', ['$resource',
    function($resource){
        return $resource('/purchase/forOrder/:receiptId', {}, {
          getPurchase: {method: 'GET', isArray: true},

        });
}]);

// creates a login service that talks to the backend
databaseServices.factory('loginService', ['$resource',
    function($resource){
        return $resource('customer', {}, {
            addCustomer: {method: 'POST', url:'/customer/addCustomer'},
            doLogin: {method: 'POST', url:'/customer/doLogin'},
            selectAll: {method: 'GET', url:'/customer/selectAll'}
        })
    },
])

