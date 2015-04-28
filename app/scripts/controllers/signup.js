'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp').controller('SignupCtrl', function ($scope) {
	
	//signupform variables
	var signup;
	$scope.signup = signup = {};
	
	$scope.submitSignup = function(){
		console.log('signup clicked: '+JSON.stringify(signup));  
	};
});
