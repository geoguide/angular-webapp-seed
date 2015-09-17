'use strict';

describe('Service: dashboardFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var dashboardFactory;
  beforeEach(inject(function (_dashboardFactory_) {
    dashboardFactory = _dashboardFactory_;
  }));

  it('should do something', function () {
    expect(!!dashboardFactory).toBe(true);
  });

});
