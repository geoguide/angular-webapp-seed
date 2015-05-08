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
		'mgcrea.ngStrap',
		'toasty'
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