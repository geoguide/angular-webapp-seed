'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.facilityFactory
 * @description
 * # facilityFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('facilityFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
		someMethod: function () {
			return meaningOfLife;
		}, getFacilities: function(){
			return $http.get(API_URL+'/admin/facilities/').then(function(response) {
				return response.data;
			});
		}, queryFacilities: function(queryIn){
			return $http.get(API_URL+'/admin/facilities?q='+queryIn).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		},
	};
});
