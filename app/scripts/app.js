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
    'satellizer'
  ])
  .config(function($stateProvider, $urlRouterProvider, $authProvider) {
 

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
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
        templateUrl: 'partials/profile.html',
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

    /* Auth Providers for 3rd parties auth services */
    $authProvider.twitter({
      url: '/auth/twitter'
    });
  });
