'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
