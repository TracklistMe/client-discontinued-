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
        console.log(data);
        // Get the json with the informations:
        var values = [];
        var currentIndex = 0;
        var labels = [];
        for (var i = 0; i < data.length; i++) {
          //Data is sorted by data.dataColumn;

          console.log(data[i].dataColumn, moment(data[i].dataColumn, "DD-MM-YY").toDate());

          if (!values[currentIndex]) {
            //First Element.
            var object = {};
            object['x'] = moment(data[i].dataColumn, "DD-MM-YY").toDate();
            object[data[i].LabelId] = data[i].price;
            values.push(
              object
            );
          } else {
            // ho almeno un valore 
            if (values[currentIndex].x.getTime() == moment(data[i].dataColumn, "DD-MM-YY").toDate().getTime()) {
              //same day
              values[currentIndex][data[i].LabelId] = data[i].price;
            } else {
              // me moved to the next data
              currentIndex++;
              var object = {};
              object['x'] = moment(data[i].dataColumn, "DD-MM-YY").toDate();
              object[data[i].LabelId] = data[i].price;
              values.push(
                object
              );
            }
          }
          var found = false;
          for (var l = 0; l < labels.length; l++) {
            if ((labels[l].id) == data[i].LabelId) {
              found = true;
            }
          }
          if (!found) {
            labels.push({
              id: data[i].LabelId,
              name: data[i].Label.displayName
            })
          }
        }
        // FILLERS: ads for each label a valid number per each time point
        for (var v = 0; v < values.length; v++) {
          for (var l = 0; l < labels.length; l++) {
            if (!values[v][labels[l].id]) {
              values[v][labels[l].id] = 0
            }
          }
        }
        console.log(labels)
          // data ready to be displayed in the chart;


        var series = [];
        for (var i = labels.length - 1; i >= 0; i--) {
          console.log(labels[i].displayName);
          series[i] = {
            color: $scope.app.colorArray[i],
            id: labels[i].id,
            y: labels[i].id,
            axis: 'y',
            thickness: '2px',
            type: 'column',
            label: labels[i].name
          }
        };

        $scope.data = values;
        $scope.options = {
          margin: {
            right: 0,
            top: 20,
          },
          stacks: [{
            axis: "y",
            series: [labels[0].id, labels[1].id, labels[2].id]
          }],
          axes: {
            x: {
              zoomable: true,
              type: 'date',
              ticksFormat: '%B',
              ticks: d3.time.months,
              ticksRotate: 0
            },
            y: {
              zoomable: true,
              ticksFormat: '.2f',
              min: 0
            }
          },
          lineMode: "cardinal",
          series: series,
          columnsHGap: 0,
        }


      });


  };







  $scope.updateLabelList();
  $scope.getCompany();
  $scope.getRevenueData();





});
