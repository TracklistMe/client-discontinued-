'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', function($scope,  $auth) {
    $scope.login = function() {
      $auth.login({ email: $scope.user.email, password: $scope.user.password })
        .then(function() {
          console.log("You have successfully logged in")
        })
        .catch(function(response) {
          console.log("response.data.message")
        });
    };
    $scope.authenticate = function(provider) {
      console.log("TENTATIVO DI AUTENTICAZIONE CON "+provider)
      $auth.authenticate(provider)
        .then(function() { 
          console.log("AUTENTICATO UFFICIALMENTE")
         })
        .catch(function(response) {
          console.log(response)
         
        });
    };
  });

