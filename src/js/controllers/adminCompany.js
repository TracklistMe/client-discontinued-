'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdmincompanyCtrl', function($scope, $state, $auth,
  $stateParams, $http, Account, FileUploader, CONFIG) {
  // add new company form
  var companyId = $stateParams.id;
  var CHARACTER_BEFORE_SEARCH = 4;
  var CHARACTER_BEFORE_SEARCH_USER = 3;
  $scope.serverURL = CONFIG.url;
  $scope.isSearching = false;
  $scope.nameAvailable = false;
  $scope.nameTooShort = true;
  $scope.searchUserResults = null;
  $scope.currentLabel = null;
  $scope.labelList = {};
  $scope.loadedImage = 100;

  var uploader = $scope.uploader = new FileUploader({
    method: 'POST',
    url: CONFIG.url + '/companies/' + companyId + '/profilePicture/'
  });





  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
    var file = fileItem;
    var filename = file._file.name;
    $http.post(
      CONFIG.url + '/companies/' + companyId + '/profilePicture/createFile/', {
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
      file.upload();
    });

  };

  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
    $scope.getCompany();
  };

  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);

    $http.post(
        CONFIG.url +
        '/companies/' +
        companyId +
        '/profilePicture/confirmFile/', {})
      .success(function() {});
  };

  $scope.addLabel = function() {
    // TODO STRING SANITIZING
    $http.post(CONFIG.url + '/labels/', {
      companyId: companyId,
      labelName: $scope.seachLabelField
    }).
    success(function() {
      $scope.updateLabelList();
    });
  };

  $scope.searchLabelAvailability = function() {
    if ($scope.seachLabelField.length > CHARACTER_BEFORE_SEARCH) {
      $scope.isSearching = true;
      $scope.nameTooShort = false;
      $http.get(CONFIG.url + '/labels/searchExact/' + $scope.seachLabelField)
        .success(function(data) {

          $scope.isSearching = false;
          if (!data) {
            //!date --> the object is empty, there is no other company with 
            //this name, the name is available
            $scope.nameAvailable = true;
          } else {
            //date --> the object has something
            $scope.nameAvailable = false;
          }
        });
    } else {
      $scope.nameTooShort = true;
    }
  };

  $scope.addLabelManager = function() {
    var newLabelManager = $scope.searchUserResults[0].id;
    var labelId = $scope.currentLabel.id;
    $http.post(CONFIG.url + '/labels/' + labelId + '/labelManagers/', {
      newLabelManager: newLabelManager
    }).
    success(function() {
      $scope.editLabel(labelId);
    });
  };

  $scope.removeLabelManager = function(userId) {
    var labelId = $scope.currentLabel.id;
    $http.delete(CONFIG.url + '/labels/' + labelId +
      '/labelManagers/' + userId).
    success(function() {
      $scope.editLabel(labelId);
    });
  };

  $scope.selectFromMultipleUsers = function(user) {
    // create as an array to align to api return tyep 
    $scope.searchUserResults = [user];
  };

  $scope.searchUser = function() {
    if ($scope.searchUserField.length > CHARACTER_BEFORE_SEARCH_USER) {
      $http.get(CONFIG.url + '/users/search/' + $scope.searchUserField)
        .success(function(data) {
          $scope.searchUserResults = data;
          for (var prop in data) {
            data[prop].avatar = CONFIG.url + '/images/' + data[prop].avatar;
          }
        });
    }
  };

  $scope.updateLabelList = function() {
    // Display only the label(s) that are part of this company
    $http.get(CONFIG.url + '/companies/' + companyId + '/labels')
      .success(function(data) {
        $scope.labelList = data;
        for (var prop in data) {
          data[prop].logo =
            CONFIG.url + '/labels/' + data[prop].id + '/profilePicture/small';
        }
      });
  };

  $scope.editLabel = function(idLabel) {
    $http.get(CONFIG.url + '/labels/' + idLabel)
      .success(function(data) {
        $scope.currentLabel = data;
        data.logo =
          CONFIG.url + '/labels/' + idLabel + '/profilePicture/small';
      });
  };

  $scope.getCompany = function() {
    $http.get(CONFIG.url + '/companies/' + companyId)
      .success(function(data) {
        $scope.company = data;
        $scope.company.logo =
          CONFIG.url + '/companies/' +
          companyId +
          '/profilePicture/small/' +
          '?d=' + Date.now();
      });
  };

  $scope.getRevenueData = function() {
    $http.get(CONFIG.url + '/companies/' + companyId + '/revenues/')
      .success(function(data) {
        console.log(data)
          // Get the json with the informations:
        var labels = [];
        for (var i = 0; i < data.length; i++) {

          //Create the object for the given label.
          if (!labels[data[i].LabelId]) {
            labels[data[i].LabelId] = {
              key: data[i].Label.displayName,
              values: []
            };
          }

          // add the object to the given label.
          labels[data[i].LabelId].values.push({
            x: i,
            y: 0
          });
        }
        // data ready to be displayed in the chart;
        var adjustedData = [];
        labels.forEach(function(entry) {
          adjustedData.push(entry);
        });


        // $scope.data = adjustedData;




      });


  };
  $scope.data = [{
    x: 0,
    val_0: 1,
    val_1: 2,
    val_2: 3,
    val_3: 4
  }, {
    x: 1,
    val_0: 0.993,
    val_1: 3.894,
    val_2: 8.47,
    val_3: 14.347
  }, {
    x: 2,
    val_0: 1.947,
    val_1: 7.174,
    val_2: 13.981,
    val_3: 19.991
  }, {
    x: 3,
    val_0: 2.823,
    val_1: 9.32,
    val_2: 14.608,
    val_3: 13.509
  }, {
    x: 4,
    val_0: 3.587,
    val_1: 9.996,
    val_2: 10.132,
    val_3: 1.167
  }, {
    x: 5,
    val_0: 4.207,
    val_1: 9.093,
    val_2: 2.117,
    val_3: 15.136
  }, {
    x: 6,
    val_0: 4.66,
    val_1: 6.755,
    val_2: 6.638,
    val_3: 19.923
  }, {
    x: 7,
    val_0: 4.927,
    val_1: 3.35,
    val_2: 13.074,
    val_3: 12.625
  }, {
    x: 8,
    val_0: 4.998,
    val_1: 0.584,
    val_2: 14.942,
    val_3: 2.331
  }, {
    x: 9,
    val_0: 4.869,
    val_1: 4.425,
    val_2: 11.591,
    val_3: 15.873
  }, {
    x: 10,
    val_0: 4.546,
    val_1: 7.568,
    val_2: 4.191,
    val_3: 19.787
  }, {
    x: 11,
    val_0: 4.042,
    val_1: 9.516,
    val_2: 4.673,
    val_3: 11.698
  }, {
    x: 12,
    val_0: 3.377,
    val_1: 9.962,
    val_2: 11.905,
    val_3: 3.487
  }, {
    x: 13,
    val_0: 2.578,
    val_1: 8.835,
    val_2: 14.978,
    val_3: 16.557
  }, {
    x: 14,
    val_0: 1.675,
    val_1: 6.313,
    val_2: 12.819,
    val_3: 19.584
  }, {
    x: 15,
    val_0: 0.706,
    val_1: 2.794,
    val_2: 6.182,
    val_3: 10.731
  }, {
    x: 16,
    val_0: 0.292,
    val_1: 1.165,
    val_2: 2.615,
    val_3: 4.63
  }, {
    x: 17,
    val_0: 1.278,
    val_1: 4.941,
    val_2: 10.498,
    val_3: 17.183
  }, {
    x: 18,
    val_0: 2.213,
    val_1: 7.937,
    val_2: 14.714,
    val_3: 19.313
  }, {
    x: 19,
    val_0: 3.059,
    val_1: 9.679,
    val_2: 13.79,
    val_3: 9.728
  }, {
    x: 20,
    val_0: 3.784,
    val_1: 9.894,
    val_2: 8.049,
    val_3: 5.758
  }, {
    x: 21,
    val_0: 4.358,
    val_1: 8.546,
    val_2: 0.504,
    val_3: 17.751
  }, {
    x: 22,
    val_0: 4.758,
    val_1: 5.849,
    val_2: 8.881,
    val_3: 18.977
  }, {
    x: 23,
    val_0: 4.968,
    val_1: 2.229,
    val_2: 14.155,
    val_3: 8.691
  }, {
    x: 24,
    val_0: 4.981,
    val_1: 1.743,
    val_2: 14.485,
    val_3: 6.866
  }, {
    x: 25,
    val_0: 4.795,
    val_1: 5.44,
    val_2: 9.754,
    val_3: 18.259
  }, {
    x: 26,
    val_0: 4.417,
    val_1: 8.278,
    val_2: 1.616,
    val_3: 18.576
  }, {
    x: 27,
    val_0: 3.864,
    val_1: 9.809,
    val_2: 7.086,
    val_3: 7.625
  }, {
    x: 28,
    val_0: 3.156,
    val_1: 9.792,
    val_2: 13.314,
    val_3: 7.951
  }, {
    x: 29,
    val_0: 2.323,
    val_1: 8.228,
    val_2: 14.89,
    val_3: 18.704
  }];

  $scope.options = {
    stacks: [{
      axis: "y",
      series: [
        "id_0",
        "id_1",
        "id_2",
        "id_3"
      ]
    }],
    height: 120,
    lineMode: "cardinal",
    series: [{
      id: "id_0",
      y: "val_0",
      label: "Foo",
      type: "column",
      color: "#1f77b4"
    }, {
      id: "id_1",
      y: "val_1",
      label: "Bar",
      type: "column",
      color: "#ff7f0e"
    }, {
      id: "id_2",
      y: "val_2",
      label: "Baz",
      type: "column",
      color: "#d62728"
    }, {
      id: "id_3",
      y: "val_3",
      label: "Baz",
      type: "column",
      color: "#d62728"
    }]
  }



  $scope.updateLabelList();
  $scope.getCompany();
  $scope.getRevenueData();





});
