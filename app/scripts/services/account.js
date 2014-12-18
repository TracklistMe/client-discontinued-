'use strict';

/**
 * @ngdoc service
 * @name tracklistmeApp.Account
 * @description
 * # Account
 * Service in the tracklistmeApp.
 */
angular.module('tracklistmeApp')
  .factory('Account', function($http, $auth) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      }
    };
  });
