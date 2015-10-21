'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorCtrl
 * @description
 * # DoctorCtrl
 * Controller of the modioAdminPortal
 */

angular.module('modioAdminPortal').controller('DoctorCtrl', function (ENV, $routeParams, $window, doctorFactory, qualificationFactory, toasty, $log) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.doctorData = null;
	this.loading = true;
	this.error = false;
	this.trackingData = [];
	this.evn = ENV;
	//this.eggActivated = false;

	//Date of Birth Picker
	this.opened = false;
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened = true;
	};
	
	this.get = function(doctorId){
		_this.loading = true;

		doctorFactory.getDoctor(doctorId).then(function(response){
			_this.doctorData = response.data;
			_this.doctorData.date_of_birth = _this.doctorData.date_of_birth || null;
			_this.drSpecialties = response.data.specialties;
			_this.rates = response.data.rates;
			_this.bookmarked = response.data.bookmarked;
			_this.error = false;
			_this.loading = false;
			return doctorFactory.getTracking(doctorId);
		}).then(function(result){
			_this.trackingData = result;
			return doctorFactory.getJobMatches(_this.doctorId);
		}).then(function(result){
			_this.matches = result;
			return qualificationFactory.getMedicalLicenses(_this.doctorId);
		}).then(function(result){
			_this.licenses = result;
		},function(error,status){
			_this.loading = false;
			_this.error = true;
			_this.doctorData = null;
		});
	};

	this.save = function(){

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
	
	this.archive = function(){
		_this.doctorData.disposition = 6;
		_this.save();
	};

	this.delete = function(){
		doctorFactory.deleteDoctor(_this.doctorId).then(function(data){
			_this.doctorData = null;
			toasty.success({
				title: 'Admin Wins!',
				msg: 'Flawless Victory.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = null;
			_this.error = true;
			_this.eggActivated = false;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: 'Please Insert More Credits',
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
	_this.get(_this.doctorId);

});
