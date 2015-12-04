// we are making an application called group08, application group08 needs the ngRoute module, our database services module (to talk to the backend), and our controllers module
var group08 = angular.module('group08', ['ngRoute', 'smart-table', 'ui.bootstrap', 'databaseServices', 'appControllers']);

angular.module('appControllers', []);

var appControllers = angular.module('appControllers');

appControllers.controller('indexController', ['$scope', '$rootScope', function ($scope, $rootScope) {

  $scope.logoutClicked = function () {
    console.log("Logout Clicked");
    if (sessionStorage.getItem('user')) {
      $rootScope.isLoggedIn = false;
      sessionStorage.clear();
      window.location.href = '/';
    } 
  };

  var user;
  if (user = sessionStorage.getItem('user')) {
    $scope.isLoggedIn = true;
    $rootScope.isLoggedIn = true;
    $rootScope.name = user.name;
    $scope.name = user.name;
  } else {
    $scope.isLoggedIn = false;
    $rootScope.isLoggedIn = false;
  }

  // https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$watch
  $scope.$watch(function() {
    return $rootScope.isLoggedIn;
  }, function(newValue, oldValue) {
    $scope.isLoggedIn = $rootScope.isLoggedIn;
  });

}]);

// when you go to X link, what HTML file should you go to, and what controllers should control it
group08.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/shop', {
        templateUrl: 'shop.html',
        controller: 'shopController',
        // https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
        resolve: {
          // string or function, if string then resolves to service
          factory: checkLoggedIn
        }
      }).
      when('/manager', {
        templateUrl: 'manager.html',
        controller: 'managerController',
        resolve: {
          // string or function, if string then resolves to service
          factory: checkLoggedIn
        }
      }).
      when('/clerk', {
       templateUrl: 'clerk.html',
       controller: 'clerkController',
       resolve: {
          // string or function, if string then resolves to service
          factory: checkLoggedIn
        }
     }).
      when('/cart', {
       templateUrl: 'cart2.html',
       controller: 'cartController',
       resolve: {
          // string or function, if string then resolves to service
          factory: checkLoggedIn
        }
     }).
    when('/login', {
      templateUrl: 'login.html',
      controller: 'loginController',
      resolve: {
          // string or function, if string then resolves to service
          factory: checkNotLoggedIn
        }
    }).
    when('/checkout', {
      templateUrl: 'checkout.html',
      controller: 'checkoutController',
      resolve: {
        // string or function, if string then resolves to service
        factory: checkLoggedIn
      }
    }).when('/receipt', {
      templateUrl: 'receipt.html',
      controller: 'receiptController',
      resolve: {
        factory: checkLoggedIn
      }
    }).when('/', {
      templateUrl: 'shop.html',
      controller: 'shopController',
      resolve: {
        factory: checkLoggedIn
      }})

  }]);

var checkLoggedIn= function ($q, $rootScope, $location) {
  var user;
  if (user = sessionStorage.getItem('user')) {
      return true;
  } else {
    $location.path("/login");
  }
};

var checkNotLoggedIn= function ($q, $rootScope, $location) {
  var user;
  if (user = sessionStorage.getItem('user')) {
      $location.path("/");
  } else {
    return true
  }
};