'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdmingenresCtrl', function($scope, $http, CONFIG) {
  var CHARACTER_BEFORE_SEARCH = 2;

  $scope.itemsByPage = 10;
  $scope.currentArtist = null;
  $scope.isSearching = false;
  $scope.editIsSearching = false;
  $scope.nameAvailable = false;
  $scope.editNameAvailable = false;

  $scope.nameTooShort = true;
  $scope.editNameTooShort = true;
  $scope.searchUserResults = [];
  $scope.genreList = [{}];
  // should be merged with the underneath function 
  // searchForEditArtistNameAvailability

  $scope.searchGenreAvailability = function() {
    if ($scope.searchGenreField.length > CHARACTER_BEFORE_SEARCH) {
      $scope.isSearching = true;
      $scope.nameTooShort = false;
      $http.get(CONFIG.url + '/genres/searchExact/' + $scope.searchGenreField)
        .success(function(data) {
          $scope.isSearching = false;
          if (data.length === 0) {
            //!date --> the object is empty, there is no other artist,  
            // with this name, the name is available
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

  $scope.searchForEditArtistNameAvailability = function() {
    if ($scope.currentArtist.displayName.length > CHARACTER_BEFORE_SEARCH) {
      $scope.editIsSearching = true;
      $scope.editNameTooShort = false;
      $http.get(CONFIG.url + '/artists/searchExact/' +
          $scope.currentArtist.displayName)
        .success(function(data) {
          $scope.editIsSearching = false;
          if (data.length === 0) {
            //!date --> the object is empty, there is no other artist, 
            // with this name, the name is available
            $scope.editNameAvailable = true;
          } else {
            //date --> the object has something
            $scope.editNameAvailable = false;
          }
        });
    } else {
      $scope.editNameTooShort = true;
    }
  };

  $scope.addGenre = function() {
    // TODO STRING SANITIZING
    $http.post(CONFIG.url + '/genres/', {
      name: $scope.searchGenreField
    }).
    success(function() {
      $scope.updateGenreList();
    });
  };

  $scope.updateArtist = function() {
    var artistId = $scope.currentArtist.id;
    $http.put(CONFIG.url + '/artists/' + artistId, $scope.currentArtist).
    success(function() {
      $scope.updateArtistList();
      $scope.searchForEditArtistNameAvailability();
    });
  };

  $scope.searchUser = function() {
    if ($scope.searchUserField.length > CHARACTER_BEFORE_SEARCH) {
      $http.get(CONFIG.url + '/users/search/' + $scope.searchUserField)
        .success(function(data) {
          for (var prop in data) {
            data[prop].avatar = CONFIG.url + '/images/' + data[prop].avatar;
          }
          $scope.searchUserResults = data;
        });
    }
  };

  $scope.selectFromMultipleUsers = function(user) {
    // create as an array to align to api return tyep 
    $scope.searchUserResults = [user];
  };

  $scope.addUserArtistAssociation = function() {
    var userId = $scope.searchUserResults[0].id;
    var artistId = $scope.currentArtist.id;
    console.log(userId);
    $http.post(CONFIG.url + '/artists/' + artistId + '/owners/', {
      newOwner: userId
    }).
    success(function() {
      $scope.editArtist(artistId);
    });
  };

  $scope.removeOwner = function(userId) {
    var artistId = $scope.currentArtist.id;
    $http.delete(CONFIG.url + '/artists/' + artistId + '/owners/' + userId).
    success(function() {
      $scope.editArtist(artistId);
    });
  };

  $scope.editArtist = function(idArtist) {
    $http.get(CONFIG.url + '/artists/' + idArtist)
      .success(function(data) {
        for (var i = 0; i < data.Users.length; i++) {
          data.Users[i].avatar = CONFIG.url + '/images/' + data.Users[i].avatar;
        }
        $scope.currentArtist = data;
        $scope.searchForEditArtistNameAvailability();
      });
  };

  $scope.updateGenreList = function() {
    $http.get(CONFIG.url + '/genres/')
      .success(function(data) {
        $scope.genreList = data;
      });
  };

  $scope.updateGenreList();
});
