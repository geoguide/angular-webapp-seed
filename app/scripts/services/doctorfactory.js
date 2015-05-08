'use strict';

/**
 * @ngdoc service
 * @name angularWebappSeedApp.doctorFactory
 * @description
 * # doctorFactory
 * Factory in the angularWebappSeedApp.
 */
angular.module('angularWebappSeedApp').factory('doctorFactory', function ($http,API_URL) {
	// Service logic
	// ...

	var meaningOfLife = 42;

	// Public API here
	return {
		someMethod: function () {
			return meaningOfLife;
		},
		getDoctor: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId).then(function(response) {
				return response.data;
			});
		}, saveDoctor(formData){
			return $http.put(API_URL+'/admin/doctors',formData).then(function(response) {
				return response.data;
			});
		}, deleteDoctor(doctorId){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId).then(function(response) {
				return true;
			},function(error){
				console.error(error);
			});
		}
	};
});
