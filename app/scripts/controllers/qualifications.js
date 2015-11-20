'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:QualificationsCtrl
 * @description
 * # QualificationsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('QualificationsCtrl', function ($scope, $routeParams, toasty, $log, qualificationFactory, doctorFactory, specialtyFactory, $modal, $q) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.tab = 'qualifications';
	this.loading = true;

	this.additional_certification_types = [
		{ id: 0, name: 'ATLS/ACLS'},
		{ id: 1, name: 'PALS'},
		{ id: 2, name: 'BLS'},
		{ id: 3, name: 'ARLS'},
		{ id: 4, name: 'NALS'}
	];

	this.insuranceTypes = [
		{ id: 0, name: 'Malpractice' },
		{ id: 1, name: 'Liability' }
	];

	this.licenseTypes = [];
	this.licenseTypes.push('State');
	this.licenseTypes.push('DEA License');
	this.licenseTypes.push('State Ctrl Substance');
	this.trackingData = [];
	this.matches = [];
	this.opened = { 'start': false, 'end': false };
	this.open = function($event,which) {
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened[which] = true;
	};
	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','MM/dd/yyyy'];
	this.format = this.formats[4];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};

	this.specialties = [];
	this.clinicalEvaluations = [];
	this.facilityAffiliations = [];
	this.medicalLicenses = [];
	this.insurance = [];
	
	/* Modals */

	this.openClinicalEvaluationModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Clinical Evaluation';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			qualificationFactory.submitClinicalEvaluation(_this.doctorId,data).then(function(){
				init();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	this.openInsuranceModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Insurance';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			qualificationFactory.submitInsurance(_this.doctorId,data).then(function(){
				init();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	this.openMedicalLicenseModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			modalTitle: dataIn.id,
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Medical License';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			qualificationFactory.submitMedicalLicense(_this.doctorId,data).then(function(){
				init();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	this.openFacilityAffiliationModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Facility Affiliation';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			qualificationFactory.submitFacilityAffiliation(_this.doctorId,data).then(function(){
				init();
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};



	this.deleteFacilityAffiliation = function(expId){
		qualificationFactory.deleteFacilityAffiliation(_this.doctorId,expId).then(function(data){
			toasty.success('Facility Deleted.');
			init();
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};
	
	this.deleteMedicalLicense = function(expId){
		qualificationFactory.deleteMedicalLicense(_this.doctorId,expId).then(function(data){
			toasty.success('License Deleted.');
			init();
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};
	
	this.deleteInsurance = function(idIn){
		qualificationFactory.deleteInsurance(_this.doctorId,idIn).then(function(data){
			toasty.success('Insurance Deleted.');
			init();
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.deleteClinicalEvaluation = function(expId){
		qualificationFactory.deleteClinicalEvaluation(_this.doctorId,expId).then(function(data){
			toasty.success('Evaluation Deleted.');
			init();
		}, function(error){
			toasty.error(error.data);
		});
	};

	this.queryFacilities = function(query){
		var deferred = $q.defer();
	   qualificationFactory.queryFacilities(query).then(function(data){
			deferred.resolve(data.facilities);
		},function(error){
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};
	
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

	var init = function(){
		_this.loading = true;
		qualificationFactory.getClinicalEvaluations(_this.doctorId).then(function(data){
			_this.clinicalEvaluations = data;
			return doctorFactory.getDoctor(_this.doctorId);
		}).then(function(result){
			_this.bookmarked =result.data.bookmarked;
			return qualificationFactory.getFacilityAffiliations(_this.doctorId);
		}).then(function(data){
			_this.facilityAffiliations = data;
			return qualificationFactory.getMedicalLicenses(_this.doctorId);
		}).then(function(data){
			_this.medicalLicenses = data;
			return qualificationFactory.getInsurance(_this.doctorId);
		}).then(function(data){
			_this.insurance = data.data;	
			_this.loading = false;
			return specialtyFactory.getSpecialties();
		}).then(function(data){
			_this.specialties = data;
			return doctorFactory.getTracking(_this.doctorId);
		}).then(function(result){
			_this.trackingData = result;
			return doctorFactory.getJobMatches(_this.doctorId);
		}).then(function(result){
			_this.matches = result;
			return doctorFactory.getJobOffers(_this.doctorId);
		}).then(function(result){
			_this.offers = result;
		}, function(error){
			$log.error(error);
		});
	};

  init();

});
