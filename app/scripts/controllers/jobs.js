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
	this.partnerIds = [];
	this.loading = true;
	this.matchList = [];

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
	this.queryData = jobFactory.queryData;
	this.queryData.job_status = 1;
	this.getResults = function() {
		_this.loading = true;
		
		jobFactory.queryJobs(_this.queryData).then(function(data) {
			_this.jobs = data.jobs;
			_this.totalJobs = data.total;
			_this.totalPages = _this.totalJobs / _this.jobsPerPage;
			_this.loading = false;
		});
	};

	this.sortResult = function(sortOn){
		_this.queryData.sortDirection = !(_this.queryData.sortDirection);
		_this.queryData.sort_by = sortOn;
		_this.getResults();
	};

	this.submitJob = function(){
		jobFactory.createJob(_this.newJob).then(function(data){
			applicationFactory.goTo('/jobs/'+data.id);
			$modalStack.dismissAll();
		},function(error){
			$log.error(error);
			toasty.error(error.data);
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
			$log.error(error);
			toasty.error(error.data);
		});
	};



	var init = function(){
		_this.loading = true;
		jobFactory.getJobTags().then(function(result){
			_this.tags = result;
			return jobFactory.getPartnerIds();
		}).then(function(result){
			_this.partnerIds = result;
			return jobFactory.getJobMatchTotals();
		}).then(function(result){
			_this.matchList = result;
			_this.getResults();
		},function(error){
			$log.error(error);
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
