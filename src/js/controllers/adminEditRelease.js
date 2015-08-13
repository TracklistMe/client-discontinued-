'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminEditReleaseCtrl', function($location, $scope, $state,
  $auth, $stateParams, $http, $modal, Account, FileUploader, CONFIG) {
  // when deataching a file from his track, remember to add in the list
  // of potential file to added back. Those files will not fetched back 
  // from the call dropzone/ so must be handled manually 

  $scope.serverURL = CONFIG.url;


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

  var releaseId = $stateParams.id;
  $scope.releaseId = releaseId;
  $scope.serverURL = CONFIG.url;
  $scope.release = null;
  $scope.company = null;
  $scope.genres = null;
  $scope.releasesToProcess = null;
  $scope.catalog = null;

  $scope.modalSelectFromCDN = null;
  $scope.modalUploadDropbox = null;
  $scope.selectedTrack = null;
  $scope.selectFileFromDropZone = null;
  $scope.addMode = null;
  // MODAL ADMIN
  // 

  $scope.openUploadToDropbox = function(track) {
    $scope.selectedTrack = track;
    $scope.modalUploadDropbox = $modal.open({
      templateUrl: 'modalUploadDropbox',
      scope: $scope,
      backdropClass: 'bg-dark'
    });

    $scope.modalUploadDropbox.result.then(function() {

    }, function() {

    });
  };

  $scope.closeUploadToDropbox = function() {
    $scope.modalUploadDropbox.close();
  };
  // OPENING MODALS FOR CDN ULOAD

  $scope.openSelectFromCDN = function(track) {

    $scope.selectedTrack = track;
    $scope.getDropZoneFiles();
    $scope.modalSelectFromCDN = $modal.open({
      templateUrl: 'modalSelectFromCDN',
      scope: $scope
    });

    $scope.modalSelectFromCDN.result.then(function() {},
      function() {});
  };

  $scope.closeSelectFromCDN = function() {
    $scope.modalSelectFromCDN.close();
  };

  $scope.assignDropZoneFileToTrack = function(file) {
    $scope.closeSelectFromCDN();
    $scope.selectedTrack.path = file.path;

    // add the path to a blacklist for the dropzone, this because we are
    // maintaining consistent a status that is not saved in the server yet.
    $scope.assignedList.push({
      path: file.path
    });
  };

  /* UPLOAD THE COVER */
  var uploader = $scope.uploader = new FileUploader({
    method: 'POST'
  });
  // Callbacks

  uploader.currentUploading = 0;

  uploader.processCDNNegotiation = function() {
    // Processing CDN Negotiation
    uploader.url = CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/';
    uploader.processOne(uploader.queue[uploader.currentUploading]);
  };

  uploader.processOne = function(fileItem) {
    var file = fileItem;
    var fname = file._file.name;
    var filename =
      fname.substr(0, (Math.min(fname.lastIndexOf('.'), fname.length)));
    var extension =
      fname.substr((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);
    console.log(filename);
    console.log(extension);
    $http.post(CONFIG.url + '/labels/' +
      $scope.labelId + '/dropZone/createFile/', {
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

  uploader.onWhenAddingFileFailed =
    function(item /*{File|FileLikeObject}*/ , filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };

  uploader.onAfterAddingFile = function() {
    uploader.processCDNNegotiation();
  };
  /*
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
  */
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);

    var fname = fileItem._file.name;
    var filename =
      fname.substr(0, (Math.min(fname.lastIndexOf('.'), fname.length)));
    var extension =
      fname.substr((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);


    $http.post(CONFIG.url + '/labels/' +
      $scope.labelId + '/dropZone/confirmFile', {
        filename: filename,
        extension: extension
      }).success(function() {

      $scope.release.cover = 'dropZone/' + $scope.labelId +
        '/' + fileItem._file.name;

      uploader.queue.pop();
      if (uploader.currentUploading < uploader.queue.length) {
        uploader.currentUploading++;
        uploader.processCDNNegotiation();
      }
    });
  };

  $scope.uploadToDropZone = function(track) {
    $scope.selectTrackToChangeFile = track;
  };

  // CDN UPLOAD OF ADDITIONAL TRACKS
  // 
  var trackUploader = $scope.trackUploader = new FileUploader({
    method: 'POST',
    // I donno $scope.release.Labels[0].id at this point in execution.
    // url: CONFIG.url + '/labels/' + $scope.release.Labels[0].id + '/dropZone/'
  });

  trackUploader.onAfterAddingFile = function() {
    $scope.processCDNNegotiation();
  };

  $scope.processCDNNegotiation = function() {
    trackUploader.url = CONFIG.url + '/labels/' + $scope.labelId + '/dropZone/';
    for (var i = 0; i < trackUploader.queue.length; i++) {
      trackUploader.processOne(trackUploader.queue[i]);
    }
  };


  trackUploader.processOne = function(fileItem) {
    var file = fileItem;
    var fname = file._file.name;
    var filename =
      fname.substr(0, (Math.min(fname.lastIndexOf('.'), fname.length)));
    var extension =
      fname.substr((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);
    $http.post(CONFIG.url + '/labels/' +
      $scope.labelId + '/dropZone/createFile/', {
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
      file.upload();
    });
  };

  /*
  trackUploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };
  trackUploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };
  */

  trackUploader.onCompleteItem = function(fileItem) {

    var fname = fileItem._file.name;
    var filename =
      fname.substr(0, (Math.min(fname.lastIndexOf('.'), fname.length)));
    var extension =
      fname.substr((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);

    $http.post(CONFIG.url + '/labels/' +
      $scope.labelId + '/dropZone/confirmFile', {
        filename: filename,
        extension: extension
      }).success(function() {
      $scope.selectFileFromDropZone = {
        filaName: filename,
        extension: extension,
        path: 'dropZone/' + $scope.labelId + '/' + fname
      };
    });
    $scope.getDropZoneFiles();
  };

  $scope.addArtist = function() {
    $http.post(CONFIG.url + '/artists/', {
      displayName: $scope.searchArtistField
    }).
    success(function() {
      $scope.searchArtist();
    });
  };

  /* SORTABLE PLUGIN FOR ANGULAR */
  $scope.sortableOptions = {
    placeholder: '<div class="sortable - placeholder "><div></div></div>',
    forcePlaceholderSize: false
  };

  $scope.sortableCallback = function() {};

  $scope.getDropZoneFiles = function() {
    $http.get(CONFIG.url + '/labels/' + $scope.labelId + '/dropZoneFiles')
      .success(function(data) {
        // concat the array with the file from the dropbox with 
        // the array of file that have been deatached.
        // Remove duplicates
        var i, j, k = 0;
        var found = false;

        $scope.dropZoneFiles = [];
        for (k = 0; k < data.length; k++) {
          $scope.dropZoneFiles.push(data[k]);
        }

        for (i = 0; i < $scope.deatachedList.length; i++) {
          found = false;
          for (j = 0; j < data.length; j++) {
            if (data[j].path === $scope.deatachedList[i].path) {
              found = true;
            }
          }
          if (found === false) {
            $scope.dropZoneFiles.push($scope.deatachedList[i]);
          }
        }

        // REMOVE ALL THE FILE THAT HAS BEEN USED BUT ARE INCONSISTENT WITH 
        // THE STATUS OF THE DROPZONE IN DB
        var array = [];
        for (i = 0; i < $scope.dropZoneFiles.length; i++) {
          found = false;
          for (j = 0; j < $scope.assignedList.length; j++) {
            if ($scope.dropZoneFiles[i].path === $scope.assignedList[j].path) {
              found = true;
            }
          }
          if (found === false) {
            array.push($scope.dropZoneFiles[i]);
          }
        }
        $scope.dropZoneFiles = array;
      });
  };

  $scope.createRelease = function() {
    $location.path('createRelease/' + releaseId);
  };

  $scope.getGenres = function() {
    $http.get(CONFIG.url + '/genres/')
      .success(function(data) {
        $scope.genres = data;
      });
  };

  $scope.getCompany = function(labelId) {
    $http.get(CONFIG.url + '/labels/' + labelId + '/companies')
      .success(function(data) {
        $scope.company = data;
      });
  };

  $scope.getLabel = function(labelId) {
    $http.get(CONFIG.url + '/labels/' + labelId)
      .success(function(data) {
        $scope.label = data;
      });
  };

  // ADD NEW TRACK
  $scope.addNewTrack = function() {
    if (!$scope.release.Tracks) { // create array of tracks
      $scope.release.Tracks = [];
    }
    $scope.release.Tracks.push({
      path: null,
      infoVisible: true, // open the panel for editing
      title: 'Track Title',
      version: 'Version Name',
      ReleaseTracks: {
        position: $scope.release.Tracks.length + 1
      },
      Producer: [],
      Remixer: []
    });
  };


  // PRODUCER-ARTIST - 

  $scope.deleteProducer = function(artist, track) {
    var index = -1;
    for (var i = track.Producer.length - 1; i >= 0; i--) {
      if (track.Producer[i].id === artist.id) {
        index = i;
      }
    }
    track.Producer.splice(index, 1);
  };

  $scope.searchArtist = function(track) {
    if (track.searchArtist.length > CHARACTER_BEFORE_SEARCH) {
      track.searchingArtist = true;
      track.resultArrived = false;
      $scope.nameTooShort = false;
      $http.get(CONFIG.url + '/artists/search/' + track.searchArtist)
        .success(function(data) {
          track.resultArrived = true;
          if (!data) {
            //!date --> the object is empty, there is no other company with 
            // this name, the name is available
            track.artistResults = [];
          } else {
            //date --> the object has something
            track.artistResults = data;
          }
        });
    } else {
      $scope.nameTooShort = true;
    }
  };

  $scope.candidateArtist = function(track, artist) {
    track.searchingArtist = false;
    track.candidateArtist = artist;
    track.searchArtist = artist.displayName;
  };

  $scope.stopAddingNewArtist = function(track) {
    track.searchingArtist = false;
    track.candidateArtist = null;
    track.searchArtist = '';
    track.showAddArtist = false;
    track.searchingArtist = false;
  };

  $scope.addAsProducer = function(track) {
    if (track.candidateArtist) {
      track.Producer.push({
        id: track.candidateArtist.id,
        displayName: track.candidateArtist.displayName
      });
      track.candidateArtist = null;
      track.searchArtist = '';
      track.showAddArtist = false;
      track.searchingArtist = false;
    } else {
      //TODO DISPLAY SOMETHING 
    }
  };

  // REMIXER-ARTIST - 
  $scope.deleteRemixer = function(remixer, track) {
    var index = -1;
    for (var i = track.Remixer.length - 1; i >= 0; i--) {
      if (track.Remixer[i].id === remixer.id) {
        index = i;
      }
    }
    track.Remixer.splice(index, 1);
  };

  $scope.searchRemixer = function(track) {
    if (track.searchRemixer.length > CHARACTER_BEFORE_SEARCH) {
      track.searchingRemixer = true;
      track.resultRemixerArrived = false;
      $scope.nameTooShort = false;
      $http.get(CONFIG.url + '/artists/search/' + track.searchRemixer)
        .success(function(data) {

          track.resultRemixerArrived = true;
          if (!data) {
            //!date --> the object is empty, there is no other company with this
            // name, the name is available
            track.remixerResults = [];
          } else {
            //date --> the object has something
            track.remixerResults = data;
          }
        });
    } else {
      $scope.nameTooShort = true;
    }
  };

  $scope.candidateRemixer = function(track, remix) {
    track.searchingRemixer = false;
    track.candidateRemixer = remix;
    track.searchRemixer = remix.displayName;
  };

  $scope.stopAddingNewRemixer = function(track) {
    track.candidateRemixer = null;
    track.searchRemixer = '';
    track.showAddRemixer = false;
    track.searchingRemixer = false;
  };

  $scope.addAsRemixer = function(track) {
    if (track.candidateRemixer) {
      if (!track.Remixer) {
        track.Remixer = [];
      }
      track.Remixer.push({
        id: track.candidateRemixer.id,
        displayName: track.candidateRemixer.displayName
      });
      track.candidateRemixer = null;
      track.searchRemixer = '';
      track.showAddRemixer = false;
      track.searchingRemixerer = false;
    } else {
      //TODO DISPLAY SOMETHING 
    }
  };

  $scope.removeTrack = function(track) {
    track.isActive = false;
  };

  $scope.reactivateTrack = function(track) {
    track.isActive = true;
  };

  $scope.deatach = function(track) {
    // REMEMBER TO DEATACH A TRACK and put back in the dropzone.
    var path = track.path;
    var i = 0;
    var filename = path.replace(/^.*(\\|\/|\:)/, '');
    var extension = filename.split('.')[1];
    filename = filename.split('.')[0];
    track.path = null;
    // find if the track already exist in the deatacched tracks
    var foundInDeatached = false;
    for (i = $scope.deatachedList.length - 1; i >= 0; i--) {
      if ($scope.deatachedList[i].path === path) {
        foundInDeatached = true;
      }
    }

    // need to check if the track would come out from the list of tracks in the 
    // dropzone already
    // in that case i should not show it again.
    var foundInDropZone = false;
    for (i = $scope.dropZoneFiles.length - 1; i >= 0; i--) {
      if ($scope.dropZoneFiles[i].path === path) {
        foundInDropZone = true;
      }
    }

    if (foundInDeatached === false && foundInDropZone === false) {
      $scope.deatachedList.push({
        fileName: filename,
        extension: extension,
        path: path
      });
    }

    for (i = 0; i < $scope.assignedList.length; i++) {
      if ($scope.assignedList[i].path === path) {
        $scope.assignedList.splice(i, 1);
      }
    }
    // HERE I SHOULD REMOVE THE TRACK FROM LIST OF ASSIGNED TRACK
  };

  $scope.selectFromDropZone = function(track) {
    $scope.selectTrackToChangeFile = track;
    $scope.selectFileFromDropZone = null;
    $scope.getDropZoneFiles();
  };
  $scope.getRelease = function() {
    $http.get(CONFIG.url + '/releases/' + releaseId)
      .success(function(data) {
        $scope.release = data;
        $scope.labelId = $scope.release.Labels[0].id;
        $scope.getLabel($scope.labelId);
        $scope.getCompany($scope.labelId);
        $scope.getGenres();
      });
  };

  /*
     Save the release.
     If we are in addMode = true (that is the release didn't exist before),
     it does add the release with a POST. 
     Otherwise it will just update the exisit information with a PUT. 
  */
  $scope.saveRelease = function() {
    for (var i = $scope.release.Tracks.length - 1; i >= 0; i--) {
      $scope.release.Tracks[i].ReleaseTracks.position = i + 1;
    }

    if ($scope.addMode === true) {
      // need to create a new relase 
      $http.post(CONFIG.url + '/releases/', {
        release: $scope.release,
        idLabel: $scope.labelId
      }).success(function(data) {
        $location.path('app/adminRelease/' + data.id);
      });
    } else {
      // update an already existing release
      $http.put(CONFIG.url + '/releases/' + $scope.releaseId, {
        release: $scope.release
      }).success(function() {
        $location.path('app/adminRelease/' + $scope.releaseId);
      });
    }
  };


  $scope.initialize = function() {
    if ($stateParams.id !== null) {
      // WE GOT A RELEASE 
      $scope.releaseId = $stateParams.id;
      $scope.addMode = false;
      $scope.getRelease();
    } else {
      // we are creating a release
      $scope.labelId = $stateParams.labelId;
      $scope.addMode = true;
      $scope.release = {
        title: 'Release Title',
        isActive: false,
        Tracks: []
      };

      $scope.getLabel($scope.labelId);
      $scope.getCompany($scope.labelId);
      $scope.getGenres();
    }
  };

  $scope.initialize();

});
