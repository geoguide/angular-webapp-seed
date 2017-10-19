'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.facilityFactory
 * @description
 * # facilityFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('reportFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...


    // Public API here
    return {
  		queryLicenses: function(queryIn){
  			queryIn.sort_direction = (queryIn.sortDir === true) ? 'DESC' : 'ASC';
  			return $http.get(API_URL+'/admin/expiring-licenses',{params: queryIn}).then(function(response) {
  				return response.data;
  			}, function(error){
  				$log.error(error);
  			});
  		}, queryData: { sortDir: false,interval:30,alerts:1,locked:0 }
  	};
});
