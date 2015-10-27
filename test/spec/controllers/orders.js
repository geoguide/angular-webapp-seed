'use strict';

describe('Controller: OrdersCtrl', function () {

  // load the controller's module
  beforeEach(module('modioAdminPortal'));

  var OrdersCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    OrdersCtrl = $controller('OrdersCtrl', {
    });
  }));

});
