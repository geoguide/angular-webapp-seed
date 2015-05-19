'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.doctorFactory
 * @description
 * # doctorFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('doctorFactory', function ($http,API_URL,$log) {
	// Service logic
	// ...

	var meaningOfLife = 42;

	// Public API here
	return {
		someMethod: function () {
			return meaningOfLife;
		}, createDoctor: function(formData){
			return $http.post(API_URL+'/admin/doctors/', formData).then(function(response) {
				return response.data;
			});
		}, getDoctor: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId).then(function(response) {
				return response.data;
			});
		}, saveDoctor: function(formData){
			return $http.put(API_URL+'/admin/doctors',formData).then(function(response) {
				return response.data;
			});
		}, deleteDoctor: function(doctorId){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId).then(function(response) {
				return true;
			},function(error){
				$log.error(error);
			});
		}, queryDoctors: function(searchQuery, pageNumber){
			return $http.get(API_URL+'/admin/doctors?q='+searchQuery+'&p='+pageNumber).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}
	};
});
