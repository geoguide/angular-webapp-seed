'use strict';

describe('Service: jobFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var jobFactory;
  beforeEach(inject(function (_jobFactory_) {
    jobFactory = _jobFactory_;
  }));

  it('should do something', function () {
    expect(!!jobFactory).toBe(true);
  });

});
