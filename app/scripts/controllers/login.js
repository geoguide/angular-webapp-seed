'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp').controller('LoginCtrl', function ($scope,$http) {
	var loginInfo;
	$scope.login = loginInfo = {};
	
	$scope.authenticate = function(){
		console.log(JSON.stringify(loginInfo));
		$http.post('https://dev-api.hubhealth.com/admin/authenticate', loginInfo).success(function(data, status, headers, config){
			console.log('success');
		}).error(function(data, status, headers, config){
			console.log('error');
		});
	};
});
