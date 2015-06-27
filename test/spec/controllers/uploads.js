'use strict';

describe('Controller: UploadsCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var UploadsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadsCtrl = $controller('UploadsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UploadsCtrl.awesomeThings.length).toBe(3);
  });
});
