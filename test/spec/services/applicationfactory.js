'use strict';

describe('Service: applicationFactory', function () {

  // load the service's module
  beforeEach(module('angularWebappSeedApp'));

  // instantiate service
  var applicationFactory;
  beforeEach(inject(function (_applicationFactory_) {
    applicationFactory = _applicationFactory_;
  }));

  it('should do something', function () {
    expect(!!applicationFactory).toBe(true);
  });

});
