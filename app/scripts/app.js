'use strict';

/**
 * @ngdoc overview
 * @name tracklistmeApp
 * @description
 * # tracklistmeApp
 *
 * Main module of the application.
 */
angular
  .module('tracklistmeApp', [
    'ngAnimate',
    'ui.router',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'satellizer',
    'mgcrea.ngStrap',
    'angularFileUpload'
  ])
  .config(function($stateProvider, $urlRouterProvider, $authProvider) {
 

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          authenticated: function($location, $auth) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/login');
            }
          }
        }
      });
    $urlRouterProvider.otherwise('/');

    
    $authProvider.loginUrl = 'http://localhost:3000/auth/login';
 
    $authProvider.signupUrl = 'http://localhost:3000/auth/signup';


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
      url: 'http://localhost:3000/auth/twitter',
      type: '1.0',
      popupOptions: { width: 495, height: 645 }
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
