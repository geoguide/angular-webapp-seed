'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:LookupCtrl
 * @description
 * # LookupCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('LookupCtrl', function ($scope,$modal,$modalStack,lookupFactory,toasty,applicationFactory,$log) {
	var _this = this;

	this.doctors = [];
	this.searchQuery = '';
	this.modalInstance = '';
	this.searchSpecialty = '';

	/* Variables */
	this.formData = {};
	this.totalDoctors = 0;
	this.currentPage = 1;
	this.doctorsPerPage = 25;
	this.totalPages = this.totalDoctors/this.doctorsPerPage;
	this.maxSize = 8;
	this.loading = true;
	this.queryData = lookupFactory.queryData;


	/* Private Functions */
	function getResultsPage(pageNumber) {
		_this.loading = true;
		lookupFactory.queryLookup(_this.queryData).then(function(response) {
			_this.doctors = response.doctors;
			_this.totalDoctors = response.total;
			_this.totalPages = _this.totalDoctors/_this.doctorsPerPage;
			_this.loading = false;
		});
	}


	/* Public Functions */
	this.sortResult = function(sortOn){
		_this.sortDirection = !_this.sortDirection;
		_this.sortBy = sortOn;
		getResultsPage(this.currentPage);
	};
	this.getResults = function(){
		return getResultsPage(this.currentPage);
	};

	this.goTo = applicationFactory.goTo;

	this.submitForm = function(){
		lookupFactory.createLookup(_this.formData).then(function(data){
			applicationFactory.goTo('/lookup-doctor/'+data.claim_id);
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
			templateUrl: 'create-lookup-modal',
			controller: 'LookupCtrl',
			controllerAs: 'lookup',
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
	getResultsPage(1);
});
