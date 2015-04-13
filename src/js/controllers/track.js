'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ReleaseCtrl
 * @description
 * # ReleaseCtrl
 * Controller of the tracklistmeApp
 */
app.controller('TrackCtrl', function($location, $scope, $state, $auth, $stateParams, $http, CONFIG) {
    var trackId = $stateParams.id

    console.log("RELEASE PAGE")
    $scope.serverURL = CONFIG.url
    $scope.track;


    $scope.getRelease = function() {
        $http.get(CONFIG.url + '/tracks/' + trackId)
            .success(function(data) {
                $scope.track = data
                $scope.getWaveform();
            })
    }
    $scope.getWaveform = function() {
        $http.get(CONFIG.url + "/waveforms/" + $scope.track.waveform).success(function(data) {
            console.log(data);
        })
    }

    $scope.getRelease();

});