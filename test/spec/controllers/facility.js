'use strict';

describe('Controller: FacilityCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var FacilityCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FacilityCtrl = $controller('FacilityCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
