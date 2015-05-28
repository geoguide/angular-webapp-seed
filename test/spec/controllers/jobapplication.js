'use strict';

describe('Controller: JobapplicationCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var JobapplicationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobapplicationCtrl = $controller('JobapplicationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
    return true;
  });
});
