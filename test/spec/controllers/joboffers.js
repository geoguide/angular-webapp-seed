'use strict';

describe('Controller: JoboffersCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var JoboffersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JoboffersCtrl = $controller('JoboffersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
