'use strict';

describe('Controller: EducationWorkCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var EducationWorkCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EducationWorkCtrl = $controller('EducationWorkCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EducationWorkCtrl.awesomeThings.length).toBe(3);
  });
});
