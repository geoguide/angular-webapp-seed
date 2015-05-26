'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.jobApplicationFactory
 * @description
 * # jobApplicationFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('jobApplicationFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
     return {
		someMethod: function () {
			return meaningOfLife;
		}, getApplication: function(applicationId){
			return $http.get(API_URL+'/admin/job-applications/'+applicationId).then(function(response) {
				return response.data;
			});
		}, acceptApplication: function(applicationId){
			return $http.put(API_URL+'/admin/job-applications/'+applicationId+'/accept').then(function(response) {
				return response.data;
			});
		}, saveApplication: function(formData){
			return $http.put(API_URL+'/admin/job-applications/'+formData.id,formData).then(function(response) {
				return response.data;
			});
		}, rejectApplication: function(applicationId){
			return $http.post(API_URL+'/admin/job-applications/'+applicationId+'/reject').then(function(response) {
				return true;
			},function(error){
				$log.error(error);
			});
		}, queryApplications: function(searchQuery, pageNumber){
			return $http.get(API_URL+'/admin/job-applications?q='+searchQuery+'&p='+pageNumber).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}
	};
  });
