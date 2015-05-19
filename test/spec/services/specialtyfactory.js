'use strict';

describe('Service: specialtyFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var specialtyFactory;
  beforeEach(inject(function (_specialtyFactory_) {
    specialtyFactory = _specialtyFactory_;
  }));

  it('should do something', function () {
    expect(!!specialtyFactory).toBe(true);
  });

});
