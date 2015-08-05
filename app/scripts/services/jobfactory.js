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
		}, queryJobs: function(queryData){
			var searchQuery, searchSpecialty, searchState, pageNumber, sortBy,sortDirection;
			searchQuery = queryData.search_query || '';
			searchState = queryData.search_state;
			pageNumber = queryData.page_number || 1;
			searchSpecialty = queryData.search_specialty;
			sortDirection = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			sortBy = queryData.sort_by;
			
			var request = API_URL+'/admin/jobs?q='+searchQuery+'&p='+pageNumber;
			if(searchSpecialty){
				request += '&specialty_id='+searchSpecialty;
			}
			if(searchState) {
				request += '&state='+searchState;
			}
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
