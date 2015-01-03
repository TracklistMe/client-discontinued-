'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdmincompaniesCtrl', function ($scope, $http, $rootScope) {
    // add new company form
    var CHARACTER_BEFORE_SEARCH = 2;
    $scope.currentCompany = null;
    $scope.isSearching = false
    $scope.nameAvailable = false
    $scope.nameTooShort = true
    $scope.searchUserResults = null

    $scope.companyList = {}

    $scope.searchCompaniesAvailability = function() { 
      	if($scope.searchCompanyField.length > CHARACTER_BEFORE_SEARCH){
      		$scope.isSearching = true;
      		$scope.nameTooShort = false;
      		$http.get($rootScope.server.url + '/companies/search/'+$scope.searchCompanyField)
      		.success(function(data) {
          		
          		$scope.isSearching = false
          		if(!data){
          			//!date --> the object is empty, there is no other company with this name, the name is available
          			$scope.nameAvailable = true
          		}else{
          			//date --> the object has something
          			$scope.nameAvailable = false
          		}
        	})
      	} else {
      		$scope.nameTooShort = true;
      	}
   	};
   	$scope.addCompany = function(){
   		console.log("ADD COMPANY")
   		// TODO STRING SANITIZING
   		$http.post($rootScope.server.url + '/companies/', {companyName:$scope.searchCompanyField}).
		  success(function(data, status, headers, config) {
		  	$scope.updateCompanyList();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}

   	$scope.searchUser = function() {
   		if($scope.searchUserField.length > CHARACTER_BEFORE_SEARCH){
	   		$http.get($rootScope.server.url + '/users/search/'+$scope.searchUserField)
	      		.success(function(data) {
	          		$scope.searchUserResults = data
   					console.log($scope.searchUserResults)
	        	})
	    }
   	}
   	$scope.selectFromMultipleUsers = function(user){
   		// create as an array to align to api return tyep 
   		$scope.searchUserResults = [user];
   		console.log($scope.searchUserResults)

   	}

   	$scope.addUserCompanyAssociation = function(){
   		var userId = $scope.searchUserResults[0].id;
   		var companyId = $scope.currentCompany.id;
   		console.log(userId);
   		$http.post($rootScope.server.url + '/companies/'+companyId+"/owners/", {newOwner:userId}).
		  success(function(data, status, headers, config) {
		  	$scope.editCompany(companyId)
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}
   	$scope.removeOwner = function(userId){
   		var companyId = $scope.currentCompany.id;
   		$http.delete($rootScope.server.url + '/companies/'+companyId+"/owners/"+userId).
		  success(function(data, status, headers, config) {
		  	$scope.editCompany(companyId)
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}

   	// ACTIVATE COMPANY FORM 
   	$scope.activateCompany = function(companyId){
   		console.log("ACTIVATE")
   		 
   		$http.put($rootScope.server.url + '/companies/'+companyId, {isActive:true}).
		  success(function(data, status, headers, config) {
		  		$scope.updateCompanyList();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}
   	$scope.deactivateCompany = function(companyId){
   		 
   		$http.put($rootScope.server.url + '/companies/'+companyId, {isActive:false}).
		  success(function(data, status, headers, config) {
		  		$scope.updateCompanyList();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}

    $scope.editCompany = function(idCompany){
   		$http.get($rootScope.server.url + '/companies/'+idCompany)
      		.success(function(data) {
      				console.log(data)
          			$scope.currentCompany = data
          	})
   	}
   	$scope.updateCompanyList = function(){
   		$http.get($rootScope.server.url + '/companies/')
      		.success(function(data) {
      				console.log(data)
          			$scope.companyList = data
          		
        	})
   	}

   	$scope.updateCompanyList()


  });
