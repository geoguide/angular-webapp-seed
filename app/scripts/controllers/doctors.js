'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:DoctorsCtrl
 * @description
 * # DoctorsCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp')
	.controller('DoctorsCtrl', function ($scope,$window,$http,API_URL,$modal,doctorFactory,toasty) {
	
	this.awesomeThings = [
		'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
	];
	var _this = this;
    
	this.doctors = [];
	this.searchQuery = '';
	this.modalInstance = '';
	
	/* Variables */
	this.formData = {};
	this.totalDoctors = 0;
	this.currentPage = 1;
	this.doctorsPerPage = 25; // this should match however many results your API puts on one page
	this.totalPages = this.totalDoctors/this.doctorsPerPage;
	this.maxSize = 6;
	
	/* Internal Functions */
    
	function getResultsPage(pageNumber) {
		console.log('getresultspage got '+pageNumber);
		// TODO: Move this to service and then populate the 
		$http.get(API_URL+'/admin/doctors?q='+_this.searchQuery).then(function(response) {
			_this.doctors = response.data.doctors;
			_this.totalDoctors = response.data.total;
			_this.totalPages = _this.totalDoctors/_this.doctorsPerPage;
		});
	}
	
	
	/* Public Fucntions */
	this.getTotalPages = function(){
		//console.log('total pages: '+Math.ceil($scope.totalPages));
		return new Array(Math.ceil(this.totalPages));
	};
	
	this.getResults = function(){
		return getResultsPage(this.currentPage);
	};
	
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
			$scope.goTo('/doctor/'+data.id);
			_this.modalInstance.close();
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
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
			}
		});

		_this.modalInstance.result.then(function (data) {
			//something on close
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	getResultsPage(1);
});