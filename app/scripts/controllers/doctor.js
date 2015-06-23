'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorCtrl
 * @description
 * # DoctorCtrl
 * Controller of the modioAdminPortal
 */

angular.module('modioAdminPortal')
  .controller('DoctorCtrl', function ($routeParams, $http, API_URL, doctorFactory, toasty, $log, experienceFactory, qualificationFactory,specialtyFactory, facilityFactory, $modal, jobApplicationFactory, s3factory, Upload) {
	
	var _this = this;
	this.doctorId = $routeParams.id;
	this.doctorData = null;
	this.training = {};
	this.medicalSchool = {};
	this.clinicalEvaluations = [];
	this.facilityAffiliations = [];
	this.specialties = [];
	this.facilities = [];
	this.workHistory = [];
	
	this.openModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				modalObject: function(){
					$log.log('sending modal '+angular.toJson(dataIn));
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

		_this.modalInstance.result.then(function (data) {
			$log.log('submitting data for '+_this.doctorId);
			experienceFactory.submitTraining(_this.doctorId,data).then(function(){
				loadExperience();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	this.openClinicalEvaluationModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					$log.log('sending modal '+angular.toJson(dataIn));
					return dataIn;
				},
				title: function(){
					return 'Clinical Evaluation';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			$log.log('submitting data for '+_this.doctorId);
			qualificationFactory.submitClinicalEvaluation(_this.doctorId,data).then(function(){
				loadQualifications();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	this.openFacilityAffiliationModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					$log.log('sending modal '+angular.toJson(dataIn));
					return dataIn;
				},
				title: function(){
					return 'Facility Affiliation';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			$log.log('submitting data for '+_this.doctorId);
			qualificationFactory.submitFacilityAffiliation(_this.doctorId,data).then(function(){
				loadQualifications();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	this.openWorkHistoryModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					$log.log('sending modal '+angular.toJson(dataIn));
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
			$log.log('submitting data for '+_this.doctorId);
			experienceFactory.submitWorkHistory(_this.doctorId,data).then(function(){
				loadExperience();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	//Date of Birth Picker
	this.opened = false;
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();
		
		_this.opened = true;
	};
	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	this.format = this.formats[0];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};
	
	this.get = function(doctorId){
		
		var doctorData = doctorFactory.getDoctor(doctorId);
		
		doctorData.then(function(data){
			_this.doctorData = data;
			_this.doctorData.date_of_birth = _this.doctorData.date_of_birth || '2000-06-22';
			_this.drSpecialties = data.specialties;
			_this.rates = data.rates;
			$log.log(JSON.stringify(_this.rates)+' are the rates');
			_this.error = false;
			$log.log(JSON.stringify(_this.doctorData));
		},function(error){
			_this.error = true;
			_this.doctorData = null;
		});
	};
	
	this.save = function(){
		$log.log(JSON.stringify(_this.doctorData));
		_this.doctorData.date_of_birth = (_this.doctorData.date_of_birth === '2000-06-22') ? null : _this.doctorData.date_of_birth;
		delete _this.doctorData.rates;
		doctorFactory.saveDoctor(_this.doctorData).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Doctor Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.delete = function(){
		doctorFactory.deleteDoctor(_this.doctorId).then(function(data){
			_this.doctorData = null;
			toasty.pop.success({
				title: 'Success!',
				msg: 'Doctor Deleted.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	
	
	this.submitMedicalSchool = function(){
		experienceFactory.submitMedicalSchool(_this.doctorId,_this.medicalSchool).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'School Saved.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.submitTraining = function(data){
		experienceFactory.submitTraining(_this.doctorId,data).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Training Saved.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.deleteTraining = function(expId){
		experienceFactory.deleteTraining(_this.doctorId,expId).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Training Deleted.',
				showClose: true,
				clickToClose: true
			});
			loadExperience();
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.deleteFacilityAffiliation = function(expId){
		qualificationFactory.deleteFacilityAffiliation(_this.doctorId,expId).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Facility Deleted.',
				showClose: true,
				clickToClose: true
			});
			loadQualifications();
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.deleteClinicalEvaluation = function(expId){
		qualificationFactory.deleteClinicalEvaluation(_this.doctorId,expId).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Evaluation Deleted.',
				showClose: true,
				clickToClose: true
			});
			loadQualifications();
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.deleteWorkHistory = function(expId){
		experienceFactory.deleteWorkHistory(_this.doctorId,expId).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Work Deleted.',
				showClose: true,
				clickToClose: true
			});
			loadExperience();
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	var loadExperience = function(){
		experienceFactory.getTraining(_this.doctorId).then(function(data){
			_this.training = data;
			return experienceFactory.getMedicalSchool(_this.doctorId);
		}).then(function(data){
			_this.medicalSchool = data;
			return experienceFactory.getWorkHistory(_this.doctorId);
		}).then(function(data){
			_this.workHistory = data;	
		},function(error){
			$log.error(error);
		});
	};
	
	var loadQualifications = function(){
		qualificationFactory.getClinicalEvaluations(_this.doctorId).then(function(data){
			_this.clinicalEvaluations = data;
			return qualificationFactory.getFacilityAffiliations(_this.doctorId);
		}).then(function(data){
			_this.facilityAffiliations = data;
		},function(error){
			$log.error(error);
		});
	};
	
	
	
	
	
	

	var init = function(){
		_this.get(_this.doctorId);
		loadExperience();
		loadQualifications();
		
		specialtyFactory.getSpecialties().then(function(data){
			_this.specialties = data;
		});
		
		facilityFactory.getFacilities().then(function(data){
			_this.facilities = data;
		});
		
		s3factory.putObject().then(function(result){
			$log.info(result);
		});
	};
	
	init();
	
});
