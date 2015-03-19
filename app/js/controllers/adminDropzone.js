app.controller('FileUploadCtrl', function($location, $scope, $state, $auth, $stateParams, $http, Account, FileUploader, CONFIG) {


    var labelId = $stateParams.id


    var uploader = $scope.uploader = new FileUploader({
        method: 'POST',
        url: CONFIG.url + '/labels/' + labelId + '/dropZone/'
    });


    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            return this.queue.length < 10;
        }
    });


    // CALLBACKS


    $scope.processCDNNegotiation = function() {
        console.log("Process CDN NEGOTIATION")
        for (var i = 0; i < uploader.queue.length; i++) {
            uploader.processOne(uploader.queue[i]);
        }
    }

    uploader.processOne = function(fileItem) {
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


    uploader.onAfterAddingFile = function(fileItem) {

        /*
            var fname = fileItem._file.name;
            var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
            var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
            console.log(filename);
            console.log(extension);
            $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/createFile/', {
                filename: filename,
                extension: extension
            }).success(function(data, status, headers, config) {


                var formDataArray = [{
                    "GoogleAccessId": data.GoogleAccessId,
                    "signature": data.signature,
                    "policy": data.policy,
                    "key": data.key
                }]
                file.formData = formDataArray;
            }).error(function(data, status, headers, config) {
                // THERE wERE PROBLEM IN ASSIGNING INFORMATIONS 
            });
*/


    };
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        // Create the file on the CDN
        // 
        //  
        /*
            $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/createFile/', {}).
            success(function(data, status, headers, config) {
                console.log("DONE")
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
          */

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


        $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/confirmFile', {
            filename: filename,
            extension: extension
        }).success(function(data, status, headers, config) {
            console.log(data)

        }).error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


        $scope.getDropZoneFiles();
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
        //catalogUploader.clearQueue()
        $scope.getToProcessReleases();
        //$scope.getDropZoneFiles();
    };

    $scope.getLabel = function() {
        $http.get(CONFIG.url + '/labels/' + labelId)
            .success(function(data) {
                $scope.label = data
            })
    }

    $scope.getDropZoneFiles = function() {
        $http.get(CONFIG.url + '/labels/' + labelId + '/dropZoneFiles')
            .success(function(data) {
                $scope.dropZoneFiles = data
            })
    }
    $scope.processReleases = function() {
        $http.post(CONFIG.url + '/labels/' + labelId + '/processReleases/', {}).
        success(function(data, status, headers, config) {
            console.log("DONE")
            $scope.getToProcessReleases();
            $scope.getDropZoneFiles();
            $scope.getCatalog();
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    }

    $scope.getToProcessReleases = function() {
        $http.get(CONFIG.url + '/labels/' + labelId + '/processReleases/info')
            .success(function(data) {
                $scope.releasesToProcess = data
            })
    }

    $scope.createRelease = function(id) {
        console.log("Create Release")
        $location.path('createRelease/' + labelId);
    }
    $scope.adminRelease = function(id) {
        console.log("adminRelease")
        $location.path('adminRelease/' + labelId + '/' + id);
    }
    $scope.getCatalog = function() {
        $http.get(CONFIG.url + '/labels/' + labelId + '/catalog')
            .success(function(data) {
                $scope.catalog = data
                console.log(data)
            })
    }


    $scope.getToProcessReleases();
    $scope.getDropZoneFiles();
    $scope.getCatalog();
    $scope.getLabel();

});