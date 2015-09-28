'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorsCtrl
 * @description
 * # DoctorsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DoctorsCtrl', function ($scope,$modal,$modalStack,doctorFactory,toasty,applicationFactory,$log) {
	var _this = this;

	this.doctors = [];
	this.searchQuery = '';
	this.modalInstance = '';

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
	
	this.queryData = doctorFactory.queryData;
	this.queryData.score_low = 0;
	this.queryData.score_high = 100;
	
	/* Private Functions */
	this.getResults = function() {
		_this.loading = true;

		doctorFactory.queryDoctors(_this.queryData).success(function(response) {
			_this.doctors = response.doctors;
			_this.totalDoctors = response.total;
			_this.totalPages = _this.totalDoctors/_this.doctorsPerPage;
			_this.loading = false;
		}).error(function(data, status, headers, config){
			_this.loading = false;
			toasty.error({
				title: 'Error!',
				msg: 'Bad Query',
				showClose: true,
				clickToClose: true
			});
		});
	};

	/* Public Functions */
	this.sortResult = function(sortOn){
		_this.sortDirection = !_this.sortDirection;
		_this.sortBy = sortOn;
		_this.getResults();
	};

	this.goTo = applicationFactory.goTo;

	this.submitForm = function(){
		doctorFactory.createDoctor(_this.formData).then(function(data){
			applicationFactory.goTo('/providers/'+data.id);
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
	_this.getResults();
});
