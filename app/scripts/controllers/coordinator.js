'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:CoordinatorCtrl
 * @description
 * # CoordinatorCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('CoordinatorCtrl', function ($window,ENV,$routeParams, doctorFactory, facilityFactory, $q, toasty, $log, $modal) {

	var _this = this;
	this.coordId = $routeParams.id;
	this.coordinatorData = null;
	this.memberships = [];
	
	this.jobStatuses = [
		{
			id: 0,
			job_status: 'Inactive'
		},{
			id: 1,
			job_status: 'Active'
		}
	];
	this.memberStatuses = [
		{
			id: 0,
			status: 'Inactive'
		},{
			id: 1,
			status: 'Active'
		}
	];
	
	this.openMembershipModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Facility Membership';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			doctorFactory.submitMembership(_this.coordId,data).then(function(){
				_this.getMemberships(_this.coordId);
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	this.get = function(coordId){

		var coordinatorData = doctorFactory.getCoordinator(coordId);

		coordinatorData.then(function(data){
			_this.coordinatorData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.coordinatorData = null;
		});
	};
	
	this.getMemberships = function(coordIdIn){
		doctorFactory.getMemberships(coordIdIn).then(function(result){
			_this.memberships = result;
		},function(error){
			$log.error(error);
		});
	};
	
	this.deleteFacilityMembership = function(expId){
		doctorFactory.removeMembership(_this.coordId,expId).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Training Deleted.',
				showClose: true,
				clickToClose: true
			});
			_this.getMemberships(_this.coordId);
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
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

	this.save = function(){
		doctorFactory.saveCoordinator(_this.coordinatorData).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Coordinator Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.coordinatorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.delete = function(){
		doctorFactory.deleteCoordinator(_this.coordId).then(function(data){
			_this.coordinatorData = null;
			toasty.success({
				title: 'Success!',
				msg: 'Coordinator Deleted.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.actAs = function(){
		doctorFactory.actAs(_this.coordId).then(function(response){
			$window.open(ENV.doctorApp+'/admin/act-as/'+response.data.token, '_blank');
			toasty.success({
				title: 'Success!',
				msg: 'Coord Acted As.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};


	/* Init */

	var init = function(){
		_this.get(_this.coordId);
		_this.getMemberships(_this.coordId);

	};

	init();

});
