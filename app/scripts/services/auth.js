'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.Auth
 * @description
 * # Auth
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('Auth', function($http, API_URL, $location, jwtHelper, $q, $timeout, localStorageService,$log) {
	
	var delegate = function(){
		var deferred = $q.defer();
		var refreshToken = localStorageService.get('refreshToken');
		$timeout(function() {
			deferred.notify('just trying to let you know i am delegating');
		},0);
		if(refreshToken){
			$http.post(API_URL+'/admin/delegate', { refresh_token: refreshToken }).then(function(response, status, headers, config){
				
				localStorageService.set('adminAuthToken', response.data.token);
				localStorageService.set('refreshToken', response.data.refresh_token);
				deferred.resolve(response.data);
			},function(){
				deferred.reject('error');
			});
		} else {
			deferred.reject('no refresh token');
		}
		return deferred.promise;
	};
	
	var isAuthenticated = function() {
		var storedJwt = localStorageService.get('adminAuthToken');
		if(storedJwt){
			var storedPayload = jwtHelper.decodeToken(storedJwt);
			userInfo = storedPayload;
			if(jwtHelper.isTokenExpired(storedJwt)){
				//$log.warn('stored JWT: '+storedJwt+' payload: '+JSON.stringify(storedPayload)+' is expired expired: '+jwtHelper.getTokenExpirationDate(storedJwt)+' deleting');
				localStorageService.remove('adminAuthToken');
			} else {
				//$log.info('stored JWT: '+storedJwt+' payload: '+JSON.stringify(storedPayload)+' is not expired expires: '+jwtHelper.getTokenExpirationDate(storedJwt));
			}
		}
		return localStorageService.get('adminAuthToken');
	};
	
	var logout = function(){
		$log.log('logout delete');
		localStorageService.remove('adminAuthToken');
		localStorageService.remove('refreshToken');
		userInfo = {};
		$location.path('/login');
	};
	
	var register = function(formData) {
		localStorageService.remove('adminAuthToken');
		var register = $http.post('/auth/register', formData);
		register.success(function(result) {
			localStorageService.set('adminAuthToken',result.token);
		});
		return register;
	};
	
	var userInfo = {};
	
	var defaultAuthPage = '/dashboard';
	
	return {
		isAuthenticated: isAuthenticated,
		user: function() { return userInfo; },
		defaultAuthPage: function(){ return defaultAuthPage; },
		logout: logout,
		delegate: delegate,
		register: register
	};
});