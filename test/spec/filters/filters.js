'use strict';

describe('Filter: filters', function () {

  // load the filter's module
  beforeEach(module('modioAdminPortal'));

  // initialize a new instance of the filter before each test
  var filters;
  beforeEach(inject(function ($filter) {
    filters = $filter('filters');
  }));

});
