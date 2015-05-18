'use strict';

/**
 * @ngdoc directive
 * @name modioAdminPortal.directive:directives
 * @description
 * # directives
 */
angular.module('modioAdminPortal').directive('directives', function () {
	return {
		template: '<div></div>',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			element.text('this is the directives directive');
		}
	};
}).directive('passwordMatch', function () {
	return {
		restrict: 'A',
		scope:true,
		require: 'ngModel',
		link: function (scope, elem , attrs,control) {
			var checker = function () {
 
				//get the value of the first password
				var e1 = scope.$eval(attrs.ngModel); 
				
				//get the value of the other password  
				var e2 = scope.$eval(attrs.passwordMatch);
				return e1 === e2;
			};
			scope.$watch(checker, function (n) {
				
				//set the form control to valid if both 
				//passwords are the same, else invalid
				control.$setValidity('unique', n);
			});
		}
	};
}).directive('ngReallyClick', function($window) {
	var linkFunction = function(scope, element, attrs) {
		element.bind('click', function() {
			var message = attrs.ngReallyMessage;
			if (message && $window.confirm(message)) {
				scope.$apply(attrs.ngReallyClick);
			}
		});
	};
	return {
		restrict: 'A',
		link: linkFunction
	};
});
