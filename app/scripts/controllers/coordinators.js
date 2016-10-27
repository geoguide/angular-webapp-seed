'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:CoordinatorsCtrl
 * @description
 * # CoordinatorsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('CoordinatorsCtrl', function ($scope,$modal,$modalStack,doctorFactory,facilityFactory,$q,toasty,applicationFactory,$log,$location,MODIOCORE) {
	var _this = this;

	this.coordinators = [];
	this.searchQuery = '';
	this.modalInstance = '';
	this.loading = true;

	/* Variables */
	this.formData = {};
	this.MODIOCORE = MODIOCORE;
	this.totalCoordinators = 0;
	this.currentPage = 1;
	this.coordinatorsPerPage = 50;
	this.totalPages = this.totalCoordinators/this.coordinatorsPerPage;
	this.maxSize = 8;
	var facilityId = +$location.search().facilityId;
	_this.queryData = doctorFactory.queryData;

	if (facilityId) {
		this.queryData.facility_id = facilityId;
	}

	/* Private Functions */
	_this.getResults = function() {
		_this.loading = true;
		_this.queryData.facility_id = _this.selectedFacility ? _this.selectedFacility.id : null;
		return doctorFactory.queryCoordinators(_this.queryData).then(function(response) {
			_this.coordinators = response.coordinators;
			_this.totalCoordinators = response.total;
			_this.totalPages = _this.totalCoordinators/_this.coordinatorsPerPage;
			_this.loading = false;
		});
	};


	/* Public Functions */
	this.sortResult = function(sortOn){
		_this.queryData.sort_direction = !_this.sortDirection;
		_this.queryData.sort_by = sortOn;
		_this.getResults();
	};

	this.goTo = applicationFactory.goTo;

	this.submitForm = function(){
		doctorFactory.createCoordinator(_this.formData).then(function(data){
			applicationFactory.goTo('/coordinator/'+data.id);
			$modalStack.dismissAll();
		},function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.open = function (modalId,dataIn) {
		this.modalInstance = $modal.open({
			templateUrl: 'create-coordinator-modal',
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			scope: $scope,
			resolve: {
				modalObject: function(){
					return dataIn;
				},
				parentCtrl: function(){
					return _this;
				}
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

	if (_this.queryData.facility_id) {
		facilityFactory.getFacility(_this.queryData.facility_id).then(function(selected_facility) {
			_this.selectedFacility = selected_facility;
			return _this.getResults();
		}).catch(function(error){
			$log.error(error);
		});
	} else {
		_this.getResults().catch(function(error){
			$log.error(error);
		});
	}

});
