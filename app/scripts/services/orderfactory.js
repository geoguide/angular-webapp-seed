'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.orderFactory
 * @description
 * # orderFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('orderFactory', function ($http,$log,API_URL) {
	// Service logic
	// ...
	
	var meaningOfLife = 42;
	
	// Public API here
	return {
		getOrders: function(queryData){
			console.log(queryData);
			return $http.get(API_URL+'/admin/orders',{params: queryData }).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, submitOrder: function(orderInfo){
			return $http.put(API_URL+'/admin/orders',orderInfo).then(function(response){
				return response.data;
			});
		}
	};
});
