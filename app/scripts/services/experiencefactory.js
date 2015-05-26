'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.experienceFactory
 * @description
 * # experienceFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('experienceFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
			return meaningOfLife;
		}, submitExperience: function(doctorId, expType, formData){
			$log.log('submitting ('+doctorId+'s '+expType+' as '+angular.toJson(formData));
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/experience/'+expType, formData).then(function(response) {
				return response.data;
			});
		}, deleteExperience: function(doctorId,expType, expId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/'+expType+'/'+expId).then(function(response) {
				return response.data;
			});
		/*}, saveJob: function(formData){
			return $http.put(API_URL+'/admin/jobs/'+formData.id,formData).then(function(response) {
				return response.data;
			});
		}, deleteJob: function(jobId){
			return $http.delete(API_URL+'/admin/jobs/'+jobId).then(function(response) {
				return true;
			},function(error){
				$log.error(error);
			});*/
		}, getExperience: function(doctorId){
			return $http.get(API_URL+'/admin/doctor/'+doctorId+'/experience').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}
    };
  });
