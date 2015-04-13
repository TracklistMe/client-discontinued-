'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ArtistCtrl
 * @description
 * # ArtistCtrl
 * Controller of the tracklistmeApp
 */
app.controller('ArtistCtrl', function($location, $scope, $state, $auth, $stateParams, $http, CONFIG) {
    var artistId = $stateParams.id

    console.log("Artist PAGE")
    $scope.serverURL = CONFIG.url
    $scope.artist;
    $scope.allArtists = []

    $scope.getArtist = function() {
        $http.get(CONFIG.url + '/artists/' + artistId)
            .success(function(data) {
                $scope.artist = data
                console.log(data)
                /*
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

                */
            })
    }
    $scope.getArtist()

});