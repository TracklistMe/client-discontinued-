'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('LogoutCtrl', function($auth, $alert) {
    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
      .then(function() {
        $alert({
          content: 'You have been logged out',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
      });
  });
