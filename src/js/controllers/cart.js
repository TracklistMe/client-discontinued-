'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ArtistCtrl
 * @description
 * # ArtistCtrl
 * Controller of the tracklistmeApp
 */
app.controller('CartCtrl', function($location, $scope, $state, $auth, $stateParams, $http, CONFIG, ngCart) {
    console.log("---")
    $scope.serverURL = CONFIG.url
    $scope.cart = ngCart;
    $scope.cart.setTaxRate(20.0);
});