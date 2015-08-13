'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdmincurrenciesCtrl', function($scope, $http, CONFIG, $filter,
  editableOptions, editableThemes) {

  $scope.priceTable = [];
  $scope.currencies = [];
  $scope.pricesMasterTable = [];

  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';


  $scope.html5 = {
    email: 'email@example.com',
    tel: '123-45-67',
    number: 29,
    range: 10,
    url: 'http://example.com',
    search: 'blabla',
    color: '#6a4415',
    date: null,
    time: '12:30',
    datetime: null,
    month: null,
    week: null
  };

  $scope.user = {
    name: 'awesome',
    desc: 'Awesome user \ndescription!',
    status: 2,
    agenda: 1,
    remember: false
  };

  $scope.statuses = [{
    value: 1,
    text: 'status1'
  }, {
    value: 2,
    text: 'status2'
  }, {
    value: 3,
    text: 'status3'
  }];

  $scope.agenda = [{
    value: 1,
    text: 'male'
  }, {
    value: 2,
    text: 'female'
  }];

  $scope.showStatus = function() {
    var selected = $filter('filter')($scope.statuses, {
      value: $scope.user.status
    });
    if ($scope.user.status && selected.length) {
      return selected[0].text;
    } else {
      return 'Not set';
    }
  };

  $scope.showAgenda = function() {
    var selected = $filter('filter')($scope.agenda, {
      value: $scope.user.agenda
    });
    if ($scope.user.agenda && selected.length) {
      return selected[0].text;
    } else {
      return 'not set ';
    }
  };

  // editable table
  $scope.users = [{
    id: 1,
    name: 'awesome user1',
    status: 2,
    group: 4,
    groupName: 'admin'
  }, {
    id: 2,
    name: 'awesome user2',
    status: undefined,
    group: 3,
    groupName: 'vip'
  }, {
    id: 3,
    name: 'awesome user3',
    status: 2,
    group: null
  }];

  $scope.groups = [];
  $scope.loadGroups = function() {
    return $scope.groups.length ? null : $http.get('api/groups').
    success(function(data) {
      $scope.groups = data;
    });
  };

  $scope.showGroup = function(user) {
    if (user.group && $scope.groups.length) {
      var selected = $filter('filter')($scope.groups, {
        id: user.group
      });
      return selected.length ? selected[0].text : 'Not set';
    } else {
      return user.groupName || 'Not set';
    }
  };

  $scope.showStatus = function(user) {
    var selected = [];
    if (user && user.status) {
      selected = $filter('filter')($scope.statuses, {
        value: user.status
      });
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  $scope.checkName = function(data, id) {
    if (id === 2 && data !== 'awesome') {
      return 'Username 2 should be `awesome`';
    }
  };

  $scope.saveUser = function(data, id) {
    //$scope.user not updated yet
    angular.extend(data, {
      id: id
    });
    // return $http.post('api/saveUser', data);
  };

  // remove user
  $scope.removeUser = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addUser = function() {
    $scope.inserted = {
      id: $scope.users.length + 1,
      name: '',
      status: null,
      group: null
    };
    $scope.users.push($scope.inserted);
  };

  $scope.getPriceTables = function() {
    $http.get(CONFIG.url + '/currencies/')
      .success(function(data) {
        $scope.currencies = data;

        $http.get(CONFIG.url + '/pricesMasterTable/')
          .success(function(data) {
            $scope.pricesMasterTable = data;

            $http.get(CONFIG.url + '/pricesTable/')
              .success(function(data) {
                $scope.priceTable = data;
              });
          });
      });
  };

  $scope.findConvertedPrice = function(masterPrice, currency) {
    for (var i = 0; i < $scope.priceTable.length; i++) {
      if ($scope.priceTable[i].MasterPrice === masterPrice &&
        $scope.priceTable[i].CurrencyId === currency) {
        return $scope.priceTable[i];
      }
    }
    return null;
  };

  $scope.createConvertedPrice = function(masterPrice, currency) {
    $scope.priceTable.push({
      MasterPrice: masterPrice,
      CurrencyId: currency,
      price: null
    });
  };

  $scope.save = function(masterPrice, currency, price) {
    $http.post(CONFIG.url + '/pricesTable/', {
      masterPrice: masterPrice,
      price: price,
      currencyId: currency
    });
  };


  $scope.getPriceTables();

});
