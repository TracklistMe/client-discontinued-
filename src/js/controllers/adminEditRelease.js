'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminEditReleaseCtrl', function($location, $scope, $state, $auth, $stateParams, $http, $modal, Account, FileUploader, CONFIG) {
    // when deataching a file from his track, remember to add in the list
    // of potential file to added back. Those files will not fetched back from the call dropzone/
    // so must be handled manually 
    $scope.deatachedList = [];
    $scope.assignedList = [];
    $scope.dropZoneFiles = [];



    // DATA PICHER 

    var CHARACTER_BEFORE_SEARCH = 1;
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };



    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };



    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];









    var releaseId = $stateParams.id
    $scope.releaseId = releaseId;
    $scope.serverURL = CONFIG.url
    $scope.release = null
    $scope.company = null
    $scope.genres;
    $scope.releasesToProcess = null
    $scope.catalog = null

    $scope.modalSelectFromCDN;
    $scope.modalUploadDropbox;
    $scope.selectedTrack;
    $scope.selectFileFromDropZone;
    $scope.addMode;
    // MODAL ADMIN
    // 

    $scope.openUploadToDropbox = function(track) {
        $scope.selectedTrack = track;
        $scope.modalUploadDropbox = $modal.open({
            templateUrl: 'modalUploadDropbox',
            scope: $scope,
            backdropClass: 'bg-dark'

        });
        console.log("OPEN UPLOAD DROPBOX")
        $scope.modalUploadDropbox.result.then(function(selectedItem) {
            console.log(selectedItem);
        }, function() {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.closeUploadToDropbox = function() {
        $scope.modalUploadDropbox.close();
    }
    // OPENING MODALS FOR CDN ULOAD

    $scope.openSelectFromCDN = function(track) {

        $scope.selectedTrack = track;
        $scope.getDropZoneFiles();
        $scope.modalSelectFromCDN = $modal.open({
            templateUrl: 'modalSelectFromCDN',
            scope: $scope
        });

        $scope.modalSelectFromCDN.result.then(function(selectedItem) {
            console.log(selectedItem);
        }, function() {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.closeSelectFromCDN = function() {
        $scope.modalSelectFromCDN.close();
    }

    $scope.assignDropZoneFileToTrack = function(file) {
        console.log(file)
        $scope.closeSelectFromCDN();
        $scope.selectedTrack.path = file.path


        // add the path to a blacklist for the dropzone, this because we are
        // maintaining consistent a status that is not saved in the server yet.

        $scope.assignedList.push({
            path: file.path
        })

    }



    /* UPLOAD THE COVER */



    var uploader = $scope.uploader = new FileUploader({
        method: 'POST'
    });




    // CALLBACKS

    uploader.currentUploading = 0

    uploader.processCDNNegotiation = function() {
        console.log("Process CDN NEGOTIATION")
        uploader.url = CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/';
        uploader.processOne(uploader.queue[uploader.currentUploading]);

    }

    uploader.processOne = function(fileItem) {
        console.log("PROCESS ---- ITEM  queue.Legth : " + uploader.queue.length);
        console.log("--------------------")
        console.log(fileItem)
        var file = fileItem;
        var fname = file._file.name;
        var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
        var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
        console.log(filename);
        console.log(extension);
        $http.post(CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/createFile/', {
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



    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        uploader.processCDNNegotiation()

        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);

        var fname = fileItem._file.name;
        var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
        var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);


        $http.post(CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/confirmFile', {
            filename: filename,
            extension: extension
        }).success(function(data, status, headers, config) {
            console.log("FILE CONFERMATO")
            console.log(fileItem)
            $scope.release.cover = "dropZone/" + $scope.labelId + "/" + fileItem._file.name;
            console.log("COVER" + $scope.release.cover)

        }).error(function(data, status, headers, config) {
            console.log(data)
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        uploader.queue.pop();
        if (uploader.currentUploading < uploader.queue.length) {
            uploader.currentUploading++
            uploader.processCDNNegotiation();
        }

    };






    //

    $scope.uploadToDropZone = function(track) {
        $scope.selectTrackToChangeFile = track
    }


    // CDN UPLOAD OF ADDITIONAL TRACKS
    // 
    var trackUploader = $scope.trackUploader = new FileUploader({
        method: 'POST',
        // I donno $scope.release.Labels[0].id at this point in execution.
        // url: CONFIG.url + '/labels/' + $scope.release.Labels[0].id + '/dropZone/'
    });

    trackUploader.onAfterAddingFile = function(fileItem) {
        console.log("fileItem ------------- " + trackUploader.queue.length)
        console.log(fileItem)
        console.log("trackUploader -------------" + $scope.trackUploader.queue.length)
        console.log(trackUploader);
        $scope.processCDNNegotiation();
    }
    $scope.processCDNNegotiation = function() {
        console.log("Process CDN NEGOTIATION")
        trackUploader.url = CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/';
        for (var i = 0; i < trackUploader.queue.length; i++) {
            console.log("ELEMENT IN QUEUE")
            trackUploader.processOne(trackUploader.queue[i]);
        }
    }

    trackUploader.processOne = function(fileItem) {
        console.log("START UPLOADING TRACK")
        var file = fileItem;
        var fname = file._file.name;
        var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
        var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
        console.log(filename);
        console.log(extension);
        $http.post(CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/createFile/', {
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


        $http.post(CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/confirmFile', {
            filename: filename,
            extension: extension
        }).success(function(data, status, headers, config) {
            console.log(data)

            $scope.selectFileFromDropZone = {
                filaName: filename,
                extension: extension,
                path: 'dropZone/' + $scope.labelId + '/' + fname
            };

        }).error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


        $scope.getDropZoneFiles();
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


    /* SORTABLE PLUGIN FOR ANGULAR */


    $scope.sortableOptions = {
        placeholder: '<div class="sortable-placeholder"><div></div></div>',
        forcePlaceholderSize: false
    };

    $scope.sortableCallback = function(startModel, destModel, start, end) {
        console.log("MOVED")
    };









    $scope.getDropZoneFiles = function() {
        $http.get(CONFIG.url + '/labels/' + $scope.labelId + '/dropZoneFiles')
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



    $scope.createRelease = function(id) {
        console.log("Create Release")
        $location.path('createRelease/' + releaseId);
    }

    $scope.getGenres = function() {
        $http.get(CONFIG.url + '/genres/')
            .success(function(data) {
                $scope.genres = data

            })
    }
    $scope.getCompany = function(labelId) {
        $http.get(CONFIG.url + '/labels/' + labelId + '/companies')
            .success(function(data) {
                $scope.company = data

            })
    }


    $scope.getLabel = function(labelId) {
        $http.get(CONFIG.url + '/labels/' + labelId)
            .success(function(data) {
                $scope.label = data
            })
    }

    // ADD NEW TRACK
    $scope.addNewTrack = function() {
        if (!$scope.release.Tracks) { // create array of tracks
            $scope.release.Tracks = []
        }
        $scope.release.Tracks.push({
            path: null,
            infoVisible: true, // open the panel for editing
            title: "Track Title",
            version: "Version Name",
            ReleaseTracks: {
                position: $scope.release.Tracks.length + 1
            },
            Producer: [],
            Remixer: []
        });
    }


    // PRODUCER-ARTIST - 

    $scope.deleteProducer = function(artist, track) {
        var index = -1;
        for (var i = track.Producer.length - 1; i >= 0; i--) {
            if (track.Producer[i].id == artist.id) {
                index = i;
            }
        };
        track.Producer.splice(index, 1);
    }

    $scope.searchArtist = function(track) {
        if (track.searchArtist.length > CHARACTER_BEFORE_SEARCH) {
            track.searchingArtist = true;
            track.resultArrived = false
            $scope.nameTooShort = false;
            $http.get(CONFIG.url + '/artists/search/' + track.searchArtist)
                .success(function(data) {

                    track.resultArrived = true

                    if (!data) {
                        //!date --> the object is empty, there is no other company with this name, the name is available
                        track.artistResults = []
                    } else {
                        //date --> the object has something
                        track.artistResults = data

                    }
                })
        } else {
            $scope.nameTooShort = true;
        }
    };

    $scope.candidateArtist = function(track, artist) {

        track.searchingArtist = false;
        track.candidateArtist = artist;
        track.searchArtist = artist.displayName
    };
    $scope.stopAddingNewArtist = function(track) {
        track.searchingArtist = false;
        track.candidateArtist = null;
        track.searchArtist = ""
        track.showAddArtist = false
        track.searchingArtist = false
    }
    $scope.addAsProducer = function(track, artist) {
        if (track.candidateArtist) {
            track.Producer.push({
                id: track.candidateArtist.id,
                displayName: track.candidateArtist.displayName
            });
            track.candidateArtist = null;
            track.searchArtist = "";
            track.showAddArtist = false
            track.searchingArtist = false
        } else {
            //TODO DISPLAY SOMETHING 
        }
    }



    // REMIXER-ARTIST - 

    $scope.deleteRemixer = function(remixer, track) {
        var index = -1;
        for (var i = track.Remixer.length - 1; i >= 0; i--) {
            if (track.Remixer[i].id == remixer.id) {
                index = i;
            }
        };
        track.Remixer.splice(index, 1);
    }

    $scope.searchRemixer = function(track) {
        if (track.searchRemixer.length > CHARACTER_BEFORE_SEARCH) {
            track.searchingRemixer = true;
            track.resultRemixerArrived = false
            $scope.nameTooShort = false;
            $http.get(CONFIG.url + '/artists/search/' + track.searchRemixer)
                .success(function(data) {

                    track.resultRemixerArrived = true

                    if (!data) {
                        //!date --> the object is empty, there is no other company with this name, the name is available
                        track.remixerResults = []
                    } else {
                        //date --> the object has something
                        track.remixerResults = data

                    }
                })
        } else {
            $scope.nameTooShort = true;
        }
    };

    $scope.candidateRemixer = function(track, remix) {
        track.searchingRemixer = false;
        track.candidateRemixer = remix;
        track.searchRemixer = remix.displayName
    };
    $scope.stopAddingNewRemixer = function(track) {

        track.candidateRemixer = null;
        track.searchRemixer = ""
        track.showAddRemixer = false
        track.searchingRemixer = false
    }
    $scope.addAsRemixer = function(track, remixer) {
        console.log(track)
        if (track.candidateRemixer) {
            if (!track.Remixer) {
                track.Remixer = []
            }
            track.Remixer.push({
                id: track.candidateRemixer.id,
                displayName: track.candidateRemixer.displayName
            });
            track.candidateRemixer = null;
            track.searchRemixer = "";
            track.showAddRemixer = false;
            track.searchingRemixerer = false;
        } else {
            //TODO DISPLAY SOMETHING 
        }
    }

    $scope.removeTrack = function(track) {
        track.isActive = false;

    }

    $scope.reactivateTrack = function(track) {
        track.isActive = true
    }


    $scope.deatach = function(track) {
        // REMEMBER TO DEATACH A TRACK and put back in the dropzone.

        var path = track.path;
        var filename = path.replace(/^.*(\\|\/|\:)/, '');
        console.log(filename)
        var extension = filename.split(".")[1];
        filename = filename.split(".")[0];
        track.path = null;

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

    $scope.selectFromDropZone = function(track) {

        $scope.selectTrackToChangeFile = track;
        $scope.selectFileFromDropZone = null
        $scope.getDropZoneFiles();
    }
    $scope.getRelease = function() {
        $http.get(CONFIG.url + '/releases/' + releaseId)
            .success(function(data) {
                $scope.release = data
                $scope.labelId = $scope.release.Labels[0].id;
                $scope.getLabel($scope.labelId);
                $scope.getCompany($scope.labelId);
                $scope.getGenres();
            })
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
        }).success(function(data, status, headers, config) {
            //  $scope.getRelease();
            //$scope.editedTrack = null
            console.log("SUCCESS!")
            $location.path("app/adminRelease/" + $scope.releaseId);

        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    }

    $scope.initialize = function() {
        if ($stateParams.id != null) {
            // WE GOT A RELEASE 
            $scope.releaseId = $stateParams.id;
            $scope.addMode = false;
            $scope.getRelease();
        } else {
            // we are creating a release
            $scope.labelId = $stateParams.labelId;
            $scope.addMode = true;
            $scope.release = {
                title: "Release Title",
                isActive: false

            }
            $scope.getLabel($scope.labelId)
            $scope.getCompany($scope.labelId);
            $scope.getGenres();
        }
    }
    $scope.initialize();

});