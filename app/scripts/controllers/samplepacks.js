'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:SamplepacksCtrl
 * @description
 * # SamplepacksCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('SamplepacksCtrl', function ($scope, $http, CONFIG, $location,$window) {
  			$scope.value = null;
  			$scope.currency = "";
  			$scope.idproduct = ""

		   var handler = StripeCheckout.configure({
	              name: "Custom Example",
	              token: function(token, args) {
	               
	              }
	          });

		    $scope.setProduct = function(value,currency,idproduct){
			$scope.value = value;
  			$scope.currency = currency;
  			$scope.idproduct = idproduct;


		    }

		   $scope.doCheckoutSimple = function(token) {
		   	console.log(token)
	  		var email = token.email;
		   	var token = token.id;
		   	var value = $scope.value;
		   	var currency = $scope.currency;
		   	var idproduct = $scope.idproduct;

		   		$http.post(CONFIG.url + '/payment/stripe/', {
	                email: email,
	                token: token,
	                value: value,
	                currency: currency,
	                idproduct: idproduct
	            }).success(function(data, status, headers, config) {
	                

	               //$location.path(data);
	         
					$window.open(data, '_self', '');
					
	                /*
	                var formDataArray = [];
	                formDataArray["GoogleAccessId"] = data.GoogleAccessId;
	                formDataArray["signature"] = data.signature;
	                formDataArray["policy"] = data.policy;
	                formDataArray["key"] = data.key;
	                */

	               

	            }).error(function(data, status, headers, config) {
	                // called asynchronously if an error occurs
	                // or server returns response with an error status.
	            });
          };
         

  });
