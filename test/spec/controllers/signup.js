'use strict';

describe('Controller: SignupCtrl', function () {

  // load the controller's module
  beforeEach(module('angularWebappSeedApp'));

  var SignupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SignupCtrl = $controller('SignupCtrl', {
      $scope: scope
    });
  }));

  it('should have an example test for later ', function () {
    expect(3).toBe(3);
  });
});
