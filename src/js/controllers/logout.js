'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the tracklistmeApp
 */
app.controller('LogoutCtrl', function($auth) {
    console.log("LOGOUT CONTROLLER")
    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
      .then(function() {
        console.log("LOGOUT")
      });
  });
