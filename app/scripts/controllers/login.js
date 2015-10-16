'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('LoginCtrl', function ($scope,$http,$location,API_URL,Auth,localStorageService,$log,toasty,applicationFactory) {
	var loginInfo;
	var _this = this;
	this.login = loginInfo = {};
	this.loading = false;
	this.authenticate = function(){
		this.loading = true;
		$http.post(API_URL+'/admin/authenticate', loginInfo).success(function(data, status, headers, config){
			localStorageService.set('adminAuthToken',data.token);
			localStorageService.set('refreshToken',data.refresh_token);
			$location.path('/dashboard');
			$scope.$emit('login');
			applicationFactory.init();
		}).error(function(data, status, headers, config){
			_this.loading = false;
			toasty.error({
				title: 'Error!',
				msg: 'Authentication error',
				showClose: true,
				clickToClose: true
			});
		});
	};
});
