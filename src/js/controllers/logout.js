'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the tracklistmeApp
 */
app.controller('LogoutCtrl', function($auth) {
  if (!$auth.isAuthenticated()) {
    return;
  }
  $auth.logout()
    .then(function() {
      //Successful logout
    });
});
