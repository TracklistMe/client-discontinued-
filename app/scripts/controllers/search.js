'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
    .controller('SearchCtrl', function($scope, $rootScope, $document, CONFIG, $http) {
        $scope.serverURL = CONFIG.url;
        var CHARACTER_BEFORE_SEARCH = 2;
        var countToExitInARow = 0;
        $scope.foundLabels = []
        $scope.foundArtists = []
        $scope.searchOpen = false
        $scope.searchString = ""
        $scope.isSelected = false

        $document.bind("keypress", function(event) {
            console.log(event);

            if ($scope.isSelected == false) {
                $scope.open();
                $scope.foundLabels = null
                $scope.foundArtists = null
                $scope.$apply();
            }

        });
        $document.bind("keyup", function(event) {
            console.log(event.keyCode)
            $scope.evaluateSearch();
            if (event.keyCode == 27) {
                countToExitInARow++

                if (countToExitInARow == 2) {
                    $scope.close();
                    $scope.$apply();
                    countToExitInARow = 0
                }

            } else {
                countToExitInARow = 0;
            }
        });


        $scope.evaluateSearch = function() {


            $scope.getArtists($scope.searchString);
            $scope.getLabels($scope.searchString);
            $scope.getTracks($scope.searchString);

        }

        $scope.getArtists = function(s) {
            if (s.length > CHARACTER_BEFORE_SEARCH) {
                $http.get(CONFIG.url + '/artists/search/' + s)
                    .success(function(data) {

                        $scope.foundArtists = data;
                    })
            }


        }
        $scope.getLabels = function(s) {

            if (s.length > CHARACTER_BEFORE_SEARCH) {
                $http.get(CONFIG.url + '/labels/search/' + s)
                    .success(function(data) {

                        $scope.foundLabels = data;
                    })
            }

        }
        $scope.getTracks = function(s) {


        }


        $scope.focusReport = function() {

        }
        $scope.blurReport = function() {

        }
        $scope.open = function() {
            console.log("Open Interface");
            $scope.searchOpen = true;
            $scope.isSelected = true;
        }
        $scope.close = function() {
            console.log("Close Interface");
            $scope.searchOpen = false;
            $scope.isSelected = false;
        }
        $rootScope.$on('searchActivate', function(event, mass) {

            $scope.open();
        });

        $scope.closeSearch = function() {
            $scope.searchOpen = false;
            $scope.isSelected = false;
        }

    });


/*


  <script>
    (function() {
        var morphSearch = document.getElementById('morphsearch'),
            input = morphSearch.querySelector('input.morphsearch-input'),
            ctrlClose = morphSearch.querySelector('span.morphsearch-close'),
            isOpen = isAnimating = false,
            // show/hide search area
            toggleSearch = function(evt) {
                // return if open and the input gets focused
                if (evt.type.toLowerCase() === 'focus' && isOpen) return false;
                var offsets = morphsearch.getBoundingClientRect();
                if (isOpen) {
                    classie.remove(morphSearch, 'open');
                    // trick to hide input text once the search overlay closes 
                    // todo: hardcoded times, should be done after transition ends
                    if (input.value !== '') {
                        setTimeout(function() {
                            classie.add(morphSearch, 'hideInput');
                            setTimeout(function() {
                                classie.remove(morphSearch, 'hideInput');
                                input.value = '';
                            }, 300);
                        }, 500);
                    }
                    input.blur();
                } else {
                    classie.add(morphSearch, 'open');
                }
                isOpen = !isOpen;
            };
        // events
        input.addEventListener('focus', toggleSearch);
        ctrlClose.addEventListener('click', toggleSearch);
        // esc key closes search overlay
        // keyboard navigation events
        document.addEventListener('keydown', function(ev) {
            var keyCode = ev.keyCode || ev.which;
            if (keyCode === 27 && isOpen) {
                toggleSearch(ev);
            }
        }); 
        morphSearch.querySelector('button[type="submit"]').addEventListener('click', function(ev) {
            ev.preventDefault();
        });
    })();
    </script>
 */
