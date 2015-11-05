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
	 var _this = this;
	 _this.twoWayMatches = [];
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
		}, get2Way: function(){
			return $http.get(API_URL+'/admin/two-way-matches').then(function(response){
				_this.twoWayMatches = response.data;
				return response.data;
			});
		}, matchExclusion: function(data){
			var url;
			if(!data.exclude){
				url = API_URL+'/admin/include-match';
			} else {
				url = API_URL+'/admin/exclude-match';
			}
			return $http.post(url,data).then(function(response){
				return response.data;
			});
		}, tempDEA: function(data){
			var url = API_URL+'/admin/services/dea-data';
			return $http.post(url,data).then(function(response){
				return response.data;
			});
		}, twoWayMatches: _this.twoWayMatches
		
    };
  });
