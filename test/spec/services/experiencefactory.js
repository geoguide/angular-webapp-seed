'use strict';

describe('Service: experienceFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var experienceFactory;
  beforeEach(inject(function (_experienceFactory_) {
    experienceFactory = _experienceFactory_;
  }));

  it('should do something', function () {
    expect(!!experienceFactory).toBe(true);
  });

});
