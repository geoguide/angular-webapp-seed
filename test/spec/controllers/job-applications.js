'use strict';

describe('Controller: JobApplicationsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularWebappSeedApp'));

  var JobApplicationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobApplicationsCtrl = $controller('JobApplicationsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
