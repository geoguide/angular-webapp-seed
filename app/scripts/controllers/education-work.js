'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:EducationWorkCtrl
 * @description
 * # EducationWorkCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('EducationWorkCtrl', function ($routeParams, toasty, $log, experienceFactory, $modal) {
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
    
	this.training = {};
	this.medicalSchool = {};
	this.workHistory = [];
	this.medicalSchools = [];
	
	/* Modals */
	
	this.openWorkHistoryModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
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

		_this.modalInstance.result.then(function (data) {
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
	
	/* Medical School */
	
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
	
	
	/* Training */
	
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
	
	
	/* Work History */
	
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
	
	/* General */
	
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
	
	
	var loadMedicalSchools = function(){
		experienceFactory.getMedicalSchools().then(function(data){
			_this.medicalSchools = data;
		},function(error){
			$log.error(error);
		});
	};
	
	/* Init */
	
	var init = function(){
		loadExperience();
		loadMedicalSchools();
	};
	init();
	
});