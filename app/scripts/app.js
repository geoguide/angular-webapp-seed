'use strict';

/**
 * @ngdoc overview
 * @name modioAdminPortal
 * @description
 * # modioAdminPortal
 *
 * Main module of the application.
 */
 
 // To Do
//TODO: change to directives rather than controllers: http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html
//TODO Smarter and more organized handling of errors and authorization issues
//TODO: Standardize API calls and use angular $resource: http://learn.ionicframework.com/formulas/backend-data/ ??
//TODO: Remove jquery and angularstrap
//TODO: Delegation fails


(function(){
	var webapp = angular.module('modioAdminPortal', [
		'config',
		'ngAnimate',
		'ngAria',
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
		'ui.bootstrap',
		'ngFileUpload'
	]);
	
	
	webapp.value('loggedIn', false);
	webapp.config(function(ENV,$provide){
		$provide.constant('API_URL', ENV.apiEndpoint);
	});
	webapp.config(function ($routeProvider, ENV) {
		
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
				tab: 'doctors',
			  templateUrl: 'views/doctors.html',
			  access: { requiredLogin: true },
			  controller: 'DoctorsCtrl',
			  controllerAs: 'drsCtrl'
			})
			.when('/jobs', {
				tab: 'jobs',
			  templateUrl: 'views/jobs.html',
			  access: { requiredLogin: true },
			  controller: 'JobsCtrl',
			  controllerAs: 'jobsCtrl'
			})
			.when('/jobs/:id',{
				tab: 'jobs',
				templateUrl: 'views/job.html',
				access: { requiredLogin: true },
				controller: 'JobCtrl',
				controllerAs: 'jobCtrl'
			}).when('/job-applications', {
				tab: 'offers',
				title: 'Job Applications',
				templateUrl: 'views/job-applications.html',
				access: { requiredLogin: true },
				controller: 'JobApplicationsCtrl',
				controllerAs: 'jobAppsCtrl'
			}).when('/dashboard', {
				tab: 'dashboard',
				templateUrl: 'views/dashboard.html',
				access: { requiredLogin: true },
				controller: 'DashboardCtrl'
			}).when('/doctor/:id', {
				tab: 'doctors',
				templateUrl: 'views/doctor.html',
				access: { requiredLogin: true },
				controller: 'DoctorCtrl',
				controllerAs: 'dr'
			}).when('/doctor/:id/account-info', {
				tab: 'doctors',
				templateUrl: 'views/account-info.html',
				access: { requiredLogin: true },
				controller: 'AccountInfoCtrl',
				controllerAs: 'ai'
			}).when('/doctor/:id/education-and-work', {
				tab: 'doctors',
				templateUrl: 'views/education-and-work.html',
				access: { requiredLogin: true },
				controller: 'EducationWorkCtrl',
				controllerAs: 'dr'
			}).when('/doctor/:id/qualifications', {
				tab: 'doctors',
				templateUrl: 'views/qualifications.html',
				access: { requiredLogin: true },
				controller: 'QualificationsCtrl',
				controllerAs: 'dr'
			}).when('/job-applications/:id', {
				tab: 'offers',
				templateUrl: 'views/job-application.html',
				access: {requiredLogin: true },
				controller: 'JobapplicationCtrl',
				controllerAs: 'jobAppCtrl'
			}).when('/doctor/:id/uploads', {
				tab: 'doctors',
				access: { requiredLogin: true },
				templateUrl: 'views/uploads.html',
				controller: 'UploadsCtrl',
				controllerAs: 'up'
			}).when('/change-password', {
				templateUrl: 'views/change-password.html',
				controller: 'ChangePasswordCtrl',
				controllerAs: 'cpCtrl',
				access: {requiredLogin: true}
			}).when('/partners', {
				templateUrl: 'views/partners.html',
				controller: 'PartnersCtrl',
				controllerAs: 'part',
				access: {requiredLogin: true },
				tab: 'partners'
			}).otherwise({
				templateUrl:'/404.html',access: { requiredLogin: false } 
			}); // Render 404 view
	});
	  
	webapp.config(function($httpProvider) {  
		$httpProvider.interceptors.push('AuthInterceptor');
	});
	
	
	webapp.run(function($rootScope,$route, $location, Auth, localStorageService,$log) {
		
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
								webapp.value('loggedIn', false);
								$location.path('/login');		
							} else {
								$log.info('Delegation Successful');
							}
						}, function(reason){
							//Error
							webapp.value('loggedIn', false);
							$log.error('delegation fail: '+reason);
							event.preventDefault();
							$location.path('/login');		
						}, function(update){
							//Notifications of in progress promises
							$log.info('sweet notification: '+update);
						});
					} else {
						webapp.value('loggedIn', false);
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
				webapp.value('loggedIn', false);
				$location.path('/login');
			}
		});
		$rootScope.$on('$routeChangeSuccess', function(newVal, oldVal) {
			if (oldVal !== newVal) {
				document.title = $route.current.title || 'Modio Admin Portal';
			}
		});
	});
})();