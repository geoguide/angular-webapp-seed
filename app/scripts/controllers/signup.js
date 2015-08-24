'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('SignupCtrl', function ($scope,$log) {
	
	//signupform variables
	var signup;
	$scope.signup = signup = {};
	
	$scope.submitSignup = function(){
		$log.info('signup clicked: '+JSON.stringify(signup));  
	};
});
