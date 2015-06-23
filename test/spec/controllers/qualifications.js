'use strict';

describe('Controller: QualificationsCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var QualificationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QualificationsCtrl = $controller('QualificationsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(QualificationsCtrl.awesomeThings.length).toBe(3);
  });
});
