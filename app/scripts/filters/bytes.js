'use strict';

/**
 * @ngdoc filter
 * @name tracklistmeApp.filter:bytes
 * @function
 * @description
 * # bytes
 * Filter in the tracklistmeApp.
 */
angular.module('tracklistmeApp')
  .filter('bytes', function() {
	var units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  return function( bytes, precision ) {
    if ( isNaN( parseFloat( bytes )) || ! isFinite( bytes ) ) {
      return '?';
    }

    var unit = 0;

    while ( bytes >= 1024 ) {
      bytes /= 1024;
      unit ++;
    }

    return bytes.toFixed( + precision ) + ' ' + units[ unit ];
  };
});