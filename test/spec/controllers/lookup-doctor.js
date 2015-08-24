'use strict';

describe('Controller: LookupDoctorCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var LookupDoctorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LookupDoctorCtrl = $controller('LookupDoctorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
