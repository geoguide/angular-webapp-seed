'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:QualificationsCtrl
 * @description
 * # QualificationsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('QualificationsCtrl', function ($scope, $routeParams, toasty, $log, qualificationFactory, specialtyFactory, $modal,$q) {
	this.awesomeThings = [
	'HTML5 Boilerplate',
	'AngularJS',
	'Karma'
	];
	var _this = this;
	this.doctorId = $routeParams.id;
	
	this.opened = { 'start': false, 'end': false };
	this.open = function($event,which) {
		$event.preventDefault();
		$event.stopPropagation();
		
		_this.opened[which] = true;
	};
	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	this.format = this.formats[0];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};
	
	this.specialties = [];
	this.clinicalEvaluations = [];
	this.facilityAffiliations = [];
	this.medicalLicenses = [];
	
	
	var loadQualifications = function(){
		qualificationFactory.getClinicalEvaluations(_this.doctorId).then(function(data){
			_this.clinicalEvaluations = data;
			return qualificationFactory.getFacilityAffiliations(_this.doctorId);
		}).then(function(data){
			_this.facilityAffiliations = data;
			return qualificationFactory.getMedicalLicenses(_this.doctorId);
		}).then(function(data){
			_this.medicalLicenses = data;	
		},function(error){
			$log.error(error);
		});
	};
	
	/* Modals */
	
	this.openClinicalEvaluationModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
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
	
	this.openMedicalLicenseModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
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
			qualificationFactory.submitMedicalLicense(_this.doctorId,data).then(function(){
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
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
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
	
	this.queryFacilities = function(query){
		var deferred = $q.defer();
	   qualificationFactory.queryFacilities(query).then(function(data){
			deferred.resolve(data);
		},function(error){
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};
  
	var init = function(){
		loadQualifications();
		specialtyFactory.getSpecialties().then(function(data){
			_this.specialties = data;
		});
	};
  
  init();

});
