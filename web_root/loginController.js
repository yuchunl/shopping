var appControllers = angular.module('appControllers');

appControllers.controller('loginController', ['$scope', '$rootScope', 'loginService', function ($scope, $rootScope, loginService) {

    $scope.addCustomer = function addCustomer(customerDetails) {
        var cid = customerDetails.cid;
        var password = customerDetails.password;
        var name = customerDetails.name;
        var address = customerDetails.address;
        var phone = customerDetails.phone;

        // FIXME: Right now cid must be an int
        loginService.addCustomer({cid: cid,
                                password: password,
                                name: name,
                                address: address,
                                phone: phone}
            ).$promise.then(function (returnData) {
                if (returnData.success == 1) {
                    var user;
                    if (user = sessionStorage.getItem('user')) {
                        user = JSON.parse(user);
                        user = {cid: cid, name: name};
                    } else {
                        user = {};
                        user = {cid: cid, name: name};
                    }
                    sessionStorage.setItem('user', JSON.stringify(user));
                    $rootScope.isLoggedIn = true;
                    window.location.href = '/';
                    //alert('Account created. Please log in to continue.')
                }
                else {
                    alert('Account already exists. Please log in, or use a different username.')
                }
            }
        );
    }

    $scope.selectAll = function selectAll() {
        loginService.selectAll().$promise.then(function (returnData) {

        })
    }

    $scope.doLogin = function doLogin(loginDetails) {
        var cid = loginDetails.cid;
        var password = loginDetails.password;

        loginService.doLogin({cid: cid, password: password}).$promise.then(function (returnData) {
            if (returnData.success == 1) {
                var user;

                console.log(returnData);

                if (user = sessionStorage.getItem('user')) {
                    user = JSON.parse(user);
                    user = returnData;
                } else {
                    user = {};
                    user = returnData;
                }

                sessionStorage.setItem('user', JSON.stringify(user));

                $rootScope.isLoggedIn = true;
                window.location.href = '/';

                //alert('You have been logged in.')
            } else {
                alert('Invalid username or password.')
            }
        });
    }
}]);