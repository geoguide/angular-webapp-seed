'use strict';

describe('Service: s3factory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var s3factory;
  beforeEach(inject(function (_s3factory_) {
    s3factory = _s3factory_;
  }));

  it('should do something', function () {
    expect(!!s3factory).toBe(true);
  });

});
