'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityCtrl
 * @description
 * # FacilityCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('FacilityCtrl', function ($routeParams, facilityFactory, toasty, $log, $modal, jobApplicationFactory, s3factory, Upload) {
	
	var _this = this;
	this.facilityId = $routeParams.id;
	this.facilityData = null;
	
	//Date of ASDASD
	this.opened = false;
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();
		
		_this.opened = true;
	};
	
	this.get = function(facilityId){
		
		var facilityData = facilityFactory.getFacility(facilityId);
		
		facilityData.then(function(data){
			_this.facilityData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.facilityData = null;
		});
	};
	
	this.save = function(){
		facilityFactory.saveFacility(_this.facilityData).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Facility Saved.',
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
	/*
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
	};*/

	
	/* Init */

	var init = function(){
		_this.get(_this.facilityId);
		
	};
	
	init();
});
