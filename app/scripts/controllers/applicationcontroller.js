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
	//Easy navigation
	$scope.goTo = function (path) {
	  $location.path(path);
	};
	//Logout
	$scope.logout = Auth.logout;
});
