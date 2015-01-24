'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
    .controller('SearchCtrl', function($scope, $rootScope, $document) {

        $scope.searchOpen = false
        $scope.searchString = ""
        $scope.isSelected = false
        $document.bind("keypress", function(event) {
            if ($scope.isSelected == false) {
                $scope.open();
                console.log($scope.searchOpen)
                $scope.isSelected = true;
                $scope.$apply();

            }

        });
        $scope.focusReport = function() {
            console.log("FOCUS<<")
        }
        $scope.blurReport = function() {
            console.log("BLUR<<")
        }
        $scope.open = function() {
            console.log("Open Interface");
            $scope.searchOpen = true;
        }
        $rootScope.$on('searchActivate', function(event, mass) {
            console.log("GOT IT ");
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
