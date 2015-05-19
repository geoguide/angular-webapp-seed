'use strict';

describe('Service: facilityFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var facilityFactory;
  beforeEach(inject(function (_facilityFactory_) {
    facilityFactory = _facilityFactory_;
  }));

  it('should do something', function () {
    expect(!!facilityFactory).toBe(true);
  });

});
