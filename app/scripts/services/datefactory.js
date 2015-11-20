'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.dateFactory
 * @description
 * # dateFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('dateFactory', function ($filter) {
	// Service logic
	// ...
	
	var processDate = function(dateIn){
		dateIn = $filter('date')(new Date(dateIn), 'MM/dd/yyyy');
		if(dateIn == '12/31/1969'){
			dateIn = null;
		}
	};
	
	// Public API here
	return {
		process: processDate
	};
});
