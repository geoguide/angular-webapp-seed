'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorCtrl
 * @description
 * # DoctorCtrl
 * Controller of the modioAdminPortal
 */

angular.module('modioAdminPortal')
  .controller('DoctorCtrl', function (ENV,$routeParams, $window, doctorFactory, toasty, $log, $modal, jobApplicationFactory, s3factory, Upload, localStorageService) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.doctorData = null;

	//Date of Birth Picker
	this.opened = false;
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened = true;
	};

	this.get = function(doctorId){

		var doctorData = doctorFactory.getDoctor(doctorId);

		doctorData.then(function(data){
			_this.doctorData = data;
			_this.doctorData.date_of_birth = _this.doctorData.date_of_birth || null;
			_this.drSpecialties = data.specialties;
			_this.rates = data.rates;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.doctorData = null;
		});
	};

	this.save = function(){
		console.log(_this.doctorData.date_of_birth);
		_this.doctorData.date_of_birth = (_this.doctorData.date_of_birth === '2000-06-22') ? null : _this.doctorData.date_of_birth;
		delete _this.doctorData.rates;
		doctorFactory.saveDoctor(_this.doctorData).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Doctor Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.error({
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
			toasty.success({
				title: 'Success!',
				msg: 'Doctor Deleted.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	this.actAs = function(){
		doctorFactory.actAs(_this.doctorId).then(function(response){
			$window.open(ENV.doctorApp+'/#/admin/act-as/'+response.data.token, '_blank');
			toasty.success({
				title: 'Success!',
				msg: 'Doctor Acted As.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.error({
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

	};

	init();

});
