'use strict';

describe('Service: lookupFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var lookupFactory;
  beforeEach(inject(function (_lookupFactory_) {
    lookupFactory = _lookupFactory_;
  }));

  it('should do something', function () {
    expect(!!lookupFactory).toBe(true);
  });

});
