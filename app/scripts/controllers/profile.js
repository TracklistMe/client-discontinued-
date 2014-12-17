'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('ProfileCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
