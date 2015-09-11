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
			return $http.post(API_URL+'/admin/job-applications/'+applicationId+'/accept');
		}, saveApplication: function(formData){
			return $http.put(API_URL+'/admin/job-applications/'+formData.id,formData).then(function(response) {
				return response.data;
			});
		}, rejectApplication: function(applicationId){
			return $http.post(API_URL+'/admin/job-applications/'+applicationId+'/reject');
		}, createApplication: function(appData){
			return $http.post(API_URL+'/admin/job-applications/',appData);
		}, queryApplications: function(queryData){
			var searchQuery, searchSpecialty, searchState, pageNumber, sortBy,sortDirection, jobStatus, jobSource;
			searchQuery = queryData.search_query || '';
			sortDirection = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			sortBy = queryData.sort_by;
			pageNumber = queryData.pageNumber || 1;
			
			var request = API_URL+'/admin/job-applications?q='+searchQuery+'&p='+pageNumber;
			
			
			if(sortBy){
				request += '&sort_by='+sortBy;
			}
			request += '&sort_direction='+sortDirection;
			return $http.get(request).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}
	};
  });
