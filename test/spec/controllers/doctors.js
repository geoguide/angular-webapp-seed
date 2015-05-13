'use strict';

describe('Controller: DoctorsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularWebappSeedApp'));

  var DoctorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DoctorsCtrl = $controller('DoctorsCtrl', {
      $scope: scope
    });
  }));

});
