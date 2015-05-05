'use strict';

describe('Controller: ApplicationcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('angularWebappSeedApp'));

  var ApplicationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicationCtrl = $controller('ApplicationCtrl', {
      $scope: scope
    });
  }));

  it('should have an example test for later ', function () {
		expect(1).toBe(1);
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
