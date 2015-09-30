'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.lookupFactory
 * @description
 * # lookupFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('lookupFactory', function ($http,API_URL,$log) {
	// Service logic
	// ...

	var meaningOfLife = 42;

	// Public API here
	return {
		someMethod: function () {
			return meaningOfLife;
		}, createLookup: function(formData){
			return $http.post(API_URL+'/admin/lookup/', formData).then(function(response) {
				return response.data;
			});
		}, getLookupDoctor: function(claimId){
			return $http.get(API_URL+'/admin/lookup/'+claimId).then(function(response) {
				return response.data;
			});
		}, getLicenses: function(doctorId){
			return $http.get(API_URL+'/admin/lookup/'+doctorId+'/licenses').then(function(response) {
				return response.data;
			});
		}, saveLookup: function(formData){
			return $http.put(API_URL+'/admin/lookup',formData).then(function(response) {
				return response.data;
			});
		}, deleteLookup: function(doctorId){
			return $http.delete(API_URL+'/admin/lookup/'+doctorId).then(function(response) {
				return true;
			},function(error){
				$log.error(error);
			});
		}, queryLookup: function(queryData){
			console.log(queryData);
			//Put these all in array (or get as an array) and just parse the array for easiness
			var  searchSpecialty, searchState, pageNumber, sortBy, sortDirection,scoreLow,scoreHigh;
			queryData.p = queryData.p || 1;
			queryData.sort_direction = (queryData.sort_direction === true) ? 'ASC' : 'DESC';

			return $http.get(API_URL+'/admin/lookup', { params: queryData }).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, addLicense: function(doctorId,licInfo){
			return $http.post(API_URL+'/admin/lookup/'+doctorId+'/licenses',licInfo).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, updateLicense: function(doctorId,licInfo){
			return $http.put(API_URL+'/admin/lookup/'+doctorId+'/licenses/',licInfo).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, queryData: {}
	};
});
