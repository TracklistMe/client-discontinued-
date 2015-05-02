'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('HomepageController', function($sce, $scope, $http, CONFIG, toaster) {

    $scope.releases = []
    $scope.serverURL = CONFIG.url;


    // should be merged with the underneath function searchForEditArtistNameAvailability
    $scope.retrieveAllRelease = function() {

        $http.get(CONFIG.url + '/releases/')
            .success(function(data) {
                $scope.releases = data;

            })

    };



    $scope.addRelease = function(id) {
        var positionOfTheRelease = id;
        var release = $scope.releases[positionOfTheRelease];

        console.log(release);


        var tracksObject = [];
        for (var i = 0; i < release.Tracks.length; i++) {

            var track = {}
            track.title = release.Tracks[i].title + " (" + release.Tracks[i].version + ")";

            track.artist = "";
            for (var j = 0; j < release.Tracks[i].Producer.length; j++) {
                track.artist += release.Tracks[i].Producer[j].displayName + ", ";
            }


            track.artist = track.artist.substring(0, track.artist.length - 2);

            track.poster = release.cover;

            track.sources = []
            // Mp3 version 
            track.sources.push({
                    src: $sce.trustAsResourceUrl($scope.serverURL + "/snippets/" + release.Tracks[i].snippetPath),
                    type: "audio/mpeg"
                }, {
                src: $sce.trustAsResourceUrl($scope.serverURL + "/snippets/" + release.Tracks[i].oggSnippetPath),
                type: "audio/ogg"
            })


            tracksObject.push(track)
        };
        $scope.$emit('addNewTrack',

            tracksObject


        );






    }


    $scope.retrieveAllRelease();
});