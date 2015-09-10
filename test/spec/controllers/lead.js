'use strict';

describe('Controller: LeadCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var LeadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LeadCtrl = $controller('LeadCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
