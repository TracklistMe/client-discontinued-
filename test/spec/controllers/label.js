'use strict';

describe('Controller: LabelCtrl', function() {

    // load the controller's module
    beforeEach(module('tracklistmeApp'));

    var LabelCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        LabelCtrl = $controller('LabelCtrl', {
            $scope: scope
        });
    }));

});
