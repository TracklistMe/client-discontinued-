'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminlabelsCtrl', function($scope, $http, CONFIG) {
  // add new company form
  $scope.labelList = [{}];


  $scope.updateLabelList = function() {
    $http.get(CONFIG.url + '/me/labels/')
      .success(function(data) {
        $scope.labelList = data;
        for (var prop in data) {
          data[prop].logo =
            CONFIG.url +
            '/labels/' +
            data[prop].id +
            '/profilePicture/small';
        }
      });
  };
  $scope.updateLabelList();

});
