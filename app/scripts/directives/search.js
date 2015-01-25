'use strict';

/**
 * @ngdoc directive
 * @name tracklistmeApp.directive:search
 * @description
 * # search
 */
angular.module('tracklistmeApp')
    .directive('focusable', function() {
        return function(scope, element, attrs) {
            console.log("ATTACHED SEARCH")
            console.log(attrs)
            attrs.$observe('focusable', function(newValue) {
                console.log("FOCUS")
                console.log(newValue)
                console.log("FOCUS")
                console.log(element[0])
                element[0].focus();
            });
        }
    }).directive('stopEvent', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.bind('keypress', function(e) {
                    e.stopPropagation();
                });
                element.bind('keyup', function(e) {
                    console.log("keyup")
                    e.stopPropagation();
                });
            }
        };
    });
