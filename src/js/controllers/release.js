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
        // I want to list all the producer that belongs to the release
        // without repeating them. 

        // for each track
        for (var i = 0; i < $scope.release.Tracks.length; i++) {
          // for each Producer
          for (var j = 0; j < $scope.release.Tracks[i].Producer.length; j++) {
            var foundInAlreadyAddedProducers = false;
            for (var k = 0; k < $scope.allArtists.length; k++) {
              if ($scope.allArtists[k].id ===
                $scope.release.Tracks[i].Producer[j].id) {
                // the artists already exists
                foundInAlreadyAddedProducers = true;
              }
            }
            //if it wasn't already added, add it.
            if (!foundInAlreadyAddedProducers) {
              $scope.allArtists.push($scope.release.Tracks[i].Producer[j]);
            }
          }
        }

      });
  };
  $scope.getRelease();
});
