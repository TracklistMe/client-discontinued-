'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ReleaseCtrl
 * @description
 * # ReleaseCtrl
 * Controller of the tracklistmeApp
 */
app.controller('ReleaseCtrl', function($location, $scope, $state, $auth,
  $stateParams, $http, CONFIG) {
  var releaseId = $stateParams.id;

  $scope.serverURL = CONFIG.url;
  $scope.release = null;
  $scope.allArtists = [];

  $scope.getRelease = function() {
    $http.get(CONFIG.url + '/releases/' + releaseId)
      .success(function(data) {
        $scope.release = data;
        // use the artistID as hash for counting the occurencies of the array.
        var countOccurencies = [];
        // for each track in the release
        for (var i = 0; i < $scope.release.Tracks.length; i++) {
          // for each producer in the track
          for (var j = 0; j < $scope.release.Tracks[i].Producer.length; j++) {
            var id = $scope.release.Tracks[i].Producer[j].id;
            if (countOccurencies[id] === null) {
              // first time that i found this Producer
              countOccurencies[id] = {
                occurencies: 1,
                producer: $scope.release.Tracks[i].Producer[j]
              };
            } else {
              countOccurencies[id].occurencies++;
            }

          }
        }

        countOccurencies.sort(function(a, b) {
          return b.occurencies - a.occurencies;
        });

        var k = 0;
        while (countOccurencies[k] !== null) {
          $scope.allArtists.push(countOccurencies[k].producer);
          k++;
        }
      });
  };
  $scope.getRelease();
});
