'use strict';

describe('Controller: JobMatchesCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var JobMatchesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobMatchesCtrl = $controller('JobMatchesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
