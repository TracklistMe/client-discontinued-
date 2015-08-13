'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', function($scope, $auth) {
  $scope.login = function() {
    $auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then(function() {
        //succesffuly logged in 
      })
      .catch(function() {
        //message is available at 
        //'response.data.message'
        //you need to pass respone in the parameter of the catch.
      });
  };
  $scope.authenticate = function(provider) {
    //Attempted autentication using the provider passsed as parameter
    $auth.authenticate(provider)
      .then(function() {
        // You are officialy autenticated 
      })
      .catch(function() {
        //message is available at 
        //'response.data.message'
        //you need to pass respone in the parameter of the catch.
      });
  };
});
