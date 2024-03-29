'use strict';

/**
 * @ngdoc overview
 * @name angularWebappSeedApp
 * @description
 * # angularWebappSeedApp
 *
 * Main module of the application.
 */
 
 // To Do
//TODO: Convert form to formly http://angular-formly.com/#/example/other/advanced-layout
//- Update (11 may 2015) use formly on the jobs
//TODO: change to directives rather than controllers: http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html
//TODO Smarter and more organized handling of errors and authorization issues
//TODO: Standardize API calls and use angular $resource: http://learn.ionicframework.com/formulas/backend-data/ ??
//TODO: Remove jquery and angularstrap


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
		'toasty',
		'ui.bootstrap'
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
	        controller: 'LoginCtrl',
	        controllerAs: 'loginCtrl'
	      })
	      .when('/signup', {
	        templateUrl: 'views/signup.html',
	        access: { requiredLogin: false },
	        controller: 'SignupCtrl'
	      })
			.when('/doctors', {
			  templateUrl: 'views/doctors.html',
			  access: { requiredLogin: true },
			  controller: 'DoctorsCtrl',
			  controllerAs: 'drsCtrl'
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
	
	
	webapp.run(function($rootScope, $location, Auth, localStorageService,$log) {
		
		$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
			//Route should have access level set
			if(nextRoute.access){
				
				//Lets store the tokens in Auth so we don't have to use localStorage here
				//If route requires login and we don't have an email or authToken do interrogation
				if (nextRoute.access.requiredLogin && (!localStorageService.get('authToken') || !Auth.user().email)) {
					
					if(localStorageService.get('refreshToken')){
						
						Auth.delegate().then(function(result){
							//Success
							if(!localStorageService.get('authToken')){
								event.preventDefault();
								$log.warn('Delegate Failed to Populate authToken');
								$location.path('/login');		
							} else {
								$log.info('Delegation Successful');
							}
						}, function(reason){
							//Error
							$log.error('delegation fail: '+reason);
							event.preventDefault();
							$location.path('/login');		
						}, function(update){
							//Notifications of in progress promises
							$log.info('sweet notification: '+update);
						});
					} else {
						$log.warn('no refresh token');
						$location.path('/login');
					}
						
				} else if(nextRoute.templateUrl === 'views/login.html' && localStorageService.get('authToken')){
					//You've got an authToken but are trying to go to the login page, send to real page
					$location.path(Auth.defaultAuthPage());
				}
				
			} else { 
				//Complain that something is wrong to draw attention to the code, all pages should have this variable set
				event.preventDefault();
				$log.warn('route did not have access level set: '+JSON.stringify(nextRoute));
				$location.path('/login');
			}
		});
	});
})();