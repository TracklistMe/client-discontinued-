'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('headerAdminController', function($scope, $auth,
  Account, CONFIG, $rootScope) {

  $scope.serverURL = CONFIG.url;
  $scope.showAccountDropDown = false;

  $scope.epxandCheckout = false;

  $scope.app.settings.themeID = 3;
  $scope.app.settings.asideFolded = false;
  $scope.app.settings.asideDock = true;
  $scope.app.settings.asideFixed = true;
  $scope.app.settings.navbarCollapseColor = 'bg-white-only';
  $scope.app.settings.navbarHeaderColor = 'bg-black';
  $scope.app.settings.asideColor = 'bg-black';

  // AUTENTICATION 
  $scope.isAdmin = false;
  $scope.hasCompanies = false;
  $scope.hasLabels = false;
  $scope.hasArtists = false;

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };
  // MAIN CALL FOR PROFILE 
  Account.getProfile()
    .success(function(data) {
      $scope.user = data;
      $scope.isAdmin = data.isAdmin;
      $scope.user.avatar = $scope.serverURL + '/images/' + $scope.user.avatar;

      // SUB CALLS FOR STATS
      Account.getCompanies()
        .success(function(data) {
          $scope.user.companies = data;
          $scope.hasCompanies = true;
        });
      Account.getLabels()
        .success(function(data) {
          $scope.user.labels = data;
          $scope.hasLabels = true;
        });
      Account.getArtists()
        .success(function(data) {
          $scope.user.artists = data;
          $scope.hasArtists = true;
        });

    });

  $scope.clickSearchButton = function() {
    $rootScope.$broadcast('searchActivate', 'test');
  };

});
