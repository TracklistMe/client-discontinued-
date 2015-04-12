'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ReleaseCtrl
 * @description
 * # ReleaseCtrl
 * Controller of the tracklistmeApp
 */
app.controller('ReleaseCtrl', function($location, $scope, $state, $auth, $stateParams, $http, CONFIG) {
    var releaseId = $stateParams.id

    console.log("RELEASE PAGE")
    $scope.serverURL = CONFIG.url
    $scope.release;
    $scope.allArtists = []

    $scope.getRelease = function() {
        $http.get(CONFIG.url + '/releases/' + releaseId)
            .success(function(data) {
                $scope.release = data
                console.log(data)

                // TO BE IMPROVE
                // use the artistID as hash for counting the occurencies of the array.
                var countOccurencies = []
                for (var i = 0; i < $scope.release.Tracks.length; i++) {
                    for (var j = 0; j < $scope.release.Tracks[i].Producer.length; j++) {
                        if (countOccurencies[$scope.release.Tracks[i].Producer[j].id] == null) {
                            // first time that i found this Producer
                            countOccurencies[$scope.release.Tracks[i].Producer[j].id] = {
                                occurencies: 1,
                                producer: $scope.release.Tracks[i].Producer[j]
                            }
                        } else {
                            countOccurencies[$scope.release.Tracks[i].Producer[j].id].occurencies++
                        }

                    }
                }

                countOccurencies.sort(function(a, b) {
                    return b.occurencies - a.occurencies
                })
                console.log(countOccurencies)
                var i = 0;
                while (countOccurencies[i] != null) {
                    $scope.allArtists.push(countOccurencies[i].producer)
                    i++;
                }
            })
    }
    $scope.getRelease()

});