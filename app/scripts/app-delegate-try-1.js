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
	var webapp = angular.module('angularWebappSeedApp', [
		'ngAnimate',
		'ngAria',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'angular-jwt'
	]);
	
	webapp.constant('API_URL', 'http://localhost:3000');
	webapp.value('loggedIn', false);
	  
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
					console.log('token: '+token);
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
	
	webapp.factory('Auth', function($http, API_URL, $window, $location, jwtHelper, $q ) {
		var _this = this;
		
		var delegate = function(){
			return $http.post(API_URL+'/admin/delegate', {refresh_token: $window.sessionStorage.refreshToken });
		};
		this.isAuthenticated = false;
		
		var isAuthed = function(){
			return this.isAuthenticated;
		};
		
		var checkAuthentication = function() {
			var deferred = $q.defer();
			var storedJwt = $window.sessionStorage.authToken;
			var refreshToken = $window.sessionStorage.authToken;
			if(storedJwt){
				if(jwtHelper.isTokenExpired(storedJwt)){
					console.log('is expired expired: '+jwtHelper.getTokenExpirationDate(storedJwt));
					delete $window.sessionStorage.authToken;
					delegate().success(function(result) {
						$window.sessionStorage.authToken = result.token;
						$window.sessionStorage.refreshToken = result.refresh_token;
						console.log('delegate-result: '+JSON.stringify(result));
						deferred.resolve(true);
						_this.isAuthenticated = true;
						//$location.path('/about');
					});
				} else {
					deferred.resolve(true);
					_this.isAuthenticated = true;
					console.log('is not expired expires: '+jwtHelper.getTokenExpirationDate(storedJwt));
					//_this.delegate();
				}
			} else {
				console.log('no jwt');
				deferred.resolve(false);
				_this.isAuthenticated = false;
			}
			
			return deferred.promise;
		};
		var getPayload = function(){
			var storedJwt = $window.sessionStorage.authToken;
			console.log('stored JWT: '+storedJwt);
			var storedPayload = jwtHelper.decodeToken(storedJwt);
			console.log('payload: '+JSON.stringify(storedPayload));
			return storedPayload;
		};
		var login = function(email, password) {
			var login = $http.post(API_URL+'/authenticate', {email: email, password: password } );
			login.success(function(result) {
				console.log('login-result: '+JSON.stringify(result));
				$window.sessionStorage.authToken = result.token;
				$window.sessionStorage.refreshToken = result.refresh_token;
				$location.path('/about');
				//LocalService.set('authToken', JSON.stringify(result));
			});
			return login;
		};
		
		return {
			//returns true if there is an auth token
			checkAuthentication: checkAuthentication,
			getPayload: getPayload,
			delegate: delegate,
			isAuthenticated: isAuthed,
			//login function, should be moved to login controller
			login: login,
			//Logout, just deletes token, then should redirect tlogin page
			logout: function() {
				// The backend doesn't care about logouts, delete the token and you're good to go.
				delete $window.sessionStorage.authToken;
				delete $window.sessionStorage.refreshToken;
				$location.path('/login');
				//LocalService.unset('authToken');
			},
			//This should move to signup controller
			register: function(formData) {
				delete $window.sessionStorage.authToken;
				delete $window.sessionStorage.refreshToken;
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
				if (nextRoute.access.requiredLogin) {
					Auth.checkAuthentication().then(function(result){
						if(!result){
							$location.path('/login');
						}
					});
					
				}
			} else { 
				event.preventDefault();
				$location.path('/about');
			}
		});
	});
})();