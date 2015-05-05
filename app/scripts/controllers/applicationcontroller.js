'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:ApplicationcontrollerCtrl
 * @description
 * # ApplicationcontrollerCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp').controller('ApplicationCtrl', function ($scope, Auth) {
	$scope.$watch( Auth.isAuthenticated, function ( isLoggedIn ) {
		$scope.isLoggedIn = isLoggedIn;
		//$scope.currentUser = AuthService.currentUser();
	});
	$scope.logout = Auth.logout();
});
