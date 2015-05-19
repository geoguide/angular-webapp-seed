'use strict';
/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobsCtrl', function($modal, $modalStack, jobFactory, toasty, applicationFactory, specialtyFactory, facilityFactory, $log, $routeParams) {
	
	this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
	
	var _this = this;
	
	this.jobData = {};
	this.newJob = {};
	this.searchQuery = '';
	this.totalJobs = 0;
	this.currentPage = 1;
	this.jobsPerPage = 25;
	this.totalPages = this.totalJobs / this.jobsPerPage;
	this.maxSize = 8;
	this.jobId = $routeParams.id;
	this.facilities = [];
	this.specialties = [];
	
	
	this.getResults = function(query, page) {
		jobFactory.queryJobs(query, page).then(function(data) {
			_this.jobs = data.jobs;
			_this.totalJobs = data.total;
			_this.totalPages = _this.totalJobs / _this.jobsPerPage;
		});
	};
	
	
	//Move to jobCtrl? Will there be job ctrl?
	this.getJob = function(jobId){
		
		var jobData = jobFactory.getJob(jobId);
		
		jobData.then(function(data){
			_this.jobData = data;
			console.log(data);
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.jobData = null;
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
	
	this.getResults('', 1);
	
	
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
	
	
	//Form Data
	
	this.jobFields = [
	{
		className: 'row',
		fieldGroup: [{
			className: 'col-xs-6',
			type: 'input',
			key: 'specialty_id',
			templateOptions: {
				label: 'Specialty'
			}
		}, {
			className: 'col-xs-6',
			type: 'input',
			key: 'facility_id',
			templateOptions: {
				label: 'Facility'
			}
		}]
	},{
		type: 'input',
		key: 'title',
		templateOptions: {
			label: 'Job Title'
		}
	},{
		type: 'input',
		key: 'description',
		templateOptions: {
			label: 'Job Description'
		}
	},{
		className: 'row',
		fieldGroup: [{
			className: 'col-xs-6',
			type: 'input',
			key: 'start_date',
			templateOptions: {
				label: 'Start Date'
			}
		}, {
			className: 'col-xs-6',
			type: 'input',
			key: 'end_date',
			templateOptions: {
				label: 'End Date'
			}
		}]
	}, {
		template: '<hr />'
	}, {
		className: 'row',
		fieldGroup: [{
			className: 'col-xs-12',
			type: 'input',
			key: 'otherInput',
			templateOptions: {
				label: 'Other Input'
			}
		}]
	}, {
		type: 'checkbox',
		key: 'otherToo',
		templateOptions: {
			label: 'Other Checkbox'
		}
	}];
	
	init();
});