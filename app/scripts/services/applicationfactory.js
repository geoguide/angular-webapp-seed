'use strict';

/**
 * @ngdoc service
 * @name angularWebappSeedApp.applicationFactory
 * @description
 * # applicationFactory
 * Factory in the angularWebappSeedApp.
 */
angular.module('angularWebappSeedApp')
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
			$location.path(path);
		}
	};
    
  });
