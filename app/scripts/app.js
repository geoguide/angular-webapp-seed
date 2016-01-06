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
		'angular-toasty',
		'ui.bootstrap',
		'ngTagsInput',
		'ui-rangeSlider',
		'ngEgg',
		'angular.filter',
		'modioCore'
	]);


	webapp.value('loggedIn', false);
	//Not sure why modioCore is not working
	webapp.config(function(ENV,$provide,$animateProvider){
		$provide.constant('API_URL', ENV.apiEndpoint, ENV.s3Bucket);
		$provide.constant('DOC_URL', ENV.doctorApp);
		$provide.constant('S3_URL', ENV.s3Bucket);
		//$provide.constant('MODIO_CORE',modioCore);
		$animateProvider.classNameFilter(/animate/);
	});
	webapp.config(function ($routeProvider, ENV) {

		$routeProvider.when('/', {
			tab: 'dashboard',
			templateUrl: 'views/dashboard.html',
			access: { requiredLogin: true },
			controller: 'DashboardCtrl',
			controllerAs: 'dash'
      }).when('/about', {
			templateUrl: 'views/about.html',
			access: { requiredLogin: true },
			controller: 'AboutCtrl'
      }).when('/login', {
			templateUrl: 'views/login.html',
			access: { requiredLogin: false },
			controller: 'LoginCtrl',
			controllerAs: 'loginCtrl'
      }).when('/signup', {
			templateUrl: 'views/signup.html',
			access: { requiredLogin: false },
			controller: 'SignupCtrl'
      }).when('/providers', {
			tab: 'users',
			templateUrl: 'views/doctors.html',
			access: { requiredLogin: true },
			controller: 'DoctorsCtrl',
			controllerAs: 'drsCtrl'
		}).when('/jobs', {
			tab: 'jobs',
			templateUrl: 'views/jobs.html',
			access: { requiredLogin: true },
			controller: 'JobsCtrl',
			controllerAs: 'jobsCtrl'
		}).when('/jobs/:id',{
			tab: 'jobs',
			templateUrl: 'views/job.html',
			access: { requiredLogin: true },
			controller: 'JobCtrl',
			controllerAs: 'jobCtrl'
		}).when('/offers', {
			tab: 'offers',
			title: 'Offers',
			templateUrl: 'views/offers.html',
			access: { requiredLogin: true },
			controller: 'OffersCtrl',
			controllerAs: 'offersCtrl'
		}).when('/dashboard', {
			tab: 'dashboard',
			templateUrl: 'views/dashboard.html',
			access: { requiredLogin: true },
			controller: 'DashboardCtrl',
			controllerAs: 'dash'
		}).when('/providers/:id', {
			tab: 'users',
			templateUrl: 'views/doctor.html',
			access: { requiredLogin: true },
			controller: 'DoctorCtrl',
			controllerAs: 'dr'
		}).when('/providers/:id/account-info', {
			tab: 'users',
			templateUrl: 'views/account-info.html',
			access: { requiredLogin: true },
			controller: 'AccountInfoCtrl',
			controllerAs: 'dr'
		}).when('/providers/:id/facility-memberships', {
			tab: 'users',
			templateUrl: 'views/education-and-work.html',
			access: { requiredLogin: true },
			controller: 'EducationWorkCtrl',
			controllerAs: 'dr'
		}).when('/providers/:id/qualifications', {
			tab: 'users',
			templateUrl: 'views/qualifications.html',
			access: { requiredLogin: true },
			controller: 'QualificationsCtrl',
			controllerAs: 'dr'
		}).when('/offers/:id', {
			tab: 'offers',
			templateUrl: 'views/offer.html',
			access: {requiredLogin: true },
			controller: 'OfferCtrl',
			controllerAs: 'offerCtrl'
		}).when('/providers/:id/uploads', {
			tab: 'users',
			access: { requiredLogin: true },
			templateUrl: 'views/uploads.html',
			controller: 'UploadsCtrl',
			controllerAs: 'up'
		}).when('/providers/:id/tracking', {
			tab: 'users',
			access: { requiredLogin: true },
			templateUrl: 'views/tracking.html',
			controller: 'TrackingCtrl',
			controllerAs: 'dr'
		}).when('/change-password', {
			templateUrl: 'views/change-password.html',
			controller: 'ChangePasswordCtrl',
			controllerAs: 'cpCtrl',
			access: {requiredLogin: true}
		}).when('/my-bookmarks', {
			templateUrl: 'views/my-bookmarks.html',
			controller: 'ChangePasswordCtrl',
			controllerAs: 'userCtrl',
			access: {requiredLogin: true}
		}).when('/facilities', {
			templateUrl: 'views/facilities.html',
			controller: 'FacilitiesCtrl',
			controllerAs: 'fac',
			access: {requiredLogin: true },
			tab: 'facilities'
		}).when('/facility/:id', {
			templateUrl: 'views/facility.html',
			controller: 'FacilityCtrl',
			controllerAs: 'fac',
			access: {requiredLogin: true },
			tab: 'facilities'
		}).when('/lookup', {
			templateUrl: 'views/lookup.html',
			controller: 'LookupCtrl',
			controllerAs:'look',
			access: {requiredLogin: true },
			tab: 'lookup'
		}).when('/lookup-doctor/:claim_id', {
			templateUrl: 'views/lookup-doctor.html',
			controller: 'LookupDoctorCtrl',
			controllerAs: 'lookdoc',
			access: {requiredLogin: true },
			tab: 'lookup'
		}).when('/coordinators', {
			templateUrl: 'views/coordinators.html',
			controller: 'CoordinatorsCtrl',
			controllerAs: 'coord',
			access: {requiredLogin: true},
			tab: 'coordinators'
		}).when('/users', {
			templateUrl: 'views/users.html',
			access: {requiredLogin: true},
			tab: 'users'
		}).when('/coordinator/:id', {
			tab: 'users',
			templateUrl: 'views/coordinator.html',
			access: { requiredLogin: true },
			controller: 'CoordinatorCtrl',
			controllerAs: 'coord'
		}).when('/lead/:id', {
			templateUrl: 'views/lead.html',
			controller: 'LeadCtrl',
			controllerAs: 'lead',
			access: { requiredLogin: true },
			tab: 'dashboard'
		}).when('/jobs/:id/files', {
			tab: 'jobs',
			access: { requiredLogin: true },
			templateUrl: 'views/jobfiles.html',
			controller: 'JobFilesCtrl',
			controllerAs: 'files'
		}).when('/jobs/:id/candidates', {
			tab: 'jobs',
			access: { requiredLogin: true },
			templateUrl: 'views/candidates.html',
			controller: 'JobCandidatesCtrl',
			controllerAs: 'jcc'
		}).when('/providers/:id/job-matches', {
			tab: 'users',
			access: { requiredLogin: true },
			templateUrl: 'views/job-matches.html',
			controller: 'JobMatchesCtrl',
			controllerAs: 'dr'
		}).when('/invoices', {
			templateUrl: 'views/invoices.html',
			controller: 'InvoicesCtrl',
			controllerAs: 'invoice',
			access: { requiredLogin: true }
		}).when('/orders', {
			templateUrl: 'views/orders.html',
			controller: 'OrdersCtrl',
			controllerAs: 'orderCtrl',
			access: { requiredLogin: true }
		}).when('/providers/:id/provider-offers', {
		  templateUrl: 'views/provider-offers.html',
		  controller: 'ProviderOffersCtrl',
		  controllerAs: 'dr',
		  access: { requiredLogin:true }
		}).otherwise({
			templateUrl:'/404.html',access: { requiredLogin: false }
		}); // Render 404 view
	});

	webapp.config(function($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptor');
	});

	webapp.config(['toastyConfigProvider', function(toastyConfigProvider) {
		toastyConfigProvider.setConfig({
        //sound: false,
        //shake: true,
        clickToClose: false,
        timeout: 4000,
        theme:'material'
      });
    }
  ]);

	webapp.config(function Config($httpProvider, jwtInterceptorProvider) {
		jwtInterceptorProvider.tokenGetter = ['jwtHelper','$http','localStorageService','API_URL','$location',function(jwtHelper, $http, localStorageService, API_URL, $location) {
			var token = localStorageService.get('adminAuthToken');
			var refreshToken = localStorageService.get('refreshToken');

			if (token && jwtHelper.isTokenExpired(token) && refreshToken) {
				return $http({
					url: API_URL+'/admin/delegate',
					data: { refresh_token: refreshToken,token: token },
					method: 'POST',
					skipAuthorization: true
				}).then(function(response, status, headers, config){
					localStorageService.set('adminAuthToken', response.data.token);
					localStorageService.set('refreshToken', response.data.refresh_token);
					return response.data.token;
				},function(error){
					localStorageService.remove('adminAuthToken');
					localStorageService.remove('refreshToken');
					$location.path('/login');
					return false;
				});
			} else {
				return token;
			}
		}];
		$httpProvider.interceptors.push('jwtInterceptor');
	});


	webapp.run(function($rootScope,$route, $location, Auth, localStorageService,$log) {


		$rootScope.$on('$routeChangeSuccess', function(newVal, oldVal) {
			if (oldVal !== newVal) {
				document.title = $route.current.title || 'Modio Admin Portal';
			}
		});
	});
})();
