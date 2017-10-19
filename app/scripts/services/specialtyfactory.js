'use strict';
/**
 * @ngdoc service
 * @name modioAdminPortal.specialtyFactory
 * @description
 * # specialtyFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('specialtyFactory', function($http, API_URL, $log) {
	// Service logic
	// ...
	var meaningOfLife = 42;
	// Public API here
	return {
		someMethod: function() {
			return meaningOfLife;
		},
		getSpecialties: function() {
			return $http.get(API_URL + '/admin/specialties/').then(function(response) {
				return response.data;
			});
		},getABMSCertifications: function() {
			return $http.get(API_URL + '/admin/doctors/abms-certifications').then(function(response) {
				return response.data;
			});
		},getABMSBoards: function() {
			return $http.get(API_URL + '/admin/doctors/abms-boards').then(function(response) {
				return response.data;
			});
		},getCertificationsByBoard: function(board){
			return $http.get(API_URL + '/admin/doctors/abms-certifications',{params: board }).then(function(response) {
				return response.data;
			});
		}, query: function(queryIn){
			queryIn.sort_direction = (queryIn.sortDirection === true) ? 'DESC' : 'ASC';
			return $http.get(API_URL+'/admin/specialties',{params: queryIn}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		},queryABMS: function(queryIn){
			if(queryIn){
				queryIn.sort_direction = (queryIn.sortDirection === true) ? 'DESC' : 'ASC';	
			} else {
				queryIn = {};
			}
			return $http.get(API_URL+'/admin/doctors/abms-certifications',{params: queryIn}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}
	};
});