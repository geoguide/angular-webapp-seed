'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:CoordinatorCtrl
 * @description
 * # CoordinatorCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('CoordinatorCtrl', function ($window, ENV, $routeParams, doctorFactory, facilityFactory, $q, toasty, $log, $modal, S3_URL, MODIOCORE, $location) {
	var _this = this;
	this.coordId = $routeParams.id;
	this.coordinatorData = null;
	this.memberships = [];
	this.facilities = [];
	this.loading = true;
	this.error = false;
	this.MODIOCORE = MODIOCORE;
	this.jobStatuses = [
		{
			id: 0,
			job_status: 'Inactive'
		},{
			id: 1,
			job_status: 'Active'
		}
	];

	this.openMembershipModal = function(dataIn){
		if (dataIn.status === null || dataIn.status === undefined) {
			dataIn.status = 1;
		}
		this.modalInstance = $modal.open({
			templateUrl: '/views/modals/membershipsModal.html',
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			size: 'lg',
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
			if (data.facilities) {
				data = data.facilities.map(function(facility){
					return {
						facility_id: facility.id,
						doctor_id: _this.coordId,
						status: data.status
					};
				});
			}
			doctorFactory.submitMembership(_this.coordId,data).then(function(){
				toasty.success('Membership Submitted.');
				_this.get(_this.coordId);
			},function(error){
				toasty.error(error);
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	this.get = function(coordId){
		_this.loading = true;
		var coordinatorData = doctorFactory.getCoordinator(coordId);
		coordinatorData.then(function(data){
			_this.coordinatorData = data;
			return doctorFactory.getMemberships(coordId);
		}).then(function(result){
			for(var fm=0;fm<result.length;fm++){
				if(result[fm].file_url){
					var url = 'https://s3.amazonaws.com/' + S3_URL + '/' + result[fm].file_url.substr(0, 8) + '-' + result[fm].file_url.substr(8, 4) + '-' + result[fm].file_url.substr(12, 4) + '-' + result[fm].file_url.substr(16, 4) + '-' + result[fm].file_url.substr(20, 12) + '/' + result[fm].file_url.substr(32);
					result[fm].profileUrl = url;
				}
			}

			_this.memberships = result;
			_this.loading = false;
			_this.error = false;
		},function(error){
			$log.error(error);
			_this.loading = false;
			_this.error = true;
			_this.coordinatorData = null;
		});
	};

	this.deleteFacilityMembership = function(expId){
		doctorFactory.removeMembership(_this.coordId,expId).then(function(data){
			toasty.success('Membership Removed');
			_this.get(_this.coordId);
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
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

	this.clearFacilitiesList = function() {
		_this.facilities = [];
	};

	this.save = function(){
		doctorFactory.saveCoordinator(_this.coordinatorData).then(function(data){
			toasty.success('Coordinator Saved.');
			_this.coordinatorData = data;
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.delete = function(){
		doctorFactory.deleteCoordinator(_this.coordId).then(function(data){
			_this.coordinatorData = null;
			toasty.success('Coordinator Deleted.');
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.actAs = function(){
		doctorFactory.actAs(_this.coordId).then(function(response){
			$window.open(ENV.doctorApp+'/admin/act-as/'+response.data.token, '_blank');
			toasty.success('I is coord.');
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.bookmark = function (idIn) {
		_this.coordinatorData.bookmarked = !_this.coordinatorData.bookmarked;
		if (!_this.coordinatorData.bookmarked) {
			doctorFactory.removeCoordinatorBookmark(idIn).catch(function (error) {
				$log.error(error);
			});
		} else {
			doctorFactory.bookmarkCoordinator(idIn).catch(function (error) {
				$log.error(error);
			});
		}
	};

	this.goToFacility = function (facility_id) {
		$location.url("/facility/" + facility_id);
	};

	/* Init */
	var init = function(){
		_this.get(_this.coordId);
	};

	init();

});
