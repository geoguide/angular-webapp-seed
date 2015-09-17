'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('AuthInterceptor', function($q, $location, localStorageService,$log) {
	return {
		//Look for the token and if we have it attach it to every request
		request: function(config) {
			//var LocalService = $injector.get('LocalService');
			var token;
			if (localStorageService.get('adminAuthToken')) {
				token = localStorageService.get('adminAuthToken');
			}
			if (token) {
				config.headers.Authorization = 'Bearer ' + token;
			}
			return config;
		},
		//If you get a 401 or 403 from the server delete the token and go to login
		responseError: function(rejection) {
			if (rejection.status === 401 || rejection.status === 403) {
				localStorageService.remove('adminAuthToken');
				$location.path('/login');
			}
			return $q.reject(rejection);
		}
	};
});