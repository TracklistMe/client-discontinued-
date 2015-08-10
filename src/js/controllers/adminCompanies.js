'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdmincompaniesCtrl', function($scope, $http, CONFIG) {
  var CHARACTER_BEFORE_SEARCH = 2;
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

  $scope.searchCompaniesAvailability = function() {
    if ($scope.searchCompanyField.length > CHARACTER_BEFORE_SEARCH) {
      $scope.isSearching = true;
      $scope.nameTooShort = false;
      $http.get(CONFIG.url + '/companies/search/' + $scope.searchCompanyField)
        .success(function(data) {
          $scope.isSearching = false;
          if (!data) {
            //!date --> the object is empty, there is no other company with 
            //this name, the name is available
            $scope.nameAvailable = true;
          } else {
            //date --> the object has something
            $scope.nameAvailable = false;
          }
        });
    } else {
      $scope.nameTooShort = true;
    }
  };

  $scope.addCompany = function() {
    // TODO STRING SANITIZING
    $http.post(CONFIG.url + '/companies/', {
      companyName: $scope.searchCompanyField
    }).
    success(function() {
      $scope.updateCompanyList();
      $scope.showPanel = false;
      $scope.searchCompanyField = '';
    });
  };

  $scope.searchUser = function() {
    if ($scope.searchUserField.length > CHARACTER_BEFORE_SEARCH) {
      $http.get(CONFIG.url + '/users/search/' + $scope.searchUserField)
        .success(function(data) {
          $scope.searchUserResults = data;
        });
    }
  };


  $scope.selectFromMultipleUsers = function(user) {
    // create as an array to align to api return type
    $scope.searchUserResults = [user];
  };

  $scope.addUserCompanyAssociation = function() {
    var userId = $scope.searchUserResults[0].id;
    var companyId = $scope.currentCompany.id;
    $http.post(CONFIG.url + '/companies/' + companyId + '/owners/', {
      newOwner: userId
    }).
    success(function() {
      $scope.editCompany(companyId);
    });
  };

  $scope.removeOwner = function(userId) {
    var companyId = $scope.currentCompany.id;
    $http.delete(CONFIG.url + '/companies/' + companyId + '/owners/' + userId).
    success(function() {
      $scope.editCompany(companyId);
    });
  };

  // ACTIVATE COMPANY FORM 
  $scope.activateCompany = function(companyId) {
    $http.put(CONFIG.url + '/companies/' + companyId, {
      isActive: true
    }).
    success(function() {
      $scope.updateCompanyList();
    });
  };

  $scope.deactivateCompany = function(companyId) {
    $http.put(CONFIG.url + '/companies/' + companyId, {
      isActive: false
    }).
    success(function() {
      $scope.updateCompanyList();
    });
  };

  $scope.editCompany = function(idCompany) {
    $http.get(CONFIG.url + '/companies/' + idCompany)
      .success(function(data) {
        $scope.currentCompany = data;
        data.logo = CONFIG.url + '/images/' + data.logo;
      });
  };

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
