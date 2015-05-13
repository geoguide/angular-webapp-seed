'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:ApplicationcontrollerCtrl
 * @description
 * # ApplicationcontrollerCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp').controller('ApplicationCtrl', function ($scope, $location, Auth) {
	$scope.$watch( Auth.isAuthenticated, function ( isLoggedIn ) {
		$scope.isLoggedIn = isLoggedIn;
		$scope.userInfo = Auth.user();
		//$scope.currentUser = AuthService.currentUser();
	});
	//Logout
	$scope.logout = Auth.logout;
});
