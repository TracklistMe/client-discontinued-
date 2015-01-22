'use strict';

describe('Directive: backgroundImage', function () {

  // load the directive's module
  beforeEach(module('tracklistmeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<background-image></background-image>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the backgroundImage directive');
  }));
});
