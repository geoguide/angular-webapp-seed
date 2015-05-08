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
		'angular-jwt',
		'LocalStorageModule',
		'ui.mask',
		'ngAnimate',
		'mgcrea.ngStrap'
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
			.when('/doctors', {
			  templateUrl: 'views/doctors.html',
			  access: { requiredLogin: true },
			  controller: 'DoctorsCtrl'
			})
			.when('/jobs', {
			  templateUrl: 'views/jobs.html',
			  access: { requiredLogin: true },
			  controller: 'JobsCtrl'
			})
			.when('/job-applications', {
			  templateUrl: 'views/job-applications.html',
			  access: { requiredLogin: true },
			  controller: 'JobApplicationsCtrl'
			})
			.when('/dashboard', {
			  templateUrl: 'views/dashboard.html',
			  access: { requiredLogin: true },
			  controller: 'DashboardCtrl'
			})
			.when('/doctor/:id', {
			  templateUrl: 'views/doctor.html',
			  access: { requiredLogin: true },
			  controller: 'DoctorCtrl',
			  controllerAs: 'dr'
			}).otherwise({
				templateUrl:'/404.html',access: { requiredLogin: false } 
			}); // Render 404 view
	  });
	  
	 webapp.config(function($httpProvider) {  
	    $httpProvider.interceptors.push('AuthInterceptor');
	});
	
	webapp.factory('AuthInterceptor', function($q, $location, localStorageService) {
		return {
			//Look for the token and if we have it attach it to every request
			request: function(config) {
				//var LocalService = $injector.get('LocalService');
				var token;
				if (localStorageService.get('authToken')) {
					token = localStorageService.get('authToken');
				}
				if (token) {
					config.headers.Authorization = 'Bearer ' + token;
				}
				return config;
			},
			//If you get a 401 or 403 from the server delete the token and go to login
			responseError: function(response) {
				if (response.status === 401 || response.status === 403) {
					console.log('error delete');
					localStorageService.remove('authToken');
					$location.path('/login');
				}
				return $q.reject(response);
			}
		};
	});
	
	webapp.factory('Auth', function($http, API_URL, $location, jwtHelper, $q, $timeout, localStorageService) {
		var delegate = function(){
			var deferred = $q.defer();
			var refreshToken = localStorageService.get('refreshToken');
			$timeout(function() {
				deferred.notify('just trying to let you know i am delegating');
			},0);
			if(refreshToken){
				$http.post(API_URL+'/admin/delegate', { refresh_token: refreshToken }).success(function(data, status, headers, config){
					console.log(data);
					localStorageService.set('authToken', data.token);
					localStorageService.set('refreshToken', data.refresh_token);
					deferred.resolve(data);
				}).error(function(){
					deferred.reject('error');
				});
			} else {
				deferred.reject('no refresh token');
			}
			
			return deferred.promise;
		};
		
		var userInfo = {};
		var defaultAuthPage = '/dashboard';
		
		return {
			//returns true if there is an auth token
			isAuthenticated: function() {
				var storedJwt = localStorageService.get('authToken');
				if(storedJwt){
					var storedPayload = jwtHelper.decodeToken(storedJwt);
					userInfo = storedPayload;
					if(jwtHelper.isTokenExpired(storedJwt)){
						console.warn('stored JWT: '+storedJwt+' payload: '+JSON.stringify(storedPayload)+' is expired expired: '+jwtHelper.getTokenExpirationDate(storedJwt)+' deleting');
						localStorageService.remove('authToken');
					} else {
						//console.info('stored JWT: '+storedJwt+' payload: '+JSON.stringify(storedPayload)+' is not expired expires: '+jwtHelper.getTokenExpirationDate(storedJwt));
					}
				}
				
				return localStorageService.get('authToken');
				//LocalService.get('authToken');
			},
			user: function() { return userInfo; },
			defaultAuthPage: function(){ return defaultAuthPage; },
			//Logout, just deletes token, then should redirect tlogin page
			logout: function() {
				// The backend doesn't care about logouts, delete the token and you're good to go.
				console.log('logout delete');
				localStorageService.remove('authToken');
				localStorageService.remove('refreshToken');
				$location.path('/login');
				//LocalService.unset('authToken');
			},
			delegate: delegate,
			//This should move to signup controller
			register: function(formData) {
				console.log('register delete');
				localStorageService.remove('authToken');
				//LocalService.unset('authToken');
				var register = $http.post('/auth/register', formData);
				register.success(function(result) {
					//LocalService.set('authToken', JSON.stringify(result));
					localStorageService.set('authToken',result.token);
				});
				return register;
			}
		};
	});
	
	webapp.run(function($rootScope, $location, Auth, localStorageService) {
		$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
			if(nextRoute.access){
				//console.log('NEA:'+JSON.stringify(nextRoute.access));	
				//Lets store the tokens in Auth so we don't have to use localStorage here
				if (nextRoute.access.requiredLogin && !localStorageService.get('authToken') || !Auth.user().email) {
					if(nextRoute.access.requiredLogin){ console.log('req'); }
					if(!localStorageService.get('authToken')){ console.log('no local storage'); }
					if(!Auth.user().email){ console.log('no info'); }
					Auth.delegate().then(function(result){
						//Success
						if(!localStorageService.get('authToken')){
							event.preventDefault();
							console.warn('Delegate Failed');
							$location.path('/login');		
						} else {
							console.info('Delegation Successful');
						}
					}, function(reason){
						//Error
						console.error('delegation fail: '+reason);
						event.preventDefault();
						console.warn('Delegate Failed');
						$location.path('/login');		
					}, function(update){
						//Notifications
						console.info('sweet notification: '+update);
					});
					/* Can do these also
						.catch(function(errorCallback){ }) //shorthand for promise.then(null, errorCallback)
						.finally(function(callback,notifyCallback);
					*/
						
				} else if(nextRoute.templateUrl === 'views/login.html' && localStorageService.get('authToken')){
					console.warn('you dont want to go there, here have the default page');
					$location.path(Auth.defaultAuthPage());
				}
			} else { 
				event.preventDefault();
				console.warn('route did not have access level set: '+JSON.stringify(nextRoute));
				$location.path('/login');
			}
		});
	});
})();