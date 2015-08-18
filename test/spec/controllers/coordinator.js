'use strict';

describe('Controller: CoordinatorCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var CoordinatorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CoordinatorCtrl = $controller('CoordinatorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
