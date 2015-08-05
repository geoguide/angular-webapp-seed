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
		}, getFacility: function(facilityId){
			return $http.get(API_URL+'/admin/facilities/'+facilityId).then(function(response) {
				return response.data;
			});
		}, saveFacility: function(formData){
			return $http.put(API_URL+'/admin/facilities/'+formData.id,formData);
		}, queryFacilities: function(queryIn){
			
			var searchQuery, pageNumber, sortBy, sortDirection;
			sortBy = queryIn.sort_by;
			queryIn.sort_direction = (queryIn.sort_direction === true) ? 'DESC' : 'ASC';
			return $http.get(API_URL+'/admin/facilities',{params: queryIn}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		},
	};
});
