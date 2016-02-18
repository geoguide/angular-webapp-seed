'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.jobFactory
 * @description
 * # jobFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('jobFactory', function ($http,API_URL,$log,dateFactory) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
		someMethod: function () {
			return meaningOfLife;
		}, createJob: function(formData){
			formData.start_date = dateFactory.process(formData.start_date);
			formData.end_date = dateFactory.process(formData.end_date);
			return $http.post(API_URL+'/admin/jobs/', formData).then(function(response) {
				return response.data;
			});
		}, getJob: function(jobId){
			return $http.get(API_URL+'/admin/jobs/'+jobId).then(function(response) {
				return response.data;
			});
		}, saveJob: function(formData){
			formData.start_date = dateFactory.process(formData.start_date);
			formData.end_date = dateFactory.process(formData.end_date);
			return $http.put(API_URL+'/admin/jobs/'+formData.id,formData);
		}, submitRate: function(formData){
			return $http.post(API_URL+'/admin/jobs/'+formData.job_id+'/rates',formData);
    }, deleteRate: function(data){
  			return $http.delete(API_URL+'/admin/jobs/'+data.job_id+'/rates/'+data.id);
		}, deleteJob: function(jobId){
			return $http.delete(API_URL+'/admin/jobs/'+jobId);
		}, queryJobs: function(queryData){
			queryData.q = queryData.q || '';
			queryData.p = queryData.p || 1;
			queryData.sort_direction = (queryData.sortDirection === true) ? 'ASC' : 'DESC';

			var request = API_URL+'/admin/jobs';

			return $http.get(request, {params: queryData}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, getJobTags: function(queryIn){
			var queryData = { q: queryIn };
			return $http.get(API_URL+'/admin/jobs/tags',{params:queryData}).then(function(response) {
				return response.data;
			});
		}, getPartnerIds: function(queryIn){
			var queryData = { q: queryIn };
			return $http.get(API_URL+'/admin/jobs/partner-ids',{params:queryData}).then(function(response) {
				return response.data;
			});
		}, findCandidates: function(jobIdIn){
			return $http.get(API_URL+'/admin/jobs/'+jobIdIn+'/candidates').then(function(response) {
				return response.data;
			});
		}, findOffers: function(jobIdIn){
			return $http.get(API_URL+'/admin/jobs/'+jobIdIn+'/offers').then(function(response) {
				return response.data;
			});
		}, queryData: {

		}, bookmarkJob: function(jobId){
			return $http.post(API_URL+'/admin/jobs/'+jobId+'/bookmark');
		}, removeBookmark: function(jobId){
			return $http.delete(API_URL+'/admin/jobs/'+jobId+'/bookmark');
		}, getJobMatchTotals: function(){
			return $http.get(API_URL+'/admin/jobs/match-count').then(function(response) {
				return response.data;
			});
		}
	};
});
