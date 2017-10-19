'use strict';

describe('Service: dateFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var dateFactory;
  beforeEach(inject(function (_dateFactory_) {
    dateFactory = _dateFactory_;
  }));

  it('should do something', function () {
    expect(!!dateFactory).toBe(true);
  });

});
