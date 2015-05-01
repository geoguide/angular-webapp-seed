'use strict';

/**
 * @ngdoc overview
 * @name angularWebappSeedApp
 * @description
 * # angularWebappSeedApp
 *
 * Main module of the application.
 */
(function(){
	var webapp = angular
	  .module('angularWebappSeedApp', [
	    'ngAnimate',
	    'ngAria',
	    'ngCookies',
	    'ngMessages',
	    'ngResource',
	    'ngRoute',
	    'ngSanitize',
	    'ngTouch'
	  ]);
	  
	webapp.constant('API_URL', 'http://localhost:3000');
	  
	webapp.config(function ($routeProvider) {
	    $routeProvider
	      .when('/', {
	        templateUrl: 'views/main.html',
	        access: { requiredLogin: true },
	        controller: 'MainCtrl'
	      })
	      .when('/about', {
	        templateUrl: 'views/about.html',
	        access: { requiredLogin: true },
	        controller: 'AboutCtrl'
	      })
	      .when('/login', {
	        templateUrl: 'views/login.html',
	        access: { requiredLogin: false },
	        controller: 'LoginCtrl'
	      })
	      .when('/signup', {
	        templateUrl: 'views/signup.html',
	        access: { requiredLogin: false },
	        controller: 'SignupCtrl'
	      })
	      .otherwise({
	        redirectTo: '/'
	      });
	  });
	
	webapp.factory('AuthInterceptor', function($q, $location, $window) {
		return {
			//Look for the token and if we have it attach it to every request
			request: function(config) {
				//var LocalService = $injector.get('LocalService');
				var token;
				if ($window.sessionStorage.authToken) {
					token = $window.sessionStorage.authToken;
					console.log(token);
				}
				if (token) {
					config.headers.Authorization = 'Bearer ' + token;
				}
				return config;
			},
			//If you get a 401 or 403 from the server delete the token and go to login
			responseError: function(response) {
				if (response.status === 401 || response.status === 403) {
					delete $window.sessionStorage.authToken;
					//LocalService.unset('authToken');
					//$injector.get('$state').go('anon.login');
					$location.path('/login');
				}
				return $q.reject(response);
			}
		};
	});
	
	webapp.factory('Auth', function($http, API_URL, $window, $location) {
		return {
			//figure out if authorized?
			authorize: function(access) {
				if(access === 'user'){
					//if (access === AccessLevels.user) {
					return this.isAuthenticated();
				} else {
					return true;
				}
			},
			//returns true if there is an auth token
			isAuthenticated: function() {
				return $window.sessionStorage.authToken;
				//LocalService.get('authToken');
			},
			//login function, should be moved to login controller
			login: function(email, password) {
				var login = $http.post(API_URL+'/authenticate', {email: email, password: password } );
				login.success(function(result) {
					console.log(JSON.stringify(result));
					$window.sessionStorage.authToken = result;
					$location.path('/about');
					//LocalService.set('authToken', JSON.stringify(result));
				});
				return login;
			},
			//Logout, just deletes token, then should redirect tlogin page
			logout: function() {
				// The backend doesn't care about logouts, delete the token and you're good to go.
				delete $window.sessionStorage.authToken;
				$location.path('/login');
				//LocalService.unset('authToken');
			},
			//This should move to signup controller
			register: function(formData) {
				delete $window.sessionStorage.authToken;
				//LocalService.unset('authToken');
				var register = $http.post('/auth/register', formData);
				register.success(function(result) {
					//LocalService.set('authToken', JSON.stringify(result));
					$window.sessionStorage.authToken = result;
				});
				return register;
			}
		};
	});
	
	webapp.directive('passwordMatch', [function () {
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
	}]);
	
	webapp.run(function($rootScope, $window, $location, Auth) {
		$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
			console.log(currentRoute);
			console.log('have token: '+JSON.stringify($window.sessionStorage.authToken));
			if(nextRoute.access){
				console.log('NEA:'+JSON.stringify(nextRoute.access));	
				if (nextRoute.access.requiredLogin && (!Auth.authorize(nextRoute.access.role) || !$window.sessionStorage.authToken) ) {
					event.preventDefault();
					console.log('final logout');
					$location.path('/login');
				}
			} else { 
				if (nextRoute.access.requiredLogin && (!Auth.authorize(nextRoute.access.role) || !$window.sessionStorage.authToken) ) {
					event.preventDefault();
					console.log('final logout');
					$location.path('/login');
				}
			}
		});
	});
})();