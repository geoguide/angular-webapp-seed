'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:EducationWorkCtrl
 * @description
 * # EducationWorkCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('EducationWorkCtrl', function ($scope, $routeParams, toasty, $log, doctorFactory, facilityFactory, applicationFactory, $q, $modal, S3_URL) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.loading = true;
	this.tab = 'facility-memberships';


	this.trackingData = [];
	this.memberships = [];
	this.matches = [];

	this.today = new Date();
	var dd = this.today.getDate();
	var mm = this.today.getMonth()+1; //January is 0!
	var yyyy = this.today.getFullYear();

	if(dd<10) {
	    dd='0'+dd;
	}

	if(mm<10) {
	    mm='0'+mm;
	}

	this.today = mm+'/'+dd+'/'+yyyy;

	/* Modals */

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
			_this.submitFacilityMembership(data).then(function(){
				toasty.success('Membership Saved');
				_this.init();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	/* Facility Memberships */

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

	this.submitFacilityMembership = function(membershipData){
		doctorFactory.submitMembership(_this.doctorId,membershipData).then(function(data){
			toasty.success('Membership Submitted.');
			_this.init();
		}, function(error){
			toasty.error(error.data);
		});
	};

	this.deleteFacilityMembership = function(expId){
		doctorFactory.removeMembership(_this.doctorId,expId).then(function(data){
			toasty.success('Training Deleted.');
			_this.init();
		}, function(error){
			toasty.error(error.data);
		});
	};

	/* General */

	this.bookmark = function(idIn){
		_this.bookmarked = !!!_this.bookmarked;
		if(_this.bookmarked){
			doctorFactory.bookmark(idIn).then(function(){

			}, function(error){
				$log.error(error);
			});
		} else {
			doctorFactory.removeBookmark(idIn).then(function(){
				//silence
			}, function(error){
				$log.error(error);
			});
		}

	};

	/* Init */

	_this.init = function(){
		doctorFactory.getDoctor(_this.doctorId).then(function(result){
			_this.bookmarked = result.data.bookmarked;
			return doctorFactory.getTracking(_this.doctorId);
		}).then(function(result){
			_this.trackingData = result;
			return doctorFactory.getJobMatches(_this.doctorId);
		}).then(function(result){
			_this.matches = result;
			return doctorFactory.getJobOffers(_this.doctorId);
		}).then(function(result){
			_this.offers = result;
			return doctorFactory.getMemberships(_this.doctorId);
		}).then(function(result){
			for(var fm=0;fm<result.length;fm++){
				if(result[fm].file_url){
					var url = 'https://s3.amazonaws.com/' + S3_URL + '/3/' + result[fm].file_url.substr(0, 8) + '-' + result[fm].file_url.substr(8, 4) + '-' + result[fm].file_url.substr(12, 4) + '-' + result[fm].file_url.substr(16, 4) + '-' + result[fm].file_url.substr(20, 12) + '/' + result[fm].file_url.substr(32);
					result[fm].profileUrl = url;
				} else {
					result[fm].profileUrl = './images/default-avatar.png';
				}
			}
			_this.memberships = result;
			_this.loading = false;
		}, function(error){
			$log.error(error);
		});

	};
	_this.init();

});
