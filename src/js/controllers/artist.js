'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ArtistCtrl
 * @description
 * # ArtistCtrl
 * Controller of the tracklistmeApp
 */
app.controller('ArtistCtrl', function($location, $scope, $state,
    $auth, $stateParams, $http, CONFIG) {
    var artistId = $stateParams.id;

    $scope.serverURL = CONFIG.url;
    $scope.artist = null;
    $scope.allArtists = [];

    $scope.getArtist = function() {
        $http.get(CONFIG.url + '/artists/' + artistId)
            .success(function(data) {
                $scope.artist = data;
                $scope.artist.avatar =
                    $scope.serverURL + '/artists/' +
                    artistId +
                    '/profilePicture/small/' +
                    '?d=' + Date.now();
                $scope.artist.largeAvatar =
                    $scope.serverURL + '/artists/' +
                    artistId +
                    '/profilePicture/large/' +
                    '?d=' + Date.now();
            });
    };
    $scope.getArtist();

});