'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.jobFactory
 * @description
 * # jobFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('jobFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
		someMethod: function () {
			return meaningOfLife;
		}, createJob: function(formData){
			return $http.post(API_URL+'/admin/jobs/', formData).then(function(response) {
				return response.data;
			});
		}, getJob: function(jobId){
			return $http.get(API_URL+'/admin/jobs/'+jobId).then(function(response) {
				return response.data;
			});
		}, saveJob: function(formData){
			return $http.put(API_URL+'/admin/jobs/'+formData.id,formData);
		}, deleteJob: function(jobId){
			return $http.delete(API_URL+'/admin/jobs/'+jobId);
		}, queryJobs: function(searchQuery, searchSpecialty, searchState, pageNumber){
			var request = API_URL+'/admin/jobs?q='+searchQuery+'&p='+pageNumber;
			if(searchSpecialty){
				request += '&specialty_id='+searchSpecialty;
			}
			if(searchState) {
				request += '&state='+searchState;
			}

			return $http.get(request).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}
	};
});
