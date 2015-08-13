'use strict';

/* Controllers */
// signin controller
app.controller('headerMusicController', function($scope, $auth, Account,
  CONFIG, $rootScope) {
  $scope.serverURL = CONFIG.url;
  $scope.showAccountDropDown = false;
  $scope.epxandCheckout = false;

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  Account.getProfile()
    .success(function(data) {
      $scope.user = data;
      $scope.user.avatar = $scope.serverURL + '/images/' + $scope.user.avatar;
    });

  $scope.clickSearchButton = function() {
    $rootScope.$broadcast('searchActivate', 'test');
  };

});
