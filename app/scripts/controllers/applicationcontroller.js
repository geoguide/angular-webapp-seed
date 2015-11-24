'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ApplicationcontrollerCtrl
 * @description
 * # ApplicationcontrollerCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('ApplicationCtrl', function ($scope, $q, $location, $route, Auth, applicationFactory, facilityFactory, specialtyFactory, jobFactory, $log,jwtHelper) {
	var _this = this;
	$scope.$watch( Auth.isAuthenticated, function ( isLoggedIn ) {
		$scope.isLoggedIn = isLoggedIn;
		_this.userInfo = Auth.user();
		applicationFactory.userInfo = Auth.user();
		//$scope.currentUser = AuthService.currentUser();
		if(isLoggedIn){
			applicationFactory.getDashboardStats().then(function(response){
				_this.stats = response;
			},function(error){
				$log.error('error in the watch: '+JSON.stringify(error));
			});
		}

	});

	this.appLoading = true;
	this.today = new Date();

	var dd = this.today.getDate();
	var mm = this.today.getMonth()+1; //January is 0!
	var yyyy = this.today.getFullYear();

	if(dd<10) {
	    dd='0'+dd;
	}

	if(mm<10) {
	    mm='0'+mm;
	}

	this.today = mm+'/'+dd+'/'+yyyy;

	$scope.$on('$routeChangeSuccess', function( event ) {
		_this.tab = $route.current.tab;
	});

	this.goTo = applicationFactory.goTo;
	this.abmsCertifications = [];



	this.insuranceTypes = [
		{
			id: 0,
			type: 'Malpractice'
		}, {
			id:1,
			type: 'Liability'
		}
	];

	this.trainingTypes = [
		{
			id:0,
			type:'Fellowship'
		},{
			id:1,
			type: 'Internship'
		},{
			id:2,
			type: 'Residency'
		}
	];

	this.memberStatuses = [
		{
			id: 0,
			status: 'Inactive'
		},{
			id: 1,
			status: 'Active'
		}
	];

	this.jobStatuses = [
		{
			id: 0,
			job_status: 'Inactive'
		},{
			id: 1,
			job_status: 'Active'
		},{
	      id: 2,
	      job_status: 'Pending Review'
		},{
			id: 3,
			job_status: 'Closed by Modio'
		},{
			id: 4,
			job_status: 'Closed by Client'
		},{
			id:5,
			job_status: 'In Progress'
		}
	];
	this.jobSources = [
		{
			id: 'a',
			source: 'Entered via Admin Portal'
		},{
			id: 'S',
			source: 'Ingested from scraped data'
		},{
			id: 'M',
			source: 'Modio'
		}, {
			id: 'c',
			source: 'Coordinator'
		}
	];
	this.doctorTitles = [
		{ group: 'Doctors', title:'MD'	},
		{ group: 'Doctors', title:'DO'	},
		{ group: 'Doctors', title:'DPM'	},
		{ group: 'Doctors', title:'DDS'	},
		{ group: 'Doctors', title:'DMD'	},
		{ group: 'Nurses', title:'CRNA'	},
		{ group: 'Nurses', title:'PA'		},
		{ group: 'Nurses', title:'RN'		},
		{ group: 'Nurses', title:'NP'		},
		{ group: 'Nurses', title: 'LPN'	}
	];

	this.usStates = applicationFactory.usStates;
	this.countries = applicationFactory.countries;

	this.accountManagers = [
		{ value:'', name: 'Unassigned' },
		{ value:'Tom Clifford', name: 'Tom Clifford' },
		{ value:'Gary Goldman', name: 'Gary Goldman' },
		{ value:'James Oleksa',name: 'James Oleksa' },
		{ value:'John Bou', name: 'John Bou' },
		{ value:'Kirk Heath', name: 'Kirk Heath' },
		{ value:'Tom Saulnier', name: 'Tom Saulnier' }
	];

	this.disposition = [
		{
			id: 0,
			name: 'New'
		},{
			id: 1,
			name: 'Welcome email sent'
		},{
			id: 3,
			name: 'Responded'
		},{
			id: 4,
			name: 'Did not respond'
		}, {
			id: 5,
			name: 'Active'
		}, {
			id: 6,
			name: 'Archived'
		}
	];

  this.source = [
    {
      id: 0,
      name: 'Provisioned'
    },{
      id: 1,
      name: 'Webapp'
    },{
      id: 2,
      name: 'Marketing'
    },{
      id: 3,
      name: 'Referral'
    },{
      id: 4,
      name: 'AdWords'
    },{
      id: 5,
      name: 'GDN'
    },{
      id: 6,
      name: 'Bing'
    },{
      id: 7,
      name: 'LinkedIn'
    },{
      id: 8,
      name: 'Facebook'
    },{
      id: 9,
      name: 'Email'
    }, {
	    id:10,
	    name: 'Coordinator'
    }
  ];

	this.dispositionMap = [];
	for(var d=0;d<_this.disposition.length;d++){
		_this.dispositionMap[_this.disposition[d].id] = _this.disposition[d].name;
	}

	this.sourceMap = [];
	for(var s=0;s<_this.source.length;s++){
		_this.sourceMap[_this.source[s].id] = _this.source[s].name;
	}

	this.queryFacilities = function(queryIn){
		var deferred = $q.defer();
		var queryData = {
			exclude_location: true,
			q: queryIn
		};
	   facilityFactory.queryFacilities(queryData).then(function(data){
			deferred.resolve(data.facilities);
		},function(error){
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};

	this.queryMedicalSchools = function(query){
		var deferred = $q.defer();
	   facilityFactory.queryMedicalSchools({q:query}).then(function(data){
			deferred.resolve(data);
		},function(error){
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};

	this.querySpecialties = function(query){
		var deferred = $q.defer();
	   specialtyFactory.query({q:query}).then(function(data){
			deferred.resolve(data);
		},function(error){
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};

	this.queryABMS = function(query){
		var deferred = $q.defer();
	   specialtyFactory.queryABMS({q:query}).then(function(data){
			deferred.resolve(data);
		},function(error){
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};

	this.rateTypes = [
		{
			field: 'standard_daily',
			name: 'Standard Daily'
		},{
			field: 'standard_hourly',
			name: 'Standard Hourly'
		},{
			field: 'weekend_daily',
			name: 'Weekend Daily'
		},{
			field: 'weekday_daily',
			name: 'Weekday Daily'
		},{
			field: 'weekday_call',
			name: 'Weekday Call'
		},{
			field: 'weekend_call',
			name: 'Weekend Call'
		},{
			field: 'outside_defined_shifts',
			name: 'Outside Defined Shifts'
		},{
			field: 'holiday_premium',
			name: 'Holiday Premium'
		},{
			field: 'callback',
			name: 'CallBack'
		},{
			field: 'salary',
			name: 'Salary'
		}
	];

	this.dateFormats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','MM/dd/yyyy'];
	this.dateFormat = this.dateFormats[4];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};

	_this.queryTags = function(query){
		return jobFactory.getJobTags(query);
	};

	$scope.$on('login',function(){
		_this.init();
	});

	//Logout
	this.logout = Auth.logout;
});
