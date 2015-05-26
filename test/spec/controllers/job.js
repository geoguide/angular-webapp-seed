'use strict';

describe('Controller: JobCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var JobCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobCtrl = $controller('JobCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.jobCtrl.awesomeThings.length).toBe(3);
  });
});
