'use strict';

/**
 * @ngdoc directive
 * @name tracklistmeApp.directive:backgroundImage
 * @description
 * # backgroundImage
 */
angular.module('tracklistmeApp')
  .directive('backgroundImage', function (CONFIG) {
    return function(scope, element, attrs){
        var url = attrs.backgroundImage;
 
        console.log(url)

        //{{serverURL}}/images/
        element.css({
            'background-image': 'url('+url+')',
            'background-size' : 'cover'
        });
    };
  });
