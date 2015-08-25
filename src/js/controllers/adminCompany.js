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

  $scope.options = {
    chart: {
      type: 'multiBarChart',
      height: 210,
      margin: {
        top: 5,
        right: 10,
        bottom: 5,
        left: 50
      },
      color: function(d, i) {
        return (d.data && d.data.color) || $scope.app.colorArray[i % $scope.app.colorArray.length]
      },
      clipEdge: true,
      staggerLabels: true,
      transitionDuration: 500,
      stacked: true,
      xAxis: {
        axisLabel: '',
        showMaxMin: false,
        tickFormat: function(d) {
          return d3.format(',f')(d);
        }
      },
      yAxis: {
        axisLabel: 'Revenue (GBP)',
        axisLabelDistance: 40,
        tickFormat: function(d) {
          return d3.format(',.1f')(d);
        }
      }
    }
  };


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
            x: data[i].dataColumn,
            y: parseFloat(data[i].price) * 100
          });
        }
        // data ready to be displayed in the chart;
        var adjustedData = [];
        labels.forEach(function(entry) {
          adjustedData.push(entry);
        });


        $scope.data = [{
          key: 'Sphera',
          values: [{
            x: 0,
            y: 1
          }]
        }, {
          key: 'Rockit',
          values: [{
            x: 0,
            y: 2
          }]
        }];

      });


  }


  $scope.updateLabelList();
  $scope.getCompany();
  $scope.getRevenueData();





});
