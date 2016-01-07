'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorsCtrl
 * @description
 * # DoctorsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DoctorsCtrl', function ($scope,API_URL,$modal,$location,$modalStack,doctorFactory,facilityFactory,toasty,applicationFactory,$log,localStorageService) {
	var _this = this;

	this.doctors = [];
	this.facilitiesWithMembers = [];
	this.searchQuery = '';
	this.modalInstance = '';
	var typeIn = $location.search().type;

	/* Variables */
	this.formData = {};
	this.totalDoctors = 0;
	this.currentPage = 1;
	this.doctorsPerPage = 25;
	this.totalPages = this.totalDoctors/this.doctorsPerPage;
	this.maxSize = 8;
	this.score_low = 0;
	this.score_high = 100;

	this.loading = true;
	this.matchList = [];

	this.queryData = doctorFactory.queryData;
	this.queryData.job_type_desired = 1;
	this.queryData.score_low = 0;
	this.queryData.score_high = 100;

	this.csvEndpoint = API_URL+'/public/download-users-csv?token='+localStorageService.get('adminAuthToken');

	/* Public Functions */
	this.getResults = function() {
		_this.loading = true;

		doctorFactory.queryDoctors(_this.queryData).then(function(response) {
			_this.doctors = response.data.doctors;
			_this.totalDoctors = response.data.total;
			_this.totalPages = _this.totalDoctors/_this.doctorsPerPage;
			_this.loading = false;
		},function(error){
			_this.loading = false;
			toasty.error({ title: 'Error!', msg: 'Bad Query' });
		});
	};

	this.changeDoctorType = function(jobTypeDesired){
		_this.queryData.job_type_desired = jobTypeDesired;
		_this.getResults();
	};

	this.sortResult = function(sortOn){
		_this.queryData.sortDir = !!!_this.queryData.sortDir;
		_this.queryData.sort_by = sortOn;
		_this.getResults();
	};

	this.submitForm = function(){
		doctorFactory.createDoctor(_this.formData).then(function(data){
			applicationFactory.goTo('/providers/'+data.id);
			$modalStack.dismissAll();
		},function(error){
			toasty.error({ title: 'Error!', msg: error.data });
		});
	};

	this.open = function () {

		this.modalInstance = $modal.open({
			templateUrl: 'create-doctor-modal2',
			controller: 'DoctorsCtrl',
			controllerAs: 'drsCtrl',
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope
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

	if(typeIn == 'credentialing'){
		_this.changeDoctorType(0);
	} else if(typeIn == 'all'){
		_this.changeDoctorType();
	}

	facilityFactory.facilitiesWithMembers({member_type: 'P'}).then(function(response){
		_this.facilitiesWithMembers = response;
		return _this.getResults();
	}).then(function(result){
		doctorFactory.getJobMatchTotals().then(function(result){
			_this.matchList = result;
		},function(error){
			$log.error(error);
		});

	},function(error){
		$log.error(error);
	});

});
