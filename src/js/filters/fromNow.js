'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
    .filter('fromNow', function() {
        return function(date) {
            return moment(date).fromNow();
        }
    }).filter('secondsToTimeString', function() {
        return function(seconds) {
            var hours = Math.floor(seconds / (60 * 60));

            var divisor_for_minutes = seconds % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);

            var divisor_for_seconds = divisor_for_minutes % 60;
            seconds = Math.ceil(divisor_for_seconds);

            // add leading zero and start concatenating the string
            var timeString = (seconds < 10) ? ("0" + seconds) : seconds;
            if (minutes > 0) {
                timeString = ((minutes < 10) ? ("0" + minutes) : minutes) + ":" + timeString
            }
            if (hours > 0) {
                timeString = hours + ":" + timeString;
            }
            return timeString;
        }
    });