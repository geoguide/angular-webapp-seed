'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorCtrl
 * @description
 * # DoctorCtrl
 * Controller of the modioAdminPortal
 */

angular.module('modioAdminPortal')
  .controller('DoctorCtrl', function (ENV,$routeParams, $window, doctorFactory, toasty, $log, $modal, offerFactory, s3factory, Upload, localStorageService) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.doctorData = null;
	this.loading = true;
	this.error = false;

	//Date of Birth Picker
	this.opened = false;
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened = true;
	};
	this.trackingData = [];
	
	this.get = function(doctorId){
		_this.loading = true;

		var doctorDataGet = doctorFactory.getDoctor(doctorId);
		doctorFactory.getTracking(doctorId).then(function(result){
			_this.trackingData = result;
		});
		
		doctorDataGet.success(function(data){
			_this.doctorData = data;
			_this.doctorData.date_of_birth = _this.doctorData.date_of_birth || null;
			_this.drSpecialties = data.specialties;
			_this.rates = data.rates;
			_this.bookmarked = data.bookmarked;
			_this.error = false;
			_this.loading = false;
		}).error(function(error,status){
			_this.loading = false;
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
			_this.doctorData = null;
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
			$window.open(ENV.doctorApp+'/admin/act-as/'+response.data.token, '_blank');
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
	
	this.bookmark = function(idIn){
		_this.bookmarked = !!!_this.bookmarked;
		if(_this.bookmarked){
			doctorFactory.bookmark(idIn).then(function(){
				
			}, function(error){
				$log.error(error);
			});	
		} else {
			doctorFactory.removeBookmark(idIn).then(function(){
				
			}, function(error){
				$log.error(error);
			});	
		}
		
	};


	/* Init */

	var init = function(){
		_this.get(_this.doctorId);
		doctorFactory.getJobMatches(_this.doctorId).then(function(result){
			_this.matches = result;
		});
	};

	init();

});
