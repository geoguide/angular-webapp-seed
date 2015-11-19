'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:EducationWorkCtrl
 * @description
 * # EducationWorkCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('EducationWorkCtrl', function ($scope, $routeParams, toasty, $log, doctorFactory, facilityFactory, applicationFactory, $q, experienceFactory, $modal, S3_URL) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.loading = true;
	this.tab = 'education-work';

	this.opened = { 'start': false, 'end': false };
	this.open = function($event,which) {
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened[which] = true;
	};

	this.training = [];
	this.medicalSchool = {};
	this.workHistory = [];
	this.medicalSchools = [];
	this.trackingData = [];
	this.memberships = [];
	this.matches = [];

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

	/* Modals */

	this.openWorkHistoryModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			scope: $scope,
			resolve: {
				opened: function(){
					return { 'start': false, 'end': false };
				},
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Work History';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			experienceFactory.submitWorkHistory(_this.doctorId,data).then(function(){
				toasty.success('Work History Saved.');
				loadExperience();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	this.openModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Training Info';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});
		
		this.usStates = applicationFactory.usStates;

		_this.modalInstance.result.then(function (data) {
			experienceFactory.submitTraining(_this.doctorId,data).then(function(){
				toasty.success('Training saved');
				loadExperience();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	this.openMembershipModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Facility Membership';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			_this.submitFacilityMembership(data).then(function(){
				toasty.success('Membership Saved');
				loadExperience();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	/* Medical School */

	this.submitMedicalSchool = function(){
		experienceFactory.submitMedicalSchool(_this.doctorId,_this.medicalSchool).then(function(data){
			loadExperience();
			toasty.success('School Saved.');
		}, function(error){
			toasty.error(error.data);
		});
	};


	/* Training */

	this.deleteTraining = function(expId){
		experienceFactory.deleteTraining(_this.doctorId,expId).then(function(data){
			toasty.success('Training Deleted.');
			loadExperience();
		}, function(error){
			toasty.error(error.data);
		});
	};


	/* Work History */

	this.deleteWorkHistory = function(expId){
		experienceFactory.deleteWorkHistory(_this.doctorId,expId).then(function(data){
			toasty.success('Work Deleted.');
			loadExperience();
		}, function(error){
			toasty.error(error.data);
		});
	};
	
	/* Facility Memberships */
	
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
	
	this.submitFacilityMembership = function(membershipData){
		doctorFactory.submitMembership(_this.doctorId,membershipData).then(function(data){
			toasty.success('Membership Submitted.');
			loadExperience();
		}, function(error){
			toasty.error(error.data);
		});
	};
	
	this.deleteFacilityMembership = function(expId){
		doctorFactory.removeMembership(_this.doctorId,expId).then(function(data){
			toasty.success('Training Deleted.');
			loadExperience();
		}, function(error){
			toasty.error(error.data);
		});
	};

	/* General */

	var loadExperience = function(){
		return experienceFactory.getTraining(_this.doctorId).then(function(data){
			_this.training = data;
			return experienceFactory.getMedicalSchool(_this.doctorId);
		}).then(function(data){
			_this.medicalSchool = data;
			return experienceFactory.getWorkHistory(_this.doctorId);
		}).then(function(data){
			_this.workHistory = data;
			return doctorFactory.getMemberships(_this.doctorId);
		}).then(function(result){
			for(var fm=0;fm<result.length;fm++){
				if(result[fm].file_url){
					var url = 'https://s3.amazonaws.com/' + S3_URL + '/3/' + result[fm].file_url.substr(0, 8) + '-' + result[fm].file_url.substr(8, 4) + '-' + result[fm].file_url.substr(12, 4) + '-' + result[fm].file_url.substr(16, 4) + '-' + result[fm].file_url.substr(20, 12) + '/' + result[fm].file_url.substr(32);
					result[fm].profileUrl = url;
				} else {
					result[fm].profileUrl = './images/default-avatar.png';
				}
				
			}
			_this.memberships = result;
		},function(error){
			$log.error(error);
		});
	};


	var loadMedicalSchools = function(){
		//moved to application controller
		return true;
	};

	/* Init */

	var init = function(){
		loadExperience().then(function(result){
			return loadMedicalSchools();
		}).then(function(){
			return doctorFactory.getTracking(_this.doctorId);
		}).then(function(result){
			_this.trackingData = result;
			return doctorFactory.getJobMatches(_this.doctorId);
		}).then(function(result){
			_this.matches = result;
			return doctorFactory.getJobOffers(_this.doctorId);
		}).then(function(result){
			_this.offers = result;
			_this.loading = false;
		}, function(error){
			$log.error(error);
		});
		
	};
	init();

});
