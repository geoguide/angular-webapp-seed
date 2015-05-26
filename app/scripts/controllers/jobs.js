'use strict';
/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobsCtrl', function($modal, $modalStack, jobFactory, toasty, applicationFactory, specialtyFactory, facilityFactory, $log) {
	
	this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
	
	var _this = this;
	
	this.newJob = {};
	this.searchQuery = '';
	this.totalJobs = 0;
	this.currentPage = 1;
	this.jobsPerPage = 25;
	this.totalPages = this.totalJobs / this.jobsPerPage;
	this.maxSize = 8;
	this.facilities = [];
	this.specialties = [];
	
	/* Calendar */
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
	this.minDate = new Date();
	
	/* Methods */
	
	this.getResults = function(pageNumber) {
		pageNumber = pageNumber || 1;
		jobFactory.queryJobs(_this.searchQuery, pageNumber).then(function(data) {
			_this.jobs = data.jobs;
			_this.totalJobs = data.total;
			_this.totalPages = _this.totalJobs / _this.jobsPerPage;
		});
	};
	
	this.submitJob = function(){
		jobFactory.createJob(_this.newJob).then(function(data){
			applicationFactory.goTo('/jobs/'+data.id);
			$modalStack.dismissAll();
		},function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.getResults(1);
	
	
	var init = function(){
		//Dooooooo... we just load this with the application. Will digest update it?
		facilityFactory.getFacilities().then(function(data){
			_this.facilities = data;
		});
		specialtyFactory.getSpecialties().then(function(data){
			_this.specialties = data;
		});
	};
	
	//Modal
	this.openNewJobForm = function () {

		this.modalInstance = $modal.open({
			templateUrl: 'create-job-modal',
			controller: 'JobsCtrl',
			controllerAs: 'jobsCtrl',
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
			}
		});

		_this.modalInstance.result.then(function (data) {
			//something on close
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	this.closeModal = function(){
		$modalStack.dismissAll();
	};
	
	init();
});