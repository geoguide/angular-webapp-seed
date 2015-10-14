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
	var meaningOfLife = 42;

	// Public API here
	return {
      someMethod: function () {
        return meaningOfLife;
      },
      //Easy navigation
		goTo: function (path,search) {
			$location.path(path).search('type',search);
		},get2Way: function(){
			return $http.get(API_URL+'/admin/two-way-matches').then(function(response){
				return response.data;
			});
		}, userInfo: {
			
		}, getDashboardStats: function(){
			return $http.get(API_URL+'/admin/dashboard-stats').then(function(response){
				return response.data;
			});
		}
	};
	
  });
