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

        $scope.selectFileFromDropZone = "TEST"
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
        $scope.selectTrackToChangeFile = null;

        // when deataching a file from his track, remember to add in the list
        // of potential file to added back. Those files will not fetched back from the call dropzone/
        // so must be handled manually 
        $scope.deatachedList = []
        $scope.assignedList = []
        $scope.dropZoneFiles = []

        var trackUploader = $scope.trackUploader = new FileUploader({
            method: 'POST',
            url: CONFIG.url + '/labels/' + labelId + '/dropZone/'
        });

        trackUploader.onAfterAddingFile = function(fileItem) {
            console.log("fileItem -------------")
            console.log(fileItem)
            console.log("trackUploader -------------")
            console.log(trackUploader);
            $scope.processCDNNegotiation();
        }
        $scope.processCDNNegotiation = function() {
            console.log("Process CDN NEGOTIATION")
            for (var i = 0; i < trackUploader.queue.length; i++) {
                trackUploader.processOne(trackUploader.queue[i]);
            }
        }

        trackUploader.processOne = function(fileItem) {
            var file = fileItem;
            var fname = file._file.name;
            var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
            var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
            console.log(filename);
            console.log(extension);
            $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/createFile/', {
                filename: filename,
                extension: extension,
                size: file.file.size
            }).success(function(data, status, headers, config) {
                console.log("DONE")

                /*
                var formDataArray = [];
                formDataArray["GoogleAccessId"] = data.GoogleAccessId;
                formDataArray["signature"] = data.signature;
                formDataArray["policy"] = data.policy;
                formDataArray["key"] = data.key;
                */

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
        trackUploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        trackUploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };

        trackUploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);

            var fname = fileItem._file.name;
            var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
            var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);


            $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/confirmFile', {
                filename: filename,
                extension: extension
            }).success(function(data, status, headers, config) {
                console.log(data)

                $scope.selectFileFromDropZone = {
                    filaName: filename,
                    extension: extension,
                    path: 'dropZone/' + labelId + '/' + fname
                };

            }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });


            $scope.getDropZoneFiles();
        };

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

            var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
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
                path: null,
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
            console.log("---RELEASE---")
            console.log($scope.release)
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

        $scope.deatach = function(index) {
            // REMEMBER TO DEATACH A TRACK and put back in the dropzone.

            var path = $scope.release.Tracks[index].path;
            var filename = path.replace(/^.*(\\|\/|\:)/, '');
            console.log(filename)
            var extension = filename.split(".")[1];
            filename = filename.split(".")[0];
            $scope.release.Tracks[index].path = null;

            // find if the track already exist in the deatacched tracks

            var foundInDeatached = false;
            for (var i = $scope.deatachedList.length - 1; i >= 0; i--) {
                if ($scope.deatachedList[i].path == path) {
                    foundInDeatached = true
                }
            };

            // need to check if the track would come out from the list of tracks in the dropzone already
            // in that case i should not show it again.
            var foundInDropZone = false;
            for (var i = $scope.dropZoneFiles.length - 1; i >= 0; i--) {
                if ($scope.dropZoneFiles[i].path == path) {
                    foundInDropZone = true
                }
            };

            if (foundInDeatached == false && foundInDropZone == false) {
                $scope.deatachedList.push({
                    fileName: filename,
                    extension: extension,
                    path: path
                })
            }

            for (var i = 0; i < $scope.assignedList.length; i++) {
                console.log("THIS" + $scope.assignedList[i].path)
                console.log("AND" + path)
                if ($scope.assignedList[i].path == path) $scope.assignedList.splice(i, 1);
            }
            // HERE I SHOULD REMOVE THE TRACK FROM LIST OF ASSIGNED TRACK 
        }
        $scope.uplaodSingleTrack = function(index) {
            $scope.open();

        }
        $scope.uploadToDropZone = function(track) {
            $scope.selectTrackToChangeFile = track



        }
        $scope.selectFromDropZone = function(track) {

                $scope.selectTrackToChangeFile = track;
                $scope.selectFileFromDropZone = null
                $scope.getDropZoneFiles();
            }
            /* ASSIGN TO A TRACK A NEW PATH FROM THE DROPZONE */
        $scope.assignDropZoneFileToTrack = function(track) {

            track.path = $scope.selectFileFromDropZone.path
            console.log($scope.release)

            // add the path to a blacklist for the dropzone, this because we are
            // maintaining consistent a status that is not saved in the server yet.

            $scope.assignedList.push({
                path: $scope.selectFileFromDropZone.path
            })

        }
        $scope.getDropZoneFiles = function() {
            $http.get(CONFIG.url + '/labels/' + labelId + '/dropZoneFiles')
                .success(function(data) {
                    // concat the array with the file from the dropbox with the array of file that have been deatached.
                    // Remove duplicates
                    $scope.dropZoneFiles = []
                    for (var k = 0; k < data.length; k++) {
                        $scope.dropZoneFiles.push(data[k])
                    }


                    for (var i = 0; i < $scope.deatachedList.length; i++) {
                        found = false;
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].path == $scope.deatachedList[i].path) {
                                found = true;
                            }
                        }
                        if (found == false) {
                            $scope.dropZoneFiles.push($scope.deatachedList[i])
                        }

                    }



                    // REMOVE ALL THE FILE THAT HAS BEEN USED BUT ARE INCONSISTENT WITH THE STATUS OF THE 
                    // DROPZONE IN DB
                    var array = []
                    for (var i = 0; i < $scope.dropZoneFiles.length; i++) {
                        var found = false;
                        for (var j = 0; j < $scope.assignedList.length; j++) {
                            if ($scope.dropZoneFiles[i].path == $scope.assignedList[j].path) {
                                found = true
                            }
                        }
                        if (found == false) {
                            array.push($scope.dropZoneFiles[i]);
                        }
                    }
                    $scope.dropZoneFiles = array;
                })
        }
        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function(size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.editTrack = function(trackId) {
            for (var i = $scope.release.Tracks.length - 1; i >= 0; i--) {
                if ($scope.release.Tracks[i].id == trackId) {
                    $scope.editedTrack = $scope.release.Tracks[i];
                }
            };

        }


        $scope.removeTrack = function(trackId) {
            for (var i = $scope.release.Tracks.length - 1; i >= 0; i--) {
                console.log("compare" + $scope.release.Tracks[i].id + " - " + trackId)
                if ($scope.release.Tracks[i].id == trackId) {
                    $scope.release.Tracks.splice(i, 1)
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
