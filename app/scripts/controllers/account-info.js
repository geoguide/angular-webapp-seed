'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:AccountInfoCtrl
 * @description
 * # AccountInfoCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('AccountInfoCtrl', function ($routeParams, $http, API_URL, doctorFactory, toasty, $log,specialtyFactory, facilityFactory, $modal, jobApplicationFactory, jobFactory) {
  		
	var _this = this;
	this.doctorId = $routeParams.id;
	this.newPassword = null;
	this.doctorData = null;
	this.states = [];
	this.drSpecialties = [];
	this.rates = {};
	this.jobApplications = [];
	this.jobs = [];
	this.newJobApp = {};
	
	this.get = function(doctorId){
		
		var doctorData = doctorFactory.getDoctor(doctorId);
		
		doctorData.then(function(data){
			_this.doctorData = data;
			_this.doctorData.date_of_birth = _this.doctorData.date_of_birth || '2000-06-22';
			_this.drSpecialties = data.specialties;
			_this.rates = data.rates;
			_this.error = false;

		},function(error){
			_this.error = true;
			_this.doctorData = null;
		});
	};
	
	this.submitRates = function(){
		doctorFactory.saveRates(_this.doctorId,_this.rates).then(function(data){
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
	
	this.updatePassword = function(){
		if(_this.newPassword && _this.newPassword.length > 6){
			doctorFactory.updatePassword(_this.doctorId,_this.newPassword).then(function(data){
				toasty.pop.success({
					title: 'Success!',
					msg: 'Password Changed.',
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
		} else {
			toasty.pop.error({
				title: 'Error!',
				msg: 'Invalid password',
				showClose: true,
				clickToClose: true
			});
		}
		
	};
	
	this.updateState = function(abbr){
		var action;
		if(_this.states[abbr]){ //If it is checked
			action = doctorFactory.addState(_this.doctorId,abbr);
	   } else {
		 	action = doctorFactory.removeState(_this.doctorId,abbr);
		}
		action.then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'State Updated.',
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
	
	this.updateSpecialty = function(specId,oldSpec){
		doctorFactory.addSpecialty(_this.doctorId,specId).then(function(){
			if(oldSpec){
				return doctorFactory.removeSpecialty(_this.doctorId,oldSpec);	
			} else {
				return true;
			}
			
		}).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Specialty Updated.',
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
	
	this.acceptApplication = function(appId){
		jobApplicationFactory.acceptApplication(appId).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Application Updated.',
				showClose: true,
				clickToClose: true
			});
			loadApplications();
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.rejectApplication = function(appId){
		jobApplicationFactory.rejectApplication(appId).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Application Updated.',
				showClose: true,
				clickToClose: true
			});
			loadApplications();
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.submitApplication = function(){
		_this.newJobApp.doctor_id = _this.doctorId;
		jobApplicationFactory.createApplication(_this.newJobApp).success(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Application Updated.',
				showClose: true,
				clickToClose: true
			});
			loadApplications();
			_this.newJobApp = {};
			_this.edit_job_application_form.$setPristine();
		}).error(function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: 'Application Bad.',
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	var loadApplications = function(){
		doctorFactory.getJobApplications(_this.doctorId).then(function(data){
			_this.jobApplications = data;
		});
	};
	
	var loadJobs = function(){
		jobFactory.queryJobs('',0).then(function(jobsInfo){
			_this.jobs = jobsInfo.jobs;
		});
	};
	
	var init = function(){
		_this.get(_this.doctorId);

		specialtyFactory.getSpecialties().then(function(data){
			_this.specialties = data;
		});
		facilityFactory.getFacilities().then(function(data){
			_this.facilities = data;
		});
		doctorFactory.getStates(_this.doctorId).then(function(data){
			
			_this.states = data;
			for(var s=0;s<_this.states.length;s++){
				var abbr = _this.states[s];
				_this.states[abbr] = true;
			}
		});
		loadJobs();
		loadApplications();
	};
	init();
});
