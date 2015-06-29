'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('LoginCtrl', function ($scope,$http,$location,API_URL,Auth,localStorageService,$log) {
	var loginInfo;
	this.login = loginInfo = {};
	
	this.authenticate = function(){
		$http.post(API_URL+'/admin/authenticate', loginInfo).success(function(data, status, headers, config){
			localStorageService.set('authToken',data.token);
			localStorageService.set('refreshToken',data.refresh_token);
			$location.path('/dashboard');
			$scope.$emit('login');
		}).error(function(data, status, headers, config){
			$log.error('error');
		});
	};
});
