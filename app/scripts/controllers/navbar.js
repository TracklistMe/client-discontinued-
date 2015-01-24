'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
    .controller('NavbarCtrl', function($scope, $auth, Account, CONFIG, $rootScope) {
        $scope.serverURL = CONFIG.url
        $scope.showAccountDropDown = false

        $scope.epxandCheckout = false;


        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        Account.getProfile()
            .success(function(data) {
                console.log(data)
                $scope.user = data;
                $scope.user.avatar = $scope.serverURL + "/images/" + $scope.user.avatar;
            })

        $scope.clickSearchButton = function() {
            console.log("HIT")
            $rootScope.$broadcast('searchActivate', 'test');
        }

    });
