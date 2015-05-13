'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp').controller('LoginCtrl', function ($http,$location,API_URL,Auth,localStorageService,$log) {
	var loginInfo;
	this.login = loginInfo = {};
	
	this.authenticate = function(){
		$log.info('login info: '+JSON.stringify(loginInfo));
		$http.post(API_URL+'/admin/authenticate', loginInfo).success(function(data, status, headers, config){
			localStorageService.set('authToken',data.token);
			localStorageService.set('refreshToken',data.refresh_token);
			$location.path('/dashboard');
		}).error(function(data, status, headers, config){
			$log.error('error');
		});
	};
});
