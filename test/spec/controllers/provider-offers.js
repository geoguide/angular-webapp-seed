'use strict';

describe('Controller: ProviderOffersCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var ProviderOffersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProviderOffersCtrl = $controller('ProviderOffersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
