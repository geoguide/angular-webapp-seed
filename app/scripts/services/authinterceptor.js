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
			if (localStorageService.get('authToken')) {
				token = localStorageService.get('authToken');
			}
			if (token) {
				config.headers.modio = 'Bearer ' + token;
				config.headers.Authorization = '';
			}
			return config;
		},
		//If you get a 401 or 403 from the server delete the token and go to login
		responseError: function(response) {
			if (response.status === 401 || response.status === 403) {
				$log.log('error delete');
				localStorageService.remove('authToken');
				$location.path('/login');
			}
			return $q.reject(response);
		}
	};
});