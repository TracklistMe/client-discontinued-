'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdminlabelCtrl
 * @description
 * # AdminlabelCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
    .controller('AdminlabelCtrl', function($location, $scope, $state, $auth, $stateParams, $http, Account, FileUploader, CONFIG) {
        var labelId = $stateParams.id
        $scope.serverURL = CONFIG.url
        $scope.label = null
        $scope.dropZoneFiles = null
        $scope.releasesToProcess = null
        $scope.catalog = null

        var uploader = $scope.uploader = new FileUploader({
            url: CONFIG.url + '/labels/' + labelId + '/profilePicture/500/500/',
            headers: {
                'Authorization': 'Bearer ' + $auth.getToken()
            },
            data: {
                user: $scope.user
            },
        });



        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            uploader.queue[0].upload();
            uploader.queue.pop();
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            $scope.getLabel();
        };



        var catalogUploader = $scope.catalogUploader = new FileUploader({
            url: CONFIG.url + '/labels/' + labelId + '/dropzone/',
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + $auth.getToken()
            },
        });
        $scope.processCDNNegotiation = function() {


            var file = catalogUploader.queue[0];
            console.log(file)
            var fname = file._file.name;
            var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
            var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
            console.log(filename);
            console.log(extension);
            $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/createFile/', {
                filename: filename,
                extension: extension
            }).success(function(data, status, headers, config) {
                console.log("DONE")
                console.log(data.signedUrl);
                file.url = data.signedUrl;
                console.log(file);
                file.upload();

            }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });



        }
        catalogUploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        catalogUploader.onAfterAddingFile = function(fileItem) {
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
        catalogUploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        catalogUploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        catalogUploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        catalogUploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        catalogUploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        catalogUploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        catalogUploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        catalogUploader.onCompleteItem = function(fileItem, response, status, headers) {
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


            //$scope.getDropZoneFiles();
        };
        catalogUploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            catalogUploader.clearQueue()
            $scope.getToProcessReleases();
            $scope.getDropZoneFiles();
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
