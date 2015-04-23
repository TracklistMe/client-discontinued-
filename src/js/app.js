'use strict';


angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'ui.load',
    'ui.jq',
    'smart-table',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'satellizer',
    'htmlSortable'
]).constant("CONFIG", {
    "url": "https://tracklist.me/api",
    //"url": "http://localhost:3000",
    "imagePath": "image"
})