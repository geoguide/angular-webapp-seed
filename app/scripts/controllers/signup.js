'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp').controller('SignupCtrl', function ($scope,$log) {
	
	//signupform variables
	var signup;
	$scope.signup = signup = {};
	
	$scope.submitSignup = function(){
		$log.info('signup clicked: '+JSON.stringify(signup));  
	};
});
