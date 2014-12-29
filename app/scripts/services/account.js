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
        return $http.get('http://localhost:3000/me');
      },
      updateProfile: function(profileData) {
        return $http.put('http://localhost:3000/me', profileData);
      }
    };
  });


