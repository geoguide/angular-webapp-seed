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
	this.otherField = 'locum_experience';
	
	this.changeOther = function(changeTo){
		_this.otherField = changeTo;
		console.log(_this.otherField);
	};
	
	
	/* Internal Functions */
    
	function getResultsPage(pageNumber) {
		// TODO: Move this to service and then populate the 
		doctorFactory.queryDoctors(_this.searchQuery,pageNumber).then(function(response) {
			_this.doctors = response.doctors;
			_this.totalDoctors = response.total;
			_this.totalPages = _this.totalDoctors/_this.doctorsPerPage;
		});
	}
	
	
	/* Public Fucntions */
	
	this.getResults = function(){
		return getResultsPage(this.currentPage);
	};
	
	this.goTo = applicationFactory.goTo;
	
	this.submitForm = function(){
		var testData = {
			email: 'gg@gg.net',
			password:'password',
			first_name: 'Geoff',
			last_name: 'GG',
			job_type: 'locum',
			locum_experience: 10,
			locum_frequency: 10
		};
		doctorFactory.createDoctor(_this.formData).then(function(data){
			applicationFactory.goTo('/doctor/'+data.id);
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

	this.open = function () {

		this.modalInstance = $modal.open({
			templateUrl: 'create-doctor-modal2',
			controller: 'DoctorsCtrl',
			controllerAs: 'drsCtrl',
			scope: $scope,
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
	getResultsPage(1);
});