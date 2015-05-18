'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ApplicationcontrollerCtrl
 * @description
 * # ApplicationcontrollerCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('ApplicationCtrl', function ($scope, $location, Auth) {
	var _this = this;
	$scope.$watch( Auth.isAuthenticated, function ( isLoggedIn ) {
		$scope.isLoggedIn = isLoggedIn;
		_this.userInfo = Auth.user();
		//$scope.currentUser = AuthService.currentUser();
	});
	
	//Logout
	this.logout = Auth.logout;
});
