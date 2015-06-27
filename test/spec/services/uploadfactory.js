'use strict';

describe('Service: uploadFactory', function () {

  // load the service's module
  beforeEach(module('modioAdminPortal'));

  // instantiate service
  var uploadFactory;
  beforeEach(inject(function (_uploadFactory_) {
    uploadFactory = _uploadFactory_;
  }));

  it('should do something', function () {
    expect(!!uploadFactory).toBe(true);
  });

});
