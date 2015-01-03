'use strict';

/**
 * @ngdoc service
 * @name tracklistmeApp.Account
 * @description
 * # Account
 * Service in the tracklistmeApp.
 */
angular.module('tracklistmeApp')
  .factory('Account', function($http, $auth, $rootScope) {
    return {
      getProfile: function() {
        return $http.get($rootScope.server.url + '/me');
      },
      updateProfile: function(profileData) {
        return $http.put($rootScope.server.url + '/me', profileData);
      }
    };
  });


