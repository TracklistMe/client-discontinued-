'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminEditReleaseCtrl', function($location, $scope, $state, $auth, $stateParams, $http, Account, FileUploader, CONFIG) {
    // DATA PICHER 


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

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

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

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];









    var releaseId = $stateParams.id
    $scope.serverURL = CONFIG.url
    $scope.release = null
    $scope.company = null
    $scope.dropZoneFiles = null
    $scope.releasesToProcess = null
    $scope.catalog = null
    $scope.label = null;

    $scope.sortableOptions = {
        placeholder: '<div class="sortable-placeholder"><div></div></div>',
        forcePlaceholderSize: false
    };

    $scope.sortableCallback = function(startModel, destModel, start, end) {
        console.log("MOVED")
    };



    $scope.releasesToProcess = {
        success: []
    };


    var uploader = $scope.uploader = new FileUploader({
        url: CONFIG.url + '/releases/' + releaseId + '/cover/',
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
        method: 'POST',
        url: CONFIG.url + '/labels/' + releaseId + '/dropZone/'
    });


    $scope.processCDNNegotiation = function() {
        console.log("Process CDN NEGOTIATION")
        for (var i = 0; i < catalogUploader.queue.length; i++) {
            catalogUploader.processOne(catalogUploader.queue[i]);
        }
    }

    catalogUploader.processOne = function(fileItem) {
        var file = fileItem;
        var fname = file._file.name;
        var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
        var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
        console.log(filename);
        console.log(extension);
        $http.post(CONFIG.url + '/labels/' + releaseId + '/dropZone/createFile/', {
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


    catalogUploader.onAfterAddingFile = function(fileItem) {

        /*
            var fname = fileItem._file.name;
            var filename = fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
            var extension = fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
            console.log(filename);
            console.log(extension);
            $http.post(CONFIG.url + '/labels/' + releaseId + '/dropZone/createFile/', {
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
    catalogUploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    catalogUploader.onAfterAddingFile = function(fileItem) {
        // Create the file on the CDN
        // 
        //  
        /*
            $http.post(CONFIG.url + '/labels/' + releaseId + '/dropZone/createFile/', {}).
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


        $http.post(CONFIG.url + '/labels/' + releaseId + '/dropZone/confirmFile', {
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
    catalogUploader.onCompleteAll = function() {
        console.info('onCompleteAll');
        //catalogUploader.clearQueue()
        $scope.getToProcessReleases();
        //$scope.getDropZoneFiles();
    };



    $scope.getDropZoneFiles = function() {
        $http.get(CONFIG.url + '/labels/' + releaseId + '/dropZoneFiles')
            .success(function(data) {
                $scope.dropZoneFiles = data
            })
    }
    $scope.processReleases = function() {
        $http.post(CONFIG.url + '/labels/' + releaseId + '/processReleases/', {}).
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
        $http.get(CONFIG.url + '/labels/' + releaseId + '/processReleases/info')
            .success(function(data) {
                $scope.releasesToProcess = data
            })
    }

    $scope.createRelease = function(id) {
        console.log("Create Release")
        $location.path('createRelease/' + releaseId);
    }
    $scope.adminRelease = function(id) {
        console.log("adminRelease")
        $location.path('adminRelease/' + releaseId + '/' + id);
    }
    $scope.getCatalog = function() {
        $http.get(CONFIG.url + '/labels/' + releaseId + '/catalog')
            .success(function(data) {
                $scope.catalog = data
                for (var prop in data) {
                    data[prop].cover = CONFIG.url + "/images/" + data[prop].cover;
                }
                console.log(data)
            })
    }




    $scope.getRelease = function() {
        $http.get(CONFIG.url + '/releases/' + releaseId)
            .success(function(data) {
                $scope.release = data
                $scope.getCompany($scope.release.Labels[0].id);
            })
    }
    $scope.getCompany = function(labelId) {
        $http.get(CONFIG.url + '/labels/' + labelId + '/companies')
            .success(function(data) {
                $scope.company = data

            })
    }

    $scope.getRelease();

});