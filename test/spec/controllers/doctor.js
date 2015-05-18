'use strict';

describe('Controller: DoctorCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var DoctorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DoctorCtrl = $controller('DoctorCtrl', {
      $scope: scope
    });
  }));

});
