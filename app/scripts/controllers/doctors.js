'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorsCtrl
 * @description
 * # DoctorsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DoctorsCtrl', function ($scope,API_URL,$modal,$q,$location,$modalStack,doctorFactory,facilityFactory,toasty,applicationFactory,$log,localStorageService,MODIOCORE) {
	var _this = this;

	this.doctors = [];
	this.facilitiesWithMembers = [];
	this.searchQuery = '';
	this.modalInstance = '';
	this.MODIOCORE = MODIOCORE;
	var typeIn = $location.search().type;

	/* Variables */
	this.formData = {
		job_type_desired: 0,
		selected_job_type_desired: []
	};
	this.totalDoctors = 0;
	this.currentPage = 1;
	this.doctorsPerPage = 25;
	this.totalPages = this.totalDoctors/this.doctorsPerPage;
	this.maxSize = 8;
	this.score_low = 0;
	this.score_high = 100;

	this.loading = true;
	this.matchList = [];

	var facilityId = +$location.search().facilityId;
	this.queryData = doctorFactory.queryData;
	this.queryData.job_seekers = 1;

	if (facilityId) {
		this.queryData.facility_id = facilityId;
	}

	this.csvEndpoint = API_URL+'/public/download-users-csv?token=' + localStorageService.get('adminAuthToken');

	this.dynamicPopover = {
		templateUrl: 'notes-template.html'
	};

	/* Public Functions */
	this.getResults = function() {
		_this.loading = true;
		applicationFactory.loading = true;
		_this.queryData.score_low = _this.score_low;
		_this.queryData.score_high = _this.score_high;
		_this.queryData.facility_id = _this.selectedFacility ? _this.selectedFacility.id : null;

		return doctorFactory.queryDoctors(_this.queryData).then(function(response) {
			applicationFactory.loading = false;
			_this.doctors = response.data.doctors;
			_this.totalDoctors = response.data.total;
			_this.totalPages = _this.totalDoctors/_this.doctorsPerPage;
			_this.loading = false;
		},function(error){
			_this.loading = false;
			toasty.error({ title: 'Error!', msg: 'Bad Query' });
		});
	};

	this.changeJobType = function() {
	  if (_this.selected_job_type_desired.length > 0) {
      _this.queryData.job_type_desired = _this.selected_job_type_desired.reduce(function(prevValue, curValue){
        return prevValue + curValue;
      });
    } else {
	    _this.queryData.job_type_desired = 0;
    }

    _this.getResults();
  };

	this.changeDoctorType = function(job_seekers){
		_this.queryData.job_seekers = job_seekers;
		_this.getResults();
	};

	this.sortResult = function(sortOn){
		_this.queryData.sortDir = !_this.queryData.sortDir;
		_this.queryData.sort_by = sortOn;
		_this.getResults();
	};

	this.submitForm = function(){
		for (var i = 0; i < _this.formData.selected_job_type_desired.length; i++) {
			_this.formData.job_type_desired += _this.formData.selected_job_type_desired[i];
		}
		doctorFactory.createDoctor(_this.formData).then(function(data){
			applicationFactory.goTo('/providers/'+data.id);
			$modalStack.dismissAll();
		},function(error){
			toasty.error({ title: 'Error!', msg: error.data });
		});
	};

	this.setTooltip = function(item) {
		_this.tooltipStates = item;
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

	this.queryFacilities = function(query, settings){
		_this.loadingLocations = true;
		var queryData = {
			q: query,
			settings: settings
		};
		var deferred = $q.defer();
		facilityFactory.queryFacilities(queryData).then(function(data){
			_this.facilities = data.facilities;
			_this.loadingLocations = false;
			deferred.resolve(data.facilities);
		},function(error){
			_this.loadingLocations = false;
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};

	if(typeIn == 'credentialing'){
		_this.queryData.job_seekers = 0;
	} else if (typeIn == 'all') {
		_this.queryData.job_seekers = null;
	}

	if (_this.queryData.facility_id) {
		facilityFactory.getFacility(_this.queryData.facility_id).then(function(selected_facility){
			_this.selectedFacility = selected_facility;
			return _this.getResults();
		}).then(function(){
			return doctorFactory.getJobMatchTotals();
		}).then(function(result){
			_this.matchList = result;
		}).catch(function(error){
			$log.error(error);
		});
	} else {
		_this.getResults().then(function(){
			return doctorFactory.getJobMatchTotals();
		}).then(function(result){
			_this.matchList = result;
		}).catch(function(error){
			$log.error(error);
		});
	}

});
