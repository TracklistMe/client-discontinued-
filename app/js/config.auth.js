'use strict';

/**
 * Config for authentication
 */
angular.module('app').config(function($authProvider, CONFIG) {
 
    var authServerURL = CONFIG.url;

    $authProvider.loginUrl = authServerURL + '/auth/login';
    $authProvider.signupUrl = authServerURL + '/auth/signup';
    

    $authProvider.facebook({
        clientId: '1377656882510514'
    });


    $authProvider.github({
        clientId: '0ba2600b1dbdb756688b'
    });

    $authProvider.linkedin({
        clientId: '77cw786yignpzj'
    });

    $authProvider.yahoo({
        clientId: 'dj0yJmk9SDVkM2RhNWJSc2ZBJmQ9WVdrOWIzVlFRMWxzTXpZbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0yYw--'
    });

    $authProvider.twitter({
        url: authServerURL + '/auth/twitter',
        type: '1.0',
        popupOptions: {
            width: 495,
            height: 645
        }
    });


    $authProvider.live({
        clientId: '000000004C12E68D'
    });

    $authProvider.oauth2({
        name: 'foursquare',
        url: '/auth/foursquare',
        clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
        authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    });
  });