'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('headerAdminController', function($scope, $auth, Account, CONFIG, $rootScope) {
    $scope.serverURL = CONFIG.url
    $scope.showAccountDropDown = false

    $scope.epxandCheckout = false;

    $scope.app.settings.themeID = 3;
    $scope.app.settings.asideFolded = false;
    $scope.app.settings.asideDock = true;
    $scope.app.settings.asideFixed = true;
    $scope.app.settings.navbarCollapseColor = "bg-white-only"
    $scope.app.settings.navbarHeaderColor = "bg-black"
    $scope.app.settings.asideColor = "bg-black"



    console.log("----" + $scope.app.settings)
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    Account.getProfile()
        .success(function(data) {
            console.log(data)
            $scope.user = data;
            console.log(data)
            $scope.user.avatar = $scope.serverURL + "/images/" + $scope.user.avatar;
        })

    $scope.clickSearchButton = function() {
        console.log("HIT")
        $rootScope.$broadcast('searchActivate', 'test');
    }

});