'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorCtrl
 * @description
 * # DoctorCtrl
 * Controller of the modioAdminPortal
 */

angular.module('modioAdminPortal')
  .controller('DoctorCtrl', function ($routeParams, $http, API_URL, doctorFactory, toasty, $log, experienceFactory, $modal) {
	
	var _this = this;
	this.doctorId = $routeParams.id;
	this.doctorData = null;
	this.activeTab = 0;
	this.opened = false;
	
	this.openModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'DoctorCtrl',
			controllerAs: 'dr',
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				info: function(){
					$log.log('sending modal '+angular.toJson(dataIn));
					return dataIn;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			//something on open????
			console.log('data '+angular.toJson(data));
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	//Date of Birth Picker
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();
		
		_this.opened = true;
	};
	
	this.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	
	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	this.format = this.formats[0];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};
	
	this.experience = {};
	
	this.get = function(doctorId){
		
		var doctorData = doctorFactory.getDoctor(doctorId);
		
		doctorData.then(function(data){
			_this.doctorData = data;
			_this.doctorData.date_of_birth = _this.doctorData.date_of_birth || '2000-06-22';
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.doctorData = null;
		});
	};
	
	// this... doesn't belong here? Can't do this on this page.
	this.create = function(newDoc){
		
		var doctorData = doctorFactory.createDoctor(newDoc);
		
		doctorData.then(function(data){
			_this.doctorData = data;
		},function(error){
			_this.doctorData = null;
		});
	};
	
	this.save = function(){
		$log.log(JSON.stringify(_this.doctorData));
		_this.doctorData.date_of_birth = (_this.doctorData.date_of_birth === '2000-06-22') ? null : _this.doctorData.date_of_birth;
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
	
	this.submitExperience = function(expType, data){
		$log.log('submitting: '+expType+' '+angular.toJson(data,false,2));
		experienceFactory.submitExperience(_this.doctorId, expType,data).then(function(data){
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
	
	var init = function(){
		_this.get(_this.doctorId);
		experienceFactory.getExperience(_this.doctorId).then(function(data){
			_this.experience = data;
		},function(error){
			$log.error(error);
		});
	};
	
	init();
	
});
