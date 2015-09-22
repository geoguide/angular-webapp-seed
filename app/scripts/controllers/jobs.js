'use strict';
/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobsCtrl', function($scope,$modal, $modalStack, jobFactory, toasty, applicationFactory, $log, $q, facilityFactory) {

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
	this.opened = { 'start': false, 'end':false };
	this.tags = [];
	this.loading = true;

	/* Calendar */
	this.open = function($event,which) {
		$log.log('open '+which+' called');
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened[which] = true;
	};

	this.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','MM/dd/yyyy'];
	this.format = this.formats[4];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};
	this.minDate = new Date();

	/* Methods */

	this.getResults = function() {
		_this.loading = true;
		var pageNumber = _this.currentPage || 1;
		var queryData = {
			search_query: _this.searchQuery,
			search_specialty: _this.searchSpecialty,
			search_state: _this.searchState,
			page_number: pageNumber,
			sort_by: _this.sortBy,
			sort_direction: _this.sortDirection,
			job_status: _this.jobStatus,
			source: _this.searchSource,
			doctor_title: _this.doctor_title,
			tag: _this.tag
		};
		jobFactory.queryJobs(queryData).then(function(data) {
			_this.jobs = data.jobs;
			_this.totalJobs = data.total;
			_this.totalPages = _this.totalJobs / _this.jobsPerPage;
			_this.loading = false;
		});
	};

	this.sortResult = function(sortOn){
		_this.sortDirection = !_this.sortDirection;
		_this.sortBy = sortOn;
		_this.getResults();
	};

	this.submitJob = function(){
		jobFactory.createJob(_this.newJob).then(function(data){
			applicationFactory.goTo('/jobs/'+data.id);
			$modalStack.dismissAll();
		},function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.archiveJob = function(jid){
		var jobData = {
			id: jid,
			archived: 1
		};
		jobFactory.saveJob(jobData).then(function(data){
			_this.getResults();
		},function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.getResults(1);


	var init = function(){
		jobFactory.getJobTags().then(function(result){
			_this.tags = result;
		});
		

	};

	//New job modal
	this.openNewJobForm = function () {

		this.modalInstance = $modal.open({
			templateUrl: 'create-job-modal',
			controller: 'JobsCtrl',
			controllerAs: 'jobsCtrl',
			scope: $scope,
			windowClass: 'lg-modal-window',
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				parentCtrl: _this
			}
		});

		_this.modalInstance.result.then(function (data) {
			//something on close
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	this.queryFacilities = function(query){
		var deferred = $q.defer();
	   facilityFactory.queryFacilities({q:query}).then(function(data){
			deferred.resolve(data.facilities);
		},function(error){
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};

	this.closeModal = function(){
		$modalStack.dismissAll();
	};

	init();
});
