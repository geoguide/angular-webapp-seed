'use strict';

describe('Controller: CoordinatorsCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var CoordinatorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CoordinatorsCtrl = $controller('CoordinatorsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
