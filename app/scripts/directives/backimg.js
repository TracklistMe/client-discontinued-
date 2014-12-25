'use strict';

/**
 * @ngdoc directive
 * @name tracklistmeApp.directive:backImg
 * @description
 * # backImg
 */
angular.module('tracklistmeApp')
  .directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});