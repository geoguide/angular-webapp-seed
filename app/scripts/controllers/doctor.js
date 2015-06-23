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
	
	this.specialties = [];
	this.facilities = [];
	
	
	
	
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

	
	/* Init */

	var init = function(){
		_this.get(_this.doctorId);
		
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
