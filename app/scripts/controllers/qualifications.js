'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:QualificationsCtrl
 * @description
 * # QualificationsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('QualificationsCtrl', function ($routeParams, $http, API_URL, doctorFactory, toasty, $log, experienceFactory, qualificationFactory,specialtyFactory, facilityFactory, $modal, jobApplicationFactory, s3factory, Upload,$q) {
	this.awesomeThings = [
	'HTML5 Boilerplate',
	'AngularJS',
	'Karma'
	];
	var _this = this;
	this.doctorId = $routeParams.id;
	
	this.opened = false;
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();
		
		_this.opened = true;
	};
	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	this.format = this.formats[0];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};
	
	this.facilties = [];
	this.specialties = [];
	this.clinicalEvaluations = [];
	this.facilityAffiliations = [];
	
	
	var loadQualifications = function(){
		qualificationFactory.getClinicalEvaluations(_this.doctorId).then(function(data){
			_this.clinicalEvaluations = data;
			return qualificationFactory.getFacilityAffiliations(_this.doctorId);
		}).then(function(data){
			_this.facilityAffiliations = data;
		},function(error){
			$log.error(error);
		});
	};
	
	/* Modals */
	
	this.openClinicalEvaluationModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					$log.log('sending modal '+angular.toJson(dataIn));
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
			$log.log('submitting data for '+_this.doctorId);
			qualificationFactory.submitClinicalEvaluation(_this.doctorId,data).then(function(){
				loadQualifications();
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
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				modalObject: function(){
					$log.log('sending modal '+angular.toJson(dataIn));
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
			$log.log('submitting data for '+_this.doctorId);
			qualificationFactory.submitFacilityAffiliation(_this.doctorId,data).then(function(){
				loadQualifications();
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
			toasty.pop.success({
				title: 'Success!',
				msg: 'Facility Deleted.',
				showClose: true,
				clickToClose: true
			});
			loadQualifications();
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.deleteClinicalEvaluation = function(expId){
		qualificationFactory.deleteClinicalEvaluation(_this.doctorId,expId).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Evaluation Deleted.',
				showClose: true,
				clickToClose: true
			});
			loadQualifications();
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	/*$scope.downloadCertificate = function() {
      $http.get(API_URL + '/certificate/', {responseType:'arraybuffer'})
        .success(function (response) {
          var file = new Blob([response], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          //$scope.certificateFile = $sce.trustAsResourceUrl(fileURL);
          $scope.model.certificateFile = $sce.trustAsResourceUrl(fileURL);
          $scope.showModal();
        });
    }*/
    
	this.queryFacilities = function(query){
		var deferred = $q.defer();
	   qualificationFactory.queryFacilities(query).then(function(data){
			deferred.resolve(data);
		},function(error){
			deferred.reject(error);
			$log.error(error);
		});
		return deferred.promise;
	};
  
	var init = function(){
		loadQualifications();
		specialtyFactory.getSpecialties().then(function(data){
			_this.specialties = data;
		});
		
		facilityFactory.getFacilities().then(function(data){
			_this.facilities = data;
		});
		
		console.log(_this.queryFacilities('gene'));
	};
  
  init();

});
