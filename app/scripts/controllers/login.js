'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp').controller('LoginCtrl', function ($scope,$http,$window,$location,API_URL,Auth) {
	var loginInfo;
	$scope.login = loginInfo = {};
	
	$scope.authenticate = function(){
		console.log('login info: '+JSON.stringify(loginInfo));
		$http.post(API_URL+'/admin/authenticate', loginInfo).success(function(data, status, headers, config){
			$window.sessionStorage.authToken = data.token;
			$window.sessionStorage.refreshToken = data.refresh_token;
			$location.path('/about');
		}).error(function(data, status, headers, config){
			console.log('error');
		});
	};
});
