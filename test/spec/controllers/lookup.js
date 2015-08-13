'use strict';

describe('Controller: LookupCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var LookupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LookupCtrl = $controller('LookupCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
