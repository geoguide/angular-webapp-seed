'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp').controller('LoginCtrl', function ($scope,$http,API_URL) {
	var loginInfo;
	$scope.login = loginInfo = {};
	
	$scope.authenticate = function(){
		$http.post(API_URL+'/admin/authenticate', loginInfo).success(function(data, status, headers, config){
			console.log('success');
		}).error(function(data, status, headers, config){
			console.log('error');
		});
	};
});
