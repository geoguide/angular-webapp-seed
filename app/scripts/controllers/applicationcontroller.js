'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ApplicationcontrollerCtrl
 * @description
 * # ApplicationcontrollerCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('ApplicationCtrl', function ($scope, $q, $location, $route, Auth, applicationFactory, facilityFactory, specialtyFactory, experienceFactory, $log) {
	var _this = this;
	$scope.$watch( Auth.isAuthenticated, function ( isLoggedIn ) {
		$scope.isLoggedIn = isLoggedIn;
		_this.userInfo = Auth.user();
		//$scope.currentUser = AuthService.currentUser();
	});

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

	this.facilities = [];
	this.specialties = [];
	this.medicalSchools = [];
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
		}
	];
	this.jobSources = [
		{
			id: 'M',
			source: 'Modio'
		},{
			id: 'O',
			source: 'Something elese'
		}
	];
	this.doctorTitles = [
		'MD',
		'DO',
		'DPM',
		'DDS',
		'DMD',
		'CRNA',
		'PA',
		'NP'
	];

	this.usStates = [
		{ name: 'ALABAMA', abbreviation: 'AL'},
		{ name: 'ALASKA', abbreviation: 'AK'},
		{ name: 'AMERICAN SAMOA', abbreviation: 'AS'},
		{ name: 'ARIZONA', abbreviation: 'AZ'},
		{ name: 'ARKANSAS', abbreviation: 'AR'},
		{ name: 'CALIFORNIA', abbreviation: 'CA'},
		{ name: 'COLORADO', abbreviation: 'CO'},
		{ name: 'CONNECTICUT', abbreviation: 'CT'},
		{ name: 'DELAWARE', abbreviation: 'DE'},
		{ name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
		{ name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
		{ name: 'FLORIDA', abbreviation: 'FL'},
		{ name: 'GEORGIA', abbreviation: 'GA'},
		{ name: 'GUAM', abbreviation: 'GU'},
		{ name: 'HAWAII', abbreviation: 'HI'},
		{ name: 'IDAHO', abbreviation: 'ID'},
		{ name: 'ILLINOIS', abbreviation: 'IL'},
		{ name: 'INDIANA', abbreviation: 'IN'},
		{ name: 'IOWA', abbreviation: 'IA'},
		{ name: 'KANSAS', abbreviation: 'KS'},
		{ name: 'KENTUCKY', abbreviation: 'KY'},
		{ name: 'LOUISIANA', abbreviation: 'LA'},
		{ name: 'MAINE', abbreviation: 'ME'},
		{ name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
		{ name: 'MARYLAND', abbreviation: 'MD'},
		{ name: 'MASSACHUSETTS', abbreviation: 'MA'},
		{ name: 'MICHIGAN', abbreviation: 'MI'},
		{ name: 'MINNESOTA', abbreviation: 'MN'},
		{ name: 'MISSISSIPPI', abbreviation: 'MS'},
		{ name: 'MISSOURI', abbreviation: 'MO'},
		{ name: 'MONTANA', abbreviation: 'MT'},
		{ name: 'NEBRASKA', abbreviation: 'NE'},
		{ name: 'NEVADA', abbreviation: 'NV'},
		{ name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
		{ name: 'NEW JERSEY', abbreviation: 'NJ'},
		{ name: 'NEW MEXICO', abbreviation: 'NM'},
		{ name: 'NEW YORK', abbreviation: 'NY'},
		{ name: 'NORTH CAROLINA', abbreviation: 'NC'},
		{ name: 'NORTH DAKOTA', abbreviation: 'ND'},
		{ name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
		{ name: 'OHIO', abbreviation: 'OH'},
		{ name: 'OKLAHOMA', abbreviation: 'OK'},
		{ name: 'OREGON', abbreviation: 'OR'},
		{ name: 'PALAU', abbreviation: 'PW'},
		{ name: 'PENNSYLVANIA', abbreviation: 'PA'},
		{ name: 'PUERTO RICO', abbreviation: 'PR'},
		{ name: 'RHODE ISLAND', abbreviation: 'RI'},
		{ name: 'SOUTH CAROLINA', abbreviation: 'SC'},
		{ name: 'SOUTH DAKOTA', abbreviation: 'SD'},
		{ name: 'TENNESSEE', abbreviation: 'TN'},
		{ name: 'TEXAS', abbreviation: 'TX'},
		{ name: 'UTAH', abbreviation: 'UT'},
		{ name: 'VERMONT', abbreviation: 'VT'},
		{ name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
		{ name: 'VIRGINIA', abbreviation: 'VA'},
		{ name: 'WASHINGTON', abbreviation: 'WA'},
		{ name: 'WEST VIRGINIA', abbreviation: 'WV'},
		{ name: 'WISCONSIN', abbreviation: 'WI'},
		{ name: 'WYOMING', abbreviation: 'WY' }
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
    }
  ];

	this.dispositionMap = [];
	for(var s=0;s<_this.disposition.length;s++){
		_this.dispositionMap[_this.disposition[s].id] = _this.disposition[s].name;
	}
	this.queryFacilities = function(query){
		var deferred = $q.defer();
	   facilityFactory.queryFacilities({q:query}).then(function(data){
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
	this.specialtiesMap = [];
	this.init = function(){
		$log.info('app init called');

		specialtyFactory.getSpecialties().then(function(data){
			_this.specialties = data;
			for(var s=0;s<_this.specialties.length;s++){
				_this.specialtiesMap[_this.specialties[s].id] = _this.specialties[s].specialty;
			}
		});

		experienceFactory.getMedicalSchools().then(function(data){
			_this.medicalSchools = data;
		},function(error){
			$log.error(error);
		});

		specialtyFactory.getABMSCertifications().then(function(data){
			_this.abmsCertifications = data;
		},function(error){
			$log.error(error);
		});
	};
	$scope.$on('login',function(){
		_this.init();
	});
	if(Auth.isAuthenticated()){
		this.init();
	}

	//Logout
	this.logout = Auth.logout;
});
