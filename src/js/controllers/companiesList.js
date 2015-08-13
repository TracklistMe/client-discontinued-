'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('CompaniesListCtrl', function($scope, $http, CONFIG) {
  // add new company form



  $scope.predicates = ['displayName'];
  $scope.selectedPredicate = $scope.predicates[0];
  $scope.itemsByPage = 5;
  $scope.rowCollectionPage = [];

  $scope.currentCompany = null;
  $scope.isSearching = false;
  $scope.nameAvailable = false;
  $scope.nameTooShort = true;
  $scope.searchUserResults = null;

  $scope.companyList = [{}];

  $scope.updateCompanyList = function() {
    $http.get(CONFIG.url + '/companies/')
      .success(function(data) {
        $scope.companyList = data;
        for (var prop in data) {
          data[prop].logo = CONFIG.url + '/images/' + data[prop].logo;
        }
      });
  };

  $scope.updateCompanyList();

});
