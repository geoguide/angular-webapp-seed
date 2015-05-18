'use strict';

describe('Service: doctorFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var doctorFactory;
  beforeEach(inject(function (_doctorFactory_) {
    doctorFactory = _doctorFactory_;
  }));

  it('should do something', function () {
    expect(!!doctorFactory).toBe(true);
  });

});
