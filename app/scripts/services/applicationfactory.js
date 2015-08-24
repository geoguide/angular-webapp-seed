'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.applicationFactory
 * @description
 * # applicationFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('applicationFactory', function ($location) {
    // Service logic
    // ...
    var _this = this;
    var meaningOfLife = 42;

	// Public API here
	return {
      someMethod: function () {
        return meaningOfLife;
      },
      //Easy navigation
		goTo: function (path) {
			$location.path(path);
		}
	};
	
  });
