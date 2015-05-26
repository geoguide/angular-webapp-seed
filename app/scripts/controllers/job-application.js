'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobapplicationCtrl
 * @description
 * # JobapplicationCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('JobapplicationCtrl', function ($modal, $modalStack, jobApplicationFactory, toasty, applicationFactory, specialtyFactory, facilityFactory, $log, $routeParams) {
	var _this = this;
	this.appData = {};
	this.appId = $routeParams.id;
	
	//Date picker
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
	
	this.save = function(){
		console.log(JSON.stringify(_this.appData));
		_this.appData.start_date = (_this.appData.start_date === '2000-06-22') ? null : _this.appData.start_date;
		_this.appData.end_date = (_this.appData.end_date === '2000-06-22') ? null : _this.appData.end_date;
		jobApplicationFactory.saveApplication(_this.appData).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Job Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.appData = data;
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.message,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.delete = function(){
		jobApplicationFactory.deleteJob(_this.jobId).then(function(data){
			_this.appData = null;
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
		
		jobApplicationFactory.getApplication(_this.appId).then(function(data){
			_this.appData = data;
			console.log(data);
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.appData = null;
		});
	};
	
	init();

});
