'use strict';

describe('Service: qualificationFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var qualificationFactory;
  beforeEach(inject(function (_qualificationFactory_) {
    qualificationFactory = _qualificationFactory_;
  }));

  it('should do something', function () {
    expect(!!qualificationFactory).toBe(true);
  });

});
