'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.applicationFactory
 * @description
 * # applicationFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('applicationFactory', function ($location,$http,API_URL) {
	// Service logic
	// ...
	var _this = this;
	// Public API here
	return {
		goTo: function (path,search) {
			$location.path(path).search('type',search);
		}, userInfo: {
			
		}, getDashboardStats: function(){
			return $http.get(API_URL+'/admin/dashboard-stats').then(function(response){
				return response.data;
			});
		}
	};
	
  });
