'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobCtrl
 * @description
 * # JobCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobCtrl', function ($modal, $modalStack, jobFactory, toasty, $log, $routeParams) {
	var _this = this;
	this.jobData = {};
	this.jobId = $routeParams.id;
	
	//Date picker
	_this.opened = { 'start': false, 'end': false };
	this.open = function($event, which) {
		$event.preventDefault();
		$event.stopPropagation();
		
		_this.opened[which] = true;
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
	
	this.save = function(){
		_this.jobData.start_date = (_this.jobData.start_date === '2000-06-22') ? null : _this.jobData.start_date;
		_this.jobData.end_date = (_this.jobData.end_date === '2000-06-22') ? null : _this.jobData.end_date;
		jobFactory.saveJob(_this.jobData).success(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Job Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.jobData = data;
		}).error(function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.message,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.delete = function(){
		jobFactory.deleteJob(_this.jobId).then(function(data){
			_this.jobData = null;
			_this.error = true;
			toasty.pop.success({
				title: 'Success!',
				msg: 'Job Deleted.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.message,
				showClose: true,
				clickToClose: true
			});
		});
	};

	var init = function(){
		//Dooooooo... we just load this with the application. Will digest update it?
		//Use Query here instead of get all like in doctor
		
		jobFactory.getJob(_this.jobId).then(function(data){
			_this.jobData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.jobData = null;
		});
	};
	
	init();

});
