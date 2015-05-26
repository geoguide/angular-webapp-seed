'use strict';

describe('Service: jobApplicationFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var jobApplicationFactory;
  beforeEach(inject(function (_jobApplicationFactory_) {
    jobApplicationFactory = _jobApplicationFactory_;
  }));

  it('should do something', function () {
    expect(!!jobApplicationFactory).toBe(true);
  });

});
