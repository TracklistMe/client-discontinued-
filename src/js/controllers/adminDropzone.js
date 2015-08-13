'use strict';

app.controller('FileUploadCtrl', function($location, $scope, $state, $auth,
  $stateParams, $http, Account, FileUploader, CONFIG) {


  var labelId = $stateParams.id;


  var uploader = $scope.uploader = new FileUploader({
    method: 'POST',
    url: CONFIG.url + '/labels/' + labelId + '/dropZone/'
  });


  // FILTERS

  uploader.filters.push({
    name: 'customFilter',
    fn: function() {
      return this.queue.length < 40;
    }
  });


  // CALLBACKS

  uploader.currentUploading = 0;
  $scope.processCDNNegotiation = function() {

    uploader.processOne(uploader.queue[uploader.currentUploading]);

  };

  uploader.processOne = function(fileItem) {

    var file = fileItem;
    var fname = file._file.name;
    var filename =
      fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
    var extension =
      fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);

    $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/createFile/', {
      filename: filename,
      extension: extension,
      size: file.file.size
    }).success(function(data) {
      var formDataArray = [{
        "GoogleAccessId": data.GoogleAccessId,
        "signature": data.signature,
        "policy": data.policy,
        "key": data.key
      }];
      file.url = data.action;
      file.formData = formDataArray;
      file.upload();
    });
  }

  /*
    uploader.onAfterAddingFile = function(fileItem) {

    };
    uploader.onWhenAddingFileFailed = function(item, filter, options) {

    };
    uploader.onAfterAddingFile = function(fileItem) {

    };
    uploader.onAfterAddingAll = function(addedFileItems) {

    };
    uploader.onBeforeUploadItem = function(item) {};
    uploader.onProgressItem = function(fileItem, progress) {};
    uploader.onProgressAll = function(progress) {};
    uploader.onSuccessItem = function(fileItem, response, status, headers) {

    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {};
    uploader.onCancelItem = function(fileItem, response, status, headers) {};
    */
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    var fname = fileItem._file.name;
    var filename =
      fname.substr(0, (Math.min(fname.lastIndexOf("."), fname.length)));
    var extension =
      fname.substr((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);


    $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/confirmFile', {
      filename: filename,
      extension: extension
    });

    if (uploader.currentUploading < uploader.queue.length) {
      uploader.currentUploading++;
      $scope.processCDNNegotiation();
    }

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
        $scope.label = data;
      });
  };

  $scope.getDropZoneFiles = function() {
    $http.get(CONFIG.url + '/labels/' + labelId + '/dropZoneFiles')
      .success(function(data) {
        $scope.dropZoneFiles = data;
      });
  };
  $scope.processReleases = function() {
    $http.post(CONFIG.url + '/labels/' + labelId + '/processReleases/', {}).
    success(function() {
      $scope.getToProcessReleases();
      $scope.getDropZoneFiles();
      $scope.getCatalog();
    });
  };

  $scope.getToProcessReleases = function() {
    $http.get(CONFIG.url + '/labels/' + labelId + '/processReleases/info')
      .success(function(data) {
        $scope.releasesToProcess = data;
      });
  };

  $scope.createRelease = function() {
    $location.path('createRelease/' + labelId);
  };

  $scope.adminRelease = function(id) {
    $location.path('adminRelease/' + labelId + '/' + id);
  };

  $scope.getCatalog = function() {

    $http.get(CONFIG.url + '/labels/' + labelId + '/catalog')
      .success(function(data) {
        $scope.catalog = data;
      });
  };

  //'/labels/:labelId/dropZone/:id
  $scope.deleteFile = function(file) {
    $http.delete(CONFIG.url + '/labels/' + labelId + '/dropZone/' + file.id)
      .success(function(data) {
        $scope.getDropZoneFiles();
      });
  };

  $scope.getToProcessReleases();
  $scope.getDropZoneFiles();
  $scope.getCatalog();
  $scope.getLabel();

});
