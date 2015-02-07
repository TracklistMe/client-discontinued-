'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdminreleaseCtrl
 * @description
 * # AdminreleaseCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
    .controller('AdminreleaseCtrl', function($location, $scope, $state, $auth, $stateParams, $http, Account, FileUploader, CONFIG) {


        $scope.addMode = false;
        $scope.release = {};
        $scope.serverURL = CONFIG.url
        var labelId = $scope.labelId = $stateParams.idLabel;
        console.log("LABEL ID " + $stateParams.idLabel)
        $scope.editedTrack = null
        $scope.temporaryTrack = null
        var CHARACTER_BEFORE_SEARCH = 3
        $scope.isSearching = false
        $scope.nameAvailable = false
        $scope.nameTooShort = true
        $scope.searchArtistResults = null

        var uploader = $scope.uploader = new FileUploader({
            url: CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/'

        });

        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            if ($scope.addMode == true) {
                // add to the dropzone
                // uploader.queue[0].upload();
                // uploader.queue.pop();
                uploader.processOne(uploader.queue[0]);

            } else {
                // upload directely into the release folder
                uploader.processOne(uploader.queue[0]);


            }
        };

        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');

        };

        $scope.addArtist = function() {
            $http.post(CONFIG.url + '/artists/', {
                displayName: $scope.searchArtistField
            }).
            success(function(data, status, headers, config) {
                $scope.searchArtist();
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        uploader.processOne = function(fileItem) {
            var file = fileItem;
            var fname = file._file.name;

            var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length))) + "_" + Math.floor(Date.now() / 1000);
            file.newFileName = filename;
            var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
            console.log(filename);
            console.log(extension);
            $http.post(CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/createFile/', {
                filename: filename,
                extension: extension,
                size: file.file.size
            }).success(function(data, status, headers, config) {
                console.log("DONE")

                var formDataArray = [{
                    "GoogleAccessId": data.GoogleAccessId,
                    "signature": data.signature,
                    "policy": data.policy,
                    "key": data.key
                }]
                file.url = data.action;
                file.formData = formDataArray;
                console.log(file);
                file.upload();


            }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            console.log(fileItem)
            var fname = fileItem._file.name;


            var filename = fileItem.newFileName;
            var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);


            $http.post(CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/confirmFile', {
                filename: filename,
                extension: extension
            }).success(function(data, status, headers, config) {
                console.log(fileItem.formData[0].key);
                $scope.release.cover = fileItem.formData[0].key;
            }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            uploader.queue.pop()


        };

        $scope.addNewTrack = function() {
            if (!$scope.release.Tracks) { // create array of tracks
                $scope.release.Tracks = []
            }
            $scope.release.Tracks.push({
                ReleaseTracks: {
                    position: $scope.release.Tracks.length + 1
                }
            });
        }

        $scope.addAsProducer = function(artist) {
            $scope.editedTrack.Producer.push(artist);

        }
        $scope.addAsRemixer = function(artist) {
            $scope.editedTrack.Remixer.push(artist);
        }

        $scope.deleteProducer = function(artist) {
            var index = -1;
            for (var i = $scope.editedTrack.Producer.length - 1; i >= 0; i--) {
                if ($scope.editedTrack.Producer[i].id == artist.id) {
                    index = i;
                }
            };
            $scope.editedTrack.Producer.splice(index, 1);
        }
        $scope.deleteRemixer = function(remixer) {

            var index = -1;
            for (var i = $scope.editedTrack.Remixer.length - 1; i >= 0; i--) {
                if ($scope.editedTrack.Remixer[i].id == remixer.id) {
                    index = i;
                }
            };
            $scope.editedTrack.Remixer.splice(index, 1);
            console.log($scope.editedTrack.Remixer)

        }

        $scope.searchArtist = function() {
            if ($scope.searchArtistField.length > CHARACTER_BEFORE_SEARCH) {
                $scope.isSearching = true;
                $scope.nameTooShort = false;
                $http.get(CONFIG.url + '/artists/search/' + $scope.searchArtistField)
                    .success(function(data) {

                        $scope.isSearching = false
                        if (!data) {
                            //!date --> the object is empty, there is no other company with this name, the name is available
                            $scope.nameAvailable = true
                        } else {
                            //date --> the object has something
                            $scope.searchArtistResults = data

                        }
                    })
            } else {
                $scope.nameTooShort = true;
            }
        };

        $scope.createRelease = function() {
            console.log($scope.release)
            $http.post(CONFIG.url + '/releases/', {
                release: $scope.release,
                idLabel: $scope.labelId
            }).
            success(function(data, status, headers, config) {
                console.log('adminRelease/' + $scope.labelId + '/' + data.id);
                $location.path('adminRelease/' + $scope.labelId + '/' + data.id);

            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        }

        $scope.saveRelease = function() {

            // ADMIN RELEASE 
            console.log($scope.release)
            for (var i = $scope.release.Tracks.length - 1; i >= 0; i--) {
                $scope.release.Tracks[i].ReleaseTracks.position = i + 1;
            };
            $http.put(CONFIG.url + '/releases/' + $scope.releaseId, {
                release: $scope.release
            }).
            success(function(data, status, headers, config) {
                $scope.getRelease();
                $scope.editedTrack = null

            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        }


        $scope.editTrack = function(trackId) {
            for (var i = $scope.release.Tracks.length - 1; i >= 0; i--) {
                if ($scope.release.Tracks[i].id == trackId) {
                    $scope.editedTrack = $scope.release.Tracks[i];
                }
            };

        }


        $scope.getRelease = function() {
            $http.get(CONFIG.url + '/releases/' + $scope.releaseId)
                .success(function(data) {
                    console.log(data)
                    $scope.release = data
                })
        }

        // INITIALIZE ITEMS 
        $scope.initialize = function() {
                if ($stateParams.id != null) {
                    // WE GOT A RELEASE 
                    $scope.releaseId = $stateParams.id;
                    $scope.getRelease();
                } else {
                    // we are creating a release
                    $scope.addMode = true;
                    $scope.release.isActive = 0;
                }
            }
            /* DATA PICKER PART 

            */
        $scope.today = function() {
            $scope.release.releaseDate = new Date();
        };


        $scope.clear = function() {
            $scope.release.releaseDate = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };



        $scope.openTimePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        /* end of datapicker */


        /* sortable list 
        Object (event) - structure         
         source:
              index: original index before move.
              itemScope: original item scope before move.
              sortableScope: original sortable list scope.
         dest: index
              index: index after move.
              sortableScope: destination sortable scope. 

        */
        $scope.dragControlListeners = {
            accept: function(sourceItemHandleScope, destSortableScope) {
                return true
            },
            itemMoved: function(event) {
                console.log(event)
            },
            orderChanged: function(event) {

            },
            containment: '#board' //optional param.
        };


        $scope.initialize();




    });
