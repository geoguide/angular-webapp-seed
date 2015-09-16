'use strict';

describe('Controller: JobcandidatesctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var JobcandidatesctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobcandidatesctrlCtrl = $controller('JobcandidatesctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
