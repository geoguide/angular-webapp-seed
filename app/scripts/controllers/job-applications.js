'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobApplicationsCtrl
 * @description
 * # JobApplicationsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobApplicationsCtrl', function ($modal, $modalStack, toasty, jobApplicationFactory, $log) {
	
	this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
	
	var _this = this;
	
	this.job_applications = [];
	this.searchQuery = '';
	this.totalJobs = 0;
	this.currentPage = 1;
	this.perPage = 25;
	this.totalPages = this.totalJobs / this.jobsPerPage;
	this.maxSize = 8;
	
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
		var queryData = {
			search_query: _this.searchQuery,
			page_number: _this.pageNumber,
			sort_by: _this.sortBy,
			sort_direction: _this.sortDirection
		};
		jobApplicationFactory.queryApplications(queryData).then(function(data) {
			_this.job_applications = data.applications;
			_this.totalApplications = data.total;
			_this.totalPages = _this.totalApplications / _this.perPage;
		});
	};
	
	this.sortResult = function(sortOn){
		_this.sortDirection = !_this.sortDirection;
		_this.sortBy = sortOn;
		_this.getResults();
	};
	
	var init = function(){
		_this.getResults(1);
	};
	init();
});