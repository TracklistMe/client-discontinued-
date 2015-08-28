'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminlabelCtrl', function($location, $scope, $state, $auth,
  $stateParams, $http, Account, FileUploader, CONFIG) {
  var labelId = $stateParams.id;
  $scope.serverURL = CONFIG.url;
  $scope.label = null;
  $scope.dropZoneFiles = null;
  $scope.releasesToProcess = null;
  $scope.catalog = null;
  $scope.releasesToProcess = {
    success: []
  };


  var uploader = $scope.uploader = new FileUploader({
    method: 'POST',
    url: CONFIG.url + '/labels/' + labelId + '/profilePicture/'
  });

  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
    var file = fileItem;
    var filename = file._file.name;
    $http.post(
      CONFIG.url + '/labels/' + labelId + '/profilePicture/createFile/', {
        filename: filename,
      }).success(function(data) {

      var formDataArray = [{
        'GoogleAccessId': data.GoogleAccessId,
        'signature': data.signature,
        'policy': data.policy,
        'key': data.key
      }];

      file.url = data.action;
      file.formData = formDataArray;
      console.log(file);
      file.upload();
    });
  };

  uploader.onCompleteAll = function() {
    $scope.getLabel();
  };

  uploader.onCompleteItem = function() {
    $http.post(
      CONFIG.url + '/labels/' + labelId + '/profilePicture/confirmFile/', {}
    );
  };

  var catalogUploader = $scope.catalogUploader = new FileUploader({
    method: 'POST',
    url: CONFIG.url + '/labels/' + labelId + '/dropZone/'
  });


  $scope.processCDNNegotiation = function() {
    for (var i = 0; i < catalogUploader.queue.length; i++) {
      catalogUploader.processOne(catalogUploader.queue[i]);
    }
  };

  catalogUploader.processOne = function(fileItem) {
    var file = fileItem;
    var fname = file._file.name;
    var filename =
      fname.substr(0, (Math.min(fname.lastIndexOf('.'), fname.length)));
    var extension =
      fname.substr((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);
    $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/createFile/', {
      filename: filename,
      extension: extension,
      size: file.file.size
    }).success(function(data) {

      var formDataArray = [{
        'GoogleAccessId': data.GoogleAccessId,
        'signature': data.signature,
        'policy': data.policy,
        'key': data.key
      }];

      file.url = data.action;
      file.formData = formDataArray;
      console.log(file);
      file.upload();
    });
  };

  /*
  catalogUploader.onAfterAddingFile = function(fileItem) {

  };
  catalogUploader.onWhenAddingFileFailed =
    function(item , filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
  catalogUploader.onAfterAddingFile = function(fileItem) {
    
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
  catalogUploader.onSuccessItem = 
  function(fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
  };
  catalogUploader.onErrorItem = 
  function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  catalogUploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };
  */
  catalogUploader.onCompleteItem =
    function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);

      var fname = fileItem._file.name;
      var filename =
        fname.substr(0, (Math.min(fname.lastIndexOf('.'), fname.length)));
      var extension =
        fname.substr((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);


      $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/confirmFile', {
        filename: filename,
        extension: extension
      });

      $scope.getDropZoneFiles();
    };
  catalogUploader.onCompleteAll = function() {
    console.info('onCompleteAll');
    //catalogUploader.clearQueue()
    $scope.getToProcessReleases();
    //$scope.getDropZoneFiles();
  };

  $scope.getLabel = function() {
    $http.get(CONFIG.url + '/labels/' + labelId)
      .success(function(data) {
        $scope.label = data;
        $scope.label.logo =
          CONFIG.url +
          '/labels/' +
          labelId +
          '/profilePicture/small' +
          '?d=' + Date.now();
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
        for (var prop in data) {
          data[prop].cover = CONFIG.url + '/images/' + data[prop].cover;
        }
      });
  };


  // REVENUE PART //

  // DATA PICKER 

  $scope.dateRangeStartingEnding = {
    startDate: moment('2013-09-20'),
    endDate: moment('2013-09-25')
  };

  console.log($scope.dateRangeStartingEnding);
  $scope.ranges = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 days': [moment().subtract(7, 'days'), moment()],
    'Last 30 days': [moment().subtract(30, 'days'), moment()],
    'This quarter': [moment().startOf('quarter'), moment().endOf('quarter')],
    'Previous quarter': [moment().startOf('quarter').subtract(3, 'months'), moment().endOf('quarter').subtract(3, 'months')]
  };
  //END OF DATA PICKER 




  $scope.getToProcessReleases();
  $scope.getDropZoneFiles();
  $scope.getCatalog();
  $scope.getLabel();

});
