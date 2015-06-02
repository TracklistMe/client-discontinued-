'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ArtistCtrl
 * @description
 * # ArtistCtrl
 * Controller of the tracklistmeApp
 */
app.controller('CartCtrl', function($location, $scope, $state, $auth, $stateParams, $http, CONFIG, ngCart, stripe) {
    console.log("---")
    console.log(stripe)
    console.log("---")
    $scope.serverURL = CONFIG.url
    $scope.cart = ngCart;
    $scope.cart.setTaxRate(20.0);
    $scope.payment = {}

    /*
     STRIPE PROCESS TO CHECKOUT

     1. create a card object and send to stripe.
     2. stripe send back an object to sign a transaction with
     3. send to nodejs the request to process the payment
     -----------
     4. NODE JS RECALCULATE PRICE TO BE SURE IS CORRECT
     5. NODE JS MARK AS TRANSACTION ALL THE TRACKS
     6. node sign with the secret key the request
	 7. NODE MOVE ALL THE TRACKS/RELEASE FROM CART TO LIBRARY
	 8. send back confirmation (should redirect to the library of the user)


     */
    $scope.charge = function() {
        $scope.payment.card = $scope.card;
        $scope.payment.card.exp_year = $scope.card.expiration.year;
        $scope.payment.card.exp_month = $scope.card.expiration.month;

        return stripe.card.createToken($scope.payment.card)
            .then(function(token) {
                console.log('token created for card ending in ', token.card.last4);
                var payment = angular.copy($scope.payment);
                console.log("TOKEN " + token.id)
                payment.card = void 0;
                payment.value = $scope.cart.totalCost();
                payment.currency = $scope.cart.getCurrencyISOName();
                payment.token = token.id;
                payment.cart = $scope.cart.getItemsIds();
                return $http.post($scope.serverURL + '/payments', payment);
            })
            .then(function(payment) {
                console.log('successfully submitted payment for $');
                console.log(payment)


            })
            .catch(function(err) {
                if (err.type && /^Stripe/.test(err.type)) {
                    console.log('Stripe error: ', err.message);
                } else {
                    console.log('Other error occurred, possibly with your API', err.message);
                }
            });
    };
});