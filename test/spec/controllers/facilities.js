'use strict';

describe('Controller: FacilitiesCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var FacilitiesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FacilitiesCtrl = $controller('FacilitiesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
