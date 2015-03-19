'use strict';

/**
 * @ngdoc service
 * @name tracklistmeApp.Account
 * @description
 * # Account
 * Service in the tracklistmeApp.
 */
angular.module('app')
  .factory('Account', function($http, $auth, CONFIG) {
    return {
      getProfile: function() {
        return $http.get(CONFIG.url + '/me');
      },
      updateProfile: function(profileData) {
        return $http.put(CONFIG.url + '/me', profileData);
      }
    };
  });


