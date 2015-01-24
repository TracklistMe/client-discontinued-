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
    });
