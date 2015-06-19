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

    var meaningOfLife = 42;

	// Public API here
	return {
      someMethod: function () {
        return meaningOfLife;
      },
      //Easy navigation
		goTo: function (path) {
			console.log('got: '+path);
			$location.path(path);
		}
	};
    
  });
