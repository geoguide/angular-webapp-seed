'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.dashboardFactory
 * @description
 * # dashboardFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('dashboardFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...

    // Public API here
    return {
      getLeads: function(queryData){
	      queryData.sort_direction = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			return $http.get(API_URL+'/admin/leads',{params: queryData}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, getLead: function(idIn){
			return $http.get(API_URL+'/admin/leads/'+idIn).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, saveLead: function(leadId,leadInfo){
			return $http.put(API_URL+'/admin/leads/'+leadId,leadInfo);
		}, submitLead: function(leadInfo){
			return $http.post(API_URL+'/admin/leads/',leadInfo);
		}
    };
  });
